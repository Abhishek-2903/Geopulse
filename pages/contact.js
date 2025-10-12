import React, { useState } from 'react';

const ContactUs = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Overview' },
    { id: 'email-support', title: 'Email Support' },
    { id: 'response-time', title: 'Response Time' },
    { id: 'what-to-include', title: 'What to Include' },
    { id: 'support-categories', title: 'Support Categories' },
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

    .contact-container {
      min-height: 100vh;
      background: #ffffff;
      color: #1a1a1a;
      padding: 48px 20px;
    }

    .contact-wrapper {
      max-width: 1200px;
      margin: 0 auto;
    }

    .contact-header {
      text-align: center;
      margin-bottom: 48px;
    }

    .contact-header h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 16px;
      color: #000000;
    }

    .contact-header p {
      font-size: 1.125rem;
      color: #4a5568;
    }

    .contact-nav-container {
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

    .contact-nav-list {
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 12px;
    }

    .contact-nav-button {
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

    .contact-nav-button:hover {
      background: #000000;
      color: #ffffff;
      border-color: #000000;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .contact-nav-button.active {
      background: #000000;
      color: #ffffff;
      border-color: #000000;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .contact-nav-button:focus {
      outline: 2px solid #333333;
      outline-offset: 2px;
    }

    .contact-main-content {
      max-width: 900px;
      margin: 0 auto;
    }

    .contact-section {
      margin-bottom: 48px;
      padding: 32px;
      background: #f9f9f9;
      border: 1px solid #e5e5e5;
      border-radius: 12px;
    }

    .contact-section h2 {
      font-size: 1.875rem;
      font-weight: 600;
      margin-bottom: 24px;
      color: #000000;
      border-bottom: 2px solid #000000;
      padding-bottom: 12px;
    }

    .contact-section h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-top: 24px;
      margin-bottom: 16px;
      color: #000000;
    }

    .contact-section p {
      margin-bottom: 16px;
      color: #2c3e50;
      font-size: 1.05rem;
    }

    .contact-section ul {
      margin-left: 24px;
      margin-bottom: 16px;
    }

    .contact-section li {
      margin-bottom: 12px;
      color: #2c3e50;
    }

    .contact-section strong {
      color: #000000;
      font-weight: 600;
    }

    .contact-highlight {
      background: #ffffff;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #000000;
      margin: 24px 0;
    }

    .contact-email-box {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff;
      padding: 32px;
      border-radius: 12px;
      text-align: center;
      margin: 32px 0;
      box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
    }

    .contact-email-box h3 {
      font-size: 1.5rem;
      margin-bottom: 8px;
      color: #ffffff;
      font-weight: 700;
    }

    .contact-email-box p {
      color: #f0f0ff;
      font-size: 1.05rem;
      margin-bottom: 16px;
    }

    .contact-email-box a {
      display: inline-block;
      font-size: 1.5rem;
      font-weight: 600;
      color: #667eea;
      text-decoration: none;
      padding: 16px 32px;
      background: #ffffff;
      border-radius: 8px;
      border: 2px solid #ffffff;
      transition: all 0.3s ease;
      margin-top: 8px;
    }

    .contact-email-box a:hover {
      background: #f0f0ff;
      color: #764ba2;
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(255, 255, 255, 0.3);
    }

    .contact-info-card {
      background: #ffffff;
      padding: 24px;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
      margin-top: 16px;
    }

    .contact-category-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-top: 24px;
    }

    .contact-category-card {
      background: #ffffff;
      padding: 24px;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
      transition: all 0.3s ease;
    }

    .contact-category-card:hover {
      border-color: #000000;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(-4px);
    }

    .contact-category-card h4 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #000000;
      margin-bottom: 12px;
    }

    .contact-category-card p {
      font-size: 0.95rem;
      margin-bottom: 0;
    }

    .contact-footer {
      text-align: center;
      margin-top: 48px;
      padding: 32px 0;
      border-top: 1px solid #e0e0e0;
    }

    .contact-footer p {
      color: #6b7280;
      margin-bottom: 8px;
    }

    .contact-footer .copyright {
      font-size: 0.875rem;
      color: #9ca3af;
    }

    @media (max-width: 768px) {
      .contact-header h1 {
        font-size: 2rem;
      }

      .contact-nav-button {
        font-size: 0.875rem;
        padding: 8px 16px;
      }

      .contact-section {
        padding: 20px;
      }

      .contact-section h2 {
        font-size: 1.5rem;
      }

      .contact-email-box a {
        font-size: 1.125rem;
        padding: 12px 24px;
      }

      .contact-category-grid {
        grid-template-columns: 1fr;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <div className="contact-container">
        <div className="contact-wrapper">
          <header className="contact-header">
            <h1>Contact Us</h1>
            <p>We're here to help with any questions or concerns</p>
          </header>

          <nav className="contact-nav-container">
            <ul className="contact-nav-list">
              {sections.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => scrollToSection(section.id)}
                    className={`contact-nav-button ${activeSection === section.id ? 'active' : ''}`}
                    aria-current={activeSection === section.id ? 'page' : undefined}
                    aria-label={`Navigate to ${section.title} section`}
                  >
                    {section.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <main className="contact-main-content">
            <section id="overview" className="contact-section">
              <h2>Overview</h2>
              <p>
                At GeoPulse, we value your feedback and are committed to providing excellent customer support. We're available to assist you with any questions, concerns, or issues you may have regarding our map tile downloading and GIS services.
              </p>
              
              <div className="contact-email-box">
                <h3>Get in Touch</h3>
                <p>Send us an email at:</p>
                <a href="mailto:geopulsee@proton.me">geopulsee@proton.me</a>
              </div>

              <p>
                Whether you need technical assistance, have billing inquiries, or want to provide feedback, our team is ready to help. We strive to respond to all inquiries as quickly as possible.
              </p>
            </section>

            <section id="email-support" className="contact-section">
              <h2>Email Support</h2>
              
              <h3>Our Email Address</h3>
              <div className="contact-info-card">
                <p><strong>Primary Support Email:</strong> geopulsee@proton.me</p>
                <p style={{ marginTop: '12px', fontSize: '0.95rem' }}>
                  This is our only official contact email. Please be cautious of any other email addresses claiming to represent GeoPulse.
                </p>
              </div>

              <h3>Email Security</h3>
              <p>
                Your privacy and security are important to us:
              </p>
              <ul>
                <li>Never share sensitive passwords or API keys via email</li>
                <li>We will never ask for your full payment card details via email</li>
                <li>All support communications are kept confidential</li>
              </ul>

              <div className="contact-highlight">
                <p><strong>Important:</strong> Always verify that responses come from @proton.me domain to avoid phishing attempts.</p>
              </div>
            </section>

            <section id="response-time" className="contact-section">
              <h2>Response Time</h2>
              
              <h3>Standard Response Time</h3>
              <div className="contact-info-card">
                <p><strong>Typical Response:</strong> 2-3 business days</p>
                <p><strong>Support Hours:</strong> Monday to Friday, 9:00 AM - 5:00 PM GMT</p>
                <p style={{ marginTop: '12px', fontSize: '0.95rem' }}>
                  We aim to respond to all inquiries within this timeframe. Complex technical issues may require additional time for investigation.
                </p>
              </div>

              <h3>Priority Support</h3>
              <p>
                Enterprise and Agency plan customers receive faster response times:
              </p>
              <ul>
                <li><strong>Enterprise Plan:</strong> 12-hour response time during business hours</li>
                <li><strong>Agency Plan:</strong> 1 business day response time</li>
                <li><strong>Critical Issues:</strong> Expedited handling for service disruptions</li>
              </ul>

              <h3>Factors Affecting Response Time</h3>
              <p>
                Please note that response times may be longer during:
              </p>
              <ul>
                <li>Weekends and holidays</li>
                <li>High volume support periods</li>
                <li>Complex technical investigations</li>
                <li>Issues requiring coordination with third-party services</li>
              </ul>

              <div className="contact-highlight">
                <p><strong>Tip:</strong> Providing detailed information in your initial email helps us respond more quickly and accurately.</p>
              </div>
            </section>

            <section id="what-to-include" className="contact-section">
              <h2>What to Include in Your Email</h2>
              
              <h3>Essential Information</h3>
              <p>
                To help us assist you efficiently, please include:
              </p>
              <ul>
                <li><strong>Subject Line:</strong> Brief description of your issue or inquiry</li>
                <li><strong>Account Email:</strong> The email address associated with your GeoPulse account</li>
                <li><strong>Issue Description:</strong> Clear explanation of your problem or question</li>
                <li><strong>Steps Taken:</strong> What you've already tried to resolve the issue</li>
              </ul>

              <h3>Technical Issues</h3>
              <p>
                For technical problems, also include:
              </p>
              <ul>
                <li>Browser name and version (Chrome 120, Firefox 121, etc.)</li>
                <li>Operating system (Windows 11, macOS 14, etc.)</li>
                <li>Screenshots or screen recordings of the issue</li>
                <li>Error messages (copy and paste the exact text)</li>
                <li>Time and date when the issue occurred</li>
                <li>Specific map tiles or regions affected</li>
              </ul>

              <h3>Billing Inquiries</h3>
              <p>
                For billing questions, please provide:
              </p>
              <ul>
                <li>Your account email address</li>
                <li>Invoice number or transaction ID (if applicable)</li>
                <li>Date of the transaction</li>
                <li>Description of the billing issue</li>
              </ul>

              <h3>Feature Requests & Feedback</h3>
              <p>
                We welcome your suggestions! Please include:
              </p>
              <ul>
                <li>Description of the desired feature or improvement</li>
                <li>Your use case or how it would benefit you</li>
                <li>Any similar features you've seen elsewhere</li>
              </ul>
            </section>

            <section id="support-categories" className="contact-section">
              <h2>Support Categories</h2>
              
              <p>
                We handle a wide range of inquiries. Here are the most common categories:
              </p>

              <div className="contact-category-grid">
                <div className="contact-category-card">
                  <h4>Technical Support</h4>
                  <p>Platform issues, download problems, file format questions, integration help, and troubleshooting.</p>
                </div>

                <div className="contact-category-card">
                  <h4>Account Management</h4>
                  <p>Login issues, password resets, account settings, profile updates, and subscription changes.</p>
                </div>

                <div className="contact-category-card">
                  <h4>Billing & Payments</h4>
                  <p>Payment issues, invoice requests, refund inquiries, subscription cancellations, and pricing questions.</p>
                </div>

                <div className="contact-category-card">
                  <h4>General Inquiries</h4>
                  <p>Product information, feature questions, plan comparisons, and general service questions.</p>
                </div>

                <div className="contact-category-card">
                  <h4>Partnerships</h4>
                  <p>Business partnerships, bulk licensing, enterprise solutions, and collaboration opportunities.</p>
                </div>

                <div className="contact-category-card">
                  <h4>Feedback & Suggestions</h4>
                  <p>Feature requests, product feedback, bug reports, and improvement suggestions.</p>
                </div>
              </div>

              <h3>Before You Contact Us</h3>
              <p>
                To get faster answers, you might want to check:
              </p>
              <ul>
                <li><strong>Documentation:</strong> Comprehensive guides and tutorials available online</li>
                <li><strong>FAQ Section:</strong> Common questions and answers</li>
                <li><strong>Terms of Service:</strong> Policy information and service terms</li>
                <li><strong>Previous Emails:</strong> Check if we've already addressed your question</li>
              </ul>

              <div className="contact-highlight">
                <p><strong>Note:</strong> For urgent account security issues (such as unauthorized access), please include "URGENT" in your email subject line.</p>
              </div>
            </section>
          </main>

          <footer className="contact-footer">
            <p>
              We look forward to hearing from you and appreciate your patience while we respond to your inquiry.
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

export default ContactUs;