import React from 'react';

const MapInterface = ({ mapLoaded, handleLoadMap, DynamicMap, setSelectedBounds, tileSource }) => {
  return (
    <div style={{
      flex: 1,
      padding: '30px 30px 30px 0'
    }}>
      <div className="glass-card" style={{
        height: '100%',
        borderRadius: '20px',
        padding: '20px',
        position: 'relative'
      }}>
        <h3 style={{
          margin: '0 0 20px 0',
          fontSize: '20px',
          fontWeight: '600',
          textAlign: 'center'
        }}>
          Map Interface
        </h3>
        <div style={{
          height: 'calc(100% - 60px)',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: '#0f0f0f',
          position: 'relative'
        }}>
          {!mapLoaded ? (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #0a0a0a, #1a1a2e)',
              padding: '40px'
            }}>
              <div style={{
                fontSize: '48px',
                marginBottom: '20px'
              }}>
                🗺️
              </div>
              <h4 style={{
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '12px',
                color: '#ffffff'
              }}>
                Map Ready to Load
              </h4>
              <p style={{
                fontSize: '14px',
                opacity: 0.7,
                marginBottom: '25px',
                textAlign: 'center',
                maxWidth: '400px',
                lineHeight: '1.6'
              }}>
                Click the button below to load the interactive map interface. 
                You'll be able to select your target area for tile generation.
              </p>
              <button
                onClick={handleLoadMap}
                className="modern-button"
                style={{
                  padding: '15px 40px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                Load Map Interface
              </button>
              <div style={{
                marginTop: '20px',
                fontSize: '12px',
                opacity: 0.5,
                textAlign: 'center'
              }}>
                Map will initialize when you're ready
              </div>
            </div>
          ) : (
            <DynamicMap onBoundsChange={setSelectedBounds} tileSource={tileSource} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MapInterface;