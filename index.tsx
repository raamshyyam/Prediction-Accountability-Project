
import React from 'react';
import ReactDOM from 'react-dom/client';

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("Critical Error: Root element not found in index.html");
} else {
  try {
    console.log("[PAP] 1: Starting React app initialization...");
    
    // Set a timeout to force fallback UI if React doesn't render in 3 seconds
    const timeoutId = setTimeout(() => {
      console.warn("[PAP] TIMEOUT: React app took too long to load (>3s)");
      if (rootElement.innerHTML.includes("Initializing")) {
        rootElement.innerHTML = `
          <div style="width: 100vw; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #f8fafc; font-family: sans-serif;">
            <div style="max-width: 500px; padding: 40px; text-align: center;">
              <h1 style="color: #1e293b; margin-bottom: 20px;">⏱️ Timeout</h1>
              <p style="color: #64748b; margin-bottom: 30px;">The app is taking longer than expected to load.</p>
              <div style="background: white; padding: 30px; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 20px; text-align: left;">
                <p style="color: #0ea5e9; font-weight: 600; margin-bottom: 10px;">Debug Info:</p>
                <code style="display: block; background: #f1f5f9; padding: 10px; border-radius: 6px; font-size: 12px; white-space: pre-wrap; word-break: break-all; color: #334155;">
Check browser console for error messages.
Root element found: ${!!rootElement}
HTML state: Module loading took >3 seconds
                </code>
              </div>
              <button onclick="location.reload()" style="padding: 10px 20px; background: #0ea5e9; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
                Refresh Page
              </button>
            </div>
          </div>
        `;
      }
    }, 3000);
    
    // Log before loading
    console.log("[PAP] 2: About to import App module...");
    
    // Dynamically import App to catch import errors
    import('./AppMinimal.tsx').then((module) => {
      console.log("[PAP] 3: App module imported successfully");
      clearTimeout(timeoutId);
      const App = module.default;
      
      try {
        console.log("[PAP] 4: Creating React root...");
        const root = ReactDOM.createRoot(rootElement);
        console.log("[PAP] 5: React root created, clearing spinner...");
        
        // Clear loading spinner immediately
        rootElement.innerHTML = '';
        
        console.log("[PAP] 6: Rendering App component...");
        root.render(
          React.createElement(App)  // Removed StrictMode to reduce overhead
        );
        console.log("[PAP] 7: PAP Application successfully mounted!");
      } catch (renderError) {
        clearTimeout(timeoutId);
        console.error("[PAP] ERROR during render:", renderError);
        rootElement.innerHTML = `
          <div style="width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; background: #fee2e2; font-family: sans-serif;">
            <div style="max-width: 600px; padding: 40px; background: white; border-radius: 12px; border: 1px solid #fecaca;">
              <h1 style="color: #991b1b; margin-bottom: 15px;">❌ Render Error</h1>
              <p style="color: #7f1d1d; margin-bottom: 10px;"><strong>Message:</strong> ${renderError.message}</p>
              <p style="color: #7f1d1d; margin-bottom: 10px;"><strong>Stack:</strong></p>
              <pre style="background: #fef2f2; padding: 15px; border-radius: 6px; overflow-x: auto; font-size: 11px; color: #7f1d1d; max-height: 200px; white-space: pre-wrap; word-break: break-all;">${renderError.stack}</pre>
              <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #dc2626; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
                Reload Page
              </button>
            </div>
          </div>
        `;
      }
    }).catch((importError) => {
      clearTimeout(timeoutId);
      console.error("[PAP] ERROR during import:", importError);
      rootElement.innerHTML = `
        <div style="width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; background: #fef3c7; font-family: sans-serif;">
          <div style="max-width: 600px; padding: 40px; background: white; border-radius: 12px; border: 1px solid #fcd34d;">
            <h1 style="color: #92400e; margin-bottom: 15px;">⚠️ Module Import Error</h1>
            <p style="color: #78350f; margin-bottom: 10px;"><strong>Message:</strong> ${importError.message}</p>
            <p style="color: #78350f; margin-bottom: 10px;"><strong>Stack:</strong></p>
            <pre style="background: #fffbeb; padding: 15px; border-radius: 6px; overflow-x: auto; font-size: 11px; color: #78350f; max-height: 200px; white-space: pre-wrap; word-break: break-all;">${importError.stack}</pre>
            <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #f59e0b; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
              Reload Page
            </button>
          </div>
        </div>
      `;
    });
    console.log("[PAP] 2.5: Import call initiated...");
  } catch (error) {
    console.error("[PAP] FATAL ERROR in initialization:", error);
    rootElement.innerHTML = `
      <div style="width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; background: #dbeafe; font-family: sans-serif;">
        <div style="max-width: 600px; padding: 40px; background: white; border-radius: 12px; border: 1px solid #bfdbfe;">
          <h1 style="color: #1e40af; margin-bottom: 15px;">❗ Initialization Error</h1>
          <p style="color: #1e3a8a; margin-bottom: 10px;"><strong>Error:</strong> ${error.message}</p>
          <pre style="background: #eff6ff; padding: 15px; border-radius: 6px; overflow-x: auto; font-size: 11px; color: #1e3a8a; white-space: pre-wrap; word-break: break-all;">${error.stack}</pre>
          <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
            Reload Page
          </button>
        </div>
      </div>
    `;
  }
}
