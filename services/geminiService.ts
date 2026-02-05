import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => {
  // Vite's 'define' config will replace this string at build time
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.error("CRITICAL: Gemini API Key is missing. Please set API_KEY in Vercel Environment Variables.");
  }
  
  return new GoogleGenAI({ apiKey: apiKey || 'MISSING_KEY' });
};

export const analyzeClaimDeeply = async (claimText: string, lang: 'en' | 'ne' = 'en') => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analyze the following claim in depth. 
      Claim: "${claimText}"
      Language Preference: ${lang === 'ne' ? 'Nepali' : 'English'}
      
      1. Evaluate 10 parameters of verifiability (specific date, metric, actor, location, etc.).
      2. Simulate 3 verification models: "Economic Analyst", "Political Fact-Checker", and "Logical Consistency Bot".
      3. Perform a web search to find any existing news related to this.
      
      Provide JSON:
      - vaguenessScore (1-10)
      - analysisParams: Array of {label, fulfilled (boolean)} - 10 items
      - verificationVectors: Array of {modelName, verdict, confidence (0-1), reasoning}
      - biasReport: String description of claimant bias
      - webEvidence: Array of {title, url}`,
      config: {
        tools: [{ googleSearch: {} }],
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
                }
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
                }
              }
            },
            biasReport: { type: Type.STRING },
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
          }
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    return {
      ...data,
      groundingLinks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (e) {
    console.error("Analysis failed", e);
    return null;
  }
};

export const discoverClaims = async (url: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Visit this URL and extract any specific public predictions or claims: ${url}. 
      Return as JSON: { claimantName, claimText, category, targetDateEstimate }.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json"
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("Discovery failed", e);
    return null;
  }
};