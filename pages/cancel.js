import React, { useState } from 'react';

const CancellationRefund = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Overview' },
    { id: 'cancellation', title: 'Cancellation Policy' },
    { id: 'refund', title: 'Refund Policy' },
    { id: 'subscription', title: 'Subscription Billing' },
    { id: 'trial', title: 'Free Trial Cancellation' },
    { id: 'downgrades', title: 'Downgrades' },
    { id: 'data-deletion', title: 'Data Deletion' },
    { id: 'exceptions', title: 'Exceptions' },
   
    { id: 'contact', title: 'Contact Us' },
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

    .refund-container {
      min-height: 100vh;
      background: #ffffff;
      color: #1a1a1a;
      padding: 48px 20px;
    }

    .refund-wrapper {
      max-width: 1200px;
      margin: 0 auto;
    }

    .refund-header {
      text-align: center;
      margin-bottom: 48px;
    }

    .refund-header h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 16px;
      color: #000000;
    }

    .refund-header p {
      font-size: 1.125rem;
      color: #4a5568;
    }

    .refund-nav-container {
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

    .refund-nav-list {
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 12px;
    }

    .refund-nav-button {
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

    .refund-nav-button:hover {
      background: #000000;
      color: #ffffff;
      border-color: #000000;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .refund-nav-button.active {
      background: #000000;
      color: #ffffff;
      border-color: #000000;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .refund-nav-button:focus {
      outline: 2px solid #333333;
      outline-offset: 2px;
    }

    .refund-main-content {
      max-width: 900px;
      margin: 0 auto;
    }

    .refund-section {
      margin-bottom: 48px;
      padding: 32px;
      background: #f9f9f9;
      border: 1px solid #e5e5e5;
      border-radius: 12px;
    }

    .refund-section h2 {
      font-size: 1.875rem;
      font-weight: 600;
      margin-bottom: 24px;
      color: #000000;
      border-bottom: 2px solid #000000;
      padding-bottom: 12px;
    }

    .refund-section h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-top: 24px;
      margin-bottom: 16px;
      color: #000000;
    }

    .refund-section p {
      margin-bottom: 16px;
      color: #2c3e50;
      font-size: 1.05rem;
    }

    .refund-section ul {
      margin-left: 24px;
      margin-bottom: 16px;
    }

    .refund-section ol {
      margin-left: 24px;
      margin-bottom: 16px;
    }

    .refund-section li {
      margin-bottom: 12px;
      color: #2c3e50;
    }

    .refund-section strong {
      color: #000000;
      font-weight: 600;
    }

    .refund-highlight {
      background: #ffffff;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #000000;
      margin: 24px 0;
    }

    .refund-note {
      background: #f0f0f0;
      padding: 16px;
      border-radius: 8px;
      margin: 16px 0;
      border: 1px solid #d0d0d0;
    }

    .refund-contact-info {
      background: #ffffff;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
      margin-top: 16px;
    }

    .refund-footer {
      text-align: center;
      margin-top: 48px;
      padding: 32px 0;
      border-top: 1px solid #e0e0e0;
    }

    .refund-footer p {
      color: #6b7280;
      margin-bottom: 8px;
    }

    .refund-footer .copyright {
      font-size: 0.875rem;
      color: #9ca3af;
    }

    @media (max-width: 768px) {
      .refund-header h1 {
        font-size: 2rem;
      }

      .refund-nav-button {
        font-size: 0.875rem;
        padding: 8px 16px;
      }

      .refund-section {
        padding: 20px;
      }

      .refund-section h2 {
        font-size: 1.5rem;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <div className="refund-container">
        <div className="refund-wrapper">
          <header className="refund-header">
            <h1>Cancellation & Refund Policy</h1>
            <p>Last Updated: October 12, 2025</p>
          </header>

          <nav className="refund-nav-container">
            <ul className="refund-nav-list">
              {sections.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => scrollToSection(section.id)}
                    className={`refund-nav-button ${activeSection === section.id ? 'active' : ''}`}
                    aria-current={activeSection === section.id ? 'page' : undefined}
                    aria-label={`Navigate to ${section.title} section`}
                  >
                    {section.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <main className="refund-main-content">
            <section id="overview" className="refund-section">
              <h2>Overview</h2>
              <p>
                At GeoPulse, we strive to provide the best map downloading and GIS services to our customers. This Cancellation and Refund Policy outlines the terms and conditions regarding cancellations, refunds, and related matters for our subscription-based services.
              </p>
              <p>
                By subscribing to GeoPulse services, you acknowledge that you have read, understood, and agree to be bound by this policy. Please read this policy carefully before making any purchase or subscription.
              </p>
              
              <div className="refund-highlight">
                <p><strong>Important Note:</strong> All subscription fees are non-refundable except where required by applicable law or as explicitly stated in this policy.</p>
              </div>
            </section>

            <section id="cancellation" className="refund-section">
              <h2>Cancellation Policy</h2>
              
              <h3>Right to Cancel</h3>
              <p>
                You have the right to cancel your GeoPulse subscription at any time. Cancellations can be initiated directly from your account dashboard without the need to contact customer support.
              </p>

              <h3>When Cancellation Takes Effect</h3>
              <p>
                When you cancel your subscription, the cancellation will take effect at the end of your current billing cycle. This means:
              </p>
              <ul>
                <li>You will continue to have access to all paid features until the end of the current billing period</li>
                <li>No further charges will be made to your payment method</li>
                <li>Your subscription will not automatically renew</li>
                <li>After the billing period ends, your account will be downgraded or deactivated</li>
              </ul>

              <h3>Immediate Cancellation</h3>
              <p>
                If you wish to immediately terminate your account and stop using the service before the end of your billing cycle, you may do so. However, please note:
              </p>
              <ul>
                <li>No refund will be provided for the unused portion of your subscription</li>
                <li>All data associated with your account will be permanently deleted</li>
                <li>You will lose access to all features and services immediately</li>
              </ul>

              <div className="refund-note">
                <p><strong>Note:</strong> We recommend backing up all your data before cancelling your subscription, as data recovery after cancellation is not possible.</p>
              </div>
            </section>

            <section id="refund" className="refund-section">
              <h2>Refund Policy</h2>
              
              <h3>General Refund Policy</h3>
              <p>
                All charges for GeoPulse services are <strong>non-refundable</strong> unless expressly stated otherwise or required by applicable law. This includes but is not limited to:
              </p>
              <ul>
                <li>Monthly subscription fees</li>
                <li>Annual subscription fees</li>
                <li>Multi-year subscription fees</li>
                <li>Add-on features and services</li>
                <li>Usage-based charges</li>
              </ul>

              <h3>No Prorated Refunds</h3>
              <p>
                We do not provide refunds or credits for:
              </p>
              <ul>
                <li>Partial months or years of service</li>
                <li>Unused time remaining on your subscription</li>
                <li>Downgrades to a lower-tier plan</li>
                <li>Accounts that are cancelled mid-billing cycle</li>
              </ul>

              <h3>Exceptions to the Refund Policy</h3>
              <p>
                Refunds may be granted in the following exceptional circumstances:
              </p>
              <ul>
                <li><strong>Technical Issues:</strong> If GeoPulse experiences prolonged service outages or technical problems that prevent you from using the service for an extended period, and we are unable to resolve the issue in a reasonable timeframe</li>
                <li><strong>Billing Errors:</strong> If you have been incorrectly charged due to a billing system error on our part</li>
                <li><strong>Duplicate Charges:</strong> If your payment method has been charged multiple times for the same subscription period</li>
                <li><strong>Unauthorized Charges:</strong> If charges were made to your account without your authorization</li>
                <li><strong>Legal Requirements:</strong> Where refunds are required by applicable consumer protection laws</li>
              </ul>

              <p>
                To request a refund under these exceptional circumstances, please contact our support team at <strong>geopulsee@proton.me</strong> within 14 days of the charge with detailed information about your situation.
              </p>
            </section>

            <section id="subscription" className="refund-section">
              <h2>Subscription Billing</h2>
              
              <h3>Billing Cycles</h3>
              <p>
                GeoPulse offers various billing cycles to suit your needs:
              </p>
              <ul>
                <li><strong>Monthly:</strong> Billed every month on the same date you subscribed</li>
                <li><strong>Quarterly:</strong> Billed every three months</li>
                <li><strong>Annual:</strong> Billed once per year</li>
                <li><strong>Multi-Year:</strong> Billed for multiple years upfront at a discounted rate</li>
              </ul>

              <h3>Automatic Renewal</h3>
              <p>
                All subscriptions automatically renew at the end of each billing cycle unless cancelled before the renewal date. You will be charged using your primary payment method on file.
              </p>

              <h3>Payment Method</h3>
              <p>
                You must maintain a valid payment method (credit card, debit card, or other accepted payment method) on file. If your payment fails:
              </p>
              <ul>
                <li>We will attempt to process the payment multiple times</li>
                <li>You will receive email notifications about the failed payment</li>
                <li>Your account may be suspended if payment cannot be processed</li>
                <li>You are responsible for any bank fees, overdraft charges, or other fees resulting from failed payments</li>
              </ul>

              <h3>Price Changes</h3>
              <p>
                GeoPulse reserves the right to change subscription prices. However:
              </p>
              <ul>
                <li>You will receive at least 30 days advance notice of any price change</li>
                <li>Price changes take effect at your next billing cycle after the notice period</li>
                <li>You have the right to cancel your subscription before the price change takes effect</li>
                <li>Continuing to use the service after the price change means you accept the new pricing</li>
              </ul>
            </section>

            <section id="trial" className="refund-section">
              <h2>Free Trial Cancellation</h2>
              
              <h3>Trial Period</h3>
              <p>
                GeoPulse may offer free trial periods for new customers to test our services. During the trial period:
              </p>
              <ul>
                <li>You have full access to the features of your selected plan</li>
                <li>No charges are made during the trial period</li>
                <li>You can cancel at any time without being charged</li>
              </ul>

              <h3>Trial to Paid Conversion</h3>
              <p>
                At the end of your trial period:
              </p>
              <ul>
                <li>Your subscription will automatically convert to a paid plan</li>
                <li>Your payment method will be charged for the first billing cycle</li>
                <li>To avoid charges, you must cancel before the trial period ends</li>
              </ul>

              <h3>Cancelling During Trial</h3>
              <p>
                If you cancel during your trial period:
              </p>
              <ul>
                <li>You will not be charged</li>
                <li>Your access will continue until the end of the trial period</li>
                <li>Your account will be deactivated when the trial expires</li>
                <li>All data will be permanently deleted after a grace period</li>
              </ul>

              <div className="refund-note">
                <p><strong>Important:</strong> Only one free trial per customer is allowed. Attempts to create multiple accounts for additional trials may result in account termination.</p>
              </div>
            </section>

            <section id="downgrades" className="refund-section">
              <h2>Downgrades</h2>
              
              <h3>Downgrading Your Plan</h3>
              <p>
                You may downgrade your subscription to a lower-tier plan at any time. When you downgrade:
              </p>
              <ul>
                <li>The downgrade takes effect at the end of your current billing cycle</li>
                <li>You will be charged the lower price at your next renewal</li>
                <li>No refund or credit is provided for the difference in price</li>
                <li>You will lose access to features not included in the lower-tier plan</li>
              </ul>

              <h3>Data and Feature Loss</h3>
              <p>
                Downgrading may result in:
              </p>
              <ul>
                <li>Loss of premium features and functionality</li>
                <li>Reduced storage capacity or map view limits</li>
                <li>Deletion of data that exceeds the limits of your new plan</li>
                <li>Loss of historical data or analytics</li>
              </ul>

              <div className="refund-highlight">
                <p><strong>Warning:</strong> GeoPulse is not liable for any data loss resulting from a downgrade. Please ensure you backup or export any important data before downgrading.</p>
              </div>

              <h3>Upgrades</h3>
              <p>
                If you upgrade from a lower-tier plan:
              </p>
              <ul>
                <li>Upgrades take effect immediately</li>
                <li>You will be charged a prorated amount for the remainder of your billing cycle</li>
                <li>Your next billing cycle will be charged at the new plan rate</li>
                <li>New features become available immediately upon upgrade</li>
              </ul>
            </section>

            <section id="data-deletion" className="refund-section">
              <h2>Data Deletion</h2>
              
              <h3>Upon Cancellation</h3>
              <p>
                When you cancel your GeoPulse subscription:
              </p>
              <ul>
                <li>All user data, including maps, datasets, and configurations, will be permanently deleted</li>
                <li>Deletion occurs immediately upon cancellation or at the end of your billing cycle, depending on your choice</li>
                <li>Once deleted, data cannot be recovered</li>
                <li>No backups are retained after deletion</li>
              </ul>

              <h3>Grace Period</h3>
              <p>
                In some cases, we may provide a grace period of up to 30 days before permanent deletion. However:
              </p>
              <ul>
                <li>This grace period is not guaranteed</li>
                <li>You will not have access to the service during the grace period</li>
                <li>To retain your data, you must reactivate your subscription within the grace period</li>
              </ul>

              <h3>Your Responsibility</h3>
              <p>
                You are solely responsible for:
              </p>
              <ul>
                <li>Backing up all data before cancellation</li>
                <li>Exporting any maps, datasets, or other content you wish to keep</li>
                <li>Understanding that GeoPulse is not a data archiving service</li>
              </ul>
            </section>

            <section id="exceptions" className="refund-section">
              <h2>Exceptions</h2>
              
              <h3>Consumer Protection Laws</h3>
              <p>
                Nothing in this policy affects your statutory rights under applicable consumer protection laws. If you are located in a jurisdiction that provides additional consumer protections, those rights take precedence over this policy.
              </p>

              <h3>European Union Customers</h3>
              <p>
                If you are a customer located in the European Union, you may have additional rights under EU consumer protection law, including:
              </p>
              <ul>
                <li>The right to withdraw from a purchase within 14 days (cooling-off period)</li>
                <li>However, this right may be waived if you begin using the service during this period</li>
              </ul>

              <h3>Exceptional Circumstances</h3>
              <p>
                We may grant refunds in exceptional circumstances at our sole discretion, including:
              </p>
              <ul>
                <li>Medical emergencies or hardship situations</li>
                <li>Service failures that substantially impair your ability to use GeoPulse</li>
                <li>Other extraordinary situations evaluated on a case-by-case basis</li>
              </ul>

              <p>
                Requests for exceptional refunds must be submitted with supporting documentation.
              </p>
            </section>

           

            <section id="contact" className="refund-section">
              <h2>Contact Us</h2>
              <p>
                If you have any questions about this Cancellation and Refund Policy, or if you need assistance with cancellation, refunds, or billing issues, please contact us:
              </p>

              <div className="refund-contact-info">
                <p><strong>Email:</strong> geopulsee@proton.me</p>
                <p><strong>Response Time:</strong> We aim to respond to all inquiries within 2-3 business days</p>
                <p><strong>Address:</strong><br />
                GeoPulse<br />
                1 Victoria Street<br />
                Bristol, BS1 6AA<br />
                United Kingdom</p>
              
              </div>

              <p style={{ marginTop: '24px' }}>
                When contacting us about refunds or billing issues, please include:
              </p>
              <ul>
                <li>Your account email address</li>
                <li>Transaction ID or invoice number (if applicable)</li>
                <li>Detailed description of the issue</li>
                <li>Any supporting documentation</li>
              </ul>
            </section>
          </main>

          <footer className="refund-footer">
            <p>
              This policy is part of our Terms of Service. For complete terms, please review our full Terms of Service document.
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

export default CancellationRefund;