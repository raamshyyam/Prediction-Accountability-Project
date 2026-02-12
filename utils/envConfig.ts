const PLACEHOLDER_VALUES = new Set([
  'YOUR_GEMINI_API_KEY_HERE',
  'dummy-key-for-error-handling'
]);

export const readPublicEnv = (key: string): string => {
  try {
    const fromVite = (import.meta as any)?.env?.[key];
    if (typeof fromVite === 'string') return fromVite.trim();
  } catch {
    // ignore
  }

  try {
    const fromWindow = (window as any)?.__ENV__?.[key];
    if (typeof fromWindow === 'string') return fromWindow.trim();
  } catch {
    // ignore
  }

  return '';
};

export const isUsableGeminiApiKey = (key: string): boolean => {
  if (!key) return false;
  if (PLACEHOLDER_VALUES.has(key)) return false;
  return /^AIza[0-9A-Za-z_-]{20,}$/.test(key);
};

export const getGeminiApiKey = (): string => readPublicEnv('VITE_API_KEY');

export const hasUsableGeminiApiKey = (): boolean => {
  return isUsableGeminiApiKey(getGeminiApiKey());
};
