export const isAIConfigured = (): boolean => {
  const apiKey = (import.meta.env.VITE_API_KEY || process.env.VITE_API_KEY || '').trim();
  return apiKey !== '' && apiKey !== 'YOUR_GEMINI_API_KEY_HERE';
};

export const logAIStatus = () => {
  const configured = isAIConfigured();
  if (!configured) {
    console.warn(
      '%c⚠️ AI Features Disabled',
      'color: orange; font-weight: bold; font-size: 14px;',
      '\nGemini API Key not configured. To enable AI analysis:',
      '\n1. Get a free API key from: https://ai.google.dev/',
      '\n2. Set VITE_API_KEY in your Vercel Project Settings',
      '\n3. Redeploy your project'
    );
  } else {
    console.log('%c✅ AI Features Enabled', 'color: green; font-weight: bold;');
  }
};
