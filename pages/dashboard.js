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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
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
    await fetchDownloadStats();
    setStatus({ 
      show: true, 
      message: 'Payment successful! Downloads added to your account.', 
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

    const estimatedSize = (total * 0.05);
    const estimatedTime = Math.round(total * 0.1);

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

  // Helper: Merge tiles into a single canvas (for GPKG/GeoTIFF)
  const mergeTilesToCanvas = async (tiles, minZoom, bounds) => {
    const [minX, maxY] = deg2num(bounds._southWest.lat, bounds._southWest.lng, minZoom);
    const [maxX, minY] = deg2num(bounds._northEast.lat, bounds._northEast.lng, minZoom);

    const tileCountX = maxX - minX + 1;
    const tileCountY = maxY - minY + 1;
    const canvas = document.createElement('canvas');
    canvas.width = tileCountX * 256;
    canvas.height = tileCountY * 256;
    const ctx = canvas.getContext('2d');

    for (const t of tiles) {
      if (t.zoom !== minZoom) continue;
      const img = await new Promise((res, rej) => {
        const i = new Image();
        i.crossOrigin = 'anonymous';
        i.onload = () => res(i);
        i.onerror = rej;
        i.src = URL.createObjectURL(new Blob([t.data], { type: 'image/png' }));
      });
      const col = t.x - minX;
      const row = t.y - minY;
      ctx.drawImage(img, col * 256, row * 256, 256, 256);
      URL.revokeObjectURL(img.src);
    }
    return canvas;
  };

  // MAIN GENERATION FUNCTION (supports all formats)
  const generateExport = async () => {
    if (!checkDownloadLimit()) {
      setShowPaymentModal(true);
      return;
    }

    if (!sql && (exportFormat === 'mbtiles' || exportFormat === 'gpkg')) {
      setStatus({ show: true, message: 'Core not initialized. Please wait.', type: 'error' });
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

    if (minZoom > maxZoom || minZoom < 1 || maxZoom > 23) {
      setStatus({ show: true, message: 'Invalid zoom levels (1-22, min ≤ max).', type: 'error' });
      return;
    }

    const estimate = getTileEstimate();
    if (!estimate) {
      setStatus({ show: true, message: 'Invalid area selected', type: 'error' });
      return;
    }

    if (estimate.total > 5000) {
      if (!confirm(`This will process ${estimate.total.toLocaleString()} tiles. Proceed?`)) {
        return;
      }
    }

    setIsGenerating(true);
    setStatus({ show: true, message: 'Initializing generation...', type: 'info' });

    try {
      const deductSuccess = await dbHelpers.deductDownload(user.id);
      if (!deductSuccess) throw new Error('Failed to process download.');

      setDownloadStats(prev => ({
        ...prev,
        downloads_remaining: prev.downloads_remaining - 1,
        total_downloads: prev.total_downloads + 1
      }));

      let blob, filename, actualTileCount = 0;
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
            setProgress({ show: true, current: downloadedTiles, total: estimate.total, text: `Downloading (z${zoom})` });

            if (tileData && tileData.length > 0) {
              tiles.push({ zoom, x, y, data: tileData });
              successfulTiles++;
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

      if (successfulTiles === 0) {
        throw new Error('No tiles downloaded. Check connection.');
      }

      actualTileCount = successfulTiles;
      setProgress({ show: true, current: estimate.total, total: estimate.total, text: 'Finalizing...' });

      // EXPORT FORMATS
      if (exportFormat === 'tiles') {
        blob = await createTilesZip(tiles, filename);
        filename = `geopulse_tiles_${tileSource}_${new Date().toISOString().slice(0,16).replace(/[:-]/g,'')}.zip`;
      }
      else if (exportFormat === 'mbtiles') {
        const db = new sql.Database();
        db.run(`
          CREATE TABLE metadata (name TEXT, value TEXT);
          CREATE TABLE tiles (zoom_level INTEGER, tile_column INTEGER, tile_row INTEGER, tile_data BLOB);
          CREATE UNIQUE INDEX tile_index ON tiles (zoom_level, tile_column, tile_row);
        `);

        const sourceNames = { 'osm': 'OpenStreetMap', 'satellite': 'ArcGIS World Imagery', 'topographic': 'ArcGIS Topographic' };
        const sourceName = sourceNames[tileSource] || 'Custom Map';

        const metadata = [
          ['name', 'GeoPulse Generated Tiles'], ['type', 'baselayer'], ['version', '1.0'],
          ['description', `Processed tiles from ${sourceName}`], ['format', 'png'],
          ['bounds', `${minLon},${minLat},${maxLon},${maxLat}`],
          ['minzoom', minZoom.toString()], ['maxzoom', maxZoom.toString()],
          ['center', `${(minLon + maxLon)/2},${(minLat + maxLat)/2},${minZoom}`],
          ['attribution', `© ${sourceName} | Processed by GeoPulse`]
        ];

        const metadataStmt = db.prepare('INSERT INTO metadata (name, value) VALUES (?, ?)');
        metadata.forEach(([n, v]) => metadataStmt.run([n, v]));
        metadataStmt.free();

        const tileStmt = db.prepare('INSERT INTO tiles (zoom_level, tile_column, tile_row, tile_data) VALUES (?, ?, ?, ?)');

        for (const t of tiles) {
          const tmsY = Math.pow(2, t.zoom) - 1 - t.y;
          tileStmt.run([t.zoom, t.x, tmsY, t.data]);
        }
        tileStmt.free();

        const data = db.export();
        blob = new Blob([data], { type: 'application/x-sqlite3' });
        filename = `geopulse_${new Date().toISOString().slice(0,16).replace(/[:-]/g,'')}.mbtiles`;
        db.close();
      }
      else if (exportFormat === 'gpkg') {
        // FIXED: Valid GeoPackage with separate statements
        const db = new sql.Database();

        // Set application ID for GeoPackage
        db.run(`PRAGMA application_id = 1196446287;`);

        // Create spatial reference system table
        db.run(`
          CREATE TABLE gpkg_spatial_ref_sys (
            srs_name TEXT NOT NULL,
            srs_id INTEGER NOT NULL PRIMARY KEY,
            organization TEXT NOT NULL,
            organization_coordsys_id INTEGER NOT NULL,
            definition TEXT NOT NULL,
            description TEXT
          );
        `);

        // Insert WGS84 and Web Mercator SRS
        const srsStmt = db.prepare(`INSERT INTO gpkg_spatial_ref_sys VALUES (?, ?, ?, ?, ?, ?)`);
        srsStmt.run(['WGS 84', 4326, 'EPSG', 4326, 
          'GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563]]]',
          'Standard WGS84']);
        srsStmt.run(['Web Mercator', 3857, 'EPSG', 3857,
          'PROJCS["WGS 84 / Pseudo-Mercator"]',
          'Web Mercator']);
        srsStmt.free();

        // Create other required tables
        db.run(`
          CREATE TABLE gpkg_contents (
            table_name TEXT PRIMARY KEY,
            data_type TEXT NOT NULL,
            identifier TEXT,
            description TEXT,
            last_change DATETIME NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
            min_x DOUBLE, min_y DOUBLE, max_x DOUBLE, max_y DOUBLE,
            srs_id INTEGER NOT NULL
          );

          CREATE TABLE gpkg_tile_matrix_set (
            table_name TEXT PRIMARY KEY,
            srs_id INTEGER NOT NULL,
            min_x DOUBLE NOT NULL, min_y DOUBLE NOT NULL,
            max_x DOUBLE NOT NULL, max_y DOUBLE NOT NULL
          );

          CREATE TABLE gpkg_tile_matrix (
            table_name TEXT NOT NULL,
            zoom_level INTEGER NOT NULL,
            matrix_width INTEGER NOT NULL,
            matrix_height INTEGER NOT NULL,
            tile_width INTEGER NOT NULL,
            tile_height INTEGER NOT NULL,
            pixel_x_size DOUBLE NOT NULL,
            pixel_y_size DOUBLE NOT NULL,
            PRIMARY KEY (table_name, zoom_level)
          );

          CREATE TABLE geopulse_tiles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            zoom_level INTEGER NOT NULL,
            tile_column INTEGER NOT NULL,
            tile_row INTEGER NOT NULL,
            tile_data BLOB NOT NULL,
            UNIQUE(zoom_level, tile_column, tile_row)
          );
        `);

        // Insert tile matrix set
        const worldSize = 20037508.342789244;
        const tmsStmt = db.prepare(`INSERT INTO gpkg_tile_matrix_set VALUES (?, ?, ?, ?, ?, ?)`);
        tmsStmt.run(['geopulse_tiles', 3857, -worldSize, -worldSize, worldSize, worldSize]);
        tmsStmt.free();

        // Insert tile matrix for each zoom level
        const tmStmt = db.prepare(`INSERT INTO gpkg_tile_matrix VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
        for (let z = minZoom; z <= maxZoom; z++) {
          const matrixSize = Math.pow(2, z);
          const pixelSize = (worldSize * 2) / (256 * matrixSize);
          tmStmt.run(['geopulse_tiles', z, matrixSize, matrixSize, 256, 256, pixelSize, pixelSize]);
        }
        tmStmt.free();

        // Insert contents
        const contentsStmt = db.prepare(`
          INSERT INTO gpkg_contents VALUES (?, ?, ?, ?, datetime('now'), ?, ?, ?, ?, ?)
        `);
        contentsStmt.run([
          'geopulse_tiles', 'tiles', 'GeoPulse raster', 
          'Tiles generated by GeoPulse',
          minLon, minLat, maxLon, maxLat, 3857
        ]);
        contentsStmt.free();

        // Insert tiles
        const tileInsertStmt = db.prepare(`
          INSERT INTO geopulse_tiles (zoom_level, tile_column, tile_row, tile_data)
          VALUES (?, ?, ?, ?)
        `);

        for (const t of tiles) {
          const tmsY = Math.pow(2, t.zoom) - 1 - t.y;
          tileInsertStmt.run([t.zoom, t.x, tmsY, t.data]);
        }
        tileInsertStmt.free();

        const data = db.export();
        blob = new Blob([data], { type: 'application/geopackage+sqlite3' });
        filename = `geopulse_${tileSource}_${new Date().toISOString().slice(0,16).replace(/[:-]/g,'')}.gpkg`;
        db.close();
      }
      else if (exportFormat === 'geotiff') {
        // FIXED: Correct GeoTIFF import and usage
        const canvas = await mergeTilesToCanvas(tiles, minZoom, selectedBounds);
        
        // Dynamic import of geotiff
        const geotiff = await import('geotiff');
        const writeArrayBuffer = geotiff.writeArrayBuffer;

        const width  = canvas.width;
        const height = canvas.height;
        const ctx    = canvas.getContext('2d');
        const img    = ctx.getImageData(0, 0, width, height);

        // Convert RGBA to RGB
        const rgb = new Uint8Array(width * height * 3);
        for (let i = 0, j = 0; i < img.data.length; i += 4, j += 3) {
          rgb[j]     = img.data[i];
          rgb[j + 1] = img.data[i + 1];
          rgb[j + 2] = img.data[i + 2];
        }

        const pixelSize = 156543.03392804097 / Math.pow(2, minZoom);

        // Create GeoTIFF using writeArrayBuffer
        const tiffArrayBuffer = await writeArrayBuffer(rgb, {
          width,
          height,
          samplesPerPixel: 3,
          geoKeys: {
            GTModelTypeGeoKey: 2,
            GTRasterTypeGeoKey: 1,
            GeographicTypeGeoKey: 4326,
            GeogCitationGeoKey: 'WGS 84',
            GeogAngularUnitsGeoKey: 9102
          },
          origin: [minLon, maxLat],
          pixelScale: [pixelSize, pixelSize]
        });

        blob = new Blob([tiffArrayBuffer], { type: 'image/tiff' });
        filename = `geopulse_${tileSource}_${new Date().toISOString().slice(0,16).replace(/[:-]/g,'')}.tif`;
      }

      const fileSizeMB = blob.size / (1024*1024);
      downloadBlob(blob, filename);

      const validFormats = ['mbtiles','tiles','gpkg','geotiff'];
      const normalizedFormat = validFormats.includes(exportFormat) ? exportFormat : 'mbtiles';
      const tileCountForDB = (normalizedFormat === 'mbtiles' || normalizedFormat === 'gpkg') ? actualTileCount : null;

      const insertData = {
        user_id: user.id,
        bounds: selectedBounds,
        min_zoom: minZoom,
        max_zoom: maxZoom,
        tile_source: tileSource,
        file_size_mb: parseFloat(fileSizeMB.toFixed(2)),
        tile_count: tileCountForDB,
        export_format: normalizedFormat,
        status: 'completed'
      };

      const { error: insertError } = await supabase
        .from('map_generations')
        .insert(insertData)
        .select();

      if (insertError) throw new Error(`DB log failed: ${insertError.message}`);

      const fmtName = { mbtiles: 'MBTiles', tiles: 'Tiles ZIP', gpkg: 'GeoPackage', geotiff: 'GeoTIFF' }[normalizedFormat];

      setStatus({
        show: true,
        message: `Complete!\nFile: ${filename}\nFormat: ${fmtName}\nSize: ${fileSizeMB.toFixed(2)} MB\nTiles: ${actualTileCount.toLocaleString()}`,
        type: 'success'
      });
    } catch (error) {
      console.error('Generation error:', error);
      setStatus({ show: true, message: `Error: ${error.message}`, type: 'error' });

      await dbHelpers.addDownloads(user.id, 1);
      await fetchDownloadStats();

      const validFormats = ['mbtiles','tiles','gpkg','geotiff'];
      const normalizedFormat = validFormats.includes(exportFormat) ? exportFormat : 'mbtiles';

      await supabase.from('map_generations').insert({
        user_id: user.id,
        bounds: selectedBounds,
        min_zoom: minZoom,
        max_zoom: maxZoom,
        tile_source: tileSource,
        tile_count: (normalizedFormat === 'mbtiles' || normalizedFormat === 'gpkg') ? 0 : null,
        export_format: normalizedFormat,
        status: 'failed',
        error_message: error.message
      });
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

  const toggleStats = () => setShowStats(!showStats);
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
        <div style={{ textAlign: 'center' }}>
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
        .glass-card { backdrop-filter: blur(15px); background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
        .modern-button { background: linear-gradient(135deg, #3b82f6, #1e40af); border: 1px solid rgba(255,255,255,0.2); color: #fff; font-weight: 600; transition: all 0.3s ease; }
        .modern-button:hover:not(:disabled) { background: linear-gradient(135deg, #1e40af, #3b82f6); box-shadow: 0 4px 20px rgba(59,130,246,0.4); transform: translateY(-1px); }
        .modern-button:disabled { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.1); color: rgba(255,255,255,0.5); }
        .loading-spinner { display: inline-block; width: 20px; height: 20px; border: 2px solid transparent; border-top: 2px solid #fff; border-radius: 50%; animation: spin 1s linear infinite; margin-right: 10px; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .modern-input { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.2); color: #fff; transition: all 0.3s ease; }
        .modern-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); outline: none; }
        .modern-select { background: #1a1a1a; border: 1px solid rgba(255,255,255,0.2); color: #fff; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23ffffff' viewBox='0 0 16 16'%3E%3Cpath d='M8 12l-6-6h12l-6 6z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 30px; }
        .modern-select:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.3); outline: none; }
        .stats-sidebar { position: absolute; top: 80px; right: 0; width: 300px; height: calc(100vh - 80px); background: rgba(0,0,0,0.7); backdrop-filter: blur(10px); border-left: 1px solid rgba(255,255,255,0.15); padding: 20px; transform: translateX(100%); transition: transform 0.3s ease-in-out; z-index: 1000; overflow-y: auto; }
        .stats-sidebar.open { transform: translateX(0); }
        .stats-toggle { position: absolute; top: 10px; right: 10px; z-index: 1001; padding: 8px 16px; border-radius: 8px; cursor: pointer; }
      `}</style>

      <NavBar user={user} handleSignOut={handleSignOut} />

      <div style={{ display: 'flex', height: 'calc(100vh - 80px)', position: 'relative' }}>
        <div style={{ width: '400px', padding: '30px', overflowY: 'auto' }}>
          <div className="glass-card" style={{ borderRadius: '20px', padding: '30px' }}>
            {downloadStats && (
              <div style={{
                background: downloadStats.downloads_remaining > 0 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                border: `1px solid ${downloadStats.downloads_remaining > 0 ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                borderRadius: '12px', padding: '15px', marginBottom: '20px', textAlign: 'center'
              }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
                  {downloadStats.downloads_remaining} Downloads Remaining
                </div>
                <div style={{ fontSize: '14px', opacity: 0.8 }}>
                  Total used: {downloadStats.total_downloads}
                </div>
                {downloadStats.downloads_remaining === 0 && (
                  <button onClick={() => setShowPaymentModal(true)} style={{
                    marginTop: '10px', padding: '8px 16px', background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
                    border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer', fontSize: '14px'
                  }}>
                    Purchase More
                  </button>
                )}
              </div>
            )}

            <MapControls
              selectedBounds={selectedBounds}
              minZoom={minZoom} setMinZoom={setMinZoom}
              maxZoom={maxZoom} setMaxZoom={setMaxZoom}
              tileSource={tileSource} setTileSource={setTileSource}
              exportFormat={exportFormat} setExportFormat={setExportFormat}
              estimate={estimate}
              generateExport={generateExport}
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
          <button onClick={toggleStats} className="modern-button stats-toggle">
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
