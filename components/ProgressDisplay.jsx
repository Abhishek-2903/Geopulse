import React from 'react';

const ProgressDisplay = ({ progress }) => {
  if (!progress.show) return null;

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{
        width: '100%',
        height: '8px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '4px',
        overflow: 'hidden',
        marginBottom: '10px'
      }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg, #3b82f6, #1e40af)',
          width: `${Math.round((progress.current / progress.total) * 100)}%`,
          transition: 'width 0.3s ease'
        }} />
      </div>
      <div style={{ fontSize: '12px', opacity: 0.8 }}>
        {progress.text} ({progress.current}/{progress.total} - {Math.round((progress.current / progress.total) * 100)}%)
      </div>
    </div>
  );
};

export default ProgressDisplay;