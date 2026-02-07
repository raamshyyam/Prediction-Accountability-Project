
import React from 'react';
import ReactDOM from 'react-dom/client';

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("Critical Error: Root element not found in index.html");
} else {
  try {
    console.log("Starting React app...");
    
    // Dynamically import App to catch import errors
    import('./App.tsx').then((module) => {
      console.log("App module loaded successfully");
      const App = module.default;
      
      try {
        const root = ReactDOM.createRoot(rootElement);
        console.log("React root created");
        
        root.render(
          <React.StrictMode>
            <App />
          </React.StrictMode>
        );
        console.log("PAP Application successfully mounted.");
      } catch (renderError) {
        console.error("React rendering error:", renderError);
        rootElement.innerHTML = `<div style="padding: 20px; color: red;"><h1>Error rendering app</h1><pre>${renderError}</pre></div>`;
      }
    }).catch((importError) => {
      console.error("Failed to import App module:", importError);
      rootElement.innerHTML = `<div style="padding: 20px; color: red;"><h1>Error loading app module</h1><pre>${importError}</pre></div>`;
    });
  } catch (error) {
    console.error("Unexpected error in index.tsx:", error);
    rootElement.innerHTML = `<div style="padding: 20px; color: red;"><h1>Unexpected error</h1><pre>${error}</pre></div>`;
  }
}
