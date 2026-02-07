
import React from 'react';
import ReactDOM from 'react-dom/client';

console.log("[PAP] 1: Module starting to execute...");

// Create a simple inline app directly to test if imports are the problem
function SimpleApp() {
  return (
    <div style={{ minHeight: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0fdf4', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '500px', textAlign: 'center', padding: '40px' }}>
        <h1 style={{ fontSize: '2em', fontWeight: 'bold', color: '#166534', marginBottom: '20px' }}>✅ SUCCESS!</h1>
        <p style={{ fontSize: '1.1em', color: '#15803d', marginBottom: '30px' }}>Inline app is loading correctly.</p>
        <p style={{ color: '#64748b', marginBottom: '20px' }}>The module loading and React initialization is working fine.</p>
        <p style={{ color: '#94a3b8', fontSize: '0.9em' }}>Now testing if the issue is with component imports...</p>
        <button onClick={() => location.reload()} style={{ marginTop: '20px', padding: '10px 20px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
          Reload
        </button>
      </div>
    </div>
  );
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("[PAP] CRITICAL: Root element not found!");
} else {
  try {
    console.log("[PAP] 2: Found root element, creating React root...");
    const root = ReactDOM.createRoot(rootElement);
    
    console.log("[PAP] 3: Clearing spinner HTML...");
    rootElement.innerHTML = '';
    
    console.log("[PAP] 4: Rendering SimpleApp...");
    root.render(
      React.createElement(SimpleApp)
    );
    
    console.log("[PAP] 5: SimpleApp rendered successfully!");
  } catch (error) {
    console.error("[PAP] ERROR:", error);
    rootElement.innerHTML = `
      <div style="width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; background: #fee2e2; font-family: sans-serif;">
        <div style="max-width: 500px; padding: 40px; text-align: center;">
          <h1 style="color: #991b1b;">❌ Render Error</h1>
          <p style="color: #7f1d1d; margin-bottom: 20px;">${error.message}</p>
          <p style="color: #7f1d1d; font-size: 0.9em;">Check browser console for more details</p>
        </div>
      </div>
    `;
  }
}
