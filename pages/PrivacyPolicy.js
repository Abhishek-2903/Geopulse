import Link from 'next/link';

export default function PrivacyPolicy() {
  const styles = {
    container: {
      minHeight: '100vh',
      background: '#ffffff',
      color: '#000000',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      padding: 'clamp(80px, 15vw, 120px) clamp(16px, 4vw, 32px)'
    },
    content: {
      maxWidth: '800px',
      margin: '0 auto',
      lineHeight: '1.6'
    },
    title: {
      fontSize: 'clamp(24px, 6vw, 36px)',
      fontWeight: '700',
      marginBottom: 'clamp(24px, 6vw, 48px)',
      color: '#000000',
      textAlign: 'center'
    },
    section: {
      marginBottom: 'clamp(24px, 6vw, 48px)'
    },
    sectionTitle: {
      fontSize: 'clamp(18px, 5vw, 24px)',
      fontWeight: '600',
      marginBottom: 'clamp(12px, 3vw, 24px)',
      color: '#000000'
    },
    paragraph: {
      fontSize: 'clamp(14px, 3.5vw, 16px)',
      color: '#333333',
      marginBottom: 'clamp(8px, 2vw, 16px)'
    },
    list: {
      listStyleType: 'disc',
      paddingLeft: 'clamp(16px, 4vw, 32px)',
      marginBottom: 'clamp(8px, 2vw, 16px)'
    },
    listItem: {
      fontSize: 'clamp(14px, 3.5vw, 16px)',
      color: '#333333',
      marginBottom: 'clamp(4px, 1vw, 8px)'
    },
    link: {
      color: '#000000',
      textDecoration: 'underline',
      fontWeight: '600'
    },
    footer: {
      borderTop: '1px solid rgba(0, 0, 0, 0.2)',
      paddingTop: 'clamp(16px, 4vw, 32px)',
      marginTop: 'clamp(24px, 6vw, 48px)',
      textAlign: 'center'
    },
    footerLink: {
      fontSize: 'clamp(14px, 3.5vw, 16px)',
      color: '#000000',
      textDecoration: 'none',
      margin: '0 clamp(8px, 2vw, 16px)',
      fontWeight: '600'
    }
  };

  return (
    <div style={styles.container}>
      <style jsx>{`
        @media (max-width: 768px) {
          .container {
            padding: clamp(40px, 10vw, 80px) clamp(8px, 2vw, 16px);
          }
          .content {
            max-width: 100%;
          }
        }
        
        .footer-link:hover {
          text-decoration: underline;
        }
      `}</style>

      <div style={styles.content}>
        <h1 style={styles.title}>Privacy Policy</h1>

        <div style={styles.section}>
          <p style={styles.paragraph}>
            GeoPulse Limited ("we", "us", "our") are committed to protecting and respecting your privacy and keeping your Personal Information secure. This policy, together with our Terms of Service and any other documents that they refer to, sets out:
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>Details of the Personal Information that we may collect from you;</li>
            <li style={styles.listItem}>Information about how we use your Personal Information;</li>
            <li style={styles.listItem}>Information about how we store your Personal Information;</li>
            <li style={styles.listItem}>Information about who we may disclose your Personal Information to; and</li>
            <li style={styles.listItem}>Information about your rights.</li>
          </ul>
          <p style={styles.paragraph}>
            Please read this policy carefully to understand our views and practices regarding your personal data and how we will treat it. Any capitalized terms used herein without definition shall have the meaning given to them in the Terms of Service. The data controller is GeoPulse Limited of 1 Victoria Street, Bristol, England, BS1 6AA, UK (registered at Companies House with company number 08388830 and trading as GeoPulse).
          </p>
          <p style={styles.paragraph}>
            By visiting or using the geopulse.com website or Services in any manner, you acknowledge that you accept the practices and policies outlined in this Privacy Policy and you hereby consent that we will collect, use, and share your information in the following ways.
          </p>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>1. What information do we collect?</h2>
          <h3 style={{ ...styles.sectionTitle, fontSize: 'clamp(16px, 4vw, 20px)' }}>Information you provide us directly</h3>
          <p style={styles.paragraph}>
            While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. Personally identifiable information may include, but is not limited to, your email address, name, and credit card or billing information when you register for a trial Account, checkout of a paid plan, or register as a Partner ("Personal Information"). We may also collect details of any opinions or complaints you raise regarding the Service and details of actions you carry out while using the Service.
          </p>
          <h3 style={{ ...styles.sectionTitle, fontSize: 'clamp(16px, 4vw, 20px)' }}>Information from websites that use our Services</h3>
          <p style={styles.paragraph}>
            We collect information when you visit or use third-party websites and apps that use our Services (such as an embedded map). This includes information about the websites, your use of our Services on those websites, as well as information the developer or publisher of the website provides to you or us.
          </p>
          <h3 style={{ ...styles.sectionTitle, fontSize: 'clamp(16px, 4vw, 20px)' }}>Information we may receive from third parties</h3>
          <p style={styles.paragraph}>
            We may receive information about you from third parties, including, without limitation, our business partners, third party suppliers, and customers.
          </p>
          <h3 style={{ ...styles.sectionTitle, fontSize: 'clamp(16px, 4vw, 20px)' }}>Cookies</h3>
          <p style={styles.paragraph}>
            Cookies are files with a small amount of data, which may include an anonymous unique identifier. Cookies are sent to your browser from a website and stored on your device. We and our third party partners use "cookies" to automatically collect information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of the Service.
          </p>
          <h3 style={{ ...styles.sectionTitle, fontSize: 'clamp(16px, 4vw, 20px)' }}>Log data</h3>
          <p style={styles.paragraph}>
            We may also collect information that your browser sends whenever you visit our Service ("Log Data"). This Log Data may include information such as your device Internet Protocol ("IP") address, operating system, browser type, browser version, language, time zone, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages and other statistics. In addition, we may use third-party services, such as Google Analytics and Intercom that collect, monitor and analyze this type of information in order to increase functionality of our Service. These third-parties may use cookies to help us analyze how our users are using the Service and they have their own Privacy Policies addressing how they use such information. Features of the Service may require you to opt-in to providing your specific geographic locations, as determined through GPS, Bluetooth, or WiFi signals.
          </p>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>2. How we store your information</h2>
          <p style={styles.paragraph}>
            Personal Information collected by GeoPulse Limited is securely stored on our servers and is not accessible by our employees or third parties except for use as indicated below. It should be noted that the transmission of information via the internet is not completely secure. Although we will do our best to protect your personal data, we cannot guarantee the security of your data transmitted to our site and any transmission is at your own risk. Once we have received your information, we use strict procedures and security features to try to prevent unauthorised access.
          </p>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>3. How we use your information</h2>
          <h3 style={{ ...styles.sectionTitle, fontSize: 'clamp(16px, 4vw, 20px)' }}>Provision of Services</h3>
          <p style={styles.paragraph}>
            We use Personal Information to operate, maintain, and provide to you the features and functionality of the Service, as well as to communicate directly with you, such as to send you email messages and push notifications within the Service in pursuit of service improvement, technical support, and research. Personal Information is also used to facilitate identification, authentication, and billing. We may also send you Service-related emails or messages (e.g., account verification, invoices, confirmations, change or updates to features of the Service, technical and security announcements).
          </p>
          <h3 style={{ ...styles.sectionTitle, fontSize: 'clamp(16px, 4vw, 20px)' }}>Marketing and Communications</h3>
          <p style={styles.paragraph}>
            We may use your Personal Information to contact you with newsletters, marketing or promotional materials and other information that may be of interest to you. You may opt out of receiving any or all of these communications from us by following the unsubscribe link or instructions provided in any email we send, or by contacting us. GeoPulse uses remarketing services to advertise on third-party websites to you after you visited our Service. We and our third-party vendors use cookies to inform, optimize and serve ads based on your past visits to our Service.
          </p>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>4. Who do we share your information with?</h2>
          <h3 style={{ ...styles.sectionTitle, fontSize: 'clamp(16px, 4vw, 20px)' }}>Service providers</h3>
          <p style={styles.paragraph}>
            We may employ third-party companies and individuals to facilitate our Service, to provide the Service on our behalf, to perform Service-related services or to assist us in analyzing how our Service is used. These third parties have access to your Personal Information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
          </p>
          <h3 style={{ ...styles.sectionTitle, fontSize: 'clamp(16px, 4vw, 20px)' }}>Recurly</h3>
          <p style={styles.paragraph}>
            Recurly provides subscription management services. Payment information is required to use the Service, and may include your name, address, and credit card information. This information is used solely for billing purposes by our PCI-certified payment provider, Recurly. Your credit card information is encrypted and transmitted to Recurly securely via HTTPS. You can learn more about Recurly’s security practices (<a href="https://recurly.com/security/" style={styles.link}>https://recurly.com/security/</a>), and Privacy Policy (<a href="https://recurly.com/legal/privacy" style={styles.link}>https://recurly.com/legal/privacy</a>). Your credit card details are never stored on our servers, and no one at GeoPulse Limited can access them. Authorized staff involved in customer Account billing may have access to your payment card expiration date to ensure your payment information remains valid. Recurly subscription management is provided by Recurly, Inc.
          </p>
          <h3 style={{ ...styles.sectionTitle, fontSize: 'clamp(16px, 4vw, 20px)' }}>Stripe</h3>
          <p style={styles.paragraph}>
            Stripe is a PCI-certified payment gateway. We use Stripe to process credit cards for billing purposes. Please read their Security policy (<a href="https://stripe.com/docs/security" style={styles.link}>https://stripe.com/docs/security</a>) and Privacy Policy (<a href="https://stripe.com/privacy" style={styles.link}>https://stripe.com/privacy</a>) for further information. Stripe payment processing is provided by Stripe, Inc.
          </p>
          <h3 style={{ ...styles.sectionTitle, fontSize: 'clamp(16px, 4vw, 20px)' }}>Google Analytics</h3>
          <p style={styles.paragraph}>
            You can opt-out from Google Analytics service from using your information by installing the Google Analytics Opt-out Browser tool: (<a href="https://tools.google.com/dlpage/gaoptout" style={styles.link}>https://tools.google.com/dlpage/gaoptout</a>). For more information on the privacy practices of Google, please visit the Google Privacy & Terms web page: (<a href="http://www.google.com/policies/privacy/" style={styles.link}>http://www.google.com/policies/privacy/</a>). Google Analytics service is provided by Google Inc.
          </p>
          <h3 style={{ ...styles.sectionTitle, fontSize: 'clamp(16px, 4vw, 20px)' }}>Google</h3>
          <p style={styles.paragraph}>
            You can opt-out of Google Analytics for Display Advertising and customize the Google Display Network ads by visiting the Google Ads Settings page: (<a href="http://www.google.com/settings/ads" style={styles.link}>http://www.google.com/settings/ads</a>). For more information on the privacy practices of Google, please visit the Google Privacy & Terms web page: (<a href="http://www.google.com/policies/privacy/" style={styles.link}>http://www.google.com/policies/privacy/</a>). Google AdWords remarketing service is provided by Google Inc.
          </p>
          <h3 style={{ ...styles.sectionTitle, fontSize: 'clamp(16px, 4vw, 20px)' }}>Dropbox</h3>
          <p style={styles.paragraph}>
            Dropbox is used to provide the GeoPulse Data Sync tool. For information about what type of data Dropbox collects and stores, please visit their Terms (<a href="https://www.dropbox.com/terms" style={styles.link}>https://www.dropbox.com/terms</a>) and Privacy Policy (<a href="https://www.dropbox.com/terms#privacy" style={styles.link}>https://www.dropbox.com/terms#privacy</a>). Dropbox is provided by Dropbox, Inc.
          </p>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>5. How long do we keep your information?</h2>
          <p style={styles.paragraph}>
            Following termination or deactivation of your Account, we may retain your profile information and User Data for a commercially reasonable time for backup, archival, or audit purposes.
          </p>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>6. Disclosure and compliance with laws</h2>
          <p style={styles.paragraph}>
            From time to time, and only in cases where Service delivery or compliance with law enforcement requires, we may disclose your Personal Information to selected third parties, including: in the event that we sell or buy any business or assets, the prospective seller or buyer of such business or assets; if GeoPulse Limited or substantially all of its assets are acquired by a third party, to the relevant third party; business parties and subcontractors for the purposes of providing the GeoPulse Limited Services; analytics providers that assist us in the improvement and optimization of our website and Service; law enforcement agencies or other third parties: We may disclose your Personal Information where required to do so by law or subpoena, or if we believe that such action is necessary to comply with the law and the reasonable requests of law enforcement, or to protect the security or integrity of our Service.
          </p>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>7. What are your privacy rights?</h2>
          <p style={styles.paragraph}>
            You have the right to request we not process your Personal Information for marketing purposes. You can exercise your right to prevent such processing by unsubscribing from our emails, newsletters, and other communications. You can exercise this right at any time by contacting us at <a href="mailto:support@geopulse.com" style={styles.link}>support@geopulse.com</a>. You have the right to access information held about you. Any access request may be subject to a reasonable fee to meet our costs in providing you details of the Personal Information we hold about you.
          </p>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>8. Changes to this Privacy Policy</h2>
          <p style={styles.paragraph}>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
          </p>
        </div>

       

       
      </div>
    </div>
  );
}