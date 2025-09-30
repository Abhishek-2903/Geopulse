import React from 'react';

const StatusDisplay = ({ status }) => {
  if (!status.show) return null;

  return (
    <div style={{
      padding: '15px',
      borderRadius: '8px',
      fontSize: '13px',
      background: {
        success: 'rgba(34, 197, 94, 0.1)',
        error: 'rgba(239, 68, 68, 0.1)',
        warning: 'rgba(249, 115, 22, 0.1)',
        info: 'rgba(59, 130, 246, 0.1)'
      }[status.type],
      color: {
        success: '#22c55e',
        error: '#ef4444',
        warning: '#f97316',
        info: '#3b82f6'
      }[status.type],
      border: `1px solid ${
        {
          success: 'rgba(34, 197, 94, 0.3)',
          error: 'rgba(239, 68, 68, 0.3)',
          warning: 'rgba(249, 115, 22, 0.3)',
          info: 'rgba(59, 130, 246, 0.3)'
        }[status.type]
      }`,
      whiteSpace: 'pre-line'
    }}>
      {status.message}
    </div>
  );
};

export default StatusDisplay;