import { GoogleGenAI } from "@google/genai";

let cachedAI: any = null;
let apiKeyChecked = false;

const getAI = () => {
  if (cachedAI && apiKeyChecked) {
    return cachedAI;
  }

  // Access API key from Vite environment (requires VITE_ prefix for client-side)
  let apiKey = '';
  
  // Try different sources for the API key
  try {
    apiKey = (import.meta.env?.VITE_API_KEY || '').trim();
  } catch (e) {
    // import.meta not available, try process.env
    apiKey = (process.env?.VITE_API_KEY || '').trim();
  }
  
  if (!apiKey && typeof window !== 'undefined' && (window as any).__ENV__) {
    apiKey = ((window as any).__ENV__.VITE_API_KEY || '').trim();
  }

  if (!apiKey) {
    console.error("CRITICAL: Gemini API Key is missing. Set VITE_API_KEY in your Vercel environment variables or .env file.");
    cachedAI = new GoogleGenAI({ apiKey: 'dummy-key-for-error-handling' });
  } else {
    console.log("✓ Gemini API Key configured");
    cachedAI = new GoogleGenAI({ apiKey });
  }
  
  apiKeyChecked = true;
  return cachedAI;
};

export const analyzeClaimDeeply = async (claimText: string, lang: 'en' | 'ne' = 'en') => {
  // If API key isn't available, return a local heuristic analysis
  const hasApiKey = (() => {
    try {
      const k = (import.meta.env?.VITE_API_KEY || '').trim();
      if (k && k !== 'YOUR_GEMINI_API_KEY_HERE') return true;
    } catch (e) {}
    try {
      // runtime fallback
      if (typeof (window as any) !== 'undefined' && (window as any).__ENV__ && (window as any).__ENV__.VITE_API_KEY) return true;
    } catch (e) {}
    return false;
  })();

  const heuristicVagueness = (text: string) => {
    if (!text || !text.trim()) return 5;
    const len = text.length;
    const numbers = (text.match(/\d{3,}|\d+/g) || []).length;
    const dates = (/\b(19|20)\d{2}\b/.test(text) ? 1 : 0) + (/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i.test(text) ? 1 : 0);
    const named = /[A-Z][a-z]+\s[A-Z][a-z]+/.test(text) ? 1 : 0;
    // lower vagueness (clearer) if numbers/dates/names present
    let score = 10 - Math.min(8, numbers + dates + named + Math.round(len / 140));
    if (score < 1) score = 1;
    if (score > 10) score = 10;
    return score;
  };

  if (!hasApiKey) {
    const score = heuristicVagueness(claimText);
    const basicParams = [
      { label: 'Has specific date', fulfilled: /\b(19|20)\d{2}\b/.test(claimText) },
      { label: 'Named actors/people', fulfilled: /[A-Z][a-z]+\s[A-Z][a-z]+/.test(claimText) },
      { label: 'Quantified metrics', fulfilled: /\d+/.test(claimText) },
      { label: 'Geographic location', fulfilled: /\b(Kathmandu|Nepal|Province|District|\b[A-Z][a-z]+\b)\b/.test(claimText) },
      { label: 'Clear causality', fulfilled: /because|due to|result in|lead to/i.test(claimText) },
      { label: 'Falsifiable', fulfilled: /will|shall|is expected to|aim to/i.test(claimText) },
      { label: 'Time-bound', fulfilled: /(by\s+\d{4}|within\s+\d+)/i.test(claimText) },
      { label: 'Measurable outcome', fulfilled: /percent|%|number of|increase|decrease|more than/i.test(claimText) },
      { label: 'Specific action/event', fulfilled: /build|construct|pass|approve|launch|open/i.test(claimText) },
      { label: 'Clear scope', fulfilled: /.{0,}/.test(claimText) }
    ];
    return {
      vaguenessScore: Math.round(score),
      analysisParams: basicParams,
      verificationVectors: [],
      webEvidence: []
    };
  }

  try {
    const ai = getAI();
    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Gemini API timeout - took longer than 15 seconds')), 15000);
    });

    const analysisPromise = ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `You are an expert claim verification system. Analyze this claim in depth.

Claim: "${claimText}"
Language: ${lang === 'ne' ? 'Nepali' : 'English'}

Provide a detailed JSON analysis with:
1. vaguenessScore: number (1-10)
2. analysisParams: array of {label, fulfilled}
3. verificationVectors: array of {modelName, verdict, confidence, reasoning}
4. webEvidence: array of {title, url}

Return ONLY valid JSON, no additional text.`,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const response = await Promise.race([analysisPromise, timeoutPromise]) as any;
    const text = response.text || '{}';
    const data = JSON.parse(text);
    return {
      vaguenessScore: Math.round(data.vaguenessScore || 5),
      analysisParams: Array.isArray(data.analysisParams) ? data.analysisParams.slice(0, 10) : [],
      verificationVectors: Array.isArray(data.verificationVectors) ? data.verificationVectors : [],
      webEvidence: Array.isArray(data.webEvidence) ? data.webEvidence : []
    };
  } catch (e) {
    console.error('Analysis failed', e);
    return {
      vaguenessScore: 5,
      analysisParams: [
        { label: 'Has specific date', fulfilled: false },
        { label: 'Named actors/people', fulfilled: false },
        { label: 'Quantified metrics', fulfilled: false },
        { label: 'Geographic location', fulfilled: false },
        { label: 'Clear causality', fulfilled: false },
        { label: 'Falsifiable', fulfilled: false },
        { label: 'Time-bound', fulfilled: false },
        { label: 'Measurable outcome', fulfilled: false },
        { label: 'Specific action/event', fulfilled: false },
        { label: 'Clear scope', fulfilled: false }
      ],
      verificationVectors: [],
      webEvidence: []
    };
  }
};

