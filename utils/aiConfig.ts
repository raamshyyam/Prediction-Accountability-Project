export const isAIConfigured = (): boolean => {
  try {
    const apiKey = (import.meta.env.VITE_API_KEY || process.env.VITE_API_KEY || '').trim();
    return apiKey !== '' && apiKey !== 'YOUR_GEMINI_API_KEY_HERE';
  } catch (e) {
    return false;
  }
};

export const getAISetupInstructions = (): string => {
  return `
AI Features are currently disabled. To enable them:

1. Get a free Gemini API key from: https://ai.google.dev/
2. Set VITE_API_KEY in your environment:
   
   For Local Development:
   - Create/update .env.local file:
     VITE_API_KEY=your_api_key_here
   - Restart your dev server
   
   For Vercel Deployment:
   - Go to Vercel Dashboard → Your Project → Settings
   - Find "Environment Variables" section
   - Add new variable:
     Name: VITE_API_KEY
     Value: your_api_key_here
   - Redeploy your project

3. Refresh the page after setting the environment variable
  `.trim();
};

export const logAIStatus = () => {
  const configured = isAIConfigured();
  if (!configured) {
    console.warn(
      '%c⚠️ AI Features Disabled',
      'color: orange; font-weight: bold; font-size: 14px;',
      '\n' + getAISetupInstructions()
    );
  } else {
    console.log('%c✅ AI Features Enabled', 'color: green; font-weight: bold;');
  }
};
