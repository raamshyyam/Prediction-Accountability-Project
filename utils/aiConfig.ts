const readApiKey = (): string => {
  try {
    const key = (import.meta as any)?.env?.VITE_API_KEY;
    if (typeof key === 'string') return key.trim();
  } catch {
    // ignore
  }

  try {
    const key = (window as any)?.__ENV__?.VITE_API_KEY;
    if (typeof key === 'string') return key.trim();
  } catch {
    // ignore
  }

  return '';
};

export const isAIConfigured = (): boolean => {
  const apiKey = readApiKey();
  return apiKey !== '' && apiKey !== 'YOUR_GEMINI_API_KEY_HERE';
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
   - Go to Vercel Dashboard -> Your Project -> Settings
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
      'AI Features Disabled',
      '\n' + getAISetupInstructions()
    );
  } else {
    console.log('AI Features Enabled');
  }
};
