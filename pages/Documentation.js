import React, { useState, useEffect } from 'react';

const Documentation = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sections = [
    { id: 'overview', title: 'Overview' },
    { id: 'getting-started', title: 'Getting Started' },
    { id: 'map-interface', title: 'Using the Map Interface' },
    { id: 'configuring-settings', title: 'Configuring Map Download Settings' },
    { id: 'downloading-tiles', title: 'Downloading Map Tiles' },
    { id: 'using-files', title: 'Using Downloaded Files' },
    { id: 'troubleshooting', title: 'Troubleshooting' },
    { id: 'faqs', title: 'FAQs' },
  ];

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const styles = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif;
      line-height: 1.6;
    }

    .doc-container {
      min-height: 100vh;
      background: #ffffff;
      color: #1a1a1a;
      padding: 48px 20px;
    }

    .doc-wrapper {
      max-width: 1200px;
      margin: 0 auto;
    }

    .doc-header {
      text-align: center;
      margin-bottom: 48px;
    }

    .doc-header h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 16px;
      color: #000000;
    }

    .doc-header p {
      font-size: 1.125rem;
      color: #4a5568;
    }

    .doc-nav-container {
      position: sticky;
      top: 16px;
      z-index: 100;
      background: #f8f9fa;
      border: 1px solid #e0e0e0;
      padding: 20px 24px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      margin-bottom: 32px;
    }

    .doc-nav-list {
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 12px;
    }

    .doc-nav-button {
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: 500;
      font-size: 0.95rem;
      border: 1px solid #d0d0d0;
      cursor: pointer;
      transition: all 0.2s ease;
      background: #ffffff;
      color: #2c3e50;
    }

    .doc-nav-button:hover {
      background: #000000;
      color: #ffffff;
      border-color: #000000;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .doc-nav-button.active {
      background: #000000;
      color: #ffffff;
      border-color: #000000;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .doc-nav-button:focus {
      outline: 2px solid #333333;
      outline-offset: 2px;
    }

    .doc-main-content {
      max-width: 900px;
      margin: 0 auto;
    }

    .doc-section {
      margin-bottom: 48px;
      padding: 32px;
      background: #f9f9f9;
      border: 1px solid #e5e5e5;
      border-radius: 12px;
    }

    .doc-section h2 {
      font-size: 1.875rem;
      font-weight: 600;
      margin-bottom: 24px;
      color: #000000;
      border-bottom: 2px solid #000000;
      padding-bottom: 12px;
    }

    .doc-section p {
      margin-bottom: 16px;
      color: #2c3e50;
      font-size: 1.05rem;
    }

    .doc-section ol,
    .doc-section ul {
      margin-left: 24px;
      margin-bottom: 16px;
    }

    .doc-section li {
      margin-bottom: 12px;
      color: #2c3e50;
    }

    .doc-section ul ul,
    .doc-section ol ul {
      margin-top: 8px;
      margin-bottom: 8px;
    }

    .doc-section strong {
      color: #000000;
      font-weight: 600;
    }

    .doc-section code {
      background: #e8e8e8;
      padding: 2px 8px;
      border-radius: 4px;
      font-family: Courier New, monospace;
      font-size: 0.9em;
      color: #1a1a1a;
      border: 1px solid #d0d0d0;
    }

    .doc-faq-item {
      margin-bottom: 24px;
      padding: 20px;
      background: #ffffff;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
      border-left: 4px solid #000000;
    }

    .doc-faq-item dt {
      font-weight: 600;
      font-size: 1.1rem;
      color: #000000;
      margin-bottom: 8px;
    }

    .doc-faq-item dd {
      color: #4a5568;
      line-height: 1.7;
    }

    .doc-footer {
      text-align: center;
      margin-top: 48px;
      padding: 32px 0;
      border-top: 1px solid #e0e0e0;
    }

    .doc-footer p {
      color: #6b7280;
      margin-bottom: 8px;
    }

    .doc-footer .copyright {
      font-size: 0.875rem;
      color: #9ca3af;
    }

    @media (max-width: 768px) {
      .doc-header h1 {
        font-size: 2rem;
      }

      .doc-nav-button {
        font-size: 0.875rem;
        padding: 8px 16px;
      }

      .doc-section {
        padding: 20px;
      }

      .doc-section h2 {
        font-size: 1.5rem;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <div className="doc-container">
        <div className="doc-wrapper">
          <header className="doc-header">
            <h1>GeoPulse Map Download Documentation</h1>
            <p>A comprehensive guide to downloading map tiles using GeoPulse</p>
          </header>

          <nav className="doc-nav-container">
            <ul className="doc-nav-list">
              {sections.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => scrollToSection(section.id)}
                    className={`doc-nav-button ${activeSection === section.id ? 'active' : ''}`}
                    aria-current={activeSection === section.id ? 'page' : undefined}
                    aria-label={`Navigate to ${section.title} section`}
                  >
                    {section.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <main className="doc-main-content">
            <section id="overview" className="doc-section">
              <h2>Overview</h2>
              <p>
                GeoPulse is a web-based tool that allows authenticated users to select a geographic area, configure map settings (such as zoom levels and tile sources), and download map tiles for offline use in GIS software or mapping applications. The application supports multiple tile sources (e.g., OpenStreetMap, satellite imagery) and two export formats: MBTiles and ZIP.
              </p>
            </section>

            <section id="getting-started" className="doc-section">
              <h2>Getting Started</h2>
              <ol>
                <li>
                  <strong>Sign In</strong>: Access the GeoPulse application and sign in using your credentials. If you don't have an account, register through the provided sign-up page. Upon signing in, you'll be directed to the dashboard.
                </li>
                <li>
                  <strong>Dashboard Overview</strong>:
                  <ul>
                    <li><strong>Navigation Bar</strong>: Displays your user information and a sign-out option.</li>
                    <li><strong>Map Interface</strong>: A dynamic map where you can select a target area.</li>
                    <li><strong>Control Panel</strong>: Allows you to configure zoom levels, tile sources, and export formats.</li>
                    <li><strong>Status and Progress Displays</strong>: Show real-time updates on map generation.</li>
                    <li><strong>Usage Stats</strong>: View your download history and usage statistics by clicking "Show Stats."</li>
                  </ul>
                </li>
              </ol>
            </section>

            <section id="map-interface" className="doc-section">
              <h2>Using the Map Interface</h2>
              <p>The map interface is powered by Leaflet and allows you to select a geographic area for downloading map tiles.</p>
              <ol>
                <li>
                  <strong>Loading the Map</strong>: The map loads automatically upon accessing the dashboard. If it fails to load, click the "Retry Loading" button.
                </li>
                <li>
                  <strong>Navigating the Map</strong>:
                  <ul>
                    <li><strong>Zoom</strong>: Use the zoom controls (+/-) in the top-right corner to adjust the map's zoom level.</li>
                    <li><strong>Pan</strong>: Click and drag to move the map.</li>
                    <li>
                      <strong>Search by Coordinates</strong>:
                      <ul>
                        <li>Enter latitude (-90 to 90) and longitude (-180 to 180) in the input fields near the map.</li>
                        <li>Click the <strong>Search</strong> button to center the map at the specified coordinates.</li>
                      </ul>
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Selecting a Target Area</strong>:
                  <ul>
                    <li>Click the <strong>target selector button</strong> (🎯) in the top-right corner to enable area selection.</li>
                    <li>Click and drag on the map to draw a rectangular area.</li>
                    <li>A green rectangle with a dashed border will appear, and a popup will display the selected area's size in square kilometers.</li>
                    <li>To modify the selection, click the target selector button again and redraw the area.</li>
                  </ul>
                </li>
              </ol>
            </section>

            <section id="configuring-settings" className="doc-section">
              <h2>Configuring Map Download Settings</h2>
              <p>The control panel on the left side of the dashboard allows you to customize your map download.</p>
              <ol>
                <li>
                  <strong>Zoom Levels</strong>:
                  <ul>
                    <li><strong>Minimum Zoom</strong>: Set the lowest zoom level (e.g., 12 for city-level detail).</li>
                    <li><strong>Maximum Zoom</strong>: Set the highest zoom level (e.g., 15 for street-level detail).</li>
                    <li>Ensure the minimum zoom is less than or equal to the maximum zoom, and both are between 1 and 22.</li>
                  </ul>
                </li>
                <li>
                  <strong>Tile Source</strong>:
                  <ul>
                    <li>Choose from available tile sources: OpenStreetMap (osm), Satellite, Topographic, Hiking, Terrain, Cycling, Trekking, Outdoor.</li>
                    <li>The selected tile source updates the map preview in real-time.</li>
                  </ul>
                </li>
                <li>
                  <strong>Export Format</strong>:
                  <ul>
                    <li><strong>MBTiles</strong>: A single SQLite database file compatible with many GIS applications (e.g., QGIS, TileServer GL).</li>
                    <li><strong>Tiles (ZIP)</strong>: A ZIP file containing individual PNG tiles in a <code>tiles/z/x/y.png</code> structure, along with a <code>README.txt</code> and <code>manifest.json</code>.</li>
                  </ul>
                </li>
                <li>
                  <strong>Tile Estimate</strong>:
                  <ul>
                    <li>After selecting an area, the control panel displays:</li>
                    <li><strong>Total Tiles</strong>: Estimated number of tiles to download.</li>
                    <li><strong>Estimated Size</strong>: Approximate file size in MB (assuming ~50KB per tile).</li>
                    <li><strong>Estimated Time</strong>: Approximate download time in seconds.</li>
                    <li>If the tile count exceeds 5,000, a confirmation prompt will appear before proceeding.</li>
                  </ul>
                </li>
              </ol>
            </section>

            <section id="downloading-tiles" className="doc-section">
              <h2>Downloading Map Tiles</h2>
              <ol>
                <li>
                  <strong>Initiate Download</strong>:
                  <ul>
                    <li>Click the <strong>Generate</strong> button in the control panel.</li>
                    <li>If no area is selected, an error message will prompt you to select a target area.</li>
                    <li>If libraries (JSZip or SQL.js) are still loading, wait until they are ready.</li>
                  </ul>
                </li>
                <li>
                  <strong>Monitor Progress</strong>:
                  <ul>
                    <li>The progress display shows the number of tiles downloaded and the current zoom level being processed.</li>
                    <li>The status display provides updates (e.g., "Initializing map generation…", "Generation complete!").</li>
                  </ul>
                </li>
                <li>
                  <strong>Download the File</strong>:
                  <ul>
                    <li>Upon completion, the file (MBTiles or ZIP) is automatically downloaded to your device.</li>
                    <li>The filename includes the tile source and timestamp (e.g., <code>geopulse_osm_20251011T1141.mbtiles</code>).</li>
                    <li>Check the status display for details like file size and tile count.</li>
                  </ul>
                </li>
              </ol>
            </section>

            <section id="using-files" className="doc-section">
              <h2>Using Downloaded Files</h2>
              <ol>
                <li>
                  <strong>MBTiles</strong>:
                  <ul>
                    <li>Use with GIS software like QGIS, TileServer GL, or MapProxy.</li>
                    <li>Load the <code>.mbtiles</code> file as a raster layer or XYZ tile source.</li>
                    <li>The file includes metadata (e.g., bounds, zoom levels, attribution) for compatibility.</li>
                  </ul>
                </li>
                <li>
                  <strong>ZIP (Tiles)</strong>:
                  <ul>
                    <li>Extract the ZIP to access the <code>tiles/</code> folder, <code>README.txt</code>, and <code>manifest.json</code>.</li>
                    <li>Point your mapping software to the <code>tiles/</code> directory, which follows the standard <code>tiles/z/x/y.png</code> structure.</li>
                    <li>Compatible with OpenLayers, Leaflet, QGIS, and most GIS applications.</li>
                    <li>Refer to <code>README.txt</code> for usage instructions and <code>manifest.json</code> for metadata.</li>
                  </ul>
                </li>
              </ol>
            </section>

            <section id="troubleshooting" className="doc-section">
              <h2>Troubleshooting</h2>
              <ul>
                <li>
                  <strong>Map Fails to Load</strong>:
                  <ul>
                    <li>Ensure a stable internet connection.</li>
                    <li>Click "Retry Loading" if the map interface fails to initialize.</li>
                    <li>Refresh the page if the issue persists.</li>
                  </ul>
                </li>
                <li>
                  <strong>Invalid Coordinates Error</strong>:
                  <ul>
                    <li>Verify that latitude is between -90 and 90, and longitude is between -180 and 180.</li>
                    <li>Use decimal format (e.g., 28.6139, not 28°36'50.04"N).</li>
                  </ul>
                </li>
                <li>
                  <strong>Generation Fails</strong>:
                  <ul>
                    <li>Check if an area is selected on the map.</li>
                    <li>Ensure zoom levels are valid (1–22, min ≤ max).</li>
                    <li>Wait for libraries to load (check the status display).</li>
                    <li>If tiles fail to download, verify your internet connection and try a smaller area or fewer zoom levels.</li>
                  </ul>
                </li>
                <li>
                  <strong>Large Tile Count Warning</strong>:
                  <ul>
                    <li>If the tile count exceeds 5,000, confirm the operation to proceed, as it may consume significant bandwidth and time.</li>
                  </ul>
                </li>
                <li>
                  <strong>Authentication Issues</strong>:
                  <ul>
                    <li>If redirected to the login page, your session may have expired. Sign in again.</li>
                    <li>Contact support if you encounter persistent authentication errors.</li>
                  </ul>
                </li>
              </ul>
            </section>

            <section id="faqs" className="doc-section">
              <h2>FAQs</h2>
              <div className="doc-faq-item">
                <dt>What tile sources are available?</dt>
                <dd>Options include OpenStreetMap, satellite imagery, topographic maps, hiking maps, terrain maps, cycling maps, trekking maps, and outdoor maps.</dd>
              </div>
              <div className="doc-faq-item">
                <dt>Can I use the downloaded tiles offline?</dt>
                <dd>Yes, both MBTiles and ZIP formats are designed for offline use in compatible mapping software.</dd>
              </div>
              <div className="doc-faq-item">
                <dt>Why is my download taking too long?</dt>
                <dd>Large areas or high zoom levels increase the number of tiles, extending download time. Try reducing the area or zoom range.</dd>
              </div>
              <div className="doc-faq-item">
                <dt>How can I view my usage stats?</dt>
                <dd>Click the "Show Stats" button in the top-right corner to view your download history and usage details.</dd>
              </div>
              <div className="doc-faq-item">
                <dt>What software supports MBTiles?</dt>
                <dd>QGIS, TileServer GL, MapProxy, and other GIS tools support MBTiles. Check your software's documentation for specific instructions.</dd>
              </div>
            </section>
          </main>

          <footer className="doc-footer">
            <p>
              For additional support, refer to the application's help section or contact the GeoPulse support team.
            </p>
            <p className="copyright">
              &copy; 2020 GeoPulse. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Documentation;