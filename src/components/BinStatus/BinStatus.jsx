import React, { useState, useEffect } from 'react';
import { fetchLatestData } from '../../services/api';
import './BinStatus.css';

const BinStatus = () => {
  const [binData, setBinData] = useState({
    dry: 0,
    wet: 0,
    lastUpdated: ''
  });
  const [loading, setLoading] = useState(true);
  const [fillAnimation, setFillAnimation] = useState(false);
  const [activeTank, setActiveTank] = useState(null);

  // Threshold configuration
  const THRESHOLDS = [
    { level: 100, label: 'FULL', color: '#ff4444' },
    { level: 75, label: 'HIGH', color: '#ff6201' },
    { level: 50, label: 'HALF', color: '#ffbb33' },
    { level: 25, label: 'LOW', color: '#518c9a' },
    { level: 0, label: 'EMPTY', color: '#00C851' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchLatestData();
      if (data) {
        setBinData({
          dry: parseInt(data.field1) || 0,
          wet: parseInt(data.field2) || 0,
          lastUpdated: data.created_at
        });
        triggerFillAnimation();
      }
      setLoading(false);
    };

    fetchData();
    const interval = setInterval(fetchData, 15000);

    return () => clearInterval(interval);
  }, []);

  const triggerFillAnimation = () => {
    setFillAnimation(true);
    setTimeout(() => setFillAnimation(false), 1000);
  };

  const handleTankClick = (type) => {
    setActiveTank(activeTank === type ? null : type);
  };

  const getStatusInfo = (level) => {
    for (let i = 0; i < THRESHOLDS.length; i++) {
      if (level >= THRESHOLDS[i].level) {
        return THRESHOLDS[i];
      }
    }
    return THRESHOLDS[THRESHOLDS.length - 1];
  };

  const renderCircularTank = (level, label, type) => {
    const status = getStatusInfo(level);
    const percentage = Math.min(100, (level / 50) * 100);
    const fillHeight = 90 * (percentage / 100);

    // Generate bubbles
    const bubbles = [];
    const bubbleCount = Math.min(15, Math.floor(percentage / 5));
    
    for (let i = 0; i < bubbleCount; i++) {
      bubbles.push(
        <circle
          key={i}
          cx={Math.random() * 60 + 20}
          cy={95 - (Math.random() * fillHeight)}
          r={Math.random() * 2 + 1}
          fill="rgba(255,255,255,0.5)"
          className="bubble"
          style={{ animationDelay: `${Math.random() * 2}s` }}
        />
      );
    }

    return (
      <div className={`tank-container ${type}`}>
        <div className="tank-label">{label}</div>
        <div 
          className="tank-visualization" 
          onClick={() => handleTankClick(type)}
        >
          <svg className="tank-svg" viewBox="0 0 100 100">
            {/* Tank outline */}
            <circle cx="50" cy="50" r="45" className="tank-outline" />
            
            {/* Fluid fill - properly clipped to circle */}
            <defs>
              <clipPath id={`tank-clip-${type}`}>
                <circle cx="50" cy="50" r="45" />
              </clipPath>
            </defs>
            
            <g clipPath={`url(#tank-clip-${type})`}>
              {/* Fluid background */}
              <rect 
                x="5" 
                y={95 - fillHeight} 
                width="90" 
                height={fillHeight} 
                fill={status.color}
                className={fillAnimation ? 'no-transition' : ''}
                rx="2"
                ry="2"
              />
              
              {/* Fluid shine */}
              <linearGradient id={`fluid-shine-${type}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
              <rect 
                x="5" 
                y={95 - fillHeight} 
                width="90" 
                height={fillHeight} 
                fill={`url(#fluid-shine-${type})`}
                rx="2"
                ry="2"
              />
              
              {/* Bubbles */}
              {bubbles}
              
              {/* Fluid surface */}
              {percentage > 0 && (
                <ellipse 
                  cx="50" 
                  cy={95 - fillHeight} 
                  rx="45" 
                  ry="3" 
                  fill={status.color}
                  className="fluid-surface"
                />
              )}
            </g>
            
            {/* Measurement markers */}
            <circle cx="50" cy="95" r="2" fill="#666" className="tank-marker" data-value="0cm" />
            <circle cx="50" cy="70" r="2" fill="#666" className="tank-marker" data-value="25cm" />
            <circle cx="50" cy="45" r="2" fill="#666" className="tank-marker" data-value="50cm" />
          </svg>
          
          {/* Center display */}
          <div className="tank-center-display" style={{ backgroundColor: status.color }}>
            <div className="tank-level">{level}%</div>
            <div className="tank-status">{status.label}</div>
          </div>
        </div>
        
        {/* Details panel that appears above when clicked */}
        {activeTank === type && (
          <div className="tank-details-panel">
            <div className="panel-header">
              <h3>{label} Details</h3>
              <button 
                className="close-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTank(null);
                }}
              >
                &times;
              </button>
            </div>
            <div className="panel-content">
              <div className="detail-row">
                <span className="detail-label">Current Level:</span>
                <span>{level}cm ({percentage.toFixed(0)}%)</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span style={{ color: status.color, fontWeight: 'bold' }}>{status.label}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Last Updated:</span>
                <span>{new Date(binData.lastUpdated).toLocaleString()}</span>
              </div>
              <div className="progress-container">
                <div 
                  className="progress-bar"
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: status.color
                  }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bin-status-container">
      <h2>Dustbin Status Monitoring</h2>
      {/* <div className="threshold-explanation">
        <p>Thresholds: ≥50cm = FULL | ≥25cm = HALF | &lt;25cm = EMPTY</p>
      </div> */}
      
      {loading ? (
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i> Loading tank data...
        </div>
      ) : (
        <>
          <div className="tank-row">
            {renderCircularTank(binData.dry, 'Dry Waste', 'dry')}
            {renderCircularTank(binData.wet, 'Wet Waste', 'wet')}
          </div>
          
          <div className="tank-controls">
            <button className="refresh-btn" onClick={triggerFillAnimation}>
              <i className="fas fa-sync-alt"></i> Refresh Data
            </button>
            <div className="last-updated">
              <i className="fas fa-clock"></i> Last updated: {new Date(binData.lastUpdated).toLocaleString()}
            </div>
          </div>
          
          {/* <div className="tank-legend">
            {THRESHOLDS.map((threshold, index) => (
              <div key={index} className="legend-item">
                <span className="color-box" style={{ backgroundColor: threshold.color }}></span>
                <span>{threshold.label} (≥{threshold.level}cm)</span>
              </div>
            ))}
          </div> */}
        </>
      )}
    </div>
  );
};

export default BinStatus;