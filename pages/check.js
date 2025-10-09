import { useState, useEffect, useRef } from 'react';
import { loadModules } from 'esri-loader';
import AuthModal from './AuthModal';

export default function Home() {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({
    lat: 40.7128,
    lng: -74.0060,
    zoom: 12
  });
  const mapRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMapLoaded(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (mapRef.current && mapLoaded) {
      loadModules(['esri/Map', 'esri/views/MapView'], { css: true })
        .then(([ArcGISMap, MapView]) => {
          const map = new ArcGISMap({
            basemap: 'topo-vector'
          });

          new MapView({
            container: mapRef.current,
            map: map,
            center: [currentLocation.lng, currentLocation.lat],
            zoom: currentLocation.zoom
          });
        })
        .catch((err) => console.error(err));
    }
  }, [mapLoaded]);

  const mapStyles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    },
    nav: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: 'rgba(15, 15, 35, 0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '16px 32px'
    },
    navContent: {
      maxWidth: '1400px',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    logoIcon: {
      width: '48px',
      height: '48px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px'
    },
    logoText: {
      fontSize: '28px',
      fontWeight: '800',
      margin: 0,
      background: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    authBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 24px',
      background: 'white',
      color: '#333',
      border: 'none',
      borderRadius: '50px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: isLoading ? 'not-allowed' : 'pointer',
      transition: 'all 0.3s ease',
      opacity: isLoading ? 0.7 : 1,
      transform: 'translateY(0)',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
    },
    hero: {
      paddingTop: '120px',
      paddingBottom: '80px',
      paddingLeft: '32px',
      paddingRight: '32px'
    },
    heroContainer: {
      maxWidth: '1400px',
      margin: '0 auto'
    },
    heroContent: {
      textAlign: 'center',
      marginBottom: '80px'
    },
    heroTitle: {
      fontSize: 'clamp(48px, 8vw, 96px)',
      fontWeight: '900',
      lineHeight: '1.1',
      margin: '0 0 32px 0',
      letterSpacing: '-2px'
    },
    heroGradient: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    heroDesc: {
      fontSize: '24px',
      color: '#b0b0b0',
      maxWidth: '900px',
      margin: '0 auto 48px',
      lineHeight: '1.6'
    },
    buttonGroup: {
      display: 'flex',
      gap: '24px',
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginBottom: '80px'
    },
    primaryBtn: {
      padding: '18px 40px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '50px',
      fontSize: '20px',
      fontWeight: '700',
      cursor: isLoading ? 'not-allowed' : 'pointer',
      transition: 'all 0.3s ease',
      minWidth: '220px',
      opacity: isLoading ? 0.7 : 1,
      transform: 'translateY(0)',
      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
    },
    secondaryBtn: {
      padding: '18px 40px',
      background: 'transparent',
      color: 'white',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '50px',
      fontSize: '20px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      minWidth: '220px'
    },
    mapSection: {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(20px)',
      borderRadius: '32px',
      padding: '40px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
    },
    mapGrid: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '32px',
      alignItems: 'start'
    },
    mapContainer: {
      background: 'rgba(15, 15, 35, 0.8)',
      borderRadius: '24px',
      padding: '24px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      position: 'relative',
      overflow: 'hidden'
    },
    mapHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    },
    mapTitle: {
      fontSize: '20px',
      fontWeight: '700',
      margin: 0
    },
    liveIndicator: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    liveDot: {
      width: '12px',
      height: '12px',
      background: '#00ff88',
      borderRadius: '50%',
      animation: 'pulse 2s infinite'
    },
    mapCanvas: {
      width: '100%',
      height: '400px',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    coordinates: {
      position: 'absolute',
      top: '16px',
      left: '16px',
      background: 'rgba(0, 0, 0, 0.7)',
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '14px',
      backdropFilter: 'blur(10px)'
    },
    zoomLevel: {
      position: 'absolute',
      bottom: '16px',
      right: '16px',
      background: 'rgba(0, 0, 0, 0.7)',
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '14px',
      backdropFilter: 'blur(10px)'
    },
    sidePanel: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    },
    marketingCard: {
      background: 'rgba(15, 15, 35, 0.8)',
      borderRadius: '20px',
      padding: '24px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      textAlign: 'center'
    },
    marketingTitle: {
      fontSize: '24px',
      fontWeight: '700',
      marginBottom: '16px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    marketingList: {
      listStyleType: 'none',
      padding: 0,
      margin: '0 0 24px 0',
      textAlign: 'left'
    },
    marketingItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '12px',
      fontSize: '16px'
    },
    marketingIcon: {
      fontSize: '20px'
    },
    featuresSection: {
      padding: '80px 32px',
      background: 'rgba(255, 255, 255, 0.02)'
    },
    featuresContainer: {
      maxWidth: '1400px',
      margin: '0 auto'
    },
    featuresTitle: {
      textAlign: 'center',
      fontSize: '36px',
      marginBottom: '48px'
    },
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '32px'
    },
    featureCard: {
      background: 'rgba(15, 15, 35, 0.8)',
      borderRadius: '20px',
      padding: '32px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      textAlign: 'center',
      transition: 'all 0.3s ease'
    },
    featureIcon: {
      fontSize: '48px',
      marginBottom: '16px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    featureTitle: {
      fontSize: '24px',
      fontWeight: '700',
      marginBottom: '16px'
    },
    featureDesc: {
      fontSize: '16px',
      color: '#b0b0b0',
      lineHeight: '1.6'
    },
    reviewsSection: {
      padding: '80px 32px',
      background: 'rgba(255, 255, 255, 0.02)'
    },
    reviewsContainer: {
      maxWidth: '1400px',
      margin: '0 auto'
    },
    reviewsTitle: {
      textAlign: 'center',
      fontSize: '36px',
      marginBottom: '48px'
    },
    reviewsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '32px'
    },
    reviewCard: {
      background: 'rgba(15, 15, 35, 0.8)',
      borderRadius: '20px',
      padding: '32px',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    reviewHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      marginBottom: '16px'
    },
    reviewAvatar: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      background: '#667eea'
    },
    reviewName: {
      fontSize: '18px',
      fontWeight: '600'
    },
    reviewStars: {
      color: '#ffd700',
      marginBottom: '16px'
    },
    reviewText: {
      color: '#b0b0b0',
      lineHeight: '1.6'
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2000
    },
    modalContent: {
      background: 'rgba(15, 15, 35, 0.95)',
      padding: '40px',
      borderRadius: '20px',
      width: '400px',
      textAlign: 'center'
    },
    modalTitle: {
      fontSize: '24px',
      marginBottom: '20px'
    },
    input: {
      width: '100%',
      padding: '10px',
      marginBottom: '10px',
      background: 'rgba(0, 0, 0, 0.5)',
      border: '1px solid #00ffff',
      color: 'white',
      borderRadius: '5px'
    },
    select: {
      width: '100%',
      padding: '10px',
      marginBottom: '10px',
      background: 'rgba(0, 0, 0, 0.5)',
      border: '1px solid #00ffff',
      color: 'white',
      borderRadius: '5px'
    },
    toggleBtn: {
      background: 'none',
      border: 'none',
      color: '#00ffff',
      cursor: 'pointer',
      marginTop: '10px'
    },
    error: {
      color: 'red',
      marginBottom: '10px'
    }
  };

  return (
    <div style={mapStyles.container}>
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .hover-scale:hover {
          transform: translateY(-2px) scale(1.02);
        }
        
        .hover-glow:hover {
          boxShadow: 0 8px 30px rgba(102, 126, 234, 0.4);
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .feature-card:hover {
          transform: translateY(-5px);
          boxShadow: 0 8px 30px rgba(102, 126, 234, 0.4);
        }

        @media (max-width: 1024px) {
          .map-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      {/* Navigation */}
      <nav style={mapStyles.nav}>
        <div style={mapStyles.navContent}>
          <div style={mapStyles.logo}>
            <div style={mapStyles.logoIcon}>🗺️</div>
            <h1 style={mapStyles.logoText}>GeoPulse</h1>
          </div>
          <button
            onClick={() => setShowModal(true)}
            disabled={isLoading}
            style={mapStyles.authBtn}
            className="hover-scale hover-glow"
          >
            {isLoading ? (
              <>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid #ddd',
                  borderTop: '2px solid #667eea',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                <span>Processing...</span>
              </>
            ) : (
              <span>Sign In / Sign Up</span>
            )}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
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
              Seamlessly integrated with QGIS and modern GIS workflows, including adventurous maps for hiking and cycling.
            </p>
            <div style={mapStyles.buttonGroup}>
              <button
                onClick={() => setShowModal(true)}
                disabled={isLoading}
                style={mapStyles.primaryBtn}
                className="hover-scale hover-glow"
              >
                {isLoading ? 'Processing...' : 'Start Free Trial'}
              </button>
              <button 
                style={mapStyles.secondaryBtn}
                className="hover-scale"
              >
                Watch Demo
              </button>
            </div>
          </div>

          {/* Map Preview Section */}
          <div style={mapStyles.mapSection}>
            <div style={mapStyles.mapGrid} className="map-grid">
              <div style={mapStyles.mapContainer}>
                <div style={mapStyles.mapHeader}>
                  <h3 style={mapStyles.mapTitle}>Live Map Preview</h3>
                  <div style={mapStyles.liveIndicator}>
                    <div style={mapStyles.liveDot}></div>
                    <span style={{ fontSize: '14px', color: '#888' }}>Live</span>
                  </div>
                </div>
                
                <div ref={mapRef} style={mapStyles.mapCanvas} />
                
                <div style={mapStyles.coordinates}>
                  Zoom: {currentLocation.zoom}
                </div>
                
                <div style={mapStyles.zoomLevel}>
                  Lat: {currentLocation.lat}, Lng: {currentLocation.lng}
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
                  </ul>
                  <button
                    onClick={() => setShowModal(true)}
                    disabled={isLoading}
                    style={{
                      ...mapStyles.primaryBtn,
                      padding: '12px 24px',
                      fontSize: '16px',
                      minWidth: 'auto'
                    }}
                    className="hover-scale hover-glow"
                  >
                    {isLoading ? 'Processing...' : 'Get Started Now'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={mapStyles.featuresSection}>
        <div style={mapStyles.featuresContainer}>
          <h2 style={mapStyles.featuresTitle}>Discover Our Premium Maps</h2>
          <div style={mapStyles.featuresGrid}>
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
                Detailed contour lines, terrain shading, and hydrological features for precise navigation in rugged landscapes. Ideal for geologists, surveyors, and outdoor enthusiasts.
              </p>
            </div>
          </div>
        </div>
      </section>
       {/* Trust & Credibility Section */}
      <section style={mapStyles.trustSection}>
        <div style={mapStyles.trustContainer}>
          {/* Statistics Bar */}
          <div style={mapStyles.statsBar}>
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

          {/* Features Section */}
          <section style={mapStyles.featuresSection}>
            <div style={mapStyles.featuresContainer}>
              <h2 style={mapStyles.featuresTitle}>Discover Our Premium Maps</h2>
              <div style={mapStyles.featuresGrid}>
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
                    Detailed contour lines, terrain shading, and hydrological features for precise navigation in rugged landscapes. Ideal for geologists, surveyors, and outdoor enthusiasts.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Customer Logos - Scrolling */}
          <h3 style={mapStyles.trustTitle}>Trusted by Leading Organizations</h3>
          <div style={mapStyles.logosContainer}>
            <div style={mapStyles.logosTrack}>
              {/* First set of logos */}
              {companies.map((company, index) => (
                <div key={`logo-1-${index}`} style={mapStyles.logoCard} className="logo-card">
                  <div style={{...mapStyles.companyLogo, color: company.color}}>
                    {company.icon}
                  </div>
                  <span style={mapStyles.companyName}>{company.name}</span>
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
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

          {/* Security & Compliance Badges */}
          <div style={mapStyles.badgesSection}>
            <h3 style={mapStyles.trustTitle}>Security & Compliance</h3>
            <div style={mapStyles.badgesGrid}>
              <div style={mapStyles.badge} className="badge-card">
                <div style={mapStyles.badgeIcon}>🔒</div>
                <div style={mapStyles.badgeText}>SOC 2 Type II</div>
                <div style={mapStyles.badgeSubtext}>Certified</div>
              </div>
              <div style={mapStyles.badge} className="badge-card">
                <div style={mapStyles.badgeIcon}>🛡️</div>
                <div style={mapStyles.badgeText}>GDPR Compliant</div>
                <div style={mapStyles.badgeSubtext}>EU Data Protection</div>
              </div>
              <div style={mapStyles.badge} className="badge-card">
                <div style={mapStyles.badgeIcon}>✓</div>
                <div style={mapStyles.badgeText}>SSL Secured</div>
                <div style={mapStyles.badgeSubtext}>256-bit Encryption</div>
              </div>
              <div style={mapStyles.badge} className="badge-card">
                <div style={mapStyles.badgeIcon}>🏆</div>
                <div style={mapStyles.badgeText}>ISO 27001</div>
                <div style={mapStyles.badgeSubtext}>Information Security</div>
              </div>
              <div style={mapStyles.badge} className="badge-card">
                <div style={mapStyles.badgeIcon}>💰</div>
                <div style={mapStyles.badgeText}>Money Back</div>
                <div style={mapStyles.badgeSubtext}>30-Day Guarantee</div>
              </div>
              <div style={mapStyles.badge} className="badge-card">
                <div style={mapStyles.badgeIcon}>⚡</div>
                <div style={mapStyles.badgeText}>99.9% Uptime</div>
                <div style={mapStyles.badgeSubtext}>SLA Guaranteed</div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* User Reviews Section */}
      <section style={mapStyles.reviewsSection}>
        <div style={mapStyles.reviewsContainer}>
          <h2 style={mapStyles.reviewsTitle}>User Reviews</h2>
          <div style={mapStyles.reviewsGrid}>
            <div style={mapStyles.reviewCard}>
              <div style={mapStyles.reviewHeader}>
                <div style={mapStyles.reviewAvatar}></div>
                <span style={mapStyles.reviewName}>John Doe</span>
              </div>
              <div style={mapStyles.reviewStars}>★★★★★</div>
              <p style={mapStyles.reviewText}>"Amazing mapping platform! The adventurous maps for hiking are spot on."</p>
            </div>
            <div style={mapStyles.reviewCard}>
              <div style={mapStyles.reviewHeader}>
                <div style={mapStyles.reviewAvatar}></div>
                <span style={mapStyles.reviewName}>Jane Smith</span>
              </div>
              <div style={mapStyles.reviewStars}>★★★★☆</div>
              <p style={mapStyles.reviewText}>"Great integration with GIS tools. Cycling routes are a game-changer."</p>
            </div>
            <div style={mapStyles.reviewCard}>
              <div style={mapStyles.reviewHeader}>
                <div style={mapStyles.reviewAvatar}></div>
                <span style={mapStyles.reviewName}>Alex Johnson</span>
              </div>
              <div style={mapStyles.reviewStars}>★★★★★</div>
              <p style={mapStyles.reviewText}>"High-quality maps and excellent performance. Highly recommend!"</p>
            </div>
            <div style={mapStyles.reviewCard}>
              <div style={mapStyles.reviewHeader}>
                <div style={mapStyles.reviewAvatar}></div>
                <span style={mapStyles.reviewName}>Emily Davis</span>
              </div>
              <div style={mapStyles.reviewStars}>★★★★★</div>
              <p style={mapStyles.reviewText}>"The map interface is futuristic and user-friendly."</p>
            </div>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal showModal={showModal} setShowModal={setShowModal} mapStyles={mapStyles} />
    </div>
  );
}