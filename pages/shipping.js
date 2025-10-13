import React, { useState } from 'react';

const ShippingPolicy = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Overview' },
    { id: 'digital-delivery', title: 'Digital Delivery' },
    { id: 'access', title: 'Access & Download' },
    { id: 'delivery-time', title: 'Delivery Timeframe' },
    { id: 'technical-requirements', title: 'Technical Requirements' },
    { id: 'support', title: 'Support' },
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

    .ship-container {
      min-height: 100vh;
      background: #ffffff;
      color: #1a1a1a;
      padding: 48px 20px;
    }

    .ship-wrapper {
      max-width: 1200px;
      margin: 0 auto;
    }

    .ship-header {
      text-align: center;
      margin-bottom: 48px;
    }

    .ship-header h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 16px;
      color: #000000;
    }

    .ship-header p {
      font-size: 1.125rem;
      color: #4a5568;
    }

    .ship-nav-container {
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

    .ship-nav-list {
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 12px;
    }

    .ship-nav-button {
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

    .ship-nav-button:hover {
      background: #000000;
      color: #ffffff;
      border-color: #000000;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .ship-nav-button.active {
      background: #000000;
      color: #ffffff;
      border-color: #000000;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .ship-nav-button:focus {
      outline: 2px solid #333333;
      outline-offset: 2px;
    }

    .ship-main-content {
      max-width: 900px;
      margin: 0 auto;
    }

    .ship-section {
      margin-bottom: 48px;
      padding: 32px;
      background: #f9f9f9;
      border: 1px solid #e5e5e5;
      border-radius: 12px;
    }

    .ship-section h2 {
      font-size: 1.875rem;
      font-weight: 600;
      margin-bottom: 24px;
      color: #000000;
      border-bottom: 2px solid #000000;
      padding-bottom: 12px;
    }

    .ship-section h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-top: 24px;
      margin-bottom: 16px;
      color: #000000;
    }

    .ship-section p {
      margin-bottom: 16px;
      color: #2c3e50;
      font-size: 1.05rem;
    }

    .ship-section ul {
      margin-left: 24px;
      margin-bottom: 16px;
    }

    .ship-section li {
      margin-bottom: 12px;
      color: #2c3e50;
    }

    .ship-section strong {
      color: #000000;
      font-weight: 600;
    }

    .ship-highlight {
      background: #ffffff;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #000000;
      margin: 24px 0;
    }

    .ship-contact-info {
      background: #ffffff;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
      margin-top: 16px;
    }

    .ship-footer {
      text-align: center;
      margin-top: 48px;
      padding: 32px 0;
      border-top: 1px solid #e0e0e0;
    }

    .ship-footer p {
      color: #6b7280;
      margin-bottom: 8px;
    }

    .ship-footer .copyright {
      font-size: 0.875rem;
      color: #9ca3af;
    }

    @media (max-width: 768px) {
      .ship-header h1 {
        font-size: 2rem;
      }

      .ship-nav-button {
        font-size: 0.875rem;
        padding: 8px 16px;
      }

      .ship-section {
        padding: 20px;
      }

      .ship-section h2 {
        font-size: 1.5rem;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <div className="ship-container">
        <div className="ship-wrapper">
          <header className="ship-header">
            <h1>Shipping & Delivery Policy</h1>
            <p>Last Updated: October 12, 2025</p>
          </header>

          <nav className="ship-nav-container">
            <ul className="ship-nav-list">
              {sections.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => scrollToSection(section.id)}
                    className={`ship-nav-button ${activeSection === section.id ? 'active' : ''}`}
                    aria-current={activeSection === section.id ? 'page' : undefined}
                    aria-label={`Navigate to ${section.title} section`}
                  >
                    {section.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <main className="ship-main-content">
            <section id="overview" className="ship-section">
              <h2>Overview</h2>
              <p>
                GeoPulse is a digital software-as-a-service (SaaS) platform that provides map tile downloading and GIS services. As we offer exclusively digital products and services, there is no physical shipping involved.
              </p>
              
              <div className="ship-highlight">
                <p><strong>Important:</strong> GeoPulse does not ship any physical products. All services and deliverables are provided digitally through our online platform.</p>
              </div>

              <p>
                This policy outlines how we deliver our digital services to customers and what you can expect regarding access and availability.
              </p>
            </section>

            <section id="digital-delivery" className="ship-section">
              <h2>Digital Delivery</h2>
              
              <h3>No Physical Shipping</h3>
              <p>
                GeoPulse provides all services digitally. We do not:
              </p>
              <ul>
                <li>Ship physical products</li>
                <li>Mail CDs, DVDs, or other physical media</li>
                <li>Send printed materials or documentation</li>
                <li>Provide hardware or physical equipment</li>
              </ul>

              <h3>Digital Service Delivery</h3>
              <p>
                All GeoPulse services are delivered electronically through:
              </p>
              <ul>
                <li>Immediate online access to the web-based platform</li>
                <li>Direct download of map tiles and GIS data</li>
                <li>Cloud-based storage and processing</li>
                <li>Email notifications and communications</li>
              </ul>

              <h3>Instant Access</h3>
              <p>
                Upon successful subscription or purchase, you receive:
              </p>
              <ul>
                <li>Immediate access to your account dashboard</li>
                <li>Instant availability of all subscribed features</li>
                <li>Real-time ability to download and export map data</li>
                <li>Online access to documentation and support resources</li>
              </ul>
            </section>

            <section id="access" className="ship-section">
              <h2>Access & Download</h2>
              
              <h3>Account Access</h3>
              <p>
                After creating an account and subscribing to a plan:
              </p>
              <ul>
                <li>You can log in immediately to access the GeoPulse platform</li>
                <li>Your account credentials are sent to your registered email address</li>
                <li>All features of your subscription plan are immediately available</li>
                <li>You can begin downloading map tiles right away</li>
              </ul>

              <h3>Download Delivery</h3>
              <p>
                Map tiles and data are delivered through:
              </p>
              <ul>
                <li><strong>Browser Downloads:</strong> Downloaded directly through your web browser</li>
                <li><strong>Export Formats:</strong> Available in MBTiles and ZIP formats</li>
                <li><strong>File Storage:</strong> Files are saved to your local device</li>
                <li><strong>No Time Limits:</strong> Downloads are available as long as your subscription is active</li>
              </ul>

              <h3>Email Confirmations</h3>
              <p>
                You will receive email confirmations for:
              </p>
              <ul>
                <li>Account creation and welcome messages</li>
                <li>Subscription activation and renewals</li>
                <li>Successful payments and invoices</li>
                <li>Password reset requests</li>
              </ul>
            </section>

            <section id="delivery-time" className="ship-section">
              <h2>Delivery Timeframe</h2>
              
              <h3>Immediate Delivery</h3>
              <p>
                GeoPulse services are delivered instantly:
              </p>
              <ul>
                <li><strong>Account Activation:</strong> Immediate upon registration</li>
                <li><strong>Subscription Access:</strong> Instant after payment confirmation</li>
                <li><strong>Feature Availability:</strong> Real-time activation of all plan features</li>
                <li><strong>Download Speed:</strong> Dependent on your internet connection and file size</li>
              </ul>

              <h3>Processing Time</h3>
              <p>
                While access is immediate, certain operations may take time:
              </p>
              <ul>
                <li><strong>Map Tile Generation:</strong> Processing time varies based on area size and zoom levels</li>
                <li><strong>Large Downloads:</strong> May take several minutes depending on the number of tiles</li>
                <li><strong>File Export:</strong> Compression and packaging time for ZIP or MBTiles format</li>
              </ul>

              <h3>No Waiting Period</h3>
              <p>
                Unlike physical products, there are no:
              </p>
              <ul>
                <li>Shipping delays</li>
                <li>Handling times</li>
                <li>Delivery schedules</li>
                <li>Geographic restrictions (except those imposed by law)</li>
              </ul>

              <div className="ship-highlight">
                <p><strong>Note:</strong> If you experience any delays in accessing your account or downloading files, please contact our support team immediately.</p>
              </div>
            </section>

            <section id="technical-requirements" className="ship-section">
              <h2>Technical Requirements</h2>
              
              <h3>Internet Connection</h3>
              <p>
                To access GeoPulse services, you need:
              </p>
              <ul>
                <li>A stable internet connection</li>
                <li>Sufficient bandwidth for downloading map tiles</li>
                <li>Modern web browser (Chrome, Firefox, Safari, or Edge)</li>
              </ul>

              <h3>Device Requirements</h3>
              <p>
                GeoPulse is accessible from:
              </p>
              <ul>
                <li>Desktop computers (Windows, Mac, Linux)</li>
                <li>Laptop computers</li>
                <li>Tablets (with compatible browsers)</li>
                <li>Mobile devices (limited functionality)</li>
              </ul>

              <h3>Software Requirements</h3>
              <p>
                To use downloaded files, you may need:
              </p>
              <ul>
                <li>GIS software (QGIS, TileServer GL, MapProxy)</li>
                <li>File extraction tools for ZIP files</li>
                <li>SQLite database viewers for MBTiles</li>
                <li>Mapping libraries (Leaflet, OpenLayers)</li>
              </ul>

              <h3>Storage Space</h3>
              <p>
                Ensure you have adequate storage space on your device:
              </p>
              <ul>
                <li>Map tile downloads can range from a few MB to several GB</li>
                <li>File size depends on selected area, zoom levels, and tile source</li>
                <li>The platform provides file size estimates before download</li>
              </ul>
            </section>

            <section id="support" className="ship-section">
              <h2>Support</h2>
              
              <h3>Access Issues</h3>
              <p>
                If you experience any issues accessing GeoPulse services or downloading files, we're here to help:
              </p>

              <div className="ship-contact-info">
                <p><strong>Email Support:</strong> geopulsee@proton.me</p>
                <p><strong>Response Time:</strong> We typically respond within 2-3 business days</p>
                <p><strong>Support Hours:</strong> Monday to Friday, 9:00 AM - 5:00 PM GMT</p>
              </div>

              <h3>Common Issues</h3>
              <p>
                For immediate assistance with common issues:
              </p>
              <ul>
                <li><strong>Login Problems:</strong> Use the "Forgot Password" feature or contact support</li>
                <li><strong>Download Failures:</strong> Check your internet connection and try again</li>
                <li><strong>Payment Issues:</strong> Verify your payment method and billing information</li>
                <li><strong>Account Access:</strong> Check your email for activation or confirmation messages</li>
              </ul>

              <h3>Documentation</h3>
              <p>
                Comprehensive documentation is available online, including:
              </p>
              <ul>
                <li>Getting Started guides</li>
                <li>Feature tutorials</li>
                <li>API documentation</li>
                <li>Troubleshooting guides</li>
                <li>FAQs</li>
              </ul>

              <h3>Priority Support</h3>
              <p>
                Enterprise and Agency plan customers receive:
              </p>
              <ul>
                <li>Faster response times (12 hours to 1 business day)</li>
                <li>Priority ticket handling</li>
                <li>Phone support by appointment</li>
                <li>Dedicated account management</li>
              </ul>
            </section>
          </main>

          <footer className="ship-footer">
            <p>
              This policy is part of our Terms of Service. For complete information, please review our full Terms of Service.
            </p>
            <p className="copyright">
              &copy; 2025 GeoPulse. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </>
  );
};

export default ShippingPolicy;