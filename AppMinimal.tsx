import React, { useState, useEffect } from 'react';

function AppMinimal() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    console.log("[PAP] AppMinimal mounted, setting ready...");
    setReady(true);
  }, []);

  return (
    <div style={{ minHeight: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '600px', textAlign: 'center', padding: '40px' }}>
        <h1 style={{ fontSize: '2.5em', fontWeight: 'bold', color: '#1e293b', marginBottom: '20px' }}>PAP</h1>
        <p style={{ fontSize: '1.1em', color: '#64748b', marginBottom: '30px' }}>Prediction Accountability Platform</p>
        
        {ready ? (
          <div style={{ backgroundColor: '#dcfce7', border: '2px solid #22c55e', padding: '30px', borderRadius: '12px', marginBottom: '20px' }}>
            <p style={{ color: '#166534', fontSize: '1.1em', fontWeight: '600', marginBottom: '10px' }}>✅ App is initialized and running!</p>
            <p style={{ color: '#16a34a', fontSize: '0.95em' }}>If you see this message, the issue is in the full App component, not in the module loading.</p>
          </div>
        ) : (
          <div style={{ backgroundColor: '#fef3c7', border: '2px solid #f59e0b', padding: '30px', borderRadius: '12px' }}>
            <p style={{ color: '#92400e', fontSize: '1.1em', fontWeight: '600' }}>⏳ Minimal app initializing...</p>
          </div>
        )}

        <div style={{ backgroundColor: '#f0f4f8', padding: '20px', borderRadius: '8px', marginTop: '20px', textAlign: 'left' }}>
          <p style={{ color: '#334155', fontSize: '0.9em', margin: '0' }}>
            <strong>Note:</strong> This is a minimal test app. If you see this, the issue is in the full App component imports or initialization logic.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AppMinimal;
