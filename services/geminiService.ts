import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => {
  // Safe access to the API key defined in vite.config.ts
  let apiKey = '';
  try {
    apiKey = process.env.API_KEY || '';
  } catch (e) {
    console.warn("Gemini Service: Could not access process.env.API_KEY directly.");
  }

  if (!apiKey || apiKey === 'MISSING_KEY') {
    console.error("CRITICAL: Gemini API Key is missing. Ensure the API_KEY environment variable is set in Vercel project settings.");
  }
  
  return new GoogleGenAI({ apiKey: apiKey || 'MISSING_KEY' });
};

export const analyzeClaimDeeply = async (claimText: string, lang: 'en' | 'ne' = 'en') => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
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
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `Research this person: "${claimantName}"
      
Return JSON with:
- bio: Brief biography
- knownPredictions: Array of past predictions/statements found
- accuracyInfo: Any accuracy information found
- affiliations: Known affiliations and organizations`,
      config: {
        responseMimeType: "application/json"
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("Background search failed", e);
    return { bio: '', knownPredictions: [], accuracyInfo: '', affiliations: [] };
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