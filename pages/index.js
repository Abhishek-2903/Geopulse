import { useState, useEffect, useRef } from 'react';
import { loadModules } from 'esri-loader';
import AuthModal from './AuthModal';
import ChatQuery from './ChatQuery';

export default function Home() {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({
    lat: 40.7128,
    lng: -74.0060,
    zoom: 14,
  });
  const [basemapType, setBasemapType] = useState('topo-vector');
  const mapRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPolicyNotification, setShowPolicyNotification] = useState(false);

  useEffect(() => {
    const hasAgreed = localStorage.getItem('privacyPolicyAgreed');
    if (!hasAgreed) {
      setShowPolicyNotification(true);
    }

    const timer = setTimeout(() => setMapLoaded(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (mapRef.current && mapLoaded) {
      loadModules(['esri/WebScene', 'esri/views/SceneView', 'esri/layers/TileLayer'], { css: true })
        .then(([WebScene, SceneView, TileLayer]) => {
          const scene = new WebScene({
            basemap: basemapType === 'outdoor' ? {
              baseLayers: [
                new TileLayer({
                  url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer'
                })
              ]
            } : basemapType
          });

          const view = new SceneView({
            container: mapRef.current,
            map: scene,
            camera: {
              position: {
                longitude: currentLocation.lng,
                latitude: currentLocation.lat,
                z: 1000 // Altitude for 3D view
              },
              tilt: 10, // Tilt for 3D perspective
              heading: 0
            }
          });

          console.log(`Loading 3D basemap: ${basemapType}`);

          return () => {
            if (view) {
              view.destroy();
            }
          };
        })
        .catch((err) => console.error('Error loading 3D scene:', err));
    }
  }, [mapLoaded, basemapType]);

  const mapTypes = [
    { id: 'topo-vector', label: 'Terrain' },
    { id: 'satellite', label: 'Satellite' },
    { id: 'national-geographic', label: 'Nat Geo' },
    { id: 'streets-vector', label: 'Street' },
    { id: 'hybrid', label: 'Hybrid' },
    { id: 'outdoor', label: 'Outdoor' }
  ];

  const handleMapTypeChange = (type) => {
    setBasemapType(type);
  };

  const companies = [
  { icon: '🏢', name: 'TechCorp', color: '#000000' },
    { icon: '🏭', name: 'MapIndustries', color: '#10B981' },
    { icon: '🎓', name: 'GeoUniversity', color: '#F59E0B' },
    { icon: '🏛️', name: 'CityGov', color: '#8B5CF6' },
    { icon: '🚁', name: 'DroneLogistics', color: '#EF4444' },
    { icon: '🏗️', name: 'BuildPro', color: '#06B6D4' }
  ];

  const handlePolicyAgree = () => {
    localStorage.setItem('privacyPolicyAgreed', 'true');
    setShowPolicyNotification(false);
  };

  const mapStyles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #111827 0%, #1F2937 100%)',
      color: '#F9FAFB',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    },
    nav: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: 'rgba(17, 24, 39, 0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(55, 65, 81, 0.2)',
      padding: 'clamp(8px, 2vw, 16px) clamp(16px, 4vw, 32px)'
    },
    navContent: {
      maxWidth: '1400px',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: 'clamp(8px, 2vw, 12px)'
    },
    logoIcon: {
      width: 'clamp(36px, 10vw, 48px)',
      height: 'clamp(36px, 10vw, 48px)',
      background: 'linear-gradient(135deg, #065F46, #059669)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 'clamp(18px, 5vw, 24px)',
      color: '#ffffff'
    },
    logoText: {
      fontSize: 'clamp(20px, 6vw, 28px)',
      fontWeight: '800',
      margin: 0,
      color: '#F9FAFB'
    },
    authBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: 'clamp(8px, 2vw, 12px)',
      padding: 'clamp(8px, 2vw, 12px) clamp(16px, 4vw, 24px)',
      background: 'linear-gradient(135deg, #059669, #047857)',
      color: '#ffffff',
      border: 'none',
      borderRadius: '50px',
      fontSize: 'clamp(14px, 4vw, 16px)',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(5, 150, 105, 0.3)'
    },
    navLink: {
      padding: 'clamp(8px, 2vw, 12px) clamp(16px, 4vw, 24px)',
      color: '#D1D5DB',
      fontSize: 'clamp(14px, 4vw, 16px)',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textDecoration: 'none'
    },
    hero: {
      paddingTop: 'clamp(80px, 15vw, 120px)',
      paddingBottom: 'clamp(40px, 10vw, 80px)',
      paddingLeft: 'clamp(16px, 4vw, 32px)',
      paddingRight: 'clamp(16px, 4vw, 32px)',
      position: 'relative',
      backgroundImage: 'url("https://png.pngtree.com/background/20230520/original/pngtree-the-earth-is-seen-on-a-dark-background-picture-image_2674185.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    },
    heroOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(17, 24, 39, 0.7)',
      zIndex: 1
    },
    heroContainer: {
      maxWidth: '1400px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 2
    },
    heroContent: {
      textAlign: 'center',
      marginBottom: 'clamp(40px, 10vw, 80px)',
      position: 'relative',
      zIndex: 2,
      animation: 'fadeInUp 1s ease-out'
    },
    heroTitle: {
      fontSize: 'clamp(36px, 8vw, 72px)',
      fontWeight: '900',
      lineHeight: '1.1',
      margin: '0 0 clamp(16px, 4vw, 32px) 0',
      letterSpacing: '-2px',
      color: '#F9FAFB',
      textShadow: '0 2px 4px rgba(0,0,0,0.5)'
    },
    heroGradient: {
      background: 'linear-gradient(135deg, #065F46, #059669)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    heroDesc: {
      fontSize: 'clamp(16px, 4vw, 20px)',
      color: '#E5E7EB',
      maxWidth: '900px',
      margin: '0 auto clamp(24px, 6vw, 48px)',
      lineHeight: '1.6',
      textShadow: '0 1px 2px rgba(0,0,0,0.5)'
    },
    buttonGroup: {
      display: 'flex',
      gap: 'clamp(12px, 3vw, 24px)',
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginBottom: 'clamp(40px, 10vw, 80px)',
      position: 'relative',
      zIndex: 2,
      animation: 'fadeInUp 1s ease-out 0.2s both'
    },
    primaryBtn: {
      padding: 'clamp(12px, 3vw, 18px) clamp(20px, 5vw, 40px)',
      background: 'linear-gradient(135deg, #059669, #047857)',
      color: '#ffffff',
      border: 'none',
      borderRadius: '50px',
      fontSize: 'clamp(16px, 4vw, 20px)',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      minWidth: 'clamp(180px, 40vw, 220px)',
      boxShadow: '0 8px 25px rgba(5, 150, 105, 0.3)',
      transform: 'translateY(0)'
    },
    secondaryBtn: {
      padding: 'clamp(12px, 3vw, 18px) clamp(20px, 5vw, 40px)',
      background: 'transparent',
      color: '#F9FAFB',
      border: '2px solid #059669',
      borderRadius: '50px',
      fontSize: 'clamp(16px, 4vw, 20px)',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      minWidth: 'clamp(180px, 40vw, 220px)'
    },
    mapSection: {
      background: 'rgba(31, 41, 55, 0.9)',
      backdropFilter: 'blur(20px)',
      borderRadius: 'clamp(16px, 4vw, 32px)',
      padding: 'clamp(20px, 5vw, 40px)',
      border: '1px solid rgba(55, 65, 81, 0.2)',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
      marginTop: 'clamp(40px, 10vw, 80px)',
      animation: 'fadeInUp 1s ease-out 0.4s both'
    },
    mapGrid: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
      gap: 'clamp(16px, 4vw, 32px)',
      alignItems: 'start'
    },
    mapContainer: {
      background: 'rgba(31, 41, 55, 0.95)',
      borderRadius: 'clamp(12px, 3vw, 24px)',
      padding: 'clamp(12px, 3vw, 24px)',
      border: '1px solid rgba(55, 65, 81, 0.2)',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
    },
    mapHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 'clamp(10px, 3vw, 20px)'
    },
    mapTitle: {
      fontSize: 'clamp(16px, 4vw, 20px)',
      fontWeight: '700',
      margin: 0,
      color: '#F9FAFB'
    },
    liveIndicator: {
      display: 'flex',
      alignItems: 'center',
      gap: 'clamp(4px, 1vw, 8px)'
    },
    liveDot: {
      width: 'clamp(8px, 2vw, 12px)',
      height: 'clamp(8px, 2vw, 12px)',
      background: '#10B981',
      borderRadius: '50%',
      animation: 'pulse 2s infinite'
    },
    mapCanvas: {
      width: '100%',
      height: 'clamp(300px, 50vw, 400px)',
      borderRadius: 'clamp(8px, 2vw, 16px)',
      border: '1px solid rgba(55, 65, 81, 0.2)'
    },
    coordinates: {
      position: 'absolute',
      top: 'clamp(8px, 2vw, 16px)',
      left: 'clamp(8px, 2vw, 16px)',
      background: 'rgba(17, 24, 39, 0.9)',
      padding: 'clamp(4px, 1vw, 8px) clamp(8px, 2vw, 16px)',
      borderRadius: '20px',
      fontSize: 'clamp(12px, 3vw, 14px)',
      backdropFilter: 'blur(10px)',
      color: '#F9FAFB'
    },
    zoomLevel: {
      position: 'absolute',
      bottom: 'clamp(8px, 2vw, 16px)',
      right: 'clamp(8px, 2vw, 16px)',
      background: 'rgba(17, 24, 39, 0.9)',
      padding: 'clamp(4px, 1vw, 8px) clamp(8px, 2vw, 16px)',
      borderRadius: '20px',
      fontSize: 'clamp(12px, 3vw, 14px)',
      backdropFilter: 'blur(10px)',
      color: '#F9FAFB'
    },
    mapTypeSelector: {
      position: 'absolute',
      top: 'clamp(3px, 1vw, 3px)',
      right: '80px',
      background: 'rgba(31, 41, 55, 0.95)',
      borderRadius: '20px',
      padding: 'clamp(5px, 1vw, 10px)',
      border: '1px solid rgba(55, 65, 81, 0.2)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      gap: 'clamp(4px, 1vw, 8px)',
      width: 'clamp(300px, 80vw, 550px)',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 10
    },
    mapTypeButton: {
      flex: '1',
      padding: 'clamp(4px, 1vw, 8px) clamp(6px, 1.5vw, 12px)',
      border: 'none',
      borderRadius: '12px',
      background: 'transparent',
      color: '#D1D5DB',
      fontSize: 'clamp(12px, 3vw, 14px)',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textAlign: 'center'
    },
    mapTypeButtonActive: {
      background: 'linear-gradient(135deg, #059669, #047857)',
      color: '#ffffff'
    },
    sidePanel: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'clamp(12px, 3vw, 24px)'
    },
    marketingCard: {
      background: 'rgba(31, 41, 55, 0.95)',
      borderRadius: 'clamp(10px, 2.5vw, 20px)',
      padding: 'clamp(12px, 3vw, 24px)',
      border: '1px solid rgba(55, 65, 81, 0.2)',
      textAlign: 'left',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
    },
    marketingTitle: {
      fontSize: 'clamp(18px, 5vw, 24px)',
      fontWeight: '700',
      marginBottom: 'clamp(8px, 2vw, 16px)',
      color: '#F9FAFB',
      textAlign: 'center'
    },
    marketingList: {
      listStyleType: 'none',
      padding: 0,
      margin: '0 0 clamp(12px, 3vw, 24px) 0',
      textAlign: 'left'
    },
    marketingItem: {
      display: 'flex',
      alignItems: 'center',
      gap: 'clamp(6px, 1.5vw, 12px)',
      marginBottom: 'clamp(6px, 1.5vw, 12px)',
      fontSize: 'clamp(14px, 3.5vw, 16px)',
      color: '#E5E7EB'
    },
    marketingIcon: {
      fontSize: 'clamp(16px, 4vw, 20px)',
      color: '#10B981'
    },
    trustSection: {
      padding: 'clamp(40px, 10vw, 80px) clamp(16px, 4vw, 32px)',
      background: 'rgba(17, 24, 39, 0.8)'
    },
    trustContainer: {
      maxWidth: '1400px',
      margin: '0 auto'
    },
    statsBar: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: 'clamp(16px, 4vw, 32px)',
      marginBottom: 'clamp(40px, 10vw, 80px)',
      padding: 'clamp(20px, 5vw, 40px)',
      background: 'rgba(31, 41, 55, 0.95)',
      borderRadius: 'clamp(12px, 3vw, 24px)',
      border: '1px solid rgba(55, 65, 81, 0.2)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
    },
    statItem: {
      textAlign: 'center'
    },
    statNumber: {
      fontSize: 'clamp(32px, 8vw, 48px)',
      fontWeight: '900',
      color: '#F9FAFB',
      marginBottom: 'clamp(4px, 1vw, 8px)'
    },
    statLabel: {
      fontSize: 'clamp(14px, 3.5vw, 16px)',
      color: '#D1D5DB'
    },
    trustTitle: {
      textAlign: 'center',
      fontSize: 'clamp(24px, 6vw, 36px)',
      fontWeight: '700',
      marginBottom: 'clamp(10px, 2.5vw, 20px)',
      color: '#F9FAFB'
    },
    logosContainer: {
      overflow: 'hidden',
      marginBottom: 'clamp(20px, 5vw, 40px)',
      position: 'relative'
    },
    logosTrack: {
      display: 'flex',
      gap: 'clamp(12px, 3vw, 24px)',
      animation: 'scroll 7.6s linear infinite'
    },
    logoCard: {
      background: 'rgba(31, 41, 55, 0.95)',
      borderRadius: 'clamp(8px, 2vw, 16px)',
      padding: 'clamp(16px, 4vw, 32px) clamp(12px, 3vw, 24px)',
      border: '1px solid rgba(55, 65, 81, 0.2)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'clamp(8px, 2vw, 16px)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      minWidth: 'clamp(150px, 40vw, 200px)',
      flexShrink: 0,
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
    },
    companyLogo: {
      fontSize: 'clamp(32px, 8vw, 48px)',
      opacity: 0.9,
      transition: 'all 0.3s ease'
    },
    companyName: {
      fontSize: 'clamp(14px, 3.5vw, 16px)',
      fontWeight: '600',
      color: '#E5E7EB'
    },
    featuresSection: {
      padding: 'clamp(40px, 10vw, 80px) clamp(16px, 4vw, 32px)',
      background: 'rgba(17, 24, 39, 0.8)'
    },
    featuresContainer: {
      maxWidth: '1400px',
      margin: '0 auto'
    },
    featuresTitle: {
      textAlign: 'center',
      fontSize: 'clamp(24px, 6vw, 36px)',
      marginBottom: 'clamp(24px, 6vw, 48px)',
      color: '#F9FAFB'
    },
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: 'clamp(16px, 4vw, 32px)'
    },
    featureCard: {
      background: 'rgba(31, 41, 55, 0.95)',
      borderRadius: 'clamp(10px, 2.5vw, 20px)',
      padding: 'clamp(16px, 4vw, 32px)',
      border: '1px solid rgba(55, 65, 81, 0.2)',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
      opacity: 0,
      transform: 'translateY(20px)',
      animation: 'fadeInUp 0.8s ease-out forwards'
    },
    featureIcon: {
      fontSize: 'clamp(32px, 8vw, 48px)',
      marginBottom: 'clamp(8px, 2vw, 16px)',
      background: 'linear-gradient(135deg, #065F46, #10B981)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    featureTitle: {
      fontSize: 'clamp(18px, 5vw, 24px)',
      fontWeight: '700',
      marginBottom: 'clamp(8px, 2vw, 16px)',
      color: '#F9FAFB'
    },
    featureDesc: {
      fontSize: 'clamp(14px, 3.5vw, 16px)',
      color: '#D1D5DB',
      lineHeight: '1.6'
    },
    reviewsSection: {
      padding: 'clamp(40px, 10vw, 80px) clamp(16px, 4vw, 32px)',
      background: 'rgba(17, 24, 39, 0.8)'
    },
    reviewsContainer: {
      maxWidth: '1400px',
      margin: '0 auto'
    },
    reviewsTitle: {
      textAlign: 'center',
      fontSize: 'clamp(24px, 6vw, 36px)',
      marginBottom: 'clamp(24px, 6vw, 48px)',
      color: '#F9FAFB'
    },
    reviewsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: 'clamp(16px, 4vw, 32px)'
    },
    reviewCard: {
      background: 'rgba(31, 41, 55, 0.95)',
      borderRadius: 'clamp(10px, 2.5vw, 20px)',
      padding: 'clamp(16px, 4vw, 32px)',
      border: '1px solid rgba(55, 65, 81, 0.2)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
      opacity: 0,
      transform: 'translateY(20px)',
      animation: 'fadeInUp 0.8s ease-out forwards'
    },
    reviewHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: 'clamp(8px, 2vw, 16px)',
      marginBottom: 'clamp(8px, 2vw, 16px)'
    },
    reviewAvatar: {
      width: 'clamp(32px, 8vw, 48px)',
      height: 'clamp(32px, 8vw, 48px)',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #059669, #047857)'
    },
    reviewName: {
      fontSize: 'clamp(16px, 4vw, 18px)',
      fontWeight: '600',
      color: '#F9FAFB'
    },
    reviewStars: {
      color: '#F59E0B',
      marginBottom: 'clamp(8px, 2vw, 16px)',
      fontSize: 'clamp(18px, 4.5vw, 20px)'
    },
    reviewText: {
      color: '#D1D5DB',
      lineHeight: '1.6',
      fontSize: 'clamp(14px, 3.5vw, 16px)'
    },
    pricingSection: {
      padding: 'clamp(40px, 10vw, 80px) clamp(16px, 4vw, 32px)',
      background: 'linear-gradient(135deg, #111827 0%, #1F2937 100%)'
    },
    pricingContainer: {
      maxWidth: '1400px',
      margin: '0 auto',
      textAlign: 'center'
    },
    pricingTitle: {
      textAlign: 'center',
      fontSize: 'clamp(24px, 6vw, 36px)',
      marginBottom: 'clamp(8px, 2vw, 16px)',
      color: '#F9FAFB',
      fontWeight: '700'
    },
    pricingSubtitle: {
      textAlign: 'center',
      fontSize: 'clamp(16px, 4vw, 18px)',
      color: '#D1D5DB',
      marginBottom: 'clamp(24px, 6vw, 48px)'
    },
    pricingGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: 'clamp(16px, 4vw, 32px)',
      justifyContent: 'center',
      alignItems: 'start',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    pricingCard: {
      background: 'rgba(31, 41, 55, 0.95)',
      borderRadius: 'clamp(12px, 3vw, 24px)',
      padding: 'clamp(32px, 8vw, 48px)',
      border: '1px solid rgba(55, 65, 81, 0.2)',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      position: 'relative',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
      maxWidth: '400px',
      margin: '0 auto',
      opacity: 0,
      transform: 'translateY(20px)',
      animation: 'fadeInUp 0.8s ease-out forwards'
    },
    pricingCardPopular: {
      border: '2px solid #10B981',
      transform: 'scale(1.05)',
      boxShadow: '0 10px 40px rgba(16, 185, 129, 0.2)'
    },
    pricingHeader: {
      marginBottom: 'clamp(16px, 4vw, 24px)'
    },
    pricingPlan: {
      fontSize: 'clamp(18px, 5vw, 24px)',
      fontWeight: '700',
      color: '#F9FAFB',
      margin: 0
    },
    pricingPrice: {
      fontSize: 'clamp(36px, 8vw, 48px)',
      fontWeight: '900',
      background: 'linear-gradient(135deg, #10B981, #059669)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      margin: 'clamp(8px, 2vw, 16px) 0'
    },
    pricingPeriod: {
      fontSize: 'clamp(14px, 3.5vw, 16px)',
      color: '#D1D5DB',
      margin: 0
    },
    pricingFeatures: {
      listStyleType: 'none',
      padding: 0,
      margin: 'clamp(24px, 6vw, 32px) 0 clamp(24px, 6vw, 32px) 0',
      textAlign: 'left'
    },
    pricingFeature: {
      fontSize: 'clamp(14px, 3.5vw, 16px)',
      color: '#E5E7EB',
      marginBottom: 'clamp(12px, 3vw, 16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: 'clamp(8px, 2vw, 12px)'
    },
    pricingFeatureIcon: {
      fontSize: 'clamp(16px, 4vw, 20px)',
      color: '#10B981'
    },
    pricingButton: {
      width: '100%',
      padding: 'clamp(12px, 3vw, 16px) clamp(20px, 5vw, 32px)',
      background: 'linear-gradient(135deg, #059669, #047857)',
      color: '#ffffff',
      border: 'none',
      borderRadius: '50px',
      fontSize: 'clamp(16px, 4vw, 18px)',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginTop: 'clamp(16px, 4vw, 24px)',
      boxShadow: '0 4px 15px rgba(5, 150, 105, 0.3)'
    },
    ctaSection: {
      padding: 'clamp(40px, 10vw, 80px) clamp(16px, 4vw, 32px)',
      background: 'linear-gradient(135deg, #065F46 0%, #10B981 100%)',
      textAlign: 'center',
      color: '#ffffff'
    },
    ctaTitle: {
      fontSize: 'clamp(24px, 6vw, 36px)',
      fontWeight: '700',
      marginBottom: 'clamp(8px, 2vw, 16px)'
    },
    ctaDesc: {
      fontSize: 'clamp(16px, 4vw, 18px)',
      marginBottom: 'clamp(24px, 6vw, 32px)',
      opacity: 0.9
    },
    ctaButton: {
      padding: 'clamp(12px, 3vw, 16px) clamp(24px, 6vw, 40px)',
      background: 'rgba(255, 255, 255, 0.2)',
      color: '#ffffff',
      border: '2px solid #ffffff',
      borderRadius: '50px',
      fontSize: 'clamp(16px, 4vw, 18px)',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(17, 24, 39, 0.7)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(5px)',
      animation: 'fadeIn 0.3s ease-in-out'
    },
    modalContent: {
      background: 'rgba(31, 41, 55, 0.95)',
      borderRadius: 'clamp(10px, 2.5vw, 20px)',
      padding: 'clamp(16px, 4vw, 32px)',
      width: 'clamp(300px, 90vw, 400px)',
      maxWidth: '90%',
      border: '1px solid rgba(55, 65, 81, 0.2)',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
      transform: 'scale(1)',
      animation: 'slideIn 0.3s ease-in-out',
      maxHeight: '90vh',
      overflowY: 'auto',
      color: '#F9FAFB'
    },
    modalTitle: {
      fontSize: 'clamp(18px, 5vw, 24px)',
      fontWeight: '700',
      margin: '0 0 clamp(8px, 2vw, 16px) 0',
      color: '#F9FAFB',
      textAlign: 'center'
    },
    input: {
      width: '100%',
      padding: 'clamp(8px, 2vw, 12px) clamp(10px, 2.5vw, 16px)',
      borderRadius: '8px',
      border: '1px solid rgba(55, 65, 81, 0.2)',
      background: 'rgba(17, 24, 39, 0.8)',
      color: '#F9FAFB',
      fontSize: 'clamp(14px, 3.5vw, 16px)',
      marginBottom: 'clamp(8px, 2vw, 16px)',
      boxSizing: 'border-box'
    },
    select: {
      width: '100%',
      padding: 'clamp(8px, 2vw, 12px) clamp(10px, 2.5vw, 16px)',
      borderRadius: '8px',
      border: '1px solid rgba(55, 65, 81, 0.2)',
      background: 'rgba(31, 41, 55, 0.95)',
      color: '#F9FAFB',
      fontSize: 'clamp(14px, 3.5vw, 16px)',
      marginBottom: 'clamp(8px, 2vw, 16px)',
      boxSizing: 'border-box',
      appearance: 'none',
      backgroundImage: 'url("data:image/svg+xml;utf8,<svg fill=\"%23059669\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\"/></svg>")',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right clamp(6px, 1.5vw, 12px) top 50%',
      backgroundSize: 'clamp(12px, 3vw, 16px)'
    },
    error: {
      color: '#F87171',
      background: 'rgba(248, 113, 113, 0.1)',
      padding: 'clamp(4px, 1vw, 8px) clamp(6px, 1.5vw, 12px)',
      borderRadius: '6px',
      marginBottom: 'clamp(8px, 2vw, 16px)',
      fontSize: 'clamp(12px, 3vw, 14px)',
      border: '1px solid rgba(248, 113, 113, 0.3)'
    },
    toggleBtn: {
      width: '100%',
      padding: 'clamp(8px, 2vw, 12px)',
      background: 'transparent',
      color: '#D1D5DB',
      border: '1px solid rgba(55, 65, 81, 0.2)',
      borderRadius: '8px',
      fontSize: 'clamp(12px, 3vw, 14px)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginTop: 'clamp(6px, 1.5vw, 12px)'
    },
    policyNotification: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(17, 24, 39, 0.7)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(5px)',
      animation: 'fadeIn 0.3s ease-in-out'
    },
    policyNotificationContent: {
      background: 'rgba(31, 41, 55, 0.95)',
      borderRadius: 'clamp(10px, 2.5vw, 20px)',
      padding: 'clamp(16px, 4vw, 32px)',
      width: 'clamp(300px, 90vw, 400px)',
      maxWidth: '90%',
      border: '1px solid rgba(55, 65, 81, 0.2)',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
      textAlign: 'center',
      animation: 'slideIn 0.3s ease-in-out',
      color: '#F9FAFB'
    },
    policyNotificationTitle: {
      fontSize: 'clamp(16px, 4vw, 20px)',
      fontWeight: '700',
      marginBottom: 'clamp(8px, 2vw, 16px)',
      color: '#F9FAFB'
    },
    policyNotificationText: {
      fontSize: 'clamp(14px, 3.5vw, 16px)',
      color: '#D1D5DB',
      marginBottom: 'clamp(12px, 3vw, 24px)',
      lineHeight: '1.6'
    },
    policyNotificationLink: {
      color: '#10B981',
      textDecoration: 'underline',
      fontWeight: '600'
    },
    policyNotificationButton: {
      padding: 'clamp(8px, 2vw, 12px) clamp(16px, 4vw, 24px)',
      background: 'linear-gradient(135deg, #059669, #047857)',
      color: '#ffffff',
      border: 'none',
      borderRadius: '50px',
      fontSize: 'clamp(14px, 3.5vw, 16px)',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(5, 150, 105, 0.3)'
    },
    footerSection: {
      padding: 'clamp(40px, 10vw, 80px) clamp(16px, 4vw, 32px)',
      background: 'rgba(17, 24, 39, 0.95)',
      borderTop: '1px solid rgba(55, 65, 81, 0.2)',
      color: '#F9FAFB'
    },
    footerContainer: {
      maxWidth: '1400px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'clamp(16px, 4vw, 32px)'
    },
    footerLinks: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: 'clamp(16px, 4vw, 32px)'
    },
    footerLink: {
      color: '#D1D5DB',
      fontSize: 'clamp(14px, 3.5vw, 16px)',
      fontWeight: '600',
      textDecoration: 'none',
      transition: 'all 0.3s ease'
    }
  };

  const updatedAuthBtnStyle = {
    ...mapStyles.authBtn,
    cursor: 'pointer'
  };

  const updatedPrimaryBtnStyle = {
    ...mapStyles.primaryBtn,
    cursor: 'pointer'
  };

  const updatedMarketingBtnStyle = {
    ...mapStyles.primaryBtn,
    padding: 'clamp(8px, 2vw, 12px) clamp(16px, 4vw, 24px)',
    fontSize: 'clamp(14px, 3.5vw, 16px)',
    minWidth: 'auto',
    cursor: 'pointer',
    background: 'linear-gradient(135deg, #059669, #047857)',
    boxShadow: '0 4px 15px rgba(5, 150, 105, 0.3)'
  };

  const pricingPlans = [
    {
      id: 'basic',
      name: 'Starter',
      price: 899,
      popular: false,
      features: [
        '✅ All map types including Hiking, Cycling, Satellite & Topographic',
        '✅ High-resolution up to Zoom Level 19 for precise navigation',
        '✅ Unlimited API calls with blazing-fast response times',
         '✅ Download 25 Maps',
        '✅ Offline maps download for seamless adventures anywhere',
        '✅ Basic analytics dashboard to track usage'
      ]
    },
    {
      id: 'pro',
      name: 'Professional',
      price: 1899,
      popular: true,
      features: [
        '✅ All map types including Hiking, Cycling, Satellite & Topographic',
        '✅ High-resolution up to Zoom Level 19 for precise navigation',
       
        '✅ Priority 24/7 support with dedicated account manager',
        '✅ Offline maps download for seamless adventures anywhere',
        '✅ Download 100 Maps',
        '✅ Comprehensive analytics with AI-powered insights',
        '✅ Early access to new features & beta testing',
        
      ]
    }
  ];

  const handlePricingClick = (plan) => {
    console.log(`Selected plan: ${plan.name}`);
    setShowModal(true);
  };

  const handleCtaClick = () => {
    setShowModal(true);
  };

  return (
    <div style={mapStyles.container}>
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideIn {
          from { 
            opacity: 0; 
            transform: scale(0.95) translateY(-20px); 
          }
          to { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes rotate3D {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }

        .hover-scale:hover {
          transform: translateY(-2px) scale(1.02);
          transition: all 0.3s ease;
        }
        
        .hover-glow:hover {
          box-shadow: 0 8px 30px rgba(5, 150, 105, 0.4);
          transition: all 0.3s ease;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .feature-card:nth-child(1) { animation-delay: 0.1s; }
        .feature-card:nth-child(2) { animation-delay: 0.2s; }
        .feature-card:nth-child(3) { animation-delay: 0.3s; }
        .feature-card:nth-child(4) { animation-delay: 0.4s; }

        .review-card:nth-child(1) { animation-delay: 0.1s; }
        .review-card:nth-child(2) { animation-delay: 0.2s; }
        .review-card:nth-child(3) { animation-delay: 0.3s; }
        .review-card:nth-child(4) { animation-delay: 0.4s; }

        .logo-card {
          animation: float 3s ease-in-out infinite;
        }

        .logo-card:nth-child(even) {
          animation-delay: -1.5s;
        }

        .feature-card:hover {
          transform: translateY(-5px) rotateX(5deg);
          box-shadow: 0 8px 30px rgba(5, 150, 105, 0.2);
          transition: all 0.3s ease;
        }

        .logo-card:hover {
          transform: translateY(-5px) scale(1.05) rotateY(10deg);
          border-color: rgba(5, 150, 105, 0.5);
          transition: all 0.3s ease;
        }

        .map-type-button:hover {
          background: rgba(5, 150, 105, 0.1);
          color: #F9FAFB;
          transform: scale(1.05);
          transition: all 0.3s ease;
        }

        .nav-link:hover {
          color: #F9FAFB;
          background: rgba(5, 150, 105, 0.1);
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .footer-link:hover {
          color: #F9FAFB;
          text-decoration: underline;
          transition: all 0.3s ease;
        }

        .pricing-card:hover {
          transform: translateY(-5px) rotateX(2deg);
          box-shadow: 0 8px 30px rgba(5, 150, 105, 0.2);
          transition: all 0.3s ease;
        }

        .pricing-button:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 6px 20px rgba(5, 150, 105, 0.4);
          transition: all 0.3s ease;
        }

        .cta-button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px) scale(1.05);
          transition: all 0.3s ease;
        }

        .mapCanvas {
          transition: transform 0.5s ease;
        }

        .mapCanvas:hover {
          transform: rotateX(5deg) scale(1.02);
        }

        @media (max-width: 768px) {
          .map-grid {
            grid-template-columns: 1fr !important;
          }
          .map-type-selector {
            width: 100% !important;
            flex-wrap: wrap;
            justify-content: center !important;
            padding: clamp(4px, 1vw, 8px) !important;
            top: clamp(-70px, -15vw, -60px) !important;
          }
          .map-type-button {
            flex: 0 0 auto !important;
            min-width: clamp(60px, 20vw, 80px) !important;
            font-size: clamp(10px, 3vw, 12px) !important;
          }
          .logos-track {
            animation: scroll 10s linear infinite;
          }
          .pricing-grid {
            grid-template-columns: 1fr;
            max-width: 400px;
            margin: 0 auto;
          }
        }

        @media (max-width: 480px) {
          .nav-content {
            flex-direction: column;
            gap: 8px;
          }
          .button-group {
            flex-direction: column;
            align-items: center;
          }
          .stats-bar {
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          }
          .features-grid, .reviews-grid {
            grid-template-columns: 1fr;
          }
          .footer-links {
            flex-direction: column;
            align-items: center;
          }
        }

        .modal-close {
          position: absolute;
          top: clamp(6px, 1.5vw, 12px);
          right: clamp(8px, 2vw, 16px);
          background: none;
          border: none;
          color: #D1D5DB;
          font-size: clamp(18px, 5vw, 24px);
          cursor: pointer;
          padding: 0;
          width: clamp(24px, 6vw, 32px);
          height: clamp(24px, 6vw, 32px);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .modal-close:hover {
          background: rgba(5, 150, 105, 0.1);
          color: #F9FAFB;
          transform: rotate(90deg);
          transition: all 0.3s ease;
        }

        .policy-notification-button:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 6px 20px rgba(5, 150, 105, 0.4);
          transition: all 0.3s ease;
        }

        .primaryBtn:hover, .secondaryBtn:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 12px 30px rgba(5, 150, 105, 0.4);
          transition: all 0.3s ease;
        }
      `}</style>

      <nav style={mapStyles.nav}>
        <div style={mapStyles.navContent} className="nav-content">
          <div style={mapStyles.logo}>
            <div style={mapStyles.logoIcon}>🗺️</div>
            <h1 style={mapStyles.logoText}>GeoPulse</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 16px)' }}>
            <a href="/Documentation" style={mapStyles.navLink} className="nav-link">
              Documentation
            </a>
            <button
              onClick={() => {
                console.log('Opening modal');
                setShowModal(true);
              }}
              style={updatedAuthBtnStyle}
              className="hover-scale hover-glow"
            >
              <span>Sign In / Sign Up</span>
            </button>
          </div>
        </div>
      </nav>

      <section style={mapStyles.hero}>
        <div style={mapStyles.heroOverlay}></div>
        <div style={mapStyles.heroContainer}>
          <div style={mapStyles.heroContent}>
            <h1 style={mapStyles.heroTitle}>
              <span>Next-Gen</span>
              <br />
              <span style={mapStyles.heroGradient}>Mapping Platform</span>
            </h1>
            <p style={mapStyles.heroDesc}>
              Generate high-quality map tiles, offline maps, and geospatial data with enterprise-grade APIs. 
              Seamlessly integrated with modern GIS workflows, including adventurous maps for hiking and cycling.
            </p>
            <div style={mapStyles.buttonGroup} className="button-group">
              <button
                onClick={() => {
                  console.log('Opening modal from hero');
                  setShowModal(true);
                }}
                style={updatedPrimaryBtnStyle}
                className="hover-scale hover-glow primaryBtn"
              >
                Start Free Trial
              </button>
              <button 
                style={mapStyles.secondaryBtn}
                className="hover-scale secondaryBtn"
              >
                Watch Demo
              </button>
            </div>
          </div>

          <div style={mapStyles.mapSection}>
            <div style={mapStyles.mapGrid} className="map-grid">
              <div style={mapStyles.mapContainer}>
                <div style={mapStyles.mapHeader}>
                  <h3 style={mapStyles.mapTitle}>Live 3D Map Preview</h3>
                  <div style={mapStyles.liveIndicator}>
                    <div style={mapStyles.liveDot}></div>
                    <span style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: '#10B981' }}>Live</span>
                  </div>
                </div>
                
                <div ref={mapRef} style={mapStyles.mapCanvas} className="mapCanvas" />
                
                <div style={mapStyles.mapTypeSelector} className="map-type-selector">
                  {mapTypes.map((type) => (
                    <button
                      key={type.id}
                      style={{
                        ...mapStyles.mapTypeButton,
                        ...(basemapType === type.id ? mapStyles.mapTypeButtonActive : {})
                      }}
                      onClick={() => handleMapTypeChange(type.id)}
                      className="map-type-button"
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={mapStyles.sidePanel}>
                <div style={mapStyles.marketingCard}>
                  <h3 style={mapStyles.marketingTitle}>Why Choose GeoPulse?</h3>
                  <ul style={mapStyles.marketingList}>
                    <li style={mapStyles.marketingItem}>
                      <span style={mapStyles.marketingIcon}>🥾</span>
                      Expert Hiking Maps for Epic Adventures – Never Get Lost Again!
                    </li>
                    <li style={mapStyles.marketingItem}>
                      <span style={mapStyles.marketingIcon}>🚴</span>
                      Optimized Cycling Routes for Every Rider – Save Time & Energy
                    </li>
                    <li style={mapStyles.marketingItem}>
                      <span style={mapStyles.marketingIcon}>🛰️</span>
                      Crystal-Clear Satellite Imagery – Insights at Your Fingertips
                    </li>
                    <li style={mapStyles.marketingItem}>
                      <span style={mapStyles.marketingIcon}>🏔️</span>
                      Detailed Topographic Views for Pros – Precision for Professionals
                    </li>
                    <li style={mapStyles.marketingItem}>
                      <span style={mapStyles.marketingIcon}>🔗</span>
                      Seamless GIS Integration – Boost Your Workflow Efficiency
                    </li>
                    <li style={mapStyles.marketingItem}>
                      <span style={mapStyles.marketingIcon}>⚡</span>
                      Real-Time Data Updates – Stay Ahead with Live Intelligence
                    </li>
                  </ul>
                  <button
                    onClick={() => {
                      console.log('Opening modal from marketing');
                      setShowModal(true);
                    }}
                    style={updatedMarketingBtnStyle}
                    className="hover-scale hover-glow"
                  >
                    Get Started Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={mapStyles.trustSection}>
        <div style={mapStyles.trustContainer}>
          <div style={mapStyles.statsBar} className="stats-bar">
            <div style={mapStyles.statItem}>
              <div style={mapStyles.statNumber}>500M+</div>
              <div style={mapStyles.statLabel}>Tiles Served Monthly</div>
            </div>
            <div style={mapStyles.statItem}>
              <div style={mapStyles.statNumber}>10,000+</div>
              <div style={mapStyles.statLabel}>Active Organizations</div>
            </div>
            <div style={mapStyles.statItem}>
              <div style={mapStyles.statNumber}>99.9%</div>
              <div style={mapStyles.statLabel}>Uptime SLA</div>
            </div>
            <div style={mapStyles.statItem}>
              <div style={mapStyles.statNumber}>150+</div>
              <div style={mapStyles.statLabel}>Countries Covered</div>
            </div>
          </div>

          <section style={mapStyles.featuresSection}>
            <div style={mapStyles.featuresContainer}>
              <h2 style={mapStyles.featuresTitle}>Discover Our Premium Maps</h2>
              <div style={mapStyles.featuresGrid} className="features-grid">
                <div style={mapStyles.featureCard} className="feature-card">
                  <div style={mapStyles.featureIcon}>🥾</div>
                  <h3 style={mapStyles.featureTitle}>Hiking Maps</h3>
                  <p style={mapStyles.featureDesc}>
                    Explore trails with detailed elevation profiles, waypoints, and real-time weather integration. Perfect for adventurers seeking the ultimate outdoor experience – turn every hike into a triumph!
                  </p>
                </div>
                <div style={mapStyles.featureCard} className="feature-card">
                  <div style={mapStyles.featureIcon}>🚴</div>
                  <h3 style={mapStyles.featureTitle}>Cycling Maps</h3>
                  <p style={mapStyles.featureDesc}>
                    Navigate bike routes with traffic-avoiding paths, slope gradients, and custom route planning. Ride smarter and safer with our specialized cycling layers – elevate your cycling game today!
                  </p>
                </div>
                <div style={mapStyles.featureCard} className="feature-card">
                  <div style={mapStyles.featureIcon}>🛰️</div>
                  <h3 style={mapStyles.featureTitle}>Satellite Imagery</h3>
                  <p style={mapStyles.featureDesc}>
                    Access high-resolution satellite views for accurate land monitoring, urban planning, and environmental analysis. See the world from above like never before – unlock global insights effortlessly!
                  </p>
                </div>
                <div style={mapStyles.featureCard} className="feature-card">
                  <div style={mapStyles.featureIcon}>🏔️</div>
                  <h3 style={mapStyles.featureTitle}>Topographic Maps</h3>
                  <p style={mapStyles.featureDesc}>
                    Detailed contour line, terrain shading, and hydrological features for precise navigation in rugged landscapes. Ideal for geologists, surveyors, and outdoor enthusiasts – conquer any terrain with confidence!
                  </p>
                </div>
              </div>
            </div>
          </section>

          <h3 style={mapStyles.trustTitle}>Trusted by Leading Organizations Worldwide</h3>
          <div style={mapStyles.logosContainer}>
            <div style={mapStyles.logosTrack} className="logos-track">
              {companies.map((company, index) => (
                <div key={`logo-1-${index}`} style={mapStyles.logoCard} className="logo-card">
                  <div style={{...mapStyles.companyLogo, color: company.color}}>
                    {company.icon}
                  </div>
                  <span style={mapStyles.companyName}>{company.name}</span>
                </div>
              ))}
              {companies.map((company, index) => (
                <div key={`logo-2-${index}`} style={mapStyles.logoCard} className="logo-card">
                  <div style={{...mapStyles.companyLogo, color: company.color}}>
                    {company.icon}
                  </div>
                  <span style={mapStyles.companyName}>{company.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={mapStyles.reviewsSection}>
        <div style={mapStyles.reviewsContainer}>
          <h2 style={mapStyles.reviewsTitle}>What Our Users Say – Join Thousands of Satisfied Customers</h2>
          <div style={mapStyles.reviewsGrid} className="reviews-grid">
            <div style={mapStyles.reviewCard} className="review-card">
              <div style={mapStyles.reviewHeader}>
                <div style={mapStyles.reviewAvatar}></div>
                <span style={mapStyles.reviewName}>Alvarez</span>
              </div>
              <div style={mapStyles.reviewStars}>★★★★★</div>
              <p style={mapStyles.reviewText}>
                "I used the hiking maps for a weekend trip in the Rockies, and the elevation profiles were incredibly helpful for planning our route. The real-time weather updates kept us prepared. GeoPulse changed our adventure game!"
              </p>
            </div>
            <div style={mapStyles.reviewCard} className="review-card">
              <div style={mapStyles.reviewHeader}>
                <div style={mapStyles.reviewAvatar}></div>
                <span style={mapStyles.reviewName}>Liam</span>
              </div>
              <div style={mapStyles.reviewStars}>★★★★☆</div>
              <p style={mapStyles.reviewText}>
                "The cycling routes are great for finding less busy roads, but I wish there were more options for customizing waypoints. Still, it’s been a solid tool for my daily rides – highly recommend for commuters!"
              </p>
            </div>
            <div style={mapStyles.reviewCard} className="review-card">
              <div style={mapStyles.reviewHeader}>
                <div style={mapStyles.reviewAvatar}></div>
                <span style={mapStyles.reviewName}>John Doe</span>
              </div>
              <div style={mapStyles.reviewStars}>★★★★★</div>
              <p style={mapStyles.reviewText}>
                "As a surveyor, the topographic maps are a lifesaver. The contour lines and terrain shading make it easy to analyze sites remotely before heading out. Saved us hours on every project!"
              </p>
            </div>
            <div style={mapStyles.reviewCard} className="review-card">
              <div style={mapStyles.reviewHeader}>
                <div style={mapStyles.reviewAvatar}></div>
                <span style={mapStyles.reviewName}>Sam</span>
              </div>
              <div style={mapStyles.reviewStars}>★★★★☆</div>
              <p style={mapStyles.reviewText}>
                "The satellite imagery is sharp and great for urban planning projects. Loading times can be a bit slow on mobile, but overall, it’s a reliable platform that delivers real value."
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={mapStyles.pricingSection}>
        <div style={mapStyles.pricingContainer}>
          <h2 style={mapStyles.pricingTitle}>Choose Your Plan – Unlock Unlimited Possibilities</h2>
          <p style={mapStyles.pricingSubtitle}>Select the perfect package for your mapping needs. Annual billing saves you 20% – start today and transform your projects!</p>
          <div style={mapStyles.pricingGrid} className="pricing-grid">
            {pricingPlans.map((plan, index) => (
              <div
                key={plan.id}
                style={{
                  ...mapStyles.pricingCard,
                  ...(plan.popular ? mapStyles.pricingCardPopular : {}),
                  animationDelay: `${index * 0.1}s`
                }}
                className="pricing-card"
              >
                {plan.popular && (
                  <div style={{ 
                    position: 'absolute', 
                    top: '-10px', 
                    left: '50%', 
                    transform: 'translateX(-50%)', 
                    background: '#10B981', 
                    color: '#ffffff', 
                    padding: '4px 16px', 
                    borderRadius: '20px', 
                    fontSize: 'clamp(12px, 3vw, 14px)', 
                    fontWeight: '600',
                    boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)'
                  }}>
                    Most Popular – 70% Choose This!
                  </div>
                )}
                <div style={mapStyles.pricingHeader}>
                  <h3 style={mapStyles.pricingPlan}>{plan.name}</h3>
                  <div style={mapStyles.pricingPrice}>${plan.price}</div>
                  <p style={mapStyles.pricingPeriod}>billed annually (Save 20%)</p>
                </div>
                <ul style={mapStyles.pricingFeatures}>
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} style={mapStyles.pricingFeature}>
                      <span style={mapStyles.pricingFeatureIcon} dangerouslySetInnerHTML={{__html: "&#10004;"}}></span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handlePricingClick(plan)}
                  style={mapStyles.pricingButton}
                  className="pricing-button hover-glow"
                >
                  Get {plan.name} Now – Limited Time Offer!
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={mapStyles.ctaSection}>
        <div style={mapStyles.pricingContainer}>
          <h2 style={mapStyles.ctaTitle}>Ready to Revolutionize Your Mapping?</h2>
          <p style={mapStyles.ctaDesc}>Join 10,000+ organizations powering their success with GeoPulse. Start your free trial today – no credit card required!</p>
          <button
            onClick={handleCtaClick}
            style={mapStyles.ctaButton}
            className="cta-button hover-glow"
          >
            Start Free Trial Now
          </button>
        </div>
      </section>

      <section style={mapStyles.footerSection}>
        <div style={mapStyles.footerContainer}>
          <div style={mapStyles.footerLinks} className="footer-links">
            <a href="/terms" style={mapStyles.footerLink} className="footer-link">Terms of Service</a>
            <a href="/cancel" style={mapStyles.footerLink} className="footer-link">Cancellation & Refund Policy</a>
            <a href="/shipping" style={mapStyles.footerLink} className="footer-link">Shipping Policy</a>
            <a href="/contact" style={mapStyles.footerLink} className="footer-link">Contact Us</a>
            <a href="/PrivacyPolicy" style={mapStyles.footerLink} className="footer-link">Privacy Policy</a>
          </div>
          <p style={{ color: '#9CA3AF', fontSize: 'clamp(12px, 3vw, 14px)', margin: 0 }}>© 2025 GeoPulse. All rights reserved.</p>
        </div>
      </section>

      {showPolicyNotification && (
        <div style={mapStyles.policyNotification}>
          <div style={mapStyles.policyNotificationContent}>
            <h3 style={mapStyles.policyNotificationTitle}>Privacy Policy Agreement</h3>
            <p style={mapStyles.policyNotificationText}>
              We use cookies to enhance your experience on GeoPulse. By continuing, you agree to our{' '}
              <a href="/PrivacyPolicy" style={mapStyles.policyNotificationLink}>Privacy Policy</a>.
            </p>
            <button
              onClick={handlePolicyAgree}
              style={mapStyles.policyNotificationButton}
              className="policy-notification-button"
            >
              Agree & Continue
            </button>
          </div>
        </div>
      )}

      <AuthModal 
        showModal={showModal} 
        setShowModal={setShowModal} 
        mapStyles={mapStyles} 
      />

      <ChatQuery mapStyles={mapStyles} />
    </div>
  );
}
