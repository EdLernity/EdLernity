import React from 'react';
import BaseLayout from '../../Layout/BaseLayout';
import { Helmet } from 'react-helmet';
import './module.css'; // Import CSS for styling
import { NavLink } from 'react-router-dom';

function PrivacyPolicy() {
  return (
    <BaseLayout>
      <Helmet>
        <meta charSet="utf-8" />
        <title>EdLernity | Privacy Policy</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>

      <div className="privacy-policy-container">
      <h1 className='text-center justify-center text-3xl items-center mt-10 underline' style={{color:"rgba(21,57,207,1)"}}>Privacy Policy</h1>
        <h2 className='text-2xl mt-8  font-semibold'>Privacy Policy for EdLernity Tech (OPC) Private Limited</h2>

        <strong className='text-lg'>Introduction:</strong>
        <p>
          Welcome to EdLernity Tech (OPC) Private Limited's Privacy Policy. At EdLernity Tech, we are committed to protecting the privacy of our users. This Privacy Policy outlines the types of information we collect, how we use it, and the choices you have concerning your data. By using our website or services, you agree to the terms outlined in this policy.
        </p>

        <h2>Information We Collect:</h2>
        <p>
          <strong>1. Personal Information:</strong>
          <br />
          When you visit our website or use our services, we may collect personal information such as your name, email address, phone number, and address. This information is collected with your consent and is necessary for the provision of our services.
        </p>

        <p>
          <strong>2. Usage Data:</strong>
          <br />
          We may collect non-personal information about how you interact with our website and services. This includes data such as IP addresses, browser type, pages viewed, and the duration of visits. This information is used for analytics and to improve our services.
        </p>

        <p>
          <strong>3. Cookies:</strong>
          <br />
          We use cookies to enhance your experience on our website. Cookies are small files stored on your device that help us analyze web traffic and customize content. You can choose to accept or decline cookies through your browser settings.
        </p>

        <h2>How We Use Your Information:</h2>
        <p>
          We use the collected information for the following purposes:
        </p>
        <p>
        <strong>1.Service Provision:</strong> <br/>
         <p>To provide and maintain our services to you. </p>
        <strong>2.Communication:</strong> <br/>
        <p> To communicate with you regarding our services, updates, and important notices.</p>
        <strong>3.Improvement:</strong> <br/>
      <p> To analyze usage data and improve the functionality and content of our website and services.</p> 
        <strong>4.Marketing:</strong> <br/>
        <p> With your consent, we may send you promotional materials and offers. You can opt-out of these communications at any time.</p>
        </p>

        <strong>Information Sharing:</strong>
        <p>
          We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this Privacy Policy or as required by law.
        </p>

        <strong>Third-Party Services:</strong>
        <p>
          Our website may contain links to third-party websites or services. These third-party sites have their own privacy policies, and we are not responsible for their practices. We encourage you to review the privacy policies of these third parties.
        </p>

        <strong>Security:</strong>
        <p>
          We take reasonable measures to protect the security of your personal information. However, no method of transmission over the internet or electronic storage is 100% secure. Therefore, while we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
        </p>

        <strong>Your Choices:</strong>
        <p>
          You have the right to:
        </p>
        <p>
          <ol>1.Access and update your personal information.</ol>
          <ol>2.Opt-out of receiving promotional communications.</ol>
          <ol>3.Request the deletion of your account and personal information.</ol>
        </p>
        <p>
          To exercise these rights, please contact us at <NavLink to="mailto:edlernity@gmail.com" style={{color:"rgba(21,57,207,1)"}}>edlernity@gmail.com</NavLink>.
        </p>

        <strong>Changes to This Privacy Policy:</strong>
        <p>
          We may update our Privacy Policy from time to time. Any changes will be posted on this page, and the date of the last update will be modified accordingly.
        </p>

        <strong>Contact Us:</strong>
        <p>
          If you have any questions or concerns about our Privacy Policy, please contact us at <NavLink to="mailto:info@edlernity.com" style={{color:"rgba(21,57,207,1)"}}>info@edlernity.com</NavLink>.
        </p>
      </div>
    </BaseLayout>
  );
}

export default PrivacyPolicy;
