
import React, { useState } from 'react';
import Head from 'next/head';

const Documentation = () => {
  const [activeSection, setActiveSection] = useState('overview');

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

  return (
    <>
      <Head>
        <title>GeoPulse Map Download Documentation</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white font-sans">
        <div className="container mx-auto px-4 py-12">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">GeoPulse Map Download Documentation</h1>
            <p className="text-lg text-gray-300">
              A comprehensive guide to downloading map tiles using GeoPulse
            </p>
          </header>

          <nav className="mb-8 sticky top-0 bg-gray-900 bg-opacity-90 backdrop-blur-md py-4 rounded-lg shadow-lg">
            <ul className="flex flex-wrap justify-center gap-4">
              {sections.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => scrollToSection(section.id)}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                    }`}
                  >
                    {section.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <main className="prose prose-invert max-w-none">
            <section id="overview" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Overview</h2>
              <p>
                GeoPulse is a web-based tool that allows authenticated users to select a geographic area, configure map settings (such as zoom levels and tile sources), and download map tiles for offline use in GIS software or mapping applications. The application supports multiple tile sources (e.g., OpenStreetMap, satellite imagery) and two export formats: MBTiles and ZIP.
              </p>
            </section>

            <section id="getting-started" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
              <ol className="list-decimal pl-6 space-y-2">
                <li>
                  <strong>Sign In</strong>: Access the GeoPulse application and sign in using your credentials. If you don’t have an account, register through the provided sign-up page. Upon signing in, you’ll be directed to the dashboard.
                </li>
                <li>
                  <strong>Dashboard Overview</strong>:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li><strong>Navigation Bar</strong>: Displays your user information and a sign-out option.</li>
                    <li><strong>Map Interface</strong>: A dynamic map where you can select a target area.</li>
                    <li><strong>Control Panel</strong>: Allows you to configure zoom levels, tile sources, and export formats.</li>
                    <li><strong>Status and Progress Displays</strong>: Show real-time updates on map generation.</li>
                    <li><strong>Usage Stats</strong>: View your download history and usage statistics by clicking "Show Stats."</li>
                  </ul>
                </li>
              </ol>
            </section>

            <section id="map-interface" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Using the Map Interface</h2>
              <p>The map interface is powered by Leaflet and allows you to select a geographic area for downloading map tiles.</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>
                  <strong>Loading the Map</strong>: The map loads automatically upon accessing the dashboard. If it fails to load, click the "Retry Loading" button.
                </li>
                <li>
                  <strong>Navigating the Map</strong>:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li><strong>Zoom</strong>: Use the zoom controls (+/-) in the top-right corner to adjust the map’s zoom level.</li>
                    <li><strong>Pan</strong>: Click and drag to move the map.</li>
                    <li>
                      <strong>Search by Coordinates</strong>:
                      <ul className="list-circle pl-6 mt-1">
                        <li>Enter latitude (-90 to 90) and longitude (-180 to 180) in the input fields near the map.</li>
                        <li>Click the <strong>Search</strong> button to center the map at the specified coordinates.</li>
                      </ul>
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Selecting a Target Area</strong>:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Click the <strong>target selector button</strong> (🎯) in the top-right corner to enable area selection.</li>
                    <li>Click and drag on the map to draw a rectangular area.</li>
                    <li>A green rectangle with a dashed border will appear, and a popup will display the selected area’s size in square kilometers.</li>
                    <li>To modify the selection, click the target selector button again and redraw the area.</li>
                  </ul>
                </li>
              </ol>
            </section>

            <section id="configuring-settings" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Configuring Map Download Settings</h2>
              <p>The control panel on the left side of the dashboard allows you to customize your map download.</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>
                  <strong>Zoom Levels</strong>:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li><strong>Minimum Zoom</strong>: Set the lowest zoom level (e.g., 12 for city-level detail).</li>
                    <li><strong>Maximum Zoom</strong>: Set the highest zoom level (e.g., 15 for street-level detail).</li>
                    <li>Ensure the minimum zoom is less than or equal to the maximum zoom, and both are between 1 and 22.</li>
                  </ul>
                </li>
                <li>
                  <strong>Tile Source</strong>:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Choose from available tile sources: OpenStreetMap (osm), Satellite, Topographic, Hiking, Terrain, Cycling, Trekking, Outdoor.</li>
                    <li>The selected tile source updates the map preview in real-time.</li>
                  </ul>
                </li>
                <li>
                  <strong>Export Format</strong>:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li><strong>MBTiles</strong>: A single SQLite database file compatible with many GIS applications (e.g., QGIS, TileServer GL).</li>
                    <li><strong>Tiles (ZIP)</strong>: A ZIP file containing individual PNG tiles in a <code>tiles/z/x/y.png</code> structure, along with a <code>README.txt</code> and <code>manifest.json</code>.</li>
                  </ul>
                </li>
                <li>
                  <strong>Tile Estimate</strong>:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>After selecting an area, the control panel displays:</li>
                    <li><strong>Total Tiles</strong>: Estimated number of tiles to download.</li>
                    <li><strong>Estimated Size</strong>: Approximate file size in MB (assuming ~50KB per tile).</li>
                    <li><strong>Estimated Time</strong>: Approximate download time in seconds.</li>
                    <li>If the tile count exceeds 5,000, a confirmation prompt will appear before proceeding.</li>
                  </ul>
                </li>
              </ol>
            </section>

            <section id="downloading-tiles" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Downloading Map Tiles</h2>
              <ol className="list-decimal pl-6 space-y-2">
                <li>
                  <strong>Initiate Download</strong>:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Click the <strong>Generate</strong> button in the control panel.</li>
                    <li>If no area is selected, an error message will prompt you to select a target area.</li>
                    <li>If libraries (JSZip or SQL.js) are still loading, wait until they are ready.</li>
                  </ul>
                </li>
                <li>
                  <strong>Monitor Progress</strong>:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>The progress display shows the number of tiles downloaded and the current zoom level being processed.</li>
                    <li>The status display provides updates (e.g., “Initializing map generation…”, “Generation complete!”).</li>
                  </ul>
                </li>
                <li>
                  <strong>Download the File</strong>:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Upon completion, the file (MBTiles or ZIP) is automatically downloaded to your device.</li>
                    <li>The filename includes the tile source and timestamp (e.g., <code>geopulse_osm_20251011T1141.mbtiles</code>).</li>
                    <li>Check the status display for details like file size and tile count.</li>
                  </ul>
                </li>
              </ol>
            </section>

            <section id="using-files" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Using Downloaded Files</h2>
              <ol className="list-decimal pl-6 space-y-2">
                <li>
                  <strong>MBTiles</strong>:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Use with GIS software like QGIS, TileServer GL, or MapProxy.</li>
                    <li>Load the <code>.mbtiles</code> file as a raster layer or XYZ tile source.</li>
                    <li>The file includes metadata (e.g., bounds, zoom levels, attribution) for compatibility.</li>
                  </ul>
                </li>
                <li>
                  <strong>ZIP (Tiles)</strong>:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Extract the ZIP to access the <code>tiles/</code> folder, <code>README.txt</code>, and <code>manifest.json</code>.</li>
                    <li>Point your mapping software to the <code>tiles/</code> directory, which follows the standard <code>tiles/z/x/y.png</code> structure.</li>
                    <li>Compatible with OpenLayers, Leaflet, QGIS, and most GIS applications.</li>
                    <li>Refer to <code>README.txt</code> for usage instructions and <code>manifest.json</code> for metadata.</li>
                  </ul>
                </li>
              </ol>
            </section>

            <section id="troubleshooting" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Troubleshooting</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Map Fails to Load</strong>:
                  <ul className="list-circle pl-6 mt-1">
                    <li>Ensure a stable internet connection.</li>
                    <li>Click “Retry Loading” if the map interface fails to initialize.</li>
                    <li>Refresh the page if the issue persists.</li>
                  </ul>
                </li>
                <li>
                  <strong>Invalid Coordinates Error</strong>:
                  <ul className="list-circle pl-6 mt-1">
                    <li>Verify that latitude is between -90 and 90, and longitude is between -180 and 180.</li>
                    <li>Use decimal format (e.g., 28.6139, not 28°36'50.04"N).</li>
                  </ul>
                </li>
                <li>
                  <strong>Generation Fails</strong>:
                  <ul className="list-circle pl-6 mt-1">
                    <li>Check if an area is selected on the map.</li>
                    <li>Ensure zoom levels are valid (1–22, min ≤ max).</li>
                    <li>Wait for libraries to load (check the status display).</li>
                    <li>If tiles fail to download, verify your internet connection and try a smaller area or fewer zoom levels.</li>
                  </ul>
                </li>
                <li>
                  <strong>Large Tile Count Warning</strong>:
                  <ul className="list-circle pl-6 mt-1">
                    <li>If the tile count exceeds 5,000, confirm the operation to proceed, as it may consume significant bandwidth and time.</li>
                  </ul>
                </li>
                <li>
                  <strong>Authentication Issues</strong>:
                  <ul className="list-circle pl-6 mt-1">
                    <li>If redirected to the login page, your session may have expired. Sign in again.</li>
                    <li>Contact support if you encounter persistent authentication errors.</li>
                  </ul>
                </li>
              </ul>
            </section>

            <section id="faqs" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">FAQs</h2>
              <dl className="space-y-4">
                <div>
                  <dt className="font-semibold">What tile sources are available?</dt>
                  <dd>Options include OpenStreetMap, satellite imagery, topographic maps, hiking maps, terrain maps, cycling maps, trekking maps, and outdoor maps.</dd>
                </div>
                <div>
                  <dt className="font-semibold">Can I use the downloaded tiles offline?</dt>
                  <dd>Yes, both MBTiles and ZIP formats are designed for offline use in compatible mapping software.</dd>
                </div>
                <div>
                  <dt className="font-semibold">Why is my download taking too long?</dt>
                  <dd>Large areas or high zoom levels increase the number of tiles, extending download time. Try reducing the area or zoom range.</dd>
                </div>
                <div>
                  <dt className="font-semibold">How can I view my usage stats?</dt>
                  <dd>Click the “Show Stats” button in the top-right corner to view your download history and usage details.</dd>
                </div>
                <div>
                  <dt className="font-semibold">What software supports MBTiles?</dt>
                  <dd>QGIS, TileServer GL, MapProxy, and other GIS tools support MBTiles. Check your software’s documentation for specific instructions.</dd>
                </div>
              </dl>
            </section>
          </main>

          <footer className="text-center mt-12 py-6 border-t border-gray-700">
            <p className="text-gray-400">
              For additional support, refer to the application’s help section or contact the GeoPulse support team.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              &copy; 2025 GeoPulse. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Documentation;
