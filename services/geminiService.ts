import { GoogleGenAI, Type } from "@google/genai";

let cachedAI: any = null;
let apiKeyChecked = false;

const getAI = () => {
  if (cachedAI && apiKeyChecked) {
    return cachedAI;
  }

  // Access API key from Vite environment (requires VITE_ prefix for client-side)
  let apiKey = '';
  
  // Try different sources for the API key
  if (typeof import !== 'undefined' && import.meta) {
    apiKey = (import.meta.env?.VITE_API_KEY || '').trim();
  }
  
  if (!apiKey) {
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
1. Vagueness Score (1-10): How vague/unclear is this claim?
2. 10 Verifiability Parameters with true/false values (e.g., "Has specific date", "Named actors", "Quantified metrics", etc.)
3. 3 Verification Vectors from different models (Economic Analyst, Political Fact-Checker, Logical Consistency Bot)
4. Web Evidence links for supporting/refuting information

Return ONLY valid JSON, no additional text.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            vaguenessScore: { type: Type.NUMBER },
            analysisParams: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  fulfilled: { type: Type.BOOLEAN }
                },
                required: ["label", "fulfilled"]
              }
            },
            verificationVectors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  modelName: { type: Type.STRING },
                  verdict: { type: Type.STRING },
                  confidence: { type: Type.NUMBER },
                  reasoning: { type: Type.STRING }
                },
                required: ["modelName", "verdict", "confidence", "reasoning"]
              }
            },
            webEvidence: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  url: { type: Type.STRING }
                }
              }
            }
          },
          required: ["vaguenessScore", "analysisParams", "verificationVectors"]
        }
      }
    });
    
    const response = await Promise.race([analysisPromise, timeoutPromise]) as any;
    const text = response.text || '{}';
    const data = JSON.parse(text);
    
    // Ensure we have the right structure
    return {
      vaguenessScore: Math.round(data.vaguenessScore || 5),
      analysisParams: Array.isArray(data.analysisParams) ? data.analysisParams.slice(0, 10) : [],
      verificationVectors: Array.isArray(data.verificationVectors) ? data.verificationVectors : [],
      webEvidence: Array.isArray(data.webEvidence) ? data.webEvidence : []
    };
  } catch (e) {
    console.error("Analysis failed", e);
    return {
      vaguenessScore: 5,
      analysisParams: [
        { label: "Has specific date", fulfilled: false },
        { label: "Named actors/people", fulfilled: false },
        { label: "Quantified metrics", fulfilled: false },
        { label: "Geographic location", fulfilled: false },
        { label: "Clear causality", fulfilled: false },
        { label: "Falsifiable", fulfilled: false },
        { label: "Time-bound", fulfilled: false },
        { label: "Measurable outcome", fulfilled: false },
        { label: "Specific action/event", fulfilled: false },
        { label: "Clear scope", fulfilled: false }
      ],
      verificationVectors: [],
      webEvidence: []
    };
  }
};
        { label: "Specific action/event", fulfilled: false },
        { label: "Clear scope", fulfilled: false }
      ],
      verificationVectors: [],
      webEvidence: []
    };
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