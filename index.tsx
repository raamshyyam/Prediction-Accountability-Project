
import React from 'react';
import ReactDOM from 'react-dom/client';

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("Critical Error: Root element not found in index.html");
} else {
  try {
    console.log("Starting React app...");
    
    // Set a timeout to force fallback UI if React doesn't render in 3 seconds
    const timeoutId = setTimeout(() => {
      console.warn("React app took too long to load, showing fallback UI");
      if (rootElement.innerHTML.includes("Initializing")) {
        rootElement.innerHTML = `
          <div style="width: 100vw; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #f8fafc; font-family: sans-serif;">
            <div style="max-width: 500px; padding: 40px; text-align: center;">
              <h1 style="color: #1e293b; margin-bottom: 20px;">PAP</h1>
              <p style="color: #64748b; margin-bottom: 30px;">Prediction Accountability Platform</p>
              <div style="background: white; padding: 30px; border-radius: 12px; border: 1px solid #e2e8f0;">
                <p style="color: #0ea5e9; font-weight: 600; margin-bottom: 15px;">Loading app...</p>
                <p style="color: #64748b; font-size: 14px;">If this takes too long, please refresh the page or check your browser console for errors.</p>
                <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #0ea5e9; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        `;
      }
    }, 3000);
    
    // Dynamically import App to catch import errors
    import('./App.tsx').then((module) => {
      clearTimeout(timeoutId);
      console.log("App module loaded successfully");
      const App = module.default;
      
      try {
        const root = ReactDOM.createRoot(rootElement);
        console.log("React root created");
        
        // Clear loading spinner
        rootElement.innerHTML = '';
        
        root.render(
          <React.StrictMode>
            <App />
          </React.StrictMode>
        );
        console.log("PAP Application successfully mounted.");
      } catch (renderError) {
        clearTimeout(timeoutId);
        console.error("React rendering error:", renderError);
        rootElement.innerHTML = `
          <div style="width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; background: #fee2e2; font-family: sans-serif;">
            <div style="max-width: 600px; padding: 40px; background: white; border-radius: 12px; border: 1px solid #fecaca;">
              <h1 style="color: #991b1b; margin-bottom: 15px;">❌ Rendering Error</h1>
              <pre style="background: #fef2f2; padding: 15px; border-radius: 6px; overflow-x: auto; font-size: 12px; color: #7f1d1d;">${renderError.message}</pre>
              <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #dc2626; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
                Reload Page
              </button>
            </div>
          </div>
        `;
      }
    }).catch((importError) => {
      clearTimeout(timeoutId);
      console.error("Failed to import App module:", importError);
      rootElement.innerHTML = `
        <div style="width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; background: #fef3c7; font-family: sans-serif;">
          <div style="max-width: 600px; padding: 40px; background: white; border-radius: 12px; border: 1px solid #fcd34d;">
            <h1 style="color: #92400e; margin-bottom: 15px;">⚠️ Module Loading Error</h1>
            <pre style="background: #fffbeb; padding: 15px; border-radius: 6px; overflow-x: auto; font-size: 12px; color: #78350f;">${importError.message}</pre>
            <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #f59e0b; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
              Reload Page
            </button>
          </div>
        </div>
      `;
    });
  } catch (error) {
    console.error("Unexpected error in index.tsx:", error);
    rootElement.innerHTML = `
      <div style="width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; background: #dbeafe; font-family: sans-serif;">
        <div style="max-width: 600px; padding: 40px; background: white; border-radius: 12px; border: 1px solid #bfdbfe;">
          <h1 style="color: #1e40af; margin-bottom: 15px;">❗ Unexpected Error</h1>
          <pre style="background: #eff6ff; padding: 15px; border-radius: 6px; overflow-x: auto; font-size: 12px; color: #1e3a8a;">${error}</pre>
          <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
            Reload Page
          </button>
        </div>
      </div>
    `;
  }
}
