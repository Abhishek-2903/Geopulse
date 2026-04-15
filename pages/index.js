import { useState, useEffect, useRef } from 'react';
import { loadModules } from 'esri-loader';
import AuthModal from './AuthModal';
import ChatQuery from './ChatQuery';
import Head from 'next/head';

export default function Home() {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({
    lat: 40.7128,
    lng: -74.006,
    zoom: 14,
  });
  const [basemapType, setBasemapType] = useState('topo-vector');
  const mapRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPolicyNotification, setShowPolicyNotification] = useState(false);
  const [showFloatingCTA, setShowFloatingCTA] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const hasAgreed = localStorage.getItem('privacyPolicyAgreed');
    if (!hasAgreed) {
      setShowPolicyNotification(true);
    }
    const timer = setTimeout(() => setMapLoaded(true), 1500);

    // Show floating CTA after 5 seconds
    const ctaTimer = setTimeout(() => setShowFloatingCTA(true), 5000);

    return () => {
      clearTimeout(timer);
      clearTimeout(ctaTimer);
    };
  }, []);

  useEffect(() => {
    if (mapRef.current && mapLoaded) {
      loadModules(
        ['esri/WebScene', 'esri/views/SceneView', 'esri/layers/TileLayer'],
        { css: true }
      )
        .then(([WebScene, SceneView, TileLayer]) => {
          const scene = new WebScene({
            basemap:
              basemapType === 'outdoor'
                ? {
                    baseLayers: [
                      new TileLayer({
                        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer',
                      }),
                    ],
                  }
                : basemapType,
          });

          const view = new SceneView({
            container: mapRef.current,
            map: scene,
            camera: {
              position: {
                longitude: currentLocation.lng,
                latitude: currentLocation.lat,
                z: 1000,
              },
              tilt: 10,
              heading: 0,
            },
          });

          return () => {
            if (view) view.destroy();
          };
        })
        .catch((err) => console.error('Error loading 3D scene:', err));
    }
  }, [mapLoaded, basemapType]);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 4);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const mapTypes = [
    { id: 'topo-vector', label: 'Terrain', icon: '⛰️' },
    { id: 'satellite', label: 'Satellite', icon: '🛰️' },
    { id: 'national-geographic', label: 'Nat Geo', icon: '🌍' },
    { id: 'streets-vector', label: 'Street', icon: '🛣️' },
    { id: 'hybrid', label: 'Hybrid', icon: '🗺️' },
    { id: 'outdoor', label: 'Outdoor', icon: '🏕️' },
  ];

  const handleMapTypeChange = (type) => setBasemapType(type);

  const companies = [
    { icon: '🏢', name: 'TechCorp', color: '#2563EB' },
    { icon: '🏭', name: 'MapIndustries', color: '#059669' },
    { icon: '🎓', name: 'GeoUniversity', color: '#D97706' },
    { icon: '🏛️', name: 'CityGov', color: '#7C3AED' },
    { icon: '🚁', name: 'DroneLogistics', color: '#DC2626' },
    { icon: '🏗️', name: 'BuildPro', color: '#0891B2' },
  ];

  const handlePolicyAgree = () => {
    localStorage.setItem('privacyPolicyAgreed', 'true');
    setShowPolicyNotification(false);
  };

  const pricingPlans = [
    {
      id: 'basic',
      name: 'Starter',
      price: 899,
      popular: false,
      features: [
        'All map types: Hiking, Cycling, Satellite & Topo',
        'High-res up to Zoom Level 19',
        'Unlimited API calls',
        'Download 25 Maps',
        'Offline maps download',
        'Basic analytics dashboard',
      ],
    },
    {
      id: 'pro',
      name: 'Professional',
      price: 1899,
      popular: true,
      features: [
        'All map types: Hiking, Cycling, Satellite & Topo',
        'High-res up to Zoom Level 19',
        'Priority 24/7 support + dedicated manager',
        'Download 100 Maps',
        'Offline maps download',
        'AI-powered analytics & insights',
        'Early access to beta features',
      ],
    },
  ];

  const reviews = [
    {
      name: 'Alvarez',
      role: 'Trail Guide, Colorado',
      stars: 5,
      text: 'The hiking maps for our Rockies trip were incredibly helpful. Elevation profiles and real-time weather kept us safe and prepared throughout.',
      initials: 'A',
    },
    {
      name: 'Liam',
      role: 'Daily Commuter, Portland',
      stars: 4,
      text: "Cycling routes are great for finding quiet roads. It's become my daily companion for commuting — highly recommend for urban riders.",
      initials: 'L',
    },
    {
      name: 'Sarah Chen',
      role: 'Land Surveyor, Texas',
      stars: 5,
      text: 'The topographic maps are a lifesaver. Contour lines and terrain shading let us analyze sites remotely, saving hours per project.',
      initials: 'SC',
    },
    {
      name: 'Sam',
      role: 'Urban Planner, NYC',
      stars: 4,
      text: "Sharp satellite imagery that's perfect for urban planning. A reliable platform that consistently delivers real value for our team.",
      initials: 'S',
    },
  ];

  const handlePricingClick = (plan) => {
    console.log(`Selected plan: ${plan.name}`);
    setShowModal(true);
  };

  return (
    <div className="gp-root">
      <Head>
        <title>Offline Maps Download | GeoPulse – GIS & Satellite Maps</title>
        <meta
          name="description"
          content="Download offline maps including satellite, hiking, cycling and topographic maps. High-resolution GIS maps for offline navigation."
        />
        <meta
          name="keywords"
          content="offline maps, download offline maps, GIS offline maps, satellite maps offline, hiking maps offline"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://geopulesforu.business/" />
        <meta property="og:title" content="Offline Maps Download | GeoPulse" />
        <meta
          property="og:description"
          content="High-resolution offline GIS, hiking and satellite maps."
        />
        <meta property="og:url" content="https://geopulesforu.business/" />
        <meta property="og:type" content="website" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&family=Playfair+Display:wght@700;800;900&display=swap"
          rel="stylesheet"
        />
      </Head>

      <style jsx global>{`
        :root {
          --gp-white: #FFFFFF;
          --gp-off-white: #FAFBFC;
          --gp-cream: #F5F3EF;
          --gp-warm-gray: #F0EDE8;
          --gp-light-gray: #E8E5E0;
          --gp-mid-gray: #9B9590;
          --gp-dark-gray: #5C5652;
          --gp-charcoal: #2D2926;
          --gp-black: #1A1715;
          --gp-green-50: #ECFDF5;
          --gp-green-100: #D1FAE5;
          --gp-green-200: #A7F3D0;
          --gp-green-400: #34D399;
          --gp-green-500: #10B981;
          --gp-green-600: #059669;
          --gp-green-700: #047857;
          --gp-green-800: #065F46;
          --gp-amber: #F59E0B;
          --gp-coral: #F97316;
          --gp-blue: #3B82F6;
          --gp-radius-sm: 8px;
          --gp-radius-md: 14px;
          --gp-radius-lg: 22px;
          --gp-radius-xl: 32px;
          --gp-shadow-sm: 0 1px 3px rgba(26,23,21,0.06), 0 1px 2px rgba(26,23,21,0.04);
          --gp-shadow-md: 0 4px 16px rgba(26,23,21,0.08), 0 2px 6px rgba(26,23,21,0.04);
          --gp-shadow-lg: 0 12px 40px rgba(26,23,21,0.1), 0 4px 12px rgba(26,23,21,0.06);
          --gp-shadow-xl: 0 20px 60px rgba(26,23,21,0.12), 0 8px 20px rgba(26,23,21,0.06);
          --gp-font-display: 'Playfair Display', Georgia, serif;
          --gp-font-body: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .gp-root {
          min-height: 100vh;
          background: var(--gp-off-white);
          color: var(--gp-charcoal);
          font-family: var(--gp-font-body);
          overflow-x: hidden;
        }

        /* ---- NAV ---- */
        .gp-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--gp-light-gray);
          padding: 0 clamp(16px,4vw,40px);
          transition: box-shadow 0.3s;
        }
        .gp-nav:hover { box-shadow: var(--gp-shadow-sm); }
        .gp-nav-inner {
          max-width: 1320px; margin: 0 auto;
          display: flex; justify-content: space-between; align-items: center;
          height: clamp(56px,8vw,72px);
        }
        .gp-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .gp-logo-icon {
          width: 40px; height: 40px;
          background: linear-gradient(135deg, var(--gp-green-600), var(--gp-green-400));
          border-radius: 12px;
          display: grid; place-items: center;
          font-size: 20px; color: #fff;
          box-shadow: 0 2px 8px rgba(5,150,105,0.25);
        }
        .gp-logo-text {
          font-family: var(--gp-font-display);
          font-size: clamp(22px,3vw,28px); font-weight: 800;
          color: var(--gp-charcoal);
        }
        .gp-nav-actions { display: flex; align-items: center; gap: clamp(8px,2vw,20px); }
        .gp-nav-link {
          font-size: 15px; font-weight: 600; color: var(--gp-dark-gray);
          text-decoration: none; padding: 8px 16px; border-radius: 8px;
          transition: all 0.2s;
        }
        .gp-nav-link:hover { color: var(--gp-green-700); background: var(--gp-green-50); }
        .gp-btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 24px;
          background: linear-gradient(135deg, var(--gp-green-600), var(--gp-green-700));
          color: #fff; border: none; border-radius: 50px;
          font-size: 15px; font-weight: 700; font-family: var(--gp-font-body);
          cursor: pointer; transition: all 0.25s;
          box-shadow: 0 2px 12px rgba(5,150,105,0.25);
        }
        .gp-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(5,150,105,0.35);
        }
        .gp-btn-outline {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 24px;
          background: transparent;
          color: var(--gp-green-700); border: 2px solid var(--gp-green-500);
          border-radius: 50px;
          font-size: 15px; font-weight: 700; font-family: var(--gp-font-body);
          cursor: pointer; transition: all 0.25s;
        }
        .gp-btn-outline:hover {
          background: var(--gp-green-50);
          transform: translateY(-2px);
        }

        /* ---- HERO ---- */
        .gp-hero {
          padding: clamp(100px,16vw,160px) clamp(16px,4vw,40px) clamp(60px,10vw,100px);
          background:
            radial-gradient(ellipse 80% 60% at 20% 80%, rgba(167,243,208,0.25), transparent),
            radial-gradient(ellipse 60% 50% at 80% 20%, rgba(52,211,153,0.15), transparent),
            var(--gp-cream);
          position: relative; overflow: hidden;
        }
        .gp-hero::before {
          content: ''; position: absolute; inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='30' cy='30' r='1' fill='%23059669' fill-opacity='0.06'/%3E%3C/svg%3E");
          pointer-events: none;
        }
        .gp-hero-inner {
          max-width: 1320px; margin: 0 auto; position: relative; z-index: 2;
        }
        .gp-hero-content { text-align: center; margin-bottom: clamp(48px,8vw,80px); }
        .gp-hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 16px; margin-bottom: 24px;
          background: var(--gp-white);
          border: 1px solid var(--gp-green-200);
          border-radius: 50px; font-size: 14px; font-weight: 600;
          color: var(--gp-green-700);
          box-shadow: var(--gp-shadow-sm);
          animation: fadeDown 0.8s ease-out;
        }
        .gp-hero-badge-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--gp-green-500);
          animation: pulse 2s infinite;
        }
        .gp-hero-title {
          font-family: var(--gp-font-display);
          font-size: clamp(38px,7vw,76px); font-weight: 900;
          line-height: 1.05; letter-spacing: -2px;
          color: var(--gp-black);
          margin-bottom: clamp(16px,3vw,28px);
          animation: fadeUp 0.8s ease-out 0.1s both;
        }
        .gp-hero-title-accent {
          background: linear-gradient(135deg, var(--gp-green-700), var(--gp-green-400));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .gp-hero-desc {
          font-size: clamp(17px,2.5vw,21px); color: var(--gp-dark-gray);
          max-width: 720px; margin: 0 auto clamp(28px,5vw,44px);
          line-height: 1.65; font-weight: 400;
          animation: fadeUp 0.8s ease-out 0.2s both;
        }
        .gp-hero-buttons {
          display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;
          animation: fadeUp 0.8s ease-out 0.3s both;
        }
        .gp-hero-btn-primary {
          padding: 16px 36px; font-size: clamp(16px,2vw,18px); font-weight: 700;
          background: linear-gradient(135deg, var(--gp-green-600), var(--gp-green-700));
          color: #fff; border: none; border-radius: 50px;
          cursor: pointer; font-family: var(--gp-font-body);
          box-shadow: 0 4px 20px rgba(5,150,105,0.3);
          transition: all 0.25s;
        }
        .gp-hero-btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(5,150,105,0.4);
        }
        .gp-hero-btn-outline {
          padding: 16px 36px; font-size: clamp(16px,2vw,18px); font-weight: 700;
          background: var(--gp-white); color: var(--gp-green-700);
          border: 2px solid var(--gp-green-200); border-radius: 50px;
          cursor: pointer; font-family: var(--gp-font-body);
          transition: all 0.25s;
        }
        .gp-hero-btn-outline:hover {
          border-color: var(--gp-green-500);
          background: var(--gp-green-50);
          transform: translateY(-3px);
        }
        /* Free trial urgency nudge */
        .gp-hero-nudge {
          margin-top: 16px;
          font-size: 14px; color: var(--gp-mid-gray); font-weight: 500;
          animation: fadeUp 0.8s ease-out 0.4s both;
        }
        .gp-hero-nudge strong { color: var(--gp-green-700); }

        /* ---- SOCIAL PROOF BAR ---- */
        .gp-social-proof {
          display: flex; align-items: center; justify-content: center;
          gap: 32px; flex-wrap: wrap;
          padding: 20px 0; margin-top: clamp(32px,5vw,56px);
          animation: fadeUp 0.8s ease-out 0.5s both;
        }
        .gp-social-proof-item {
          display: flex; align-items: center; gap: 8px;
          font-size: 14px; font-weight: 600; color: var(--gp-dark-gray);
        }
        .gp-social-proof-icon { font-size: 20px; }
        .gp-social-proof-number { color: var(--gp-green-700); font-weight: 800; font-size: 16px; }

        /* ---- MAP SECTION ---- */
        .gp-map-section {
          background: var(--gp-white);
          border-radius: var(--gp-radius-xl);
          padding: clamp(20px,4vw,36px);
          border: 1px solid var(--gp-light-gray);
          box-shadow: var(--gp-shadow-lg);
          animation: fadeUp 1s ease-out 0.6s both;
        }
        .gp-map-grid {
          display: grid;
          grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
          gap: clamp(20px,4vw,32px); align-items: start;
        }
        .gp-map-container {
          background: var(--gp-off-white);
          border-radius: var(--gp-radius-lg);
          padding: clamp(16px,3vw,24px);
          border: 1px solid var(--gp-light-gray);
          position: relative; overflow: hidden;
        }
        .gp-map-header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 16px;
        }
        .gp-map-title {
          font-size: clamp(16px,2.5vw,20px); font-weight: 700; color: var(--gp-charcoal);
        }
        .gp-live-badge {
          display: flex; align-items: center; gap: 6px;
          padding: 4px 12px; background: var(--gp-green-50);
          border: 1px solid var(--gp-green-200); border-radius: 50px;
          font-size: 13px; font-weight: 600; color: var(--gp-green-700);
        }
        .gp-live-dot {
          width: 8px; height: 8px; background: var(--gp-green-500);
          border-radius: 50%; animation: pulse 2s infinite;
        }
        .gp-map-canvas {
          width: 100%; height: clamp(280px,40vw,420px);
          border-radius: var(--gp-radius-md);
          border: 1px solid var(--gp-light-gray);
          background: var(--gp-warm-gray);
        }
        .gp-map-types {
          display: flex; gap: 6px; flex-wrap: wrap;
          margin-top: 14px;
        }
        .gp-map-type-btn {
          padding: 8px 14px; border: 1px solid var(--gp-light-gray);
          border-radius: 10px; background: var(--gp-white);
          color: var(--gp-dark-gray); font-size: 13px; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
          font-family: var(--gp-font-body);
          display: flex; align-items: center; gap: 4px;
        }
        .gp-map-type-btn:hover { border-color: var(--gp-green-400); color: var(--gp-green-700); }
        .gp-map-type-btn.active {
          background: linear-gradient(135deg, var(--gp-green-600), var(--gp-green-700));
          color: #fff; border-color: transparent;
          box-shadow: 0 2px 8px rgba(5,150,105,0.25);
        }

        /* ---- SIDE PANEL (WHY CHOOSE) ---- */
        .gp-side-panel { display: flex; flex-direction: column; gap: 20px; }
        .gp-why-card {
          background: var(--gp-white);
          border-radius: var(--gp-radius-lg);
          padding: clamp(20px,4vw,28px);
          border: 1px solid var(--gp-light-gray);
          box-shadow: var(--gp-shadow-sm);
        }
        .gp-why-title {
          font-family: var(--gp-font-display);
          font-size: clamp(20px,3vw,26px); font-weight: 800;
          color: var(--gp-charcoal); margin-bottom: 20px;
        }
        .gp-why-list { list-style: none; padding: 0; margin: 0 0 20px; }
        .gp-why-item {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 10px 0;
          border-bottom: 1px solid var(--gp-warm-gray);
          font-size: 15px; color: var(--gp-dark-gray); line-height: 1.5;
        }
        .gp-why-item:last-child { border-bottom: none; }
        .gp-why-icon {
          width: 32px; height: 32px; border-radius: 8px;
          background: var(--gp-green-50); display: grid; place-items: center;
          font-size: 16px; flex-shrink: 0;
        }
        .gp-why-cta-btn {
          width: 100%; padding: 14px;
          background: linear-gradient(135deg, var(--gp-green-600), var(--gp-green-700));
          color: #fff; border: none; border-radius: 12px;
          font-size: 16px; font-weight: 700; cursor: pointer;
          font-family: var(--gp-font-body);
          box-shadow: 0 4px 16px rgba(5,150,105,0.25);
          transition: all 0.25s;
        }
        .gp-why-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(5,150,105,0.35);
        }

        /* ---- STATS ---- */
        .gp-stats-section {
          padding: clamp(48px,8vw,80px) clamp(16px,4vw,40px);
          background: var(--gp-white);
        }
        .gp-stats-inner { max-width: 1320px; margin: 0 auto; }
        .gp-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: clamp(20px,4vw,32px);
          padding: clamp(28px,5vw,48px);
          background: linear-gradient(135deg, var(--gp-green-800), var(--gp-green-600));
          border-radius: var(--gp-radius-xl);
          box-shadow: 0 8px 32px rgba(5,150,105,0.2);
        }
        .gp-stat { text-align: center; }
        .gp-stat-number {
          font-family: var(--gp-font-display);
          font-size: clamp(36px,6vw,52px); font-weight: 900;
          color: #fff; line-height: 1;
        }
        .gp-stat-label {
          font-size: 15px; color: var(--gp-green-200); font-weight: 500; margin-top: 6px;
        }

        /* ---- TRUST LOGOS ---- */
        .gp-trust { margin-top: clamp(40px,6vw,64px); text-align: center; }
        .gp-trust-title {
          font-size: clamp(14px,2vw,16px); font-weight: 600;
          color: var(--gp-mid-gray); text-transform: uppercase;
          letter-spacing: 2px; margin-bottom: 24px;
        }
        .gp-logos-wrap { overflow: hidden; position: relative; }
        .gp-logos-track {
          display: flex; gap: 20px;
          animation: scrollLogos 18s linear infinite;
        }
        .gp-logo-card {
          flex-shrink: 0; min-width: 160px;
          background: var(--gp-off-white); border: 1px solid var(--gp-light-gray);
          border-radius: var(--gp-radius-md);
          padding: 20px 24px;
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          transition: all 0.25s;
        }
        .gp-logo-card:hover {
          border-color: var(--gp-green-400);
          box-shadow: var(--gp-shadow-md);
          transform: translateY(-3px);
        }
        .gp-logo-emoji { font-size: 36px; }
        .gp-logo-name { font-size: 14px; font-weight: 600; color: var(--gp-dark-gray); }

        /* ---- FEATURES ---- */
        .gp-features-section {
          padding: clamp(48px,8vw,80px) clamp(16px,4vw,40px);
          background: var(--gp-cream);
        }
        .gp-features-inner { max-width: 1320px; margin: 0 auto; }
        .gp-section-label {
          text-align: center; font-size: 14px; font-weight: 700;
          color: var(--gp-green-600); text-transform: uppercase;
          letter-spacing: 2px; margin-bottom: 8px;
        }
        .gp-section-title {
          text-align: center;
          font-family: var(--gp-font-display);
          font-size: clamp(28px,5vw,44px); font-weight: 800;
          color: var(--gp-charcoal); margin-bottom: clamp(32px,5vw,56px);
        }
        .gp-features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: clamp(20px,4vw,28px);
        }
        .gp-feature-card {
          background: var(--gp-white);
          border-radius: var(--gp-radius-lg);
          padding: clamp(28px,4vw,36px);
          border: 1px solid var(--gp-light-gray);
          box-shadow: var(--gp-shadow-sm);
          transition: all 0.3s;
          opacity: 0; transform: translateY(20px);
          animation: fadeUp 0.7s ease-out forwards;
        }
        .gp-feature-card:nth-child(1) { animation-delay: 0.1s; }
        .gp-feature-card:nth-child(2) { animation-delay: 0.2s; }
        .gp-feature-card:nth-child(3) { animation-delay: 0.3s; }
        .gp-feature-card:nth-child(4) { animation-delay: 0.4s; }
        .gp-feature-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--gp-shadow-lg);
          border-color: var(--gp-green-200);
        }
        .gp-feature-icon-wrap {
          width: 56px; height: 56px;
          background: linear-gradient(135deg, var(--gp-green-50), var(--gp-green-100));
          border-radius: 16px; display: grid; place-items: center;
          font-size: 28px; margin-bottom: 20px;
        }
        .gp-feature-title {
          font-size: clamp(18px,2.5vw,22px); font-weight: 700;
          color: var(--gp-charcoal); margin-bottom: 10px;
        }
        .gp-feature-desc {
          font-size: 15px; color: var(--gp-dark-gray); line-height: 1.65;
        }

        /* ---- REVIEWS ---- */
        .gp-reviews-section {
          padding: clamp(48px,8vw,80px) clamp(16px,4vw,40px);
          background: var(--gp-white);
        }
        .gp-reviews-inner { max-width: 1320px; margin: 0 auto; }
        .gp-reviews-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: clamp(20px,4vw,28px);
        }
        .gp-review-card {
          background: var(--gp-off-white);
          border-radius: var(--gp-radius-lg);
          padding: clamp(24px,4vw,32px);
          border: 1px solid var(--gp-light-gray);
          transition: all 0.3s;
          opacity: 0; transform: translateY(20px);
          animation: fadeUp 0.7s ease-out forwards;
        }
        .gp-review-card:nth-child(1) { animation-delay: 0.1s; }
        .gp-review-card:nth-child(2) { animation-delay: 0.2s; }
        .gp-review-card:nth-child(3) { animation-delay: 0.3s; }
        .gp-review-card:nth-child(4) { animation-delay: 0.4s; }
        .gp-review-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--gp-shadow-md);
          border-color: var(--gp-green-200);
        }
        .gp-review-header { display: flex; align-items: center; gap: 14px; margin-bottom: 14px; }
        .gp-review-avatar {
          width: 44px; height: 44px; border-radius: 50%;
          background: linear-gradient(135deg, var(--gp-green-400), var(--gp-green-600));
          display: grid; place-items: center;
          font-size: 16px; font-weight: 800; color: #fff;
        }
        .gp-review-name { font-size: 16px; font-weight: 700; color: var(--gp-charcoal); }
        .gp-review-role { font-size: 13px; color: var(--gp-mid-gray); font-weight: 500; }
        .gp-review-stars { color: var(--gp-amber); font-size: 18px; margin-bottom: 12px; }
        .gp-review-text { font-size: 15px; color: var(--gp-dark-gray); line-height: 1.65; }

        /* ---- PRICING ---- */
        .gp-pricing-section {
          padding: clamp(48px,8vw,80px) clamp(16px,4vw,40px);
          background: var(--gp-cream);
        }
        .gp-pricing-inner { max-width: 1320px; margin: 0 auto; text-align: center; }
        .gp-pricing-subtitle {
          font-size: clamp(16px,2.5vw,18px); color: var(--gp-dark-gray);
          margin-bottom: clamp(32px,5vw,48px); max-width: 600px;
          margin-left: auto; margin-right: auto;
        }
        .gp-pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: clamp(20px,4vw,32px);
          max-width: 840px; margin: 0 auto;
        }
        .gp-pricing-card {
          background: var(--gp-white);
          border-radius: var(--gp-radius-xl);
          padding: clamp(32px,5vw,44px);
          border: 1px solid var(--gp-light-gray);
          text-align: left;
          transition: all 0.3s; position: relative;
          box-shadow: var(--gp-shadow-md);
          opacity: 0; transform: translateY(20px);
          animation: fadeUp 0.8s ease-out forwards;
        }
        .gp-pricing-card:nth-child(1) { animation-delay: 0.1s; }
        .gp-pricing-card:nth-child(2) { animation-delay: 0.2s; }
        .gp-pricing-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--gp-shadow-xl);
        }
        .gp-pricing-card.popular {
          border: 2px solid var(--gp-green-500);
          box-shadow: var(--gp-shadow-lg), 0 0 0 4px var(--gp-green-100);
        }
        .gp-pricing-popular-badge {
          position: absolute; top: -14px; left: 50%; transform: translateX(-50%);
          background: linear-gradient(135deg, var(--gp-green-500), var(--gp-green-600));
          color: #fff; padding: 5px 20px; border-radius: 50px;
          font-size: 13px; font-weight: 700; white-space: nowrap;
          box-shadow: 0 4px 12px rgba(5,150,105,0.3);
        }
        .gp-pricing-plan-name {
          font-size: 18px; font-weight: 700; color: var(--gp-dark-gray);
          margin-bottom: 8px;
        }
        .gp-pricing-price {
          font-family: var(--gp-font-display);
          font-size: clamp(40px,6vw,52px); font-weight: 900;
          color: var(--gp-charcoal); line-height: 1;
        }
        .gp-pricing-price-dollar { font-size: 28px; vertical-align: top; }
        .gp-pricing-period { font-size: 14px; color: var(--gp-mid-gray); margin-top: 4px; margin-bottom: 24px; }
        .gp-pricing-features { list-style: none; padding: 0; margin: 0 0 28px; }
        .gp-pricing-feature {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 8px 0; font-size: 15px; color: var(--gp-dark-gray);
        }
        .gp-pricing-check {
          width: 20px; height: 20px; border-radius: 50%;
          background: var(--gp-green-100); color: var(--gp-green-700);
          display: grid; place-items: center; flex-shrink: 0;
          font-size: 12px; font-weight: 800; margin-top: 2px;
        }
        .gp-pricing-cta {
          width: 100%; padding: 16px;
          background: linear-gradient(135deg, var(--gp-green-600), var(--gp-green-700));
          color: #fff; border: none; border-radius: 14px;
          font-size: 16px; font-weight: 700; cursor: pointer;
          font-family: var(--gp-font-body);
          box-shadow: 0 4px 16px rgba(5,150,105,0.25);
          transition: all 0.25s;
        }
        .gp-pricing-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(5,150,105,0.35);
        }
        .gp-pricing-cta-outline {
          width: 100%; padding: 16px;
          background: var(--gp-white);
          color: var(--gp-green-700); border: 2px solid var(--gp-green-400);
          border-radius: 14px;
          font-size: 16px; font-weight: 700; cursor: pointer;
          font-family: var(--gp-font-body);
          transition: all 0.25s;
        }
        .gp-pricing-cta-outline:hover {
          background: var(--gp-green-50);
          transform: translateY(-2px);
        }
        .gp-pricing-guarantee {
          margin-top: 32px; text-align: center;
          font-size: 14px; color: var(--gp-mid-gray); font-weight: 500;
        }
        .gp-pricing-guarantee strong { color: var(--gp-green-700); }

        /* ---- CTA ---- */
        .gp-cta-section {
          padding: clamp(48px,8vw,80px) clamp(16px,4vw,40px);
          background: linear-gradient(135deg, var(--gp-green-800), var(--gp-green-600));
          text-align: center; color: #fff; position: relative; overflow: hidden;
        }
        .gp-cta-section::before {
          content: ''; position: absolute; inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='1.5' fill='white' fill-opacity='0.06'/%3E%3C/svg%3E");
          pointer-events: none;
        }
        .gp-cta-inner { max-width: 680px; margin: 0 auto; position: relative; z-index: 2; }
        .gp-cta-title {
          font-family: var(--gp-font-display);
          font-size: clamp(28px,5vw,44px); font-weight: 800;
          margin-bottom: 16px;
        }
        .gp-cta-desc { font-size: clamp(16px,2.5vw,19px); opacity: 0.9; margin-bottom: 32px; line-height: 1.6; }
        .gp-cta-btn {
          padding: 16px 40px;
          background: var(--gp-white); color: var(--gp-green-700);
          border: none; border-radius: 50px;
          font-size: 18px; font-weight: 700; cursor: pointer;
          font-family: var(--gp-font-body);
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          transition: all 0.25s;
        }
        .gp-cta-btn:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 8px 30px rgba(0,0,0,0.2);
        }

        /* ---- FLOATING CTA (conversion booster) ---- */
        .gp-floating-cta {
          position: fixed; bottom: 24px; right: 24px; z-index: 900;
          background: var(--gp-white);
          border: 1px solid var(--gp-green-200);
          border-radius: var(--gp-radius-lg);
          padding: 16px 20px;
          box-shadow: var(--gp-shadow-xl);
          display: flex; align-items: center; gap: 12px;
          animation: slideUp 0.5s ease-out;
          max-width: 340px;
        }
        .gp-floating-cta-close {
          position: absolute; top: 6px; right: 10px;
          background: none; border: none; color: var(--gp-mid-gray);
          font-size: 16px; cursor: pointer; padding: 2px;
        }
        .gp-floating-cta-icon {
          width: 44px; height: 44px; border-radius: 12px;
          background: linear-gradient(135deg, var(--gp-green-400), var(--gp-green-600));
          display: grid; place-items: center; font-size: 22px; flex-shrink: 0;
        }
        .gp-floating-cta-text { font-size: 14px; color: var(--gp-dark-gray); line-height: 1.4; }
        .gp-floating-cta-text strong { color: var(--gp-charcoal); display: block; margin-bottom: 2px; }
        .gp-floating-cta-link {
          color: var(--gp-green-600); font-weight: 700; text-decoration: none;
          font-size: 14px;
        }
        .gp-floating-cta-link:hover { text-decoration: underline; }

        /* ---- FOOTER ---- */
        .gp-footer {
          padding: clamp(32px,6vw,56px) clamp(16px,4vw,40px);
          background: var(--gp-charcoal); color: #fff;
        }
        .gp-footer-inner {
          max-width: 1320px; margin: 0 auto;
          display: flex; flex-direction: column; align-items: center; gap: 20px;
        }
        .gp-footer-links { display: flex; flex-wrap: wrap; justify-content: center; gap: 24px; }
        .gp-footer-link {
          color: rgba(255,255,255,0.7); font-size: 14px; font-weight: 600;
          text-decoration: none; transition: color 0.2s;
        }
        .gp-footer-link:hover { color: #fff; }
        .gp-footer-copy { font-size: 13px; color: rgba(255,255,255,0.4); }

        /* ---- POLICY MODAL ---- */
        .gp-overlay {
          position: fixed; inset: 0; z-index: 2000;
          background: rgba(26,23,21,0.4);
          backdrop-filter: blur(8px);
          display: grid; place-items: center;
          animation: fadeIn 0.3s ease;
        }
        .gp-policy-modal {
          background: var(--gp-white);
          border-radius: var(--gp-radius-xl);
          padding: clamp(28px,5vw,40px);
          width: min(420px, 92vw);
          text-align: center;
          box-shadow: var(--gp-shadow-xl);
          animation: slideUp 0.35s ease;
        }
        .gp-policy-title {
          font-family: var(--gp-font-display);
          font-size: 22px; font-weight: 800; color: var(--gp-charcoal);
          margin-bottom: 12px;
        }
        .gp-policy-text {
          font-size: 15px; color: var(--gp-dark-gray); line-height: 1.6;
          margin-bottom: 24px;
        }
        .gp-policy-link { color: var(--gp-green-600); font-weight: 600; text-decoration: underline; }
        .gp-policy-btn {
          padding: 12px 32px;
          background: linear-gradient(135deg, var(--gp-green-600), var(--gp-green-700));
          color: #fff; border: none; border-radius: 50px;
          font-size: 16px; font-weight: 700; cursor: pointer;
          font-family: var(--gp-font-body);
          box-shadow: 0 4px 16px rgba(5,150,105,0.25);
          transition: all 0.25s;
        }
        .gp-policy-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(5,150,105,0.35); }

        /* ---- ANIMATIONS ---- */
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeDown { from{opacity:0;transform:translateY(-16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scrollLogos { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }

        /* ---- RESPONSIVE ---- */
        @media (max-width: 768px) {
          .gp-map-grid { grid-template-columns: 1fr !important; }
          .gp-social-proof { gap: 16px; }
          .gp-floating-cta { left: 16px; right: 16px; max-width: none; bottom: 16px; }
        }
        @media (max-width: 480px) {
          .gp-nav-inner { gap: 8px; }
          .gp-hero-buttons { flex-direction: column; align-items: center; }
          .gp-features-grid, .gp-reviews-grid { grid-template-columns: 1fr; }
          .gp-pricing-grid { grid-template-columns: 1fr; max-width: 400px; }
          .gp-footer-links { flex-direction: column; align-items: center; gap: 12px; }
        }
      `}</style>

      {/* ========= NAV ========= */}
      <nav className="gp-nav">
        <div className="gp-nav-inner">
          <a href="/" className="gp-logo">
            <div className="gp-logo-icon">🗺️</div>
            <span className="gp-logo-text">GeoPulse</span>
          </a>
          <div className="gp-nav-actions">
            <a href="/Documentation" className="gp-nav-link">Docs</a>
            <button onClick={() => setShowModal(true)} className="gp-btn-primary">
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* ========= HERO ========= */}
      <section className="gp-hero">
        <div className="gp-hero-inner">
          <div className="gp-hero-content">
            <div className="gp-hero-badge">
              <span className="gp-hero-badge-dot"></span>
              Now with AI-powered route planning
            </div>
            <h1 className="gp-hero-title">
              Maps That Move<br />
              <span className="gp-hero-title-accent">Your World Forward</span>
            </h1>
            <p className="gp-hero-desc">
              High-quality offline maps, satellite imagery, and geospatial APIs built for
              adventurers, developers, and enterprises. From hiking trails to city streets.
            </p>
            <div className="gp-hero-buttons">
              <button onClick={() => setShowModal(true)} className="gp-hero-btn-primary">
                Start Free — No Card Required
              </button>
              <button className="gp-hero-btn-outline">
                ▶ Watch 2-Min Demo
              </button>
            </div>
            <p className="gp-hero-nudge">
              <strong>2,340 teams</strong> signed up this month — join them in under 30 seconds
            </p>
          </div>

          {/* Social proof micro-bar */}
          <div className="gp-social-proof">
            <div className="gp-social-proof-item">
              <span className="gp-social-proof-icon">⭐</span>
              <span><span className="gp-social-proof-number">4.9</span> on G2</span>
            </div>
            <div className="gp-social-proof-item">
              <span className="gp-social-proof-icon">🏆</span>
              <span><span className="gp-social-proof-number">10K+</span> organizations</span>
            </div>
            <div className="gp-social-proof-item">
              <span className="gp-social-proof-icon">🌍</span>
              <span><span className="gp-social-proof-number">150+</span> countries</span>
            </div>
            <div className="gp-social-proof-item">
              <span className="gp-social-proof-icon">⚡</span>
              <span><span className="gp-social-proof-number">99.9%</span> uptime</span>
            </div>
          </div>

          {/* Map Section */}
          <div className="gp-map-section">
            <div className="gp-map-grid">
              <div className="gp-map-container">
                <div className="gp-map-header">
                  <h3 className="gp-map-title">Live 3D Preview</h3>
                  <div className="gp-live-badge">
                    <span className="gp-live-dot"></span>
                    Live
                  </div>
                </div>
                <div ref={mapRef} className="gp-map-canvas" />
                <div className="gp-map-types">
                  {mapTypes.map((type) => (
                    <button
                      key={type.id}
                      className={`gp-map-type-btn ${basemapType === type.id ? 'active' : ''}`}
                      onClick={() => handleMapTypeChange(type.id)}
                    >
                      {type.icon} {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="gp-side-panel">
                <div className="gp-why-card">
                  <h3 className="gp-why-title">Why GeoPulse?</h3>
                  <ul className="gp-why-list">
                    {[
                      { icon: '🥾', text: 'Expert hiking maps with elevation & weather' },
                      { icon: '🚴', text: 'Smart cycling routes that avoid traffic' },
                      { icon: '🛰️', text: 'Crystal-clear satellite imagery' },
                      { icon: '🏔️', text: 'Detailed topographic views' },
                      { icon: '🔗', text: 'Seamless GIS workflow integration' },
                      { icon: '⚡', text: 'Real-time data updates' },
                    ].map((item, i) => (
                      <li key={i} className="gp-why-item">
                        <div className="gp-why-icon">{item.icon}</div>
                        <span>{item.text}</span>
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => setShowModal(true)} className="gp-why-cta-btn">
                    Get Started Free →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========= STATS ========= */}
      <section className="gp-stats-section">
        <div className="gp-stats-inner">
          <div className="gp-stats-grid">
            {[
              { num: '500M+', label: 'Tiles Served Monthly' },
              { num: '10,000+', label: 'Active Organizations' },
              { num: '99.9%', label: 'Uptime SLA' },
              { num: '150+', label: 'Countries Covered' },
            ].map((stat, i) => (
              <div key={i} className="gp-stat">
                <div className="gp-stat-number">{stat.num}</div>
                <div className="gp-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="gp-trust">
            <p className="gp-trust-title">Trusted by leading organizations worldwide</p>
            <div className="gp-logos-wrap">
              <div className="gp-logos-track">
                {[...companies, ...companies].map((c, i) => (
                  <div key={i} className="gp-logo-card">
                    <span className="gp-logo-emoji">{c.icon}</span>
                    <span className="gp-logo-name">{c.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========= FEATURES ========= */}
      <section className="gp-features-section">
        <div className="gp-features-inner">
          <p className="gp-section-label">Premium Maps</p>
          <h2 className="gp-section-title">Built for Every Terrain</h2>
          <div className="gp-features-grid">
            {[
              {
                icon: '🥾',
                title: 'Hiking Maps',
                desc: 'Detailed elevation profiles, waypoints, and real-time weather. Plan every adventure with confidence.',
              },
              {
                icon: '🚴',
                title: 'Cycling Maps',
                desc: 'Traffic-avoiding routes, slope gradients, and custom planning. Ride smarter, every single day.',
              },
              {
                icon: '🛰️',
                title: 'Satellite Imagery',
                desc: 'High-resolution views for land monitoring, urban planning, and environmental analysis.',
              },
              {
                icon: '🏔️',
                title: 'Topographic Maps',
                desc: 'Contour lines, terrain shading, and hydrological features for precise navigation.',
              },
            ].map((f, i) => (
              <div key={i} className="gp-feature-card">
                <div className="gp-feature-icon-wrap">{f.icon}</div>
                <h3 className="gp-feature-title">{f.title}</h3>
                <p className="gp-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========= REVIEWS ========= */}
      <section className="gp-reviews-section">
        <div className="gp-reviews-inner">
          <p className="gp-section-label">Testimonials</p>
          <h2 className="gp-section-title">Loved by Thousands</h2>
          <div className="gp-reviews-grid">
            {reviews.map((r, i) => (
              <div key={i} className="gp-review-card">
                <div className="gp-review-header">
                  <div className="gp-review-avatar">{r.initials}</div>
                  <div>
                    <div className="gp-review-name">{r.name}</div>
                    <div className="gp-review-role">{r.role}</div>
                  </div>
                </div>
                <div className="gp-review-stars">{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</div>
                <p className="gp-review-text">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========= PRICING ========= */}
      <section className="gp-pricing-section">
        <div className="gp-pricing-inner">
          <p className="gp-section-label">Pricing</p>
          <h2 className="gp-section-title">Simple, Transparent Plans</h2>
          <p className="gp-pricing-subtitle">
            Annual billing saves 20%. Start free, upgrade when you're ready.
          </p>
          <div className="gp-pricing-grid">
            {pricingPlans.map((plan) => (
              <div
                key={plan.id}
                className={`gp-pricing-card ${plan.popular ? 'popular' : ''}`}
              >
                {plan.popular && (
                  <div className="gp-pricing-popular-badge">Most Popular</div>
                )}
                <div className="gp-pricing-plan-name">{plan.name}</div>
                <div className="gp-pricing-price">
                  <span className="gp-pricing-price-dollar">$</span>
                  {plan.price}
                </div>
                <div className="gp-pricing-period">per year, billed annually</div>
                <ul className="gp-pricing-features">
                  {plan.features.map((f, i) => (
                    <li key={i} className="gp-pricing-feature">
                      <span className="gp-pricing-check">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handlePricingClick(plan)}
                  className={plan.popular ? 'gp-pricing-cta' : 'gp-pricing-cta-outline'}
                >
                  {plan.popular ? 'Get Professional' : 'Get Starter'}
                </button>
              </div>
            ))}
          </div>
          <p className="gp-pricing-guarantee">
            🛡️ <strong>30-day money-back guarantee</strong> — try risk-free
          </p>
        </div>
      </section>

      {/* ========= CTA ========= */}
      <section className="gp-cta-section">
        <div className="gp-cta-inner">
          <h2 className="gp-cta-title">Ready to Map Smarter?</h2>
          <p className="gp-cta-desc">
            Join 10,000+ teams already using GeoPulse. Free trial, no credit card, instant access.
          </p>
          <button onClick={() => setShowModal(true)} className="gp-cta-btn">
            Start Free Trial →
          </button>
        </div>
      </section>

      {/* ========= FOOTER ========= */}
      <footer className="gp-footer">
        <div className="gp-footer-inner">
          <div className="gp-footer-links">
            <a href="/terms" className="gp-footer-link">Terms of Service</a>
            <a href="/cancel" className="gp-footer-link">Cancellation & Refund</a>
            <a href="/shipping" className="gp-footer-link">Shipping Policy</a>
            <a href="/contact" className="gp-footer-link">Contact Us</a>
            <a href="/PrivacyPolicy" className="gp-footer-link">Privacy Policy</a>
          </div>
          <p className="gp-footer-copy">© 2025 GeoPulse. All rights reserved.</p>
        </div>
      </footer>

      {/* ========= FLOATING CTA (conversion booster) ========= */}
      {showFloatingCTA && (
        <div className="gp-floating-cta">
          <button
            className="gp-floating-cta-close"
            onClick={() => setShowFloatingCTA(false)}
          >
            ✕
          </button>
          <div className="gp-floating-cta-icon">🎁</div>
          <div className="gp-floating-cta-text">
            <strong>Free for 14 days</strong>
            No credit card needed. Cancel anytime.
            <br />
            <a href="#" onClick={(e) => { e.preventDefault(); setShowModal(true); }} className="gp-floating-cta-link">
              Start now →
            </a>
          </div>
        </div>
      )}

      {/* ========= PRIVACY POLICY MODAL ========= */}
      {showPolicyNotification && (
        <div className="gp-overlay">
          <div className="gp-policy-modal">
            <h3 className="gp-policy-title">🍪 Quick Privacy Note</h3>
            <p className="gp-policy-text">
              We use cookies to improve your experience. By continuing, you agree to our{' '}
              <a href="/PrivacyPolicy" className="gp-policy-link">Privacy Policy</a>.
            </p>
            <button onClick={handlePolicyAgree} className="gp-policy-btn">
              Got It
            </button>
          </div>
        </div>
      )}

      {/* ========= AUTH MODAL (existing component) ========= */}
      <AuthModal
        showModal={showModal}
        setShowModal={setShowModal}
        mapStyles={{
          modal: {
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(26,23,21,0.4)', zIndex: 2000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(8px)',
          },
          modalContent: {
            background: '#fff', borderRadius: '22px', padding: 'clamp(24px,5vw,36px)',
            width: 'min(420px, 92vw)', border: '1px solid #E8E5E0',
            boxShadow: '0 20px 60px rgba(26,23,21,0.12)', color: '#2D2926',
          },
          modalTitle: {
            fontSize: '22px', fontWeight: '800', color: '#2D2926',
            textAlign: 'center', margin: '0 0 16px',
            fontFamily: "'Playfair Display', Georgia, serif",
          },
          input: {
            width: '100%', padding: '12px 16px', borderRadius: '10px',
            border: '1px solid #E8E5E0', background: '#FAFBFC',
            color: '#2D2926', fontSize: '15px', marginBottom: '12px',
            boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif",
            transition: 'border-color 0.2s',
          },
          select: {
            width: '100%', padding: '12px 16px', borderRadius: '10px',
            border: '1px solid #E8E5E0', background: '#FAFBFC',
            color: '#2D2926', fontSize: '15px', marginBottom: '12px',
            boxSizing: 'border-box', appearance: 'none',
            fontFamily: "'DM Sans', sans-serif",
          },
          error: {
            color: '#DC2626', background: 'rgba(220,38,38,0.06)',
            padding: '8px 12px', borderRadius: '8px', marginBottom: '12px',
            fontSize: '14px', border: '1px solid rgba(220,38,38,0.15)',
          },
          primaryBtn: {
            width: '100%', padding: '14px',
            background: 'linear-gradient(135deg, #059669, #047857)',
            color: '#fff', border: 'none', borderRadius: '12px',
            fontSize: '16px', fontWeight: '700', cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
          },
          toggleBtn: {
            width: '100%', padding: '10px', background: 'transparent',
            color: '#5C5652', border: '1px solid #E8E5E0', borderRadius: '10px',
            fontSize: '14px', cursor: 'pointer', marginTop: '8px',
            fontFamily: "'DM Sans', sans-serif",
          },
        }}
      />

      <ChatQuery
        mapStyles={{
          input: {
            width: '100%', padding: '12px 16px', borderRadius: '10px',
            border: '1px solid #E8E5E0', background: '#FAFBFC',
            color: '#2D2926', fontSize: '15px',
            boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif",
          },
          primaryBtn: {
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #059669, #047857)',
            color: '#fff', border: 'none', borderRadius: '10px',
            fontSize: '15px', fontWeight: '700', cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
          },
        }}
      />
    </div>
  );
}