export const extractManifestoClaims = async (text: string, lang: 'en' | 'ne' = 'en') => {
  // If no API key, do a simple sentence-splitting heuristic
  const hasApiKey = (() => {
    try {
      const k = (import.meta.env?.VITE_API_KEY || '').trim();
      if (k && k !== 'YOUR_GEMINI_API_KEY_HERE') return true;
    } catch (e) {}
    try {
      if (typeof (window as any) !== 'undefined' && (window as any).__ENV__ && (window as any).__ENV__.VITE_API_KEY) return true;
    } catch (e) {}
    return false;
  })();

  if (!hasApiKey) {
    // naive split: sentences longer than 40 chars, pick top 10
    const sentences = text.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(s => s.length > 40);
    const selected = sentences.slice(0, 20).map((s, idx) => ({ id: `m-${idx}`, text: s, priority: idx < 3 ? 'high' : idx < 8 ? 'medium' : 'low' }));
    return selected;
  }

  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `Extract the key promises or commitments from this manifesto text and return JSON array of objects {text, priority} where priority is high|medium|low.\n\nText:\n${text}`,
      config: { responseMimeType: 'application/json' }
    });
    const data = JSON.parse(response.text || '[]');
    if (Array.isArray(data)) return data.map((d: any, i: number) => ({ id: `m-${i}`, text: d.text || d.claim || '', priority: d.priority || 'medium' }));
    return [];
  } catch (e) {
    console.warn('Manifesto extraction failed', e);
    return [];
  }
};

export const discoverClaims = async (url: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `Extract specific public predictions or claims from this URL: ${url}
      
Return JSON with claims array: [{ claimantName, claimText, category, targetDateEstimate }]`
    });
    return JSON.parse(response.text || '{"claims":[]}');
  } catch (e) {
    console.error("Discovery failed", e);
    return { claims: [] };
  }
};

export const searchClaimantBackground = async (claimantName: string) => {
  try {
    const ai = getAI();
    
    // Create a timeout promise (10 seconds for background search)
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Claimant background search timeout')), 10000);
    });
    
    const searchPromise = ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `Research this person: "${claimantName}"
      
Return JSON with:
- bio: Brief biography (2-3 sentences max)
- knownPredictions: Array of 2-3 past predictions/statements found (or empty if not found)
- accuracyInfo: Any accuracy information found (or empty string)
- affiliations: Known affiliations and organizations (comma separated or empty)
- role: Their primary role/profession (politician, economist, journalist, etc.)

Return ONLY valid JSON.`,
      config: {
        responseMimeType: "application/json"
      }
    });
    
    const response = await Promise.race([searchPromise, timeoutPromise]) as any;
    const result = JSON.parse(response.text || '{}');
    
    return {
      bio: result.bio || '',
      knownPredictions: Array.isArray(result.knownPredictions) ? result.knownPredictions : [],
      accuracyInfo: result.accuracyInfo || '',
      affiliations: Array.isArray(result.affiliations) ? result.affiliations : (typeof result.affiliations === 'string' ? [result.affiliations] : []),
      role: result.role || 'Independent'
    };
  } catch (e) {
    console.warn("Background search failed", e);
    return { bio: '', knownPredictions: [], accuracyInfo: '', affiliations: [], role: 'Independent' };
  }
};

export const generateVaguenessInsight = async (claimText: string, vaguenessScore: number) => {
  // If API key isn't present, return a local heuristic explanation
  const hasApiKey = (() => {
    try {
      const k = (import.meta.env?.VITE_API_KEY || '').trim();
      if (k && k !== 'YOUR_GEMINI_API_KEY_HERE') return true;
    } catch (e) {}
    try {
      if (typeof (window as any) !== 'undefined' && (window as any).__ENV__ && (window as any).__ENV__.VITE_API_KEY) return true;
    } catch (e) {}
    return false;
  })();

  if (!hasApiKey) {
    const parts = [] as string[];
    if (/\d+/.test(claimText)) parts.push('Contains numeric values or metrics which reduce vagueness.');
    if (/\b(19|20)\d{2}\b/.test(claimText) || /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i.test(claimText)) parts.push('Mentions specific dates or timeframes.');
    if (/[A-Z][a-z]+\s[A-Z][a-z]+/.test(claimText)) parts.push('Includes named people or organizations.');
    if (/(percent|%|increase|decrease|more than|less than)/i.test(claimText)) parts.push('Uses measurable language (percent, increase, decrease).');
    if (parts.length === 0) return 'This claim lacks specific, measurable details (dates, numbers, named actors), making it harder to verify.';
    return parts.join(' ');
  }

  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `Explain why this claim has a vagueness score of ${vaguenessScore}/10:
      
"${claimText}"

Provide a concise explanation of which specific elements make it vague or clear.`
    });
    return response.text || 'Analysis not available';
  } catch (e) {
    console.error("Vagueness insight failed", e);
    return 'Analysis not available';
  }
};