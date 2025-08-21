import React, { useState, useEffect } from 'react';

const DebugInfo = () => {
  const [apiStatus, setApiStatus] = useState('Unknown');
  const [lastCheck, setLastCheck] = useState(null);

  const checkApi = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/google-sheets-data');
      if (response.ok) {
        setApiStatus('✅ Backend API is running');
      } else {
        setApiStatus('❌ Backend API error');
      }
    } catch (error) {
      setApiStatus(`❌ Backend API failed: ${error.message}`);
    }
    setLastCheck(new Date().toLocaleTimeString());
  };

  useEffect(() => {
    checkApi();
    const interval = setInterval(checkApi, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      background: '#333',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 1000,
      maxWidth: '300px'
    }}>
      <div><strong>🔧 Debug Info:</strong></div>
      <div>API Status: {apiStatus}</div>
      <div>Last Check: {lastCheck}</div>
      <button 
        onClick={checkApi}
        style={{
          background: '#007bff',
          color: 'white',
          border: 'none',
          padding: '5px 10px',
          borderRadius: '3px',
          marginTop: '5px',
          cursor: 'pointer'
        }}
      >
        🔄 Check API
      </button>
    </div>
  );
};

export default DebugInfo;

