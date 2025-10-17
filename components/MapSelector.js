// components/MapSelector.js
import { useEffect, useRef, useState, useCallback } from 'react';
import 'leaflet/dist/leaflet.css'; // Bundled CSS import (safe in Next.js)

export default function MapSelector({ onBoundsChange, tileSource }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const rectangleRef = useRef(null);
  const [leafletReady, setLeafletReady] = useState(false);
  const [loadingState, setLoadingState] = useState('initializing');
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);
  const initAttemptRef = useRef(0);
  const [L, setL] = useState(null); // Store imported Leaflet module
  const [latInput, setLatInput] = useState('');
  const [lngInput, setLngInput] = useState('');

  const cleanup = useCallback(() => {
    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        console.log('Map instance cleaned up');
      } catch (error) {
        console.error('Error cleaning up map:', error);
      }
    }
    if (rectangleRef.current) {
      rectangleRef.current = null;
    }
  }, []);

  // Load Leaflet dynamically (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    mountedRef.current = true;
    initAttemptRef.current++;
    const currentAttempt = initAttemptRef.current;

    console.log('MapSelector mounted, init attempt:', currentAttempt);

    const mountDelay = setTimeout(() => {
      if (!mountedRef.current || initAttemptRef.current !== currentAttempt) {
        console.log('Mount cancelled or superseded');
        return;
      }

      let retryCount = 0;
      const maxRetries = 2;

      const initializeLeaflet = async () => {
        if (!mountedRef.current || initAttemptRef.current !== currentAttempt) {
          console.log('Initialization cancelled');
          return;
        }

        try {
          setLoadingState(`loading (${retryCount + 1}/${maxRetries + 1})`);
          setError(null);

          const module = await import('leaflet');
          setL(module.default);

          if (mountedRef.current && initAttemptRef.current === currentAttempt && module.default && typeof module.default.map === 'function') {
            console.log('Leaflet imported successfully');
            setLeafletReady(true);
            setLoadingState('ready');
            setError(null);
          } else {
            throw new Error('Leaflet imported but context changed');
          }
        } catch (err) {
          console.error('Error importing Leaflet, attempt:', retryCount + 1, err);

          if (retryCount < maxRetries && mountedRef.current && initAttemptRef.current === currentAttempt) {
            retryCount++;
            setLoadingState(`retrying (${retryCount}/${maxRetries})`);
            setTimeout(initializeLeaflet, 2000);
          } else {
            setLoadingState('failed');
            setError(err.message || 'Failed to load map interface');
            console.error('Failed to import Leaflet after', maxRetries + 1, 'attempts');
          }
        }
      };

      initializeLeaflet();
    }, 1200);

    return () => {
      clearTimeout(mountDelay);
      mountedRef.current = false;
      cleanup();
    };
  }, [cleanup]);

  // Initialize map once Leaflet is ready
  useEffect(() => {
    if (!leafletReady || mapInstanceRef.current || !mapRef.current || !L || !mountedRef.current) {
      return;
    }

    const timer = setTimeout(() => {
      if (mountedRef.current && mapRef.current && !mapInstanceRef.current && L) {
        const hasValidDimensions = mapRef.current.offsetWidth > 0 && mapRef.current.offsetHeight > 0;

        if (hasValidDimensions) {
          initializeMap();
        } else {
          console.log('Container dimensions invalid, retrying...');
          setTimeout(() => {
            if (mountedRef.current && !mapInstanceRef.current) {
              initializeMap();
            }
          }, 1000);
        }
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [leafletReady, L]);

  // Update tiles when source changes
  useEffect(() => {
    if (mapInstanceRef.current && L && leafletReady && mountedRef.current) {
      updateMapTiles();
    }
  }, [tileSource, leafletReady, L]);

  const getTileConfig = (source) => {
    const configs = {
      'osm': {
        url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '© OpenStreetMap contributors',
        maxNativeZoom: 19,
        maxZoom: 22
      },
      'satellite': {
        url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
        attribution: '© Google',
        maxNativeZoom: 22,
        maxZoom: 24
      },
      'mapbox-satellite': {
        url: 'https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.jpg?access_token=YOUR_MAPBOX_TOKEN',
        attribution: '© Mapbox © Maxar',
        maxNativeZoom: 22,
        maxZoom: 24
      },
      'hybrid': {
        url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
        attribution: '© Google Hybrid',
        maxNativeZoom: 22,
        maxZoom: 24
      },
      'terrain': {
        url: 'https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg',
        attribution: '© Stamen Design © OpenStreetMap',
        maxNativeZoom: 18,
        maxZoom: 22
      },
      'topographic': {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        attribution: 'Tiles © Esri — DeLorme, NAVTEQ',
        maxNativeZoom: 20,
        maxZoom: 22
      },
      'hiking': {
        url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        attribution: '© OpenTopoMap (CC-BY-SA)',
        maxNativeZoom: 17,
        maxZoom: 22,
        subdomains: ['a', 'b', 'c']
      },
      'cycling': {
        url: 'https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
        attribution: '© CyclOSM © OpenStreetMap',
        maxNativeZoom: 20,
        maxZoom: 22,
        subdomains: ['a', 'b']
      },
      'trekking': {
        url: 'https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=YOUR_API_KEY',
        attribution: '© Thunderforest © OpenStreetMap',
        maxNativeZoom: 22,
        maxZoom: 24
      },
      'outdoor': {
        url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        attribution: '© CARTO © OpenStreetMap',
        maxNativeZoom: 20,
        maxZoom: 22,
        subdomains: ['a', 'b', 'c', 'd']
      }
    };

    return configs[source] || configs['satellite'];
  };

  const updateMapTiles = () => {
    if (!mapInstanceRef.current || !L || !mountedRef.current) return;

    const map = mapInstanceRef.current;

    try {
      map.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) {
          map.removeLayer(layer);
        }
      });

      const config = getTileConfig(tileSource);
      const options = {
        attribution: config.attribution,
        maxNativeZoom: config.maxNativeZoom,
        maxZoom: config.maxZoom,
        timeout: 15000
      };
      
      // Add subdomains if available
      if (config.subdomains) {
        options.subdomains = config.subdomains;
      }
      
      const tileLayer = L.tileLayer(config.url, options);

      tileLayer.addTo(map);
      console.log('Map tiles updated to:', tileSource, 'with maxZoom:', config.maxZoom);
    } catch (error) {
      console.error('Error updating map tiles:', error);
    }
  };

  const initializeMap = () => {
    if (!L || !mapRef.current || mapInstanceRef.current || !mountedRef.current) {
      console.log('Map initialization skipped - preconditions not met');
      return;
    }

    try {
      const container = mapRef.current;

      console.log('Initializing map with container:', container);

      const hasValidDimensions = container.offsetWidth > 0 && container.offsetHeight > 0;

      if (!hasValidDimensions) {
        console.warn('Container dimensions invalid, aborting');
        return;
      }

      // Clear container to prevent conflicts
      container.innerHTML = '';

      const map = L.map(container, {
        zoomControl: false,
        preferCanvas: true,
        attributionControl: true
      }).setView([28.6139, 77.2090], 10);

      mapInstanceRef.current = map;
      console.log('Map instance created successfully');

      L.control.zoom({
        position: 'topright'
      }).addTo(map);

      updateMapTiles();

      const DrawControl = L.Control.extend({
        onAdd: function (map) {
          const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');

          container.style.cssText = `
            background: rgba(0, 0, 0, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.2);
            width: 40px;
            height: 40px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            color: #ffffff;
            backdrop-filter: blur(10px);
            border-radius: 6px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
            transition: all 0.2s ease;
          `;

          container.innerHTML = '🎯';
          container.title = 'Select target area';

          L.DomEvent.on(container, 'click', function () {
            if (mountedRef.current) {
              enableDrawing(map, L);
            }
          });

          L.DomEvent.disableClickPropagation(container);
          return container;
        },
      });

      new DrawControl({ position: 'topright' }).addTo(map);

      const instructionDiv = L.DomUtil.create('div', 'map-instruction');
      instructionDiv.innerHTML = `
        <div class="modern-instruction" style="
          position: absolute;
          top: 15px;
          left: 15px;
          background: rgba(0, 0, 0, 0.8);
          color: #ffffff;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          z-index: 1000;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(10px);
        ">
          Click target selector to define area
        </div>
      `;
      container.appendChild(instructionDiv);

      map.whenReady(() => {
        console.log('Map initialized and ready');
        setTimeout(() => {
          if (mountedRef.current && mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
            console.log('Map size invalidated for proper display');
          }
        }, 300);
      });

    } catch (error) {
      console.error('Error initializing map:', error);
      setError('Failed to initialize map: ' + error.message);
    }
  };

  const enableDrawing = (map, L) => {
    if (!mountedRef.current) return;

    let isDrawing = false;
    let startLatLng = null;

    if (rectangleRef.current) {
      map.removeLayer(rectangleRef.current);
      rectangleRef.current = null;
      if (onBoundsChange) onBoundsChange(null);
    }

    map.getContainer().style.cursor = 'crosshair';

    const instruction = mapRef.current.querySelector('.modern-instruction');
    if (instruction) {
      instruction.innerHTML = 'Drag to select target area';
      instruction.style.background = 'rgba(34, 197, 94, 0.9)';
    }

    const onMouseDown = (e) => {
      if (!mountedRef.current) return;
      isDrawing = true;
      startLatLng = e.latlng;
      map.dragging.disable();
      map.doubleClickZoom.disable();
    };

    const onMouseMove = (e) => {
      if (!isDrawing || !startLatLng || !mountedRef.current) return;

      if (rectangleRef.current) {
        map.removeLayer(rectangleRef.current);
      }

      const bounds = L.latLngBounds(startLatLng, e.latlng);
      rectangleRef.current = L.rectangle(bounds, {
        color: '#3b82f6',
        weight: 2,
        opacity: 1,
        fillColor: '#3b82f6',
        fillOpacity: 0.1,
        dashArray: '5, 5'
      }).addTo(map);
    };

    const onMouseUp = (e) => {
      if (!isDrawing || !startLatLng || !mountedRef.current) return;

      isDrawing = false;
      const bounds = L.latLngBounds(startLatLng, e.latlng);

      if (rectangleRef.current) {
        map.removeLayer(rectangleRef.current);
      }

      rectangleRef.current = L.rectangle(bounds, {
        color: '#22c55e',
        weight: 2,
        opacity: 1,
        fillColor: '#22c55e',
        fillOpacity: 0.15
      }).addTo(map);

      const center = bounds.getCenter();
      const area = calculateArea(bounds);

      const popupContent = `
        <div style="
          background: rgba(0, 0, 0, 0.9);
          color: #ffffff;
          font-size: 12px;
          text-align: center;
          padding: 12px;
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          min-width: 150px;
        ">
          <div style="color: #22c55e; font-weight: 600; margin-bottom: 8px;">
            Area Selected
          </div>
          <div style="color: #ffffff; opacity: 0.9;">
            ${area.toFixed(2)} km²
          </div>
        </div>
      `;

      L.popup().setLatLng(center).setContent(popupContent).openOn(map);

      if (onBoundsChange) onBoundsChange(bounds);

      map.getContainer().style.cursor = '';
      if (instruction) {
        instruction.innerHTML = 'Area selected - click again to modify';
        instruction.style.background = 'rgba(34, 197, 94, 0.9)';
      }

      map.dragging.enable();
      map.doubleClickZoom.enable();

      map.off('mousedown', onMouseDown);
      map.off('mousemove', onMouseMove);
      map.off('mouseup', onMouseUp);
    };

    map.on('mousedown', onMouseDown);
    map.on('mousemove', onMouseMove);
    map.on('mouseup', onMouseUp);
  };

  const calculateArea = (bounds) => {
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    const latDiff = ne.lat - sw.lat;
    const lngDiff = ne.lng - sw.lng;
    const latKm = latDiff * 111;
    const lngKm = lngDiff * 111 * Math.cos((sw.lat * Math.PI) / 180);
    return Math.abs(latKm * lngKm);
  };

  const handleRetry = () => {
    setError(null);
    setLeafletReady(false);
    setLoadingState('initializing');
    initAttemptRef.current = 0;
    // Trigger re-import
    setL(null);
  };

  const handleSearch = () => {
    const lat = parseFloat(latInput);
    const lng = parseFloat(lngInput);

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setError('Invalid coordinates. Latitude must be between -90 and 90, Longitude between -180 and 180.');
      return;
    }

    if (mapInstanceRef.current && L && mountedRef.current) {
      mapInstanceRef.current.setView([lat, lng], 20); // Changed zoom level to 20 for high detail
      setError(null);
      setLatInput('');
      setLngInput('');
      console.log(`Map centered to coordinates: [${lat}, ${lng}] at zoom level 20`);
    }
  };

  return (
    <>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        padding: '10px',
        position: 'absolute',
        top: '7%',
        right: '200px',
        transform: 'translateY(-50%)',
        zIndex: '1000',
      }}>
        <div style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
        }}>
          <input
            type="text"
            placeholder="Latitude (-90 to 90)"
            value={latInput}
            onChange={(e) => setLatInput(e.target.value)}
            className="modern-input"
            style={{
              padding: '8px',
              borderRadius: '6px',
              width: '150px',
            }}
          />
          <input
            type="text"
            placeholder="Longitude (-180 to 180)"
            value={lngInput}
            onChange={(e) => setLngInput(e.target.value)}
            className="modern-input"
            style={{
              padding: '8px',
              borderRadius: '6px',
              width: '150px',
            }}
          />
          <button
            onClick={handleSearch}
            className="modern-button"
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
            }}
          >
            Search
          </button>
        </div>
        {error && (
          <div style={{
            color: '#ff6b6b',
            fontSize: '12px',
            textAlign: 'center',
          }}>
            {error}
          </div>
        )}
      </div>
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: '130%',
          borderRadius: '8px',
          position: 'relative',
          background: 'linear-gradient(135deg, #0a0a0a, #1a1a2e)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '520px'
        }}
      >
        {!leafletReady && (
          <div style={{
            color: 'white',
            fontSize: '16px',
            textAlign: 'center',
            padding: '20px',
            maxWidth: '300px'
          }}>
            {loadingState !== 'failed' ? (
              <>
                <div style={{
                  width: '40px',
                  height: '40px',
                  border: '3px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '3px solid #ffffff',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 15px'
                }}></div>
                <div>Loading Map Interface...</div>
                <div style={{ 
                  fontSize: '12px', 
                  marginTop: '8px', 
                  opacity: 0.7,
                  textTransform: 'capitalize'
                }}>
                  Status: {loadingState}
                </div>
              </>
            ) : (
              <>
                <div style={{ 
                  fontSize: '24px', 
                  marginBottom: '15px',
                  color: '#ff6b6b'
                }}>
                  ⚠️
                </div>
                <div style={{ 
                  marginBottom: '15px',
                  color: '#ff6b6b',
                  lineHeight: '1.4'
                }}>
                  Failed to load map interface
                </div>
                {error && (
                  <div style={{ 
                    fontSize: '11px', 
                    marginBottom: '15px',
                    color: '#ffaa00',
                    opacity: 0.8
                  }}>
                    {error}
                  </div>
                )}
                <button
                  onClick={handleRetry}
                  style={{
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#1e40af';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#3b82f6';
                  }}
                >
                  Retry Loading
                </button>
              </>
            )}
          </div>
        )}
      </div>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        :global(.leaflet-control-zoom a) {
          background: rgba(0, 0, 0, 0.8) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          color: white !important;
          backdrop-filter: blur(10px) !important;
          border-radius: 6px !important;
          margin-bottom: 2px !important;
        }
        
        :global(.leaflet-control-zoom a:hover) {
          background: rgba(59, 130, 246, 0.8) !important;
        }
        
        :global(.leaflet-container) {
          background: linear-gradient(135deg, #0a0a0a, #1a1a2e) !important;
        }
        
        :global(.leaflet-control-attribution) {
          background: rgba(0, 0, 0, 0.8) !important;
          color: white !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          border-radius: 5px !important;
          font-size: 10px !important;
        }

        :global(.leaflet-popup-content-wrapper) {
          background: transparent !important;
          box-shadow: none !important;
          border-radius: 0 !important;
          padding: 0 !important;
        }

        :global(.leaflet-popup-tip) {
          display: none !important;
        }
      `}</style>
    </>
  );
}