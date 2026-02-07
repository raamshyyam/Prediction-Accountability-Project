
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

console.log("[PAP] 1: Module starting to execute...");

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("[PAP] CRITICAL: Root element not found!");
} else {
  try {
    console.log("[PAP] 2: Found root element, creating React root...");
    const root = ReactDOM.createRoot(rootElement);
    
    console.log("[PAP] 3: Clearing spinner HTML...");
    rootElement.innerHTML = '';
    
    console.log("[PAP] 4: Rendering App...");
    root.render(React.createElement(App));
    
    console.log("[PAP] 5: App rendered successfully!");
  } catch (error) {
    console.error("[PAP] ERROR:", error);
    rootElement.innerHTML = `
      <div style="width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; background: #fee2e2; font-family: sans-serif;">
        <div style="max-width: 500px; padding: 40px; text-align: center;">
          <h1 style="color: #991b1b;">❌ Render Error</h1>
          <p style="color: #7f1d1d; margin-bottom: 20px;">${error.message}</p>
          <pre style="color: #7f1d1d; font-size: 0.8em; background: #fff5f5; padding: 10px; border-radius: 4px; text-align: left; max-height: 200px; overflow: auto;">${error.stack}</pre>
        </div>
      </div>
    `;
  }
}
