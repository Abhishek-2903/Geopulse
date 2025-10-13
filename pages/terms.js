import React, { useState, useEffect } from 'react';

const TermsOfService = () => {
  const [activeSection, setActiveSection] = useState('definitions');

  const sections = [
    { id: 'definitions', title: 'Definitions' },
    { id: 'accounts', title: 'Accounts' },
    { id: 'partners', title: 'Partners' },
    { id: 'subscriptions', title: 'Subscriptions' },
    { id: 'fees', title: 'Fees & Modifications' },
    { id: 'refunds', title: 'Refunds & Changes' },
    { id: 'cancellation', title: 'Cancellation' },
    { id: 'liability', title: 'Limitation of Liability' },
    { id: 'disclaimer', title: 'Disclaimer' },
    { id: 'copyright', title: 'Copyright & Ownership' },
    { id: 'dmca', title: 'DMCA Compliance' },
    { id: 'fair-usage', title: 'Fair Usage Policy' },
    { id: 'other', title: 'Other Terms' },
    { id: 'support', title: 'Support' },
    { id: 'security', title: 'Data Security' },
    { id: 'contact', title: 'Contact' },
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

    .tos-container {
      min-height: 100vh;
      background: #ffffff;
      color: #1a1a1a;
      padding: 48px 20px;
    }

    .tos-wrapper {
      max-width: 1200px;
      margin: 0 auto;
    }

    .tos-header {
      text-align: center;
      margin-bottom: 48px;
    }

    .tos-header h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 16px;
      color: #000000;
    }

    .tos-header p {
      font-size: 1.125rem;
      color: #4a5568;
    }

    .tos-nav-container {
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

    .tos-nav-list {
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 12px;
    }

    .tos-nav-button {
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

    .tos-nav-button:hover {
      background: #000000;
      color: #ffffff;
      border-color: #000000;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .tos-nav-button.active {
      background: #000000;
      color: #ffffff;
      border-color: #000000;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .tos-nav-button:focus {
      outline: 2px solid #333333;
      outline-offset: 2px;
    }

    .tos-main-content {
      max-width: 900px;
      margin: 0 auto;
    }

    .tos-section {
      margin-bottom: 48px;
      padding: 32px;
      background: #f9f9f9;
      border: 1px solid #e5e5e5;
      border-radius: 12px;
    }

    .tos-section h2 {
      font-size: 1.875rem;
      font-weight: 600;
      margin-bottom: 24px;
      color: #000000;
      border-bottom: 2px solid #000000;
      padding-bottom: 12px;
    }

    .tos-section h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-top: 24px;
      margin-bottom: 16px;
      color: #000000;
    }

    .tos-section p {
      margin-bottom: 16px;
      color: #2c3e50;
      font-size: 1.05rem;
    }

    .tos-section ul {
      margin-left: 24px;
      margin-bottom: 16px;
    }

    .tos-section ol {
      margin-left: 24px;
      margin-bottom: 16px;
    }

    .tos-section li {
      margin-bottom: 12px;
      color: #2c3e50;
    }

    .tos-section strong {
      color: #000000;
      font-weight: 600;
    }

    .tos-section em {
      font-style: italic;
    }

    .tos-definition {
      margin-bottom: 16px;
      padding-left: 16px;
    }

    .tos-contact-info {
      background: #ffffff;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
      margin-top: 16px;
    }

    .tos-footer {
      text-align: center;
      margin-top: 48px;
      padding: 32px 0;
      border-top: 1px solid #e0e0e0;
    }

    .tos-footer p {
      color: #6b7280;
      margin-bottom: 8px;
    }

    .tos-footer .copyright {
      font-size: 0.875rem;
      color: #9ca3af;
    }

    @media (max-width: 768px) {
      .tos-header h1 {
        font-size: 2rem;
      }

      .tos-nav-button {
        font-size: 0.875rem;
        padding: 8px 16px;
      }

      .tos-section {
        padding: 20px;
      }

      .tos-section h2 {
        font-size: 1.5rem;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <div className="tos-container">
        <div className="tos-wrapper">
          <header className="tos-header">
            <h1>GeoPulse Terms of Service</h1>
           
          </header>

          <nav className="tos-nav-container">
            <ul className="tos-nav-list">
              {sections.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => scrollToSection(section.id)}
                    className={`tos-nav-button ${activeSection === section.id ? 'active' : ''}`}
                    aria-current={activeSection === section.id ? 'page' : undefined}
                    aria-label={`Navigate to ${section.title} section`}
                  >
                    {section.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <main className="tos-main-content">
            <section id="definitions" className="tos-section">
              <h2>Definitions</h2>
              <p>The following definitions apply to this Agreement:</p>
              
              <div className="tos-definition">
                <p><strong>"us", "we", or "our"</strong>: GeoPulse</p>
              </div>
              
              <div className="tos-definition">
                <p><strong>"you", "your", "Customer"</strong>: you, an individual or organization</p>
              </div>
              
              <div className="tos-definition">
                <p><strong>"Order Form"</strong>: means an order form agreed and executed by both parties, setting out the Services ordered by the Customer or changes to the Services ordered by either Party</p>
              </div>
              
              <div className="tos-definition">
                <p><strong>"Services"</strong>: means the services provided by GeoPulse as set out in an Order Form and the service accessible at the GeoPulse platform</p>
              </div>
              
              <div className="tos-definition">
                <p><strong>"User Data"</strong>: business data and other information related to you, your customers, or your business</p>
              </div>
              
              <div className="tos-definition">
                <p><strong>"Account"</strong>: the access point that a Customer has to the Services, comprising a unique username (or email address) and a password</p>
              </div>
              
              <div className="tos-definition">
                <p><strong>"Subscription"</strong>: the contract or agreement between the Customer and us, where a regular recurring fee is paid in exchange for access to the Services</p>
              </div>
              
              <div className="tos-definition">
                <p><strong>"Billing Cycle"</strong>: refers to the recurring time period for which a Customer is billed for the use of the Services</p>
              </div>
              
              <div className="tos-definition">
                <p><strong>"Standard Terms"</strong>: means these terms and conditions</p>
              </div>

              <p>If there is any conflict between the terms of this Agreement, the following order of priority shall apply:</p>
              <ol>
                <li>Order Form(s); and</li>
                <li>Standard Terms.</li>
              </ol>

              <p>To access the Services, Customers must at all times agree to and abide by these Terms. The Services allow you to submit, store, User Data. These Terms apply to all visitors, Customers and others who access or use the Service.</p>

              <p>By accessing or using the Services you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Services.</p>
            </section>

            <section id="accounts" className="tos-section">
              <h2>Accounts</h2>
              <p>When you create an account with us, you must provide us information that is accurate, complete, and current at all times. You must provide your legal full name, a valid email address, and any other information requested during the Account creation process. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your Account.</p>

              <p>You are responsible for safeguarding the password that you use to access the Services and for any activities or actions under your password, whether your password is with our Services or a third-party service. GeoPulse cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.</p>

              <p>You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</p>

              <p>You must be 13 years or older to create an Account using this Services, and you must be human. Accounts registered by "bots" or other automated methods are not permitted.</p>

              <p>Your login credentials may only be used by one person – a single Account shared by multiple people is not permitted.</p>

              <p>All User Data uploaded to the Services and activity that occurs under your Account (even when User Data is posted by others who have access to your account through additional login credentials) is solely your responsibility. The Service must not be used for any illegal or unauthorized purpose. You must not, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright laws).</p>

              <h3>Prohibited Activities</h3>
              <p>You must not:</p>
              <ul>
                <li>Upload, post, host, or transmit unsolicited email, SMSs, or "spam" messages</li>
                <li>Transmit any worms or viruses or any code of a destructive nature</li>
                <li>Modify, adapt or hack the Services or modify another website so as to falsely imply that it is associated with the Services, GeoPulse, or any other GeoPulse service</li>
                <li>Reproduce, duplicate, copy, sell, resell or exploit with malicious intent any portion of the Services, use of the Services, or access to the Services without the express written permission by GeoPulse</li>
              </ul>

              <p>Verbal, physical, written or other abuse (including threats of abuse or retribution) of any customer, employee, member, or officer of GeoPulse will result in immediate Account termination.</p>

              <p>We may, but have no obligation to, terminate Accounts containing User Data that we determine in our sole discretion are unlawful, offensive, threatening, libellous, defamatory, pornographic, obscene or otherwise objectionable or violates any party's intellectual property or these Terms of Services.</p>
            </section>

            <section id="partners" className="tos-section">
              <h2>Partners</h2>
              <p>A "Partner" is an individual or entity that has agreed to these Terms of Service and participates in the GeoPulse Partner Program.</p>

              <p>The Partner will comply with all applicable laws and highest industry standards.</p>

              <h3>Partner Requirements</h3>
              <p>The Partner must:</p>
              <ul>
                <li>Be at least 18 years old or the age of majority where Partner resides</li>
                <li>Provide certain Personal Information necessary for registration and authentication, and agree that email will be our primary method of communication</li>
                <li>Make certain acknowledgments if signing up on behalf of an employer or a company</li>
                <li>Agree that this Agreement may be changed by GeoPulse at any time</li>
                <li>Acknowledge and agree to GeoPulse's Privacy Policy</li>
                <li>Not use GeoPulse's trademarks as part of its name or brand unless permitted under these Terms</li>
                <li>Not buy search engine advertising, trademarks or domain names that mention or use "GeoPulse" or other GeoPulse logos</li>
              </ul>

              <h3>Termination</h3>
              <p>Either GeoPulse or Partner can end this agreement at any time by providing notice to the other. If there is fraud or any other unacceptable behaviour by Partner, or if Partner violates these Terms of Service, GeoPulse can suspend Partner's privileges or end the agreement without notice. GeoPulse can change or eliminate all or any portion of the Partner Program at any time, upon reasonable notice.</p>

              <p>All of the information, property and intellectual property you have access to as a result of your participation in the GeoPulse Partner Program belongs entirely to GeoPulse.</p>

              <p>Both GeoPulse and Partner agree to use Confidential Information and Personal Information only to perform the obligations of these Terms. Confidential Information and Personal Information must be protected and respected.</p>
            </section>

            <section id="subscriptions" className="tos-section">
              <h2>Subscriptions</h2>
              <p>Some parts of the Services are billed on a Subscription basis. You will be billed in advance on an agreed recurring and periodic Billing Cycle. Billing Cycles are set either on a monthly, quarterly, annual, or multi-year basis, depending on the type of subscription plan you select when purchasing a Subscription.</p>

              <p>At the end of each Billing Cycle, your Subscription will automatically renew under the exact same conditions unless you cancel it or we cancel it. You may terminate your Subscription renewal by closing your account in your Account panel.</p>

              <p>A valid payment method, such as credit card, is required to process the payment for your Subscription. You shall provide us with accurate and complete billing information including full name and a valid payment method information. By submitting such payment information, you automatically authorize us to charge all Subscription fees incurred through your account to any such payment instruments.</p>
            </section>

            <section id="fees" className="tos-section">
              <h2>Fees and Modifications to the Services</h2>
              <p>We, in our sole discretion and at any time, may modify or discontinue, temporarily or permanently, the Services (or any part thereof) with or without notice.</p>

              <p>We, in our sole discretion and at any time, may modify the Subscription fees for any Subscription or optional add-on. Any fee change will become effective at the end of the then-current Billing Cycle.</p>

              <p>We will provide you with a reasonable prior notice of 30 days any change in Subscription fees to give you an opportunity to terminate your Subscription before such change becomes effective.</p>

              <p>Your continued use of the Services after the Subscription fee change comes into effect constitutes your agreement to pay the modified Subscription fee amount.</p>

              <p>GeoPulse shall not be liable to you or to any third party for any modification, price change, suspension, or discontinuance of the Services.</p>
            </section>

            <section id="refunds" className="tos-section">
              <h2>Refunds, Upgrades, and Downgrades</h2>
              <p>All charges are non-refundable unless expressly stated otherwise, or otherwise provided by applicable law.</p>

              <p>The Services is billed in advance as per your chosen Billing Cycle and is non-refundable. There will be no refunds or credits for partial periods of usage, upgrade or downgrade, or refunds for any unused period with an Active account. In order to treat everyone equally, no exceptions will be made.</p>

              <h3>Upgrades</h3>
              <p>An upgrade from a trial Account to any paid plan will end your free trial. You will be billed for your first Billing Cycle immediately upon upgrading.</p>

              <p>Upon successful checkout of a purchase or upgrade, any new account features of the new plan will be available for use immediately.</p>

              <h3>Downgrades</h3>
              <p>Downgrading your Services may cause the loss of User Data, features, or capacity of your Account. GeoPulse does not accept any liability for any loss incurred as a result of downgrading.</p>

              <h3>Additional Fees</h3>
              <p>GeoPulse is not responsible for any bank fees, interest charges, finance charges, overdraft charges, or other fees resulting from charges billed for the Services. Currency exchange settlements will be based on agreements between you and the provider of your credit card.</p>

              <p>All Subscription fees and optional Account add-ons are exclusive of all taxes, levies, or duties imposed by taxing authorities, and you shall be responsible for payment of all such taxes, levies, or duties.</p>
            </section>

            <section id="cancellation" className="tos-section">
              <h2>Cancellation and Termination</h2>
              <p>You may cancel your GeoPulse account at any time from your Account administration panel. We do not provide refunds for any remaining credit for your Subscription's Billing Cycle.</p>

              <p>Upon cancellation, all User Data associated with the Account will be immediately deleted from the Services. Once deleted, User Data cannot be recovered.</p>

              <p>GeoPulse, in its sole discretion, has the right to suspend or terminate your account and refuse any and all current or future use of the Services, or any other GeoPulse Services, for any reason at any time. Upon suspension or termination, your right to use the Services will stop immediately. You may not have access to User Data that you stored on the site after we suspend or terminate your account. You are responsible for backing up User Data that you use with the Services.</p>

              <p>Termination of the Services will result in the deletion of your User Data or your access to your Account, and the forfeiture and relinquishment of all User Data in your Account. GeoPulse reserves the right to refuse service to anyone for any reason at any time.</p>
            </section>

            <section id="liability" className="tos-section">
              <h2>Limitation of Liability</h2>
              <p>You expressly understand and agree that GeoPulse shall not be liable for any direct, indirect, incidental, special, consequential or exemplary damages, including but not limited to, damages for loss of profits, goodwill, use, data or other intangible losses (even if GeoPulse has been advised of the possibility of such damages), resulting from:</p>

              <ul>
                <li>The use or the inability to use the Services</li>
                <li>The cost of procurement of substitute goods and services resulting from any goods, data, information or services purchased or obtained or messages received or transactions entered into through or from the Services</li>
                <li>Unauthorized access to or alteration of your transmissions or data</li>
                <li>Statements or conduct of any third party access through the Services</li>
                <li>Or any other matter relating to the Services</li>
              </ul>
            </section>

            <section id="disclaimer" className="tos-section">
              <h2>Disclaimer</h2>
              <p>Your use of the Service is at your sole risk. The Service is provided on an "as is" and "as available" basis.</p>

              <p>The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance.</p>

              <p>GeoPulse, its subsidiaries, affiliates, and its licensors do not warrant that:</p>

              <ul>
                <li>The service will meet your specific requirements</li>
                <li>The service will be uninterrupted, timely, secure, or error-free</li>
                <li>The results that may be obtained from the use of the service will be accurate or reliable</li>
                <li>The quality of any products, services, information, or other material purchased or obtained by you through the service will meet your expectations</li>
                <li>Any errors in the Service will be corrected</li>
              </ul>

              <p>While GeoPulse prohibits such conduct and User Data on the Service, you understand and agree that GeoPulse cannot be responsible for the User Data posted on the Service and you nonetheless may be exposed to such materials.</p>
            </section>

            <section id="copyright" className="tos-section">
              <h2>Copyright and Content Ownership</h2>
              <p>We claim no intellectual property rights over the User Data or material you provide to the Service. Your Personal Information and User Data uploaded remain yours. However, by opting to make your User Data public and available to anonymous users through configuration of dataset access settings to a public state, you agree to allow others to view, access, or download your User Data without restriction. By opting to configure your maps as online and to be viewed publicly without access control, you agree to allow others to view your maps.</p>

              <p>GeoPulse does not pre-screen User Data, but GeoPulse and its designee have the right (but not the obligation) in their sole discretion to refuse or remove any User Data that is available via the Service.</p>

              <p>In addition, we are not a content-archiving service. We do not promise to store or make available on our Services any User Data that you post, or any other content, for any length of time. You are solely responsible for keeping back-ups of everything you post on our Services.</p>
            </section>

            <section id="dmca" className="tos-section">
              <h2>Digital Millennium Copyright Act Compliance</h2>
              <p>If you are a copyright owner or an agent thereof, and believe that any User Data or other material infringes upon your copyrights, you may submit a notification pursuant to the Digital Millennium Copyright Act ("DMCA") by providing our Copyright Agent with the following information in writing (see 17 U.S.C § 512(c)(3) for further detail):</p>

              <ul>
                <li>A physical or electronic signature of a person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed</li>
                <li>Identification of the copyrighted work claimed to have been infringed, or, if multiple copyrighted works on the Services are covered by a single notification, a representative list of such works from the Services</li>
                <li>Identification of the material that is claimed to be infringing or to be the subject of infringing activity and that is to be removed or access to which is to be disabled, and information reasonably sufficient to permit us to locate the material</li>
                <li>Information reasonably sufficient to permit us to contact the complaining party, such as an address, telephone number, and, if available, an electronic mail address</li>
                <li>A statement that the complaining party has a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law</li>
                <li>A statement that the information in the notification is accurate, and under penalty of perjury, that the complaining party is authorized to act on behalf of the owner of an exclusive right that is allegedly infringed</li>
              </ul>

              <p>The designated Copyright Agent to receive notifications of claimed infringement is: <strong>geopulsee@proton.me</strong></p>
            </section>

            <section id="fair-usage" className="tos-section">
              <h2>Fair Usage Policy</h2>
              <p>Accounts can have up to 50,000 map views per month under our fair usage policy. Customers who think their maps will exceed this level regularly should contact GeoPulse support.</p>

              <p>If your bandwidth usage significantly exceeds the average bandwidth usage (as determined solely by us) of others accessing of the Services, we reserve the right to immediately disable your account or throttle your file hosting until you can reduce your bandwidth consumption.</p>
            </section>

            <section id="other" className="tos-section">
              <h2>Other Terms</h2>
              
              <h3>Waiver</h3>
              <p>The failure of GeoPulse to exercise or enforce any right or provision of these Terms will not constitute a waiver of such right or provision. Any waiver of any provision of these Terms will be effective only if in writing and signed by an authorized representative of GeoPulse.</p>

              <p>If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect. These Terms constitute the entire agreement between you and us and govern your use of the Services, superseding any prior agreements between you and us (including, but not limited to, any prior versions of these Terms of Services).</p>

              <h3>Notice of Modification</h3>
              <p>GeoPulse reserves the right to update and change these Terms of Service from time to time without notice. Any new features that augment or enhance the current Services, including the release of new tools and resources, shall be subject to the Terms of Service. Continued use of the Service after any such changes shall constitute your consent to such changes. You can review the most current version of the Terms of Service at any time.</p>

              <h3>Indemnification</h3>
              <p>You agree to indemnify and hold harmless GeoPulse and its respective directors, officers, employees and agents from and against any and all claims and expenses, including attorneys' fees, arising out of your use of the Services, including but not limited to your violation of the Terms.</p>
            </section>

            <section id="support" className="tos-section">
              <h2>Support</h2>
              <p>Our commitment to providing outstanding customer support is a cornerstone of our Services. Support requests can be submitted through our Help Centre.</p>

              <h3>Response Times</h3>
              <p>The expected response times for each of our plans are as follows:</p>

              <ul>
                <li><strong>Tier 1 (Agency Plan):</strong> Our Agency plan customers enjoy our fastest support responses, with replies typically sent within 12 hours of the request submitted through the GeoPulse Help Centre.</li>
                <li><strong>Tier 2 (Enterprise Plan):</strong> As an Enterprise plan customer, you'll benefit from our priority support, and we aim to respond to your queries, submitted via the GeoPulse Help Centre, within one business day.</li>
                <li><strong>Tier 3 (Business Plan):</strong> For our Business plan customers, we strive to respond to all support requests, submitted through the GeoPulse Help Centre, within two business days.</li>
                <li><strong>Tier 4 (Professional Plan):</strong> If you're on our Professional plan, you can expect to receive a response within three business days after submitting a support request via the GeoPulse Help Centre.</li>
              </ul>

              <p>Please note that these times are maximum estimates and we always strive to respond to our customers as soon as possible.</p>

              <p>For our Enterprise and Agency plan customers, phone support is available by appointment. This allows us to ensure we provide timely and effective phone assistance. Unfortunately, phone support is currently not available for Professional and Business plans.</p>

              <p>These published response times apply to standard business days and hours, and might be affected by national holidays. We appreciate your understanding and are dedicated to assisting you as quickly and effectively as possible.</p>
            </section>

            <section id="security" className="tos-section">
              <h2>Data Security</h2>
              <p>You understand and accept that GeoPulse uses third party vendors and hosting partners to provide the necessary hardware, software, networking, storage, and related technology required to run the Services.</p>

              <p>You understand and accept that the technical processing and transmission of the Services, including your User Data, may be transferred unencrypted and involve:</p>

              <ul>
                <li>Transmissions over various networks; and</li>
                <li>Changes to conform and adapt to technical requirements of connecting networks or devices.</li>
              </ul>

              <p>For further details about the Data Security processes in place at GeoPulse, please contact our support team.</p>
            </section>

            <section id="contact" className="tos-section">
              <h2>Contact</h2>
              <p>If you have any questions, comments or requests regarding the Terms of Service, please contact us:</p>

              <div className="tos-contact-info">
                <p><strong>Email:</strong> geopulsee@proton.me</p>
                <p><strong>Address:</strong><br />
                GeoPulse<br />
                1 Victoria Street<br />
                Bristol, BS1 6AA<br />
                United Kingdom</p>
               
              </div>
            </section>
          </main>

          <footer className="tos-footer">
            <p>
              For additional support or inquiries, please contact the GeoPulse support team.
            </p>
            <p className="copyright">
              &copy; 2025 GeoPulse. 1 Victoria Street, Bristol BS1 6AA, UK. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </>
  );
};

export default TermsOfService;