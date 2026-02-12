import { GoogleGenAI } from "@google/genai";
import { getGeminiApiKey, hasUsableGeminiApiKey } from "../utils/envConfig";

let cachedAI: any = null;
let apiKeyChecked = false;

const getAI = (): GoogleGenAI | null => {
  if (cachedAI && apiKeyChecked) {
    return cachedAI;
  }

  const apiKey = getGeminiApiKey();
  const hasApiKey = hasUsableGeminiApiKey();

  if (!hasApiKey) {
    if (!apiKey) {
      console.warn("Gemini API key is missing. AI features will use local fallbacks.");
    } else {
      console.warn("Gemini API key format appears invalid. AI features will use local fallbacks.");
    }
    cachedAI = null;
  } else {
    console.log("Gemini API Key configured");
    cachedAI = new GoogleGenAI({ apiKey });
  }

  apiKeyChecked = true;
  return cachedAI;
};

export const analyzeClaimDeeply = async (claimText: string, lang: 'en' | 'ne' = 'en') => {
  try {
    // If API key isn't available, return a local heuristic analysis
    const hasApiKey = hasUsableGeminiApiKey();

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

    const ai = getAI();
    if (!ai) {
      throw new Error('Gemini client unavailable');
    }
    // Create a timeout promise to prevent blocking indefinitely
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Gemini API timeout - took longer than 20 seconds')), 20000);
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

    if (!response || !response.text) {
      console.warn('Empty response from Gemini API');
      return {
        vaguenessScore: 5,
        analysisParams: [],
        verificationVectors: [],
        webEvidence: []
      };
    }

    let text = (response.text || '').trim();

    // Handle cases where response might have markdown code blocks
    if (text.startsWith('```json')) {
      text = text.replace(/^```json\s*/, '').replace(/```$/, '');
    } else if (text.startsWith('```')) {
      text = text.replace(/^```\s*/, '').replace(/```$/, '');
    }

    text = text.trim();

    // Extract JSON object from the response text
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');

    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      text = text.substring(jsonStart, jsonEnd + 1);
    } else {
      // If we can't find a JSON object, throw an error to trigger the catch block
      throw new Error('No JSON object found in response');
    }

    const data = JSON.parse(text);

    // Validate and sanitize the response
    const vaguenessScore = Math.max(1, Math.min(10, Math.round(data.vaguenessScore || 5)));

    // Safety check: ensure arrays exist before filtering
    const analysisParams = (Array.isArray(data.analysisParams) ? data.analysisParams : [])
      .slice(0, 10)
      .filter((p: any) => p && typeof p === 'object');

    const verificationVectors = (Array.isArray(data.verificationVectors) ? data.verificationVectors : [])
      .slice(0, 5)
      .filter((v: any) => v && typeof v === 'object');

    const webEvidence = (Array.isArray(data.webEvidence) ? data.webEvidence : [])
      .slice(0, 5)
      .filter((w: any) => w && typeof w === 'object');

    return {
      vaguenessScore,
      analysisParams,
      verificationVectors,
      webEvidence
    };
  } catch (e) {
    console.error('Analysis failed', e);
    // Return a safe fallback object to prevent UI crashes
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
  const hasApiKey = hasUsableGeminiApiKey();

  if (!hasApiKey) {
    // Smart sentence splitting: extract sentences that look like promises/commitments
    const sentences = text.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(s => s && s.length > 10);
    // Filter for sentences that look like commitments (contain action verbs)
    const commitmentKeywords = ['will|shall|would|promise|commit|build|construct|improve|increase|decrease|establish|create|develop|ensure|maintain|strengthen|reduce|expand|launch|introduce|pass|approve|implement|guarantee|provide|offer|support|promote|enhance|reform|modernize|invest|allocate|fund|dedicate|allocate|raise|lower|eliminate|abolish|reform'];
    const commitmentRegex = new RegExp(commitmentKeywords.join(''), 'i');

    const selected = sentences
      .filter(s => commitmentRegex.test(s) || s.length > 30)
      .slice(0, 25)
      .map((s, idx) => ({
        id: `m-${idx}`,
        text: s.length > 150 ? s.substring(0, 150) + '...' : s,
        priority: idx < 5 ? 'high' : idx < 15 ? 'medium' : 'low'
      }));

    return selected.length > 0 ? selected : sentences.slice(0, 10).map((s, idx) => ({
      id: `m-${idx}`,
      text: s.length > 150 ? s.substring(0, 150) + '...' : s,
      priority: idx < 3 ? 'high' : idx < 7 ? 'medium' : 'low'
    }));
  }

  try {
    const ai = getAI();
    if (!ai) {
      return [];
    }
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
    if (!hasUsableGeminiApiKey()) {
      return { claims: [] };
    }

    const ai = getAI();
    if (!ai) {
      return { claims: [] };
    }
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
    if (!hasUsableGeminiApiKey()) {
      return { bio: '', knownPredictions: [], accuracyInfo: '', affiliations: [], role: 'Independent' };
    }

    const ai = getAI();
    if (!ai) {
      return { bio: '', knownPredictions: [], accuracyInfo: '', affiliations: [], role: 'Independent' };
    }

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
  const hasApiKey = hasUsableGeminiApiKey();

  const generateLocalInsight = (): string => {
    const parts = [] as string[];
    const observations = [] as string[];

    // Analyze specific elements
    if (/\d+(?:\.\d+)?(?:%|%)?/.test(claimText)) {
      observations.push('Contains specific numbers or percentages');
    }
    if (/\b(19|20)\d{2}\b/.test(claimText)) {
      observations.push('Mentions a specific year');
    }
    if (/(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\d{1,2}\/\d{1,2})/i.test(claimText)) {
      observations.push('References a specific date');
    }
    if (/[A-Z][a-z]+\s[A-Z][a-z]+/.test(claimText)) {
      observations.push('Names specific people or organizations');
    }
    if (/(percent|%|increase|decrease|more than|less than|growth|rate|per|\/)/i.test(claimText)) {
      observations.push('Uses quantifiable or measurable language');
    }
    if (/(will|shall|would|is expected|aim to|plan to|intend to|will likely)/i.test(claimText)) {
      observations.push('Contains a falsifiable prediction');
    }
    if (/(by\s+\d{4}|within\s+\d+\s+(day|week|month|year|hour))/i.test(claimText)) {
      observations.push('Specifies a timeframe');
    }
    if (/(Nepal|Kathmandu|Province|District|Region|City)/i.test(claimText)) {
      observations.push('Specifies a geographic location');
    }

    // Build insight based on vagueness score
    let insight = '';
    if (vaguenessScore >= 8) {
      insight = `This claim is very vague and difficult to verify.`;
    } else if (vaguenessScore >= 6) {
      insight = `This claim has some vague elements that make verification challenging.`;
    } else if (vaguenessScore >= 4) {
      insight = `This claim is moderately clear, though some details could be more specific.`;
    } else {
      insight = `This claim is clear and specific, making it easier to verify.`;
    }

    if (observations.length > 0) {
      insight += ` Positive elements: ${observations.join(', ')}.`;
    }

    if (vaguenessScore >= 6 && observations.length < 3) {
      insight += ` To make this claim more verifiable, consider adding specific dates, names, numbers, or measurable outcomes.`;
    }

    return insight;
  };

  if (!hasApiKey) {
    return generateLocalInsight();
  }

  try {
    const ai = getAI();
    if (!ai) {
      return generateLocalInsight();
    }

    // Add timeout for insight generation (8 seconds)
    const timeoutPromise = new Promise<string>((_, reject) =>
      setTimeout(() => reject(new Error('Insight generation timeout')), 8000)
    );

    const responsePromise = ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `Explain why this claim has a vagueness score of ${vaguenessScore}/10:
      
"${claimText}"

Provide a concise explanation of which specific elements make it vague or clear. Keep it under 150 characters.`
    });

    const response = await Promise.race([responsePromise, timeoutPromise]) as any;
    const text = (response.text || '').trim();

    if (text && text.length > 0) {
      return text;
    }

    // Fallback if response is empty
    return generateLocalInsight();
  } catch (e) {
    console.warn("Vagueness insight generation failed, using local analysis:", e);
    return generateLocalInsight();
  }
};

