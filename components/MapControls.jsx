import React from 'react';

const MapControls = ({
  selectedBounds,
  minZoom, setMinZoom,
  maxZoom, setMaxZoom,
  tileSource, setTileSource,
  exportFormat, setExportFormat,
  estimate,
  generateExport,  // CHANGED
  isGenerating,
  libsLoading,
  libsError,
  jsZip,
  sql
}) => {
  return (
    <>
      <h2 style={{
        fontSize: '28px',
        fontWeight: '700',
        marginBottom: '25px',
        textAlign: 'center'
      }}>
        Map Generator
      </h2>

      <div style={{
        background: selectedBounds ? 'rgba(34, 197, 94, 0.15)' : 'rgba(249, 115, 22, 0.15)',
        border: `1px solid ${selectedBounds ? 'rgba(34, 197, 94, 0.3)' : 'rgba(249, 115, 22, 0.3)'}`,
        borderRadius: '12px',
        padding: '15px',
        marginBottom: '25px'
      }}>
        <div style={{ fontWeight: '600', marginBottom: '5px' }}>
          Target Area
        </div>
        {selectedBounds ? (
          <div style={{ fontSize: '12px', fontFamily: 'monospace', opacity: 0.8 }}>
            Area Selected<br />
            Lat: {selectedBounds._southWest.lat.toFixed(4)} → {selectedBounds._northEast.lat.toFixed(4)}<br/>
            Lng: {selectedBounds._southWest.lng.toFixed(4)} → {selectedBounds._northEast.lng.toFixed(4)}
          </div>
        ) : (
          <div style={{ fontSize: '12px', opacity: 0.8 }}>
            Select target area on map
          </div>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Zoom Levels</label>
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '10px', opacity: '0.7', textTransform: 'uppercase' }}>Min Zoom</label>
            <input type="number" min="1" max="22" value={minZoom} onChange={e => setMinZoom(parseInt(e.target.value))}
              className="modern-input" style={{ width: '100%', padding: '10px', borderRadius: '8px', fontSize: '14px' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '10px', opacity: '0.7', textTransform: 'uppercase' }}>Max Zoom</label>
            <input type="number" min="1" max="22" value={maxZoom} onChange={e => setMaxZoom(parseInt(e.target.value))}
              className="modern-input" style={{ width: '100%', padding: '10px', borderRadius: '8px', fontSize: '14px' }} />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Map Source</label>
        <select value={tileSource} onChange={e => setTileSource(e.target.value)}
          className="modern-select" style={{ width: '100%', padding: '12px', borderRadius: '8px', fontSize: '14px' }}>
          <optgroup label="Standard Maps">
            <option value="osm">Terrain Map</option>
            <option value="satellite">Satellite Imagery</option>
            <option value="topographic">Topographic Map</option>
          </optgroup>
          <optgroup label="Traditional Outdoor">
            <option value="hiking">Physical World Map</option>
            <option value="terrain">Hiking Trails</option>
            <option value="cycling">Street (Cycling)</option>
            <option value="trekking">National Geographic</option>
            <option value="outdoor">Outdoor Canvas</option>
          </optgroup>
        </select>
      </div>

      <div style={{ marginBottom: '25px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Output Format</label>
        <select value={exportFormat} onChange={e => setExportFormat(e.target.value)}
          className="modern-select" style={{ width: '100%', padding: '12px', borderRadius: '8px', fontSize: '14px' }}>
          <option value="mbtiles">MBTiles Database (.mbtiles)</option>
          <option value="tiles">Tiles ZIP Package (.zip)</option>
          <option value="gpkg">GeoPackage (.gpkg)</option>
          <option value="geotiff">GeoTIFF (single raster)</option>
        </select>
        {['gpkg', 'geotiff'].includes(exportFormat) && (
          <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '4px' }}>
            Raster merged at zoom {minZoom}
          </div>
        )}
      </div>

      {estimate && (
        <div style={{
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '12px',
          padding: '15px',
          marginBottom: '25px'
        }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600' }}>Generation Estimate</h4>
          <div style={{ fontSize: '12px', fontFamily: 'monospace', opacity: 0.9 }}>
            Tiles: {estimate.total.toLocaleString()}<br />
            Est. Size: {estimate.estimatedSize.toFixed(1)} MB<br />
            Est. Time: {estimate.estimatedTime < 60 ? estimate.estimatedTime + 's' : Math.round(estimate.estimatedTime / 60) + 'm'}<br />
            {estimate.total > 2000 && (
              <div style={{ marginTop: '10px', fontWeight: '600', color: '#f59e0b' }}>
                Warning: Large operation - may take time
              </div>
            )}
          </div>
        </div>
      )}

      {libsLoading && (
        <div style={{ textAlign: 'center', marginBottom: '20px', fontSize: '14px', opacity: 0.7 }}>
          <div className="loading-spinner" style={{ display: 'inline-block', marginRight: '10px' }}></div>
          Loading core libraries...
        </div>
      )}

      {libsError && (
        <div style={{
          padding: '15px', borderRadius: '8px', fontSize: '13px',
          background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444',
          border: '1px solid rgba(239, 68, 68, 0.3)', marginBottom: '20px'
        }}>
          {libsError}
        </div>
      )}

      <button
        onClick={generateExport}
        disabled={isGenerating || !selectedBounds || libsLoading || !jsZip || !sql}
        className="modern-button"
        style={{
          width: '100%',
          padding: '15px',
          borderRadius: '12px',
          fontSize: '16px',
          cursor: isGenerating || !selectedBounds || libsLoading || !jsZip || !sql ? 'not-allowed' : 'pointer',
          marginBottom: '20px'
        }}
      >
        {isGenerating ? (
          <>
            <span className="loading-spinner"></span>
            Generating...
          </>
        ) : (
          `Generate ${exportFormat.toUpperCase()}`
        )}
      </button>
    </>
  );
};

export default MapControls;
