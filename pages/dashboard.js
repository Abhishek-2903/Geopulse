import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import NavBar from '../components/NavBar';
import MapControls from '../components/MapControls';
import MapInterface from '../components/MapInterface';
import StatusDisplay from '../components/StatusDisplay';
import ProgressDisplay from '../components/ProgressDisplay';
import UsageStats from '../components/UsageStats';
import PaymentModal from '../components/PaymentModal';
import { dbHelpers } from '../lib/Supabase';

// Dynamically import Leaflet to avoid SSR issues
const DynamicMap = dynamic(() => import("../components/MapSelector"), {
  ssr: false,
  loading: () => (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0f0f0f'
    }}>
      <div style={{
        color: '#ffffff',
        fontSize: '16px',
        textAlign: 'center'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '3px solid #666',
          borderTop: '3px solid #ffffff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 12px'
        }}></div>
        Loading Map Interface...
      </div>
    </div>
  )
});

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedBounds, setSelectedBounds] = useState(null);
  const [progress, setProgress] = useState({ show: false, current: 0, total: 0, text: '' });
  const [status, setStatus] = useState({ show: false, message: '', type: 'info' });
  const [mapLoaded, setMapLoaded] = useState(false);
  const [libsLoading, setLibsLoading] = useState(true);
  const [libsError, setLibsError] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showStats, setShowStats] = useState(false);
  
  // Payment related states
  const [downloadStats, setDownloadStats] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  
  // Form states
  const [minZoom, setMinZoom] = useState(12);
  const [maxZoom, setMaxZoom] = useState(15);
  const [tileSource, setTileSource] = useState('osm');
  const [exportFormat, setExportFormat] = useState('mbtiles');
  
  // Library states
  const [jsZip, setJsZip] = useState(null);
  const [sql, setSql] = useState(null);

  const supabase = createClientComponentClient();
  const router = useRouter();

  // Auth check with token refresh and validation
  useEffect(() => {
    const checkAuth = async () => {
      setAuthLoading(true);
      try {
        const justSignedIn = sessionStorage.getItem('justSignedIn');
        let session = null;

        if (justSignedIn) {
          sessionStorage.removeItem('justSignedIn');
          const { data, error } = await supabase.auth.getSession();
          if (error) {
            console.error('Session fetch error:', error);
            router.push('/');
            return;
          }
          session = data.session;
        } else {
          const { data, error } = await supabase.auth.getSession();
          if (error) {
            console.error('Session fetch error:', error);
            router.push('/');
            return;
          }
          session = data.session;
          if (session && new Date(session.expires_at * 1000) < new Date()) {
            const { data: refreshedData, error: refreshError } = await supabase.auth.refreshSession();
            if (refreshError) {
              console.error('Token refresh error:', refreshError);
              router.push('/');
              return;
            }
            session = refreshedData.session;
          }
        }

        if (!session || !session.user) {
          router.push('/');
          return;
        }

        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData.user) {
          console.error('User validation error:', userError);
          router.push('/');
          return;
        }

        setUser(userData.user);
        setAuthLoading(false);
      } catch (error) {
        console.error('Authentication error:', error);
        router.push('/');
        setAuthLoading(false);
      }
    };

    checkAuth();

    const { subscription } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (event === 'SIGNED_OUT') {
        router.push('/');
      } else if (event === 'TOKEN_REFRESHED' && newSession) {
        setUser(newSession.user);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [router, supabase]);

  // Fetch download stats when user is loaded
  useEffect(() => {
    if (user) {
      fetchDownloadStats();
    }
  }, [user]);

  const fetchDownloadStats = async () => {
    if (!user) return;
    
    try {
      const stats = await dbHelpers.getUserDownloadStats(user.id);
      setDownloadStats(stats);
    } catch (error) {
      console.error('Error fetching download stats:', error);
    }
  };

  // Load JSZip and SQL.js dynamically
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadLibs = async () => {
      setLibsLoading(true);
      setLibsError(null);

      try {
        const jszipMod = await import('jszip');
        if (!jszipMod.default || typeof jszipMod.default !== 'function') {
          throw new Error('JSZip module did not export a valid constructor');
        }
        setJsZip(() => jszipMod.default);
        console.log('JSZip loaded successfully');

        const initSqlJs = (await import('sql.js')).default;
        const response = await fetch('/sql-wasm.wasm');
        if (!response.ok) {
          throw new Error(`Failed to fetch WASM file: ${response.statusText}`);
        }
        const SQL = await initSqlJs({
          locateFile: () => '/sql-wasm.wasm'
        });
        setSql(() => SQL);
        console.log('SQL.js loaded successfully');
        setStatus({ show: true, message: 'Map Generator Ready', type: 'success' });
      } catch (error) {
        console.error('Library loading error:', error);
        setLibsError(error.message || 'Failed to load required libraries');
        setStatus({ show: true, message: 'Failed to initialize core. Please refresh.', type: 'error' });
      } finally {
        setLibsLoading(false);
      }
    };

    loadLibs();
  }, []);

  const checkDownloadLimit = () => {
    if (!downloadStats) return false;
    return downloadStats.downloads_remaining > 0;
  };

  const handlePaymentSuccess = async () => {
    await fetchDownloadStats(); // Refresh download stats
    setStatus({ 
      show: true, 
      message: '✅ Payment successful! 100 downloads added to your account.', 
      type: 'success' 
    });
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
      setStatus({ show: true, message: 'Error signing out', type: 'error' });
    }
  };

  const handleLoadMap = () => {
    setMapLoaded(true);
    setStatus({ show: true, message: 'Loading map interface...', type: 'info' });
  };

  const deg2num = (lat_deg, lon_deg, zoom) => {
    const lat_rad = lat_deg * Math.PI / 180;
    const n = Math.pow(2, zoom);
    const xtile = Math.floor((lon_deg + 180.0) / 360.0 * n);
    const ytile = Math.floor((1.0 - Math.asinh(Math.tan(lat_rad)) / Math.PI) / 2.0 * n);
    return [xtile, ytile];
  };

  const getTileEstimate = () => {
    if (!selectedBounds) return null;

    const { _southWest, _northEast } = selectedBounds;
    const minLat = _southWest.lat;
    const maxLat = _northEast.lat;
    const minLon = _southWest.lng;
    const maxLon = _northEast.lng;

    let total = 0;
    let breakdown = [];

    for (let zoom = minZoom; zoom <= maxZoom; zoom++) {
      const [minX, maxY] = deg2num(minLat, minLon, zoom);
      const [maxX, minY] = deg2num(maxLat, maxLon, zoom);
      const tilesThisZoom = (maxX - minX + 1) * (maxY - minY + 1);
      total += tilesThisZoom;
      breakdown.push({ zoom, count: tilesThisZoom });
    }

    const estimatedSize = (total * 0.05); // Assuming ~50KB per tile
    const estimatedTime = Math.round(total * 0.1); // Assuming ~100ms per tile

    return { total, breakdown, estimatedSize, estimatedTime };
  };

  const getTileUrl = (source, z, x, y) => {
    const urls = {
      'osm': `https://tile.openstreetmap.org/${z}/${x}/${y}.png`,
      'satellite': `https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`,
      'topographic': `https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/${z}/${y}/${x}`,
      'hiking': `https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/${z}/${y}/${x}`,
      'terrain': `https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/${z}/${y}/${x}`,
      'cycling': `https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/${z}/${y}/${x}`,
      'trekking': `https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/${z}/${y}/${x}`,
      'outdoor': `https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/${z}/${y}/${x}`
    };
    return urls[source] || urls['osm'];
  };

  const downloadTile = async (url) => {
    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': 'GeoPulse-Generator/1.0' }
      });
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        return new Uint8Array(arrayBuffer);
      }
      console.warn(`Failed to download tile: ${url} (status: ${response.status})`);
      return null;
    } catch (error) {
      console.error('Failed to download tile:', url, error);
      return null;
    }
  };

  const createTilesZip = async (tiles, filename) => {
    if (!jsZip || typeof jsZip !== 'function') {
      throw new Error('JSZip library not loaded or invalid');
    }

    const zip = new jsZip();
    
    tiles.forEach(tile => {
      const path = `tiles/${tile.zoom}/${tile.x}/${tile.y}.png`;
      zip.file(path, tile.data);
    });

    const manifest = {
      type: 'GeoPulse Map Tiles',
      version: '1.0',
      created: new Date().toISOString(),
      total_tiles: tiles.length,
      structure: 'tiles/{z}/{x}/{y}.png',
      bounds: selectedBounds ? {
        south: selectedBounds._southWest.lat,
        west: selectedBounds._southWest.lng,
        north: selectedBounds._northEast.lat,
        east: selectedBounds._northEast.lng
      } : null,
      zoom_range: `${minZoom}-${maxZoom}`,
      tile_source: tileSource,
      usage: 'Extract and use the tiles/ folder with any mapping software that supports slippy map tiles'
    };

    zip.file('manifest.json', JSON.stringify(manifest, null, 2));

    const readme = `GeoPulse Map Tiles
==================

This ZIP contains ${tiles.length} map tiles in standard slippy map format.

Folder Structure:
tiles/
├── {zoom}/
│   ├── {x}/
│   │   └── {y}.png

How to use:
1. Extract this ZIP file
2. Use the tiles/ folder with any mapping software
3. Point your map application to the tiles/ directory
4. The tiles follow the standard Z/X/Y.png naming convention

Tile Information:
- Source: ${tileSource}
- Zoom levels: ${minZoom} to ${maxZoom}
- Total tiles: ${tiles.length}
- Generated: ${new Date().toLocaleString()}

Compatible with:
- QGIS (add as XYZ Tiles)
- OpenLayers
- Leaflet
- MapProxy
- TileServer GL
- Most GIS applications

For questions or support, refer to the manifest.json file for detailed metadata.
`;

    zip.file('README.txt', readme);

    return await zip.generateAsync({ type: 'blob' });
  };

  const generateMBTiles = async () => {
    // Check download limit first
    if (!checkDownloadLimit()) {
      setShowPaymentModal(true);
      return;
    }

    if (!sql) {
      setStatus({ show: true, message: 'Core not initialized. Please wait and try again.', type: 'error' });
      return;
    }

    if (!selectedBounds) {
      setStatus({ show: true, message: 'Please select a target area on the map first.', type: 'error' });
      return;
    }

    if (isGenerating) {
      setStatus({ show: true, message: 'Generation in progress. Please wait.', type: 'warning' });
      return;
    }

    const { _southWest, _northEast } = selectedBounds;
    const minLat = _southWest.lat;
    const maxLat = _northEast.lat;
    const minLon = _southWest.lng;
    const maxLon = _northEast.lng;

    if (minZoom > maxZoom || minZoom < 1 || maxZoom > 22) {
      setStatus({ show: true, message: 'Invalid zoom levels (1-22, min ≤ max).', type: 'error' });
      return;
    }

    const estimate = getTileEstimate();
    if (!estimate) {
      setStatus({ show: true, message: 'Invalid area selected', type: 'error' });
      return;
    }

    if (estimate.total > 5000) {
      if (!confirm(`This operation will process ${estimate.total.toLocaleString()} tiles. This may consume significant bandwidth and time. Proceed?`)) {
        return;
      }
    }

    setIsGenerating(true);
    setStatus({ show: true, message: 'Initializing map generation...', type: 'info' });

    try {
      // Deduct download count before starting generation
      const deductSuccess = await dbHelpers.deductDownload(user.id);
      if (!deductSuccess) {
        throw new Error('Failed to process download. Please try again.');
      }

      // Update local state
      setDownloadStats(prev => ({
        ...prev,
        downloads_remaining: prev.downloads_remaining - 1,
        total_downloads: prev.total_downloads + 1
      }));

      let blob, filename, actualTileCount = 0;

      if (exportFormat === 'tiles') {
        const tiles = [];
        let downloadedTiles = 0;
        let successfulTiles = 0;
        let failedTiles = 0;

        for (let zoom = minZoom; zoom <= maxZoom; zoom++) {
          const [minX, maxY] = deg2num(minLat, minLon, zoom);
          const [maxX, minY] = deg2num(maxLat, maxLon, zoom);

          for (let x = minX; x <= maxX; x++) {
            for (let y = minY; y <= maxY; y++) {
              const tileUrl = getTileUrl(tileSource, zoom, x, y);
              const tileData = await downloadTile(tileUrl);
              
              downloadedTiles++;
              setProgress({ show: true, current: downloadedTiles, total: estimate.total, text: `Downloading tiles (zoom ${zoom})` });

              if (tileData && tileData.length > 0) {
                tiles.push({ zoom, x, y, data: tileData });
                successfulTiles++;
              } else {
                failedTiles++;
              }

              if (downloadedTiles % 5 === 0) {
                await new Promise(resolve => setTimeout(resolve, 300));
              } else {
                await new Promise(resolve => setTimeout(resolve, 100));
              }
            }
          }
        }

        if (successfulTiles === 0) {
          throw new Error('Processing failed: No tiles were successfully downloaded. Check connection and retry.');
        }

        actualTileCount = successfulTiles;
        console.log(`Tiles format: Successfully downloaded ${actualTileCount} tiles, ${failedTiles} failed`);

        setProgress({ show: true, current: estimate.total, total: estimate.total, text: 'Creating tiles package...' });
        blob = await createTilesZip(tiles, filename);
        filename = `geopulse_tiles_${tileSource}_${new Date().toISOString().slice(0, 16).replace(/[:-]/g, '')}.zip`;
      } else {
        const db = new sql.Database();
        db.run(`
          CREATE TABLE metadata (name TEXT, value TEXT);
          CREATE TABLE tiles (zoom_level INTEGER, tile_column INTEGER, tile_row INTEGER, tile_data BLOB);
          CREATE UNIQUE INDEX tile_index ON tiles (zoom_level, tile_column, tile_row);
        `);

        const sourceNames = {
          'osm': 'OpenStreetMap',
          'satellite': 'ArcGIS World Imagery',
          'topographic': 'ArcGIS Topographic',
          'hiking': 'Physical World Map',
          'terrain': 'Terrain Base Map',
          'cycling': 'Street Navigation',
          'trekking': 'National Geographic',
          'outdoor': 'Light Canvas Map'
        };

        const sourceName = sourceNames[tileSource] || 'Custom Map';

        const metadata = [
          ['name', 'GeoPulse Generated Tiles'],
          ['type', 'baselayer'],
          ['version', '1.0'],
          ['description', `Processed tiles from ${sourceName}`],
          ['format', 'png'],
          ['bounds', `${minLon},${minLat},${maxLon},${maxLat}`],
          ['minzoom', minZoom.toString()],
          ['maxzoom', maxZoom.toString()],
          ['center', `${(minLon + maxLon) / 2},${(minLat + maxLat) / 2},${minZoom}`],
          ['attribution', `© ${sourceName} | Processed by GeoPulse`]
        ];

        const metadataStmt = db.prepare('INSERT INTO metadata (name, value) VALUES (?, ?)');
        metadata.forEach(([name, value]) => metadataStmt.run([name, value]));
        metadataStmt.free();

        let downloadedTiles = 0;
        let successfulTiles = 0;
        let failedTiles = 0;

        const tileStmt = db.prepare('INSERT INTO tiles (zoom_level, tile_column, tile_row, tile_data) VALUES (?, ?, ?, ?)');

        for (let zoom = minZoom; zoom <= maxZoom; zoom++) {
          const [minX, maxY] = deg2num(minLat, minLon, zoom);
          const [maxX, minY] = deg2num(maxLat, maxLon, zoom);

          for (let x = minX; x <= maxX; x++) {
            for (let y = minY; y <= maxY; y++) {
              const url = getTileUrl(tileSource, zoom, x, y);
              const tileData = await downloadTile(url);
              
              downloadedTiles++;
              setProgress({ show: true, current: downloadedTiles, total: estimate.total, text: `Processing tiles (zoom ${zoom})` });

              if (tileData && tileData.length > 0) {
                const tmsY = Math.pow(2, zoom) - 1 - y;
                try {
                  tileStmt.run([zoom, x, tmsY, tileData]);
                  successfulTiles++;
                } catch (error) {
                  console.error('Error inserting tile:', error);
                  failedTiles++;
                }
              } else {
                failedTiles++;
              }

              if (downloadedTiles % 10 === 0) {
                await new Promise(resolve => setTimeout(resolve, 200));
              } else {
                await new Promise(resolve => setTimeout(resolve, 50));
              }
            }
          }
        }

        tileStmt.free();

        if (successfulTiles === 0) {
          throw new Error('Processing failed: No tiles were successfully processed. Check connection and retry.');
        }

        actualTileCount = successfulTiles;
        console.log(`MBTiles format: Successfully processed ${actualTileCount} tiles, ${failedTiles} failed`);

        setProgress({ show: true, current: estimate.total, total: estimate.total, text: 'Finalizing compilation...' });
        const data = db.export();
        blob = new Blob([data], { type: 'application/x-sqlite3' });
        filename = `geopulse_${new Date().toISOString().slice(0, 16).replace(/[:-]/g, '')}.mbtiles`;
        db.close();
      }

      const fileSizeMB = blob.size / (1024 * 1024);
      downloadBlob(blob, filename);

      console.log(`Inserting to map_generations: tile_count = ${actualTileCount}, export_format = ${exportFormat}`);
      const { error: insertError } = await supabase
        .from('map_generations')
        .insert({
          user_id: user.id,
          bounds: selectedBounds,
          min_zoom: minZoom,
          max_zoom: maxZoom,
          tile_source: tileSource,
          file_size_mb: fileSizeMB,
          tile_count: actualTileCount,
          export_format: exportFormat,
          status: 'completed'
        });

      if (insertError) {
        console.error('Supabase insert error:', insertError);
        throw new Error(`Failed to log generation to database: ${insertError.message}`);
      }

      const formatName = exportFormat === 'tiles' ? 'Tiles ZIP Package' : 'MBTiles';
      setStatus({
        show: true,
        message: `Generation complete!\nFile: ${filename}\nFormat: ${formatName}\nSize: ${fileSizeMB.toFixed(2)} MB\nTiles: ${actualTileCount.toLocaleString()}\nRemaining downloads: ${downloadStats.downloads_remaining - 1}`,
        type: 'success'
      });
      setProgress({ show: false, current: 0, total: 0, text: '' });
    } catch (error) {
      console.error('Generation error:', error);
      setStatus({ show: true, message: `Generation error: ${error.message}`, type: 'error' });
      
      // Refund the download on error
      await dbHelpers.addDownloads(user.id, 1);
      await fetchDownloadStats();
      
      const { error: insertError } = await supabase
        .from('map_generations')
        .insert({
          user_id: user.id,
          bounds: selectedBounds,
          min_zoom: minZoom,
          max_zoom: maxZoom,
          tile_source: tileSource,
          tile_count: 0,
          export_format: exportFormat,
          status: 'failed',
          error_message: error.message
        });
      if (insertError) {
        console.error('Supabase insert error (failure case):', insertError);
      }
    } finally {
      setIsGenerating(false);
      setProgress({ show: false, current: 0, total: 0, text: '' });
    }
  };

  const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleStats = () => {
    setShowStats(!showStats);
  };

  const estimate = getTileEstimate();

  if (authLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f0f0f',
        color: '#ffffff'
      }}>
        <div style={{
          textAlign: 'center'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '3px solid #666',
            borderTop: '3px solid #ffffff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 12px'
          }}></div>
          Verifying authentication...
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #262626 100%)',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      color: '#ffffff',
      position: 'relative'
    }}>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        .glass-card {
          backdrop-filter: blur(15px);
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        
        .modern-button {
          background: linear-gradient(135deg, #3b82f6, #1e40af);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          fontWeight: 600;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .modern-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #1e40af, #3b82f6);
          box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4);
          transform: translateY(-1px);
        }
        
        .modern-button:disabled {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.5);
        }
        
        .loading-spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-top: 2px solid #ffffff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-right: 10px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .modern-input {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          transition: all 0.3s ease;
        }
        
        .modern-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          outline: none;
        }
        
        .modern-select {
          background: #1a1a1a;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          transition: all 0.3s ease;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23ffffff' viewBox='0 0 16 16'%3E%3Cpath d='M8 12l-6-6h12l-6 6z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          padding-right: 30px;
        }
        
        .modern-select:hover {
          background: #0f0f0f;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
        }
        
        .modern-select:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
          outline: none;
        }
        
        .stats-sidebar {
          position: absolute;
          top: 80px;
          right: 0;
          width: 300px;
          height: calc(100vh - 80px);
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(10px);
          border-left: 1px solid rgba(255, 255, 255, 0.15);
          padding: 20px;
          transform: translateX(100%);
          transition: transform 0.3s ease-in-out;
          z-index: 1000;
          overflow-y: auto;
        }
        
        .stats-sidebar.open {
          transform: translateX(0);
        }
        
        .stats-toggle {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 1001;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
        }
      `}</style>

      <NavBar user={user} handleSignOut={handleSignOut} />

      <div style={{
        display: 'flex',
        height: 'calc(100vh - 80px)',
        position: 'relative'
      }}>
        <div style={{
          width: '400px',
          padding: '30px',
          overflowY: 'auto'
        }}>
          <div className="glass-card" style={{
            borderRadius: '20px',
            padding: '30px'
          }}>
            {/* Download Stats Display */}
            {downloadStats && (
              <div style={{
                background: downloadStats.downloads_remaining > 0 
                  ? 'rgba(34, 197, 94, 0.1)' 
                  : 'rgba(239, 68, 68, 0.1)',
                border: `1px solid ${downloadStats.downloads_remaining > 0 
                  ? 'rgba(34, 197, 94, 0.3)' 
                  : 'rgba(239, 68, 68, 0.3)'}`,
                borderRadius: '12px',
                padding: '15px',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
                  {downloadStats.downloads_remaining} Downloads Remaining
                </div>
                <div style={{ fontSize: '14px', opacity: 0.8 }}>
                  Total downloads used: {downloadStats.total_downloads}
                </div>
                {downloadStats.downloads_remaining === 0 && (
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    style={{
                      marginTop: '10px',
                      padding: '8px 16px',
                      background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#ffffff',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Purchase More Downloads
                  </button>
                )}
              </div>
            )}

            <MapControls
              selectedBounds={selectedBounds}
              minZoom={minZoom}
              setMinZoom={setMinZoom}
              maxZoom={maxZoom}
              setMaxZoom={setMaxZoom}
              tileSource={tileSource}
              setTileSource={setTileSource}
              exportFormat={exportFormat}
              setExportFormat={setExportFormat}
              estimate={estimate}
              generateMBTiles={generateMBTiles}
              isGenerating={isGenerating}
              libsLoading={libsLoading}
              libsError={libsError}
              jsZip={jsZip}
              sql={sql}
              canGenerate={checkDownloadLimit()}
            />
            <ProgressDisplay progress={progress} />
            <StatusDisplay status={status} />
          </div>
        </div>

        <div style={{ position: 'relative', flex: 1 }}>
          <MapInterface
            mapLoaded={mapLoaded}
            handleLoadMap={handleLoadMap}
            DynamicMap={DynamicMap}
            setSelectedBounds={setSelectedBounds}
            tileSource={tileSource}
          />
          <button
            onClick={toggleStats}
            className="modern-button stats-toggle"
          >
            {showStats ? 'Hide Stats' : 'Show Stats'}
          </button>
        </div>

        <div className={`stats-sidebar ${showStats ? 'open' : ''}`}>
          <UsageStats user={user} />
        </div>
      </div>

      <PaymentModal
        showModal={showPaymentModal}
        setShowModal={setShowPaymentModal}
        onPaymentSuccess={handlePaymentSuccess}
        downloadStats={downloadStats}
        isLoading={paymentLoading}
        setIsLoading={setPaymentLoading}
      />
    </div>
  );
}