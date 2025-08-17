import React from 'react';
import './Sidebar.css';

const Sidebar = ({ activeTab, countdown, refreshCount, totalCandidates, onTabChange, loading, error, lastRefresh, onRefresh, isCollapsed, onToggleCollapse }) => {
  const toggleSidebar = () => {
    onToggleCollapse(!isCollapsed);
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h3>⚙️ Configuration</h3>
        <button 
          className="sidebar-toggle-button"
          onClick={toggleSidebar}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? '▶️' : '◀️'}
        </button>
      </div>
      
      <div className="sidebar-content">
        <div className="sidebar-section">
          <h4>🎥 Projector Mode</h4>
          <div className="status-indicator connected">
            ✅ Enabled
          </div>
        </div>
        
        <div className="sidebar-section">
          <h4>🔗 Google Sheets Connection</h4>
          {loading ? (
            <div className="status-indicator loading">
              ⏳ Loading data...
            </div>
          ) : error ? (
            <div className="status-indicator disconnected">
              ❌ Connection Error
              <div style={{fontSize: '0.8em', marginTop: '5px'}}>
                {error.length > 50 ? error.substring(0, 50) + '...' : error}
              </div>
            </div>
          ) : (
            <div className="status-indicator connected">
              ✅ Connected to Google Sheets
            </div>
          )}
          <p>📊 <strong>Total Candidates:</strong> {totalCandidates}</p>
          <p>🏆 <strong>Top 10 by Value:</strong> 10 candidates</p>
          <p>📊 <strong>Remaining by Value:</strong> {Math.max(0, totalCandidates - 10)} candidates</p>
          {lastRefresh && (
            <p>🕒 <strong>Last Updated:</strong> {new Date(lastRefresh).toLocaleTimeString()}</p>
          )}
        </div>
        
        <div className="sidebar-section">
          <h4>🔄 Tab Switching Status</h4>
          <p><strong>Current tab:</strong> {activeTab === 0 ? '🏆 Top 10' : '📊 Remaining'}</p>
          
          <div className="countdown-timer">
            ⏱️ Next switch in: {countdown} seconds
          </div>
          
          <div className="tab-buttons">
            <button 
              className={`tab-button ${activeTab === 0 ? 'active' : ''}`}
              onClick={() => onTabChange(0)}
            >
              🏆 Show Top 10
            </button>
            <button 
              className={`tab-button ${activeTab === 1 ? 'active' : ''}`}
              onClick={() => onTabChange(1)}
            >
              📊 Show Remaining
            </button>
          </div>
        </div>
        
        <div className="sidebar-section">
          <h4>📊 Refresh Status</h4>
          <p>🔄 <strong>Refresh count:</strong> {refreshCount}</p>
          <p>⏰ <strong>Auto-refresh:</strong> Every 1 minute</p>
          <button className="refresh-button" onClick={onRefresh} disabled={loading}>
            {loading ? '⏳ Loading...' : '🔄 Refresh Data'}
          </button>
        </div>
        
        <div className="sidebar-section">
          <h4>🔍 Debug Info</h4>
          <p>Active tab: {activeTab}</p>
          <p>Countdown: {countdown}s</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
