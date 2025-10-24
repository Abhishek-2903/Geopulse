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
      loadModules(['esri/Map', 'esri/views/MapView', 'esri/layers/TileLayer'], { css: true })
        .then(([ArcGISMap, MapView, TileLayer]) => {
          const map = new ArcGISMap({
            basemap: basemapType === 'outdoor' ? {
              baseLayers: [
                new TileLayer({
                  url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer'
                })
              ]
            } : basemapType
          });

          const view = new MapView({
            container: mapRef.current,
            map: map,
            center: [currentLocation.lng, currentLocation.lat],
            zoom: currentLocation.zoom
          });

          console.log(`Loading basemap: ${basemapType}`);

          return () => {
            if (view) {
              view.destroy();
            }
          };
        })
        .catch((err) => console.error('Error loading map:', err));
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
    { icon: '🏭', name: 'MapIndustries', color: '#333333' },
    { icon: '🎓', name: 'GeoUniversity', color: '#000000' },
    { icon: '🏛️', name: 'CityGov', color: '#333333' },
    { icon: '🚁', name: 'DroneLogistics', color: '#000000' },
    { icon: '🏗️', name: 'BuildPro', color: '#333333' }
  ];

  const handlePolicyAgree = () => {
    localStorage.setItem('privacyPolicyAgreed', 'true');
    setShowPolicyNotification(false);
  };

  const mapStyles = {
    container: {
      minHeight: '100vh',
      background: '#ffffff',
      color: '#000000',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    },
    nav: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(0, 0, 0, 0.2)',
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
      background: '#000000',
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
      color: '#000000'
    },
    authBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: 'clamp(8px, 2vw, 12px)',
      padding: 'clamp(8px, 2vw, 12px) clamp(16px, 4vw, 24px)',
      background: '#000000',
      color: '#ffffff',
      border: 'none',
      borderRadius: '50px',
      fontSize: 'clamp(14px, 4vw, 16px)',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
    },
    navLink: {
      padding: 'clamp(8px, 2vw, 12px) clamp(16px, 4vw, 24px)',
      color: '#333333',
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
      paddingRight: 'clamp(16px, 4vw, 32px)'
    },
    heroContainer: {
      maxWidth: '1400px',
      margin: '0 auto'
    },
    heroContent: {
      textAlign: 'center',
      marginBottom: 'clamp(40px, 10vw, 80px)'
    },
    heroTitle: {
      fontSize: 'clamp(36px, 8vw, 72px)',
      fontWeight: '900',
      lineHeight: '1.1',
      margin: '0 0 clamp(16px, 4vw, 32px) 0',
      letterSpacing: '-2px',
      color: '#000000'
    },
    heroGradient: {
      color: '#000000'
    },
    heroDesc: {
      fontSize: 'clamp(16px, 4vw, 20px)',
      color: '#333333',
      maxWidth: '900px',
      margin: '0 auto clamp(24px, 6vw, 48px)',
      lineHeight: '1.6'
    },
    buttonGroup: {
      display: 'flex',
      gap: 'clamp(12px, 3vw, 24px)',
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginBottom: 'clamp(40px, 10vw, 80px)'
    },
    primaryBtn: {
      padding: 'clamp(12px, 3vw, 18px) clamp(20px, 5vw, 40px)',
      background: '#000000',
      color: '#ffffff',
      border: 'none',
      borderRadius: '50px',
      fontSize: 'clamp(16px, 4vw, 20px)',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      minWidth: 'clamp(180px, 40vw, 220px)',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)'
    },
    secondaryBtn: {
      padding: 'clamp(12px, 3vw, 18px) clamp(20px, 5vw, 40px)',
      background: 'transparent',
      color: '#000000',
      border: '2px solid rgba(0, 0, 0, 0.3)',
      borderRadius: '50px',
      fontSize: 'clamp(16px, 4vw, 20px)',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      minWidth: 'clamp(180px, 40vw, 220px)'
    },
    mapSection: {
      background: 'rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(20px)',
      borderRadius: 'clamp(16px, 4vw, 32px)',
      padding: 'clamp(20px, 5vw, 40px)',
      border: '1px solid rgba(0, 0, 0, 0.2)'
    },
    mapGrid: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
      gap: 'clamp(16px, 4vw, 32px)',
      alignItems: 'start'
    },
    mapContainer: {
      background: 'rgba(255, 255, 255, 0.8)',
      borderRadius: 'clamp(12px, 3vw, 24px)',
      padding: 'clamp(12px, 3vw, 24px)',
      border: '1px solid rgba(0, 0, 0, 0.2)',
      position: 'relative',
      overflow: 'hidden'
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
      color: '#000000'
    },
    liveIndicator: {
      display: 'flex',
      alignItems: 'center',
      gap: 'clamp(4px, 1vw, 8px)'
    },
    liveDot: {
      width: 'clamp(8px, 2vw, 12px)',
      height: 'clamp(8px, 2vw, 12px)',
      background: '#30b116ff',
      borderRadius: '50%',
      animation: 'pulse 2s infinite'
    },
    mapCanvas: {
      width: '100%',
      height: 'clamp(300px, 50vw, 400px)',
      borderRadius: 'clamp(8px, 2vw, 16px)',
      border: '1px solid rgba(0, 0, 0, 0.2)'
    },
    coordinates: {
      position: 'absolute',
      top: 'clamp(8px, 2vw, 16px)',
      left: 'clamp(8px, 2vw, 16px)',
      background: 'rgba(255, 255, 255, 0.7)',
      padding: 'clamp(4px, 1vw, 8px) clamp(8px, 2vw, 16px)',
      borderRadius: '20px',
      fontSize: 'clamp(12px, 3vw, 14px)',
      backdropFilter: 'blur(10px)',
      color: '#000000'
    },
    zoomLevel: {
      position: 'absolute',
      bottom: 'clamp(8px, 2vw, 16px)',
      right: 'clamp(8px, 2vw, 16px)',
      background: 'rgba(255, 255, 255, 0.7)',
      padding: 'clamp(4px, 1vw, 8px) clamp(8px, 2vw, 16px)',
      borderRadius: '20px',
      fontSize: 'clamp(12px, 3vw, 14px)',
      backdropFilter: 'blur(10px)',
      color: '#000000'
    },
    mapTypeSelector: {
      position: 'absolute',
      top: 'clamp(3px, 1vw, 3px)',
      right: 'clamp(16px, 4vw, 82px)',
      background: 'hsla(90, 22%, 78%, 0.95)',
      borderRadius: '20px',
      padding: 'clamp(5px, 1vw, 10px)',
      border: '1px solid rgba(0, 0, 0, 0.2)',
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
      color: '#333333',
      fontSize: 'clamp(12px, 3vw, 14px)',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textAlign: 'center'
    },
    mapTypeButtonActive: {
      background: '#000000',
      color: '#ffffff'
    },
    sidePanel: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'clamp(12px, 3vw, 24px)'
    },
    marketingCard: {
      background: 'rgba(255, 255, 255, 0.8)',
      borderRadius: 'clamp(10px, 2.5vw, 20px)',
      padding: 'clamp(12px, 3vw, 24px)',
      border: '1px solid rgba(0, 0, 0, 0.2)',
      textAlign: 'center'
    },
    marketingTitle: {
      fontSize: 'clamp(18px, 5vw, 24px)',
      fontWeight: '700',
      marginBottom: 'clamp(8px, 2vw, 16px)',
      color: '#000000'
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
      color: '#000000'
    },
    marketingIcon: {
      fontSize: 'clamp(16px, 4vw, 20px)'
    },
    trustSection: {
      padding: 'clamp(40px, 10vw, 80px) clamp(16px, 4vw, 32px)',
      background: 'rgba(0, 0, 0, 0.05)'
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
      background: 'rgba(255, 255, 255, 0.8)',
      borderRadius: 'clamp(12px, 3vw, 24px)',
      border: '1px solid rgba(0, 0, 0, 0.2)'
    },
    statItem: {
      textAlign: 'center'
    },
    statNumber: {
      fontSize: 'clamp(32px, 8vw, 48px)',
      fontWeight: '900',
      color: '#000000',
      marginBottom: 'clamp(4px, 1vw, 8px)'
    },
    statLabel: {
      fontSize: 'clamp(14px, 3.5vw, 16px)',
      color: '#333333'
    },
    trustTitle: {
      textAlign: 'center',
      fontSize: 'clamp(24px, 6vw, 36px)',
      fontWeight: '700',
      marginBottom: 'clamp(10px, 2.5vw, 20px)',
      color: '#000000'
    },
    logosContainer: {
      overflow: 'hidden',
      marginBottom: 'clamp(20px, 5vw, 40px)', // Reduced gap
      position: 'relative'
    },
    logosTrack: {
      display: 'flex',
      gap: 'clamp(12px, 3vw, 24px)',
      animation: 'scroll 7.6s linear infinite'
    },
    logoCard: {
      background: 'rgba(255, 255, 255, 0.8)',
      borderRadius: 'clamp(8px, 2vw, 16px)',
      padding: 'clamp(16px, 4vw, 32px) clamp(12px, 3vw, 24px)',
      border: '1px solid rgba(0, 0, 0, 0.2)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'clamp(8px, 2vw, 16px)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      minWidth: 'clamp(150px, 40vw, 200px)',
      flexShrink: 0
    },
    companyLogo: {
      fontSize: 'clamp(32px, 8vw, 48px)',
      opacity: 0.9,
      transition: 'all 0.3s ease'
    },
    companyName: {
      fontSize: 'clamp(14px, 3.5vw, 16px)',
      fontWeight: '600',
      color: '#333333'
    },
    badgesSection: {
      marginTop: 'clamp(40px, 10vw, 80px)'
    },
    badgesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: 'clamp(12px, 3vw, 24px)'
    },
    badge: {
      background: 'rgba(255, 255, 255, 0.8)',
      borderRadius: 'clamp(8px, 2vw, 16px)',
      padding: 'clamp(16px, 4vw, 32px) clamp(12px, 3vw, 24px)',
      border: '1px solid rgba(0, 0, 0, 0.2)',
      textAlign: 'center',
      transition: 'all 0.3s ease'
    },
    badgeIcon: {
      fontSize: 'clamp(32px, 8vw, 48px)',
      marginBottom: 'clamp(8px, 2vw, 16px)',
      color: '#000000'
    },
    badgeText: {
      fontSize: 'clamp(16px, 4vw, 18px)',
      fontWeight: '600',
      color: '#000000'
    },
    badgeSubtext: {
      fontSize: 'clamp(12px, 3vw, 14px)',
      color: '#666666',
      marginTop: 'clamp(4px, 1vw, 8px)'
    },
    featuresSection: {
      padding: 'clamp(40px, 10vw, 80px) clamp(16px, 4vw, 32px)',
      background: 'rgba(0, 0, 0, 0.05)'
    },
    featuresContainer: {
      maxWidth: '1400px',
      margin: '0 auto'
    },
    featuresTitle: {
      textAlign: 'center',
      fontSize: 'clamp(24px, 6vw, 36px)',
      marginBottom: 'clamp(24px, 6vw, 48px)',
      color: '#000000'
    },
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: 'clamp(16px, 4vw, 32px)'
    },
    featureCard: {
      background: 'rgba(255, 255, 255, 0.8)',
      borderRadius: 'clamp(10px, 2.5vw, 20px)',
      padding: 'clamp(16px, 4vw, 32px)',
      border: '1px solid rgba(0, 0, 0, 0.2)',
      textAlign: 'center',
      transition: 'all 0.3s ease'
    },
    featureIcon: {
      fontSize: 'clamp(32px, 8vw, 48px)',
      marginBottom: 'clamp(8px, 2vw, 16px)',
      color: '#000000'
    },
    featureTitle: {
      fontSize: 'clamp(18px, 5vw, 24px)',
      fontWeight: '700',
      marginBottom: 'clamp(8px, 2vw, 16px)',
      color: '#000000'
    },
    featureDesc: {
      fontSize: 'clamp(14px, 3.5vw, 16px)',
      color: '#333333',
      lineHeight: '1.6'
    },
    reviewsSection: {
      padding: 'clamp(40px, 10vw, 80px) clamp(16px, 4vw, 32px)',
      background: 'rgba(0, 0, 0, 0.05)'
    },
    reviewsContainer: {
      maxWidth: '1400px',
      margin: '0 auto'
    },
    reviewsTitle: {
      textAlign: 'center',
      fontSize: 'clamp(24px, 6vw, 36px)',
      marginBottom: 'clamp(24px, 6vw, 48px)',
      color: '#000000'
    },
    reviewsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: 'clamp(16px, 4vw, 32px)'
    },
    reviewCard: {
      background: 'rgba(255, 255, 255, 0.8)',
      borderRadius: 'clamp(10px, 2.5vw, 20px)',
      padding: 'clamp(16px, 4vw, 32px)',
      border: '1px solid rgba(0, 0, 0, 0.2)'
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
      background: '#000000'
    },
    reviewName: {
      fontSize: 'clamp(16px, 4vw, 18px)',
      fontWeight: '600',
      color: '#000000'
    },
    reviewStars: {
      color: '#000000',
      marginBottom: 'clamp(8px, 2vw, 16px)'
    },
    reviewText: {
      color: '#333333',
      lineHeight: '1.6',
      fontSize: 'clamp(14px, 3.5vw, 16px)'
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(255, 255, 255, 0.7)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(5px)',
      animation: 'fadeIn 0.3s ease-in-out'
    },
    modalContent: {
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: 'clamp(10px, 2.5vw, 20px)',
      padding: 'clamp(16px, 4vw, 32px)',
      width: 'clamp(300px, 90vw, 400px)',
      maxWidth: '90%',
      border: '1px solid rgba(0, 0, 0, 0.2)',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      transform: 'scale(1)',
      animation: 'slideIn 0.3s ease-in-out',
      maxHeight: '90vh',
      overflowY: 'auto'
    },
    modalTitle: {
      fontSize: 'clamp(18px, 5vw, 24px)',
      fontWeight: '700',
      margin: '0 0 clamp(8px, 2vw, 16px) 0',
      color: '#000000',
      textAlign: 'center'
    },
    input: {
      width: '100%',
      padding: 'clamp(8px, 2vw, 12px) clamp(10px, 2.5vw, 16px)',
      borderRadius: '8px',
      border: '1px solid rgba(0, 0, 0, 0.2)',
      background: 'rgba(0, 0, 0, 0.05)',
      color: '#000000',
      fontSize: 'clamp(14px, 3.5vw, 16px)',
      marginBottom: 'clamp(8px, 2vw, 16px)',
      boxSizing: 'border-box'
    },
    select: {
      width: '100%',
      padding: 'clamp(8px, 2vw, 12px) clamp(10px, 2.5vw, 16px)',
      borderRadius: '8px',
      border: '1px solid rgba(0, 0, 0, 0.2)',
      background: 'rgba(255, 255, 255, 0.95)',
      color: '#000000',
      fontSize: 'clamp(14px, 3.5vw, 16px)',
      marginBottom: 'clamp(8px, 2vw, 16px)',
      boxSizing: 'border-box',
      appearance: 'none',
      backgroundImage: 'url("data:image/svg+xml;utf8,<svg fill=\"black\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\"/></svg>")',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right clamp(6px, 1.5vw, 12px) top 50%',
      backgroundSize: 'clamp(12px, 3vw, 16px)'
    },
    error: {
      color: '#000000',
      background: 'rgba(0, 0, 0, 0.1)',
      padding: 'clamp(4px, 1vw, 8px) clamp(6px, 1.5vw, 12px)',
      borderRadius: '6px',
      marginBottom: 'clamp(8px, 2vw, 16px)',
      fontSize: 'clamp(12px, 3vw, 14px)',
      border: '1px solid rgba(0, 0, 0, 0.3)'
    },
    toggleBtn: {
      width: '100%',
      padding: 'clamp(8px, 2vw, 12px)',
      background: 'transparent',
      color: '#333333',
      border: '1px solid rgba(0, 0, 0, 0.2)',
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
      background: 'rgba(255, 255, 255, 0.7)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(5px)',
      animation: 'fadeIn 0.3s ease-in-out'
    },
    policyNotificationContent: {
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: 'clamp(10px, 2.5vw, 20px)',
      padding: 'clamp(16px, 4vw, 32px)',
      width: 'clamp(300px, 90vw, 400px)',
      maxWidth: '90%',
      border: '1px solid rgba(0, 0, 0, 0.2)',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
      textAlign: 'center',
      animation: 'slideIn 0.3s ease-in-out'
    },
    policyNotificationTitle: {
      fontSize: 'clamp(16px, 4vw, 20px)',
      fontWeight: '700',
      marginBottom: 'clamp(8px, 2vw, 16px)',
      color: '#000000'
    },
    policyNotificationText: {
      fontSize: 'clamp(14px, 3.5vw, 16px)',
      color: '#333333',
      marginBottom: 'clamp(12px, 3vw, 24px)',
      lineHeight: '1.6'
    },
    policyNotificationLink: {
      color: '#000000',
      textDecoration: 'underline',
      fontWeight: '600'
    },
    policyNotificationButton: {
      padding: 'clamp(8px, 2vw, 12px) clamp(16px, 4vw, 24px)',
      background: '#000000',
      color: '#ffffff',
      border: 'none',
      borderRadius: '50px',
      fontSize: 'clamp(14px, 3.5vw, 16px)',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
    },
    footerSection: {
      padding: 'clamp(40px, 10vw, 80px) clamp(16px, 4vw, 32px)',
      background: 'rgba(0, 0, 0, 0.05)',
      borderTop: '1px solid rgba(0, 0, 0, 0.2)'
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
      color: '#333333',
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
    cursor: 'pointer'
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
        
        .hover-scale:hover {
          transform: translateY(-2px) scale(1.02);
        }
        
        .hover-glow:hover {
          boxShadow: 0 8px 30px rgba(0, 0, 0, 0.4);
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .feature-card:hover {
          transform: translateY(-5px);
          boxShadow: 0 8px 30px rgba(0, 0, 0, 0.4);
        }

        .logo-card:hover {
          transform: translateY(-5px) scale(1.05);
          border-color: rgba(0, 0, 0, 0.5);
        }

        .badge-card:hover {
          transform: translateY(-5px);
          border-color: rgba(0, 0, 0, 0.5);
        }

        .map-type-button:hover {
          background: rgba(0, 0, 0, 0.1);
          color: #000000;
        }

        .nav-link:hover {
          color: #000000;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 8px;
        }

        .footer-link:hover {
          color: #000000;
          text-decoration: underline;
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
          .features-grid, .reviews-grid, .badges-grid {
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
          color: #333333;
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
          background: rgba(0, 0, 0, 0.1);
          color: #000000;
        }

        .policy-notification-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
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
                className="hover-scale hover-glow"
              >
                Start Free Trial
              </button>
              <button 
                style={mapStyles.secondaryBtn}
                className="hover-scale"
              >
                Watch Demo
              </button>
            </div>
          </div>

          <div style={mapStyles.mapSection}>
            <div style={mapStyles.mapGrid} className="map-grid">
              <div style={mapStyles.mapContainer}>
                <div style={mapStyles.mapHeader}>
                  <h3 style={mapStyles.mapTitle}>Live Map Preview</h3>
                  <div style={mapStyles.liveIndicator}>
                    <div style={mapStyles.liveDot}></div>
                    <span style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: '#239d4eff' }}>Live</span>
                  </div>
                </div>
                
                <div ref={mapRef} style={mapStyles.mapCanvas} />
                
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
                  <h3 style={mapStyles.marketingTitle}>Why GeoPulse?</h3>
                  <ul style={mapStyles.marketingList}>
                    <li style={mapStyles.marketingItem}>
                      <span style={mapStyles.marketingIcon}>🥾</span>
                      Expert Hiking Maps for Epic Adventures
                    </li>
                    <li style={mapStyles.marketingItem}>
                      <span style={mapStyles.marketingIcon}>🚴</span>
                      Optimized Cycling Routes for Every Rider
                    </li>
                    <li style={mapStyles.marketingItem}>
                      <span style={mapStyles.marketingIcon}>🛰️</span>
                      Crystal-Clear Satellite Imagery
                    </li>
                    <li style={mapStyles.marketingItem}>
                      <span style={mapStyles.marketingIcon}>🏔️</span>
                      Detailed Topographic Views for Pros
                    </li>
                    <li style={mapStyles.marketingItem}>
                      <span style={mapStyles.marketingIcon}>🔗</span>
                      Seamless GIS Integration
                    </li>
                    <li style={mapStyles.marketingItem}>
                      <span style={mapStyles.marketingIcon}>⚡</span>
                      Real-Time Data Updates
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
                    Explore trails with detailed elevation profiles, waypoints, and real-time weather integration. Perfect for adventurers seeking the ultimate outdoor experience.
                  </p>
                </div>
                <div style={mapStyles.featureCard} className="feature-card">
                  <div style={mapStyles.featureIcon}>🚴</div>
                  <h3 style={mapStyles.featureTitle}>Cycling Maps</h3>
                  <p style={mapStyles.featureDesc}>
                    Navigate bike routes with traffic-avoiding paths, slope gradients, and custom route planning. Ride smarter and safer with our specialized cycling layers.
                  </p>
                </div>
                <div style={mapStyles.featureCard} className="feature-card">
                  <div style={mapStyles.featureIcon}>🛰️</div>
                  <h3 style={mapStyles.featureTitle}>Satellite Imagery</h3>
                  <p style={mapStyles.featureDesc}>
                    Access high-resolution satellite views for accurate land monitoring, urban planning, and environmental analysis. See the world from above like never before.
                  </p>
                </div>
                <div style={mapStyles.featureCard} className="feature-card">
                  <div style={mapStyles.featureIcon}>🏔️</div>
                  <h3 style={mapStyles.featureTitle}>Topographic Maps</h3>
                  <p style={mapStyles.featureDesc}>
                    Detailed contour line, terrain shading, and hydrological features for precise navigation in rugged landscapes. Ideal for geologists, surveyors, and outdoor enthusiasts.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <h3 style={mapStyles.trustTitle}>Trusted by Leading Organizations</h3>
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
          <h2 style={mapStyles.reviewsTitle}>What Our Users Say</h2>
          <div style={mapStyles.reviewsGrid} className="reviews-grid">
            <div style={mapStyles.reviewCard}>
              <div style={mapStyles.reviewHeader}>
                <div style={mapStyles.reviewAvatar}></div>
                <span style={mapStyles.reviewName}>Alvarez</span>
              </div>
              <div style={mapStyles.reviewStars}>★★★★★</div>
              <p style={mapStyles.reviewText}>
                I used the hiking maps for a weekend trip in the Rockies, and the elevation profiles were incredibly helpful for planning our route. The real-time weather updates kept us prepared.
              </p>
            </div>
            <div style={mapStyles.reviewCard}>
              <div style={mapStyles.reviewHeader}>
                <div style={mapStyles.reviewAvatar}></div>
                <span style={mapStyles.reviewName}>Liam </span>
              </div>
              <div style={mapStyles.reviewStars}>★★★★☆</div>
              <p style={mapStyles.reviewText}>
                The cycling routes are great for finding less busy roads, but I wish there were more options for customizing waypoints. Still, it’s been a solid tool for my daily rides.
              </p>
            </div>
            <div style={mapStyles.reviewCard}>
              <div style={mapStyles.reviewHeader}>
                <div style={mapStyles.reviewAvatar}></div>
                <span style={mapStyles.reviewName}>John Doe</span>
              </div>
              <div style={mapStyles.reviewStars}>★★★★★</div>
              <p style={mapStyles.reviewText}>
                As a surveyor, the topographic maps are a lifesaver. The contour lines and terrain shading make it easy to analyze sites remotely before heading out.
              </p>
            </div>
            <div style={mapStyles.reviewCard}>
              <div style={mapStyles.reviewHeader}>
                <div style={mapStyles.reviewAvatar}></div>
                <span style={mapStyles.reviewName}>Ethan</span>
              </div>
              <div style={mapStyles.reviewStars}>★★★★☆</div>
              <p style={mapStyles.reviewText}>
                The satellite imagery is sharp and great for urban planning projects. Loading times can be a bit slow on mobile, but overall, it’s a reliable platform.
              </p>
            </div>
          </div>
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
              Agree
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
