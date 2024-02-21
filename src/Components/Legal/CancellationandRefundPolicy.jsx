import React from 'react';
import BaseLayout from '../../Layout/BaseLayout';
import { Helmet } from 'react-helmet';
import './module.css'; 
import { NavLink } from 'react-router-dom';

function CancellationAndRefundPolicy() {
  return (
    <BaseLayout>
      <Helmet>
        <meta charSet="utf-8" />
        <title>EdLernity | Cancellation-And-Refund-Policy</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>

      <div className="cancellation-refund-policy-container">
        <h1 className='text-center justify-center text-3xl underline' style={{color:"rgba(21,57,207,1)"}}>Cancellation and Refund Policy</h1>

        <p className='mt-8'>
          At EdLernity, we strive to provide exceptional services to our valued customers. In the event that you need to cancel your enrollment or request a refund, please review our policy below:
        </p>

        <strong>1. Cancellation Policy:</strong>
        <ul>
          <li>Cancellations must be requested in writing via email to our customer support team at least within 7 hours prior to the start date of the course or service.</li>
          <li>Any cancellation made within 7 hours of the course or service start date may be subject to a cancellation fee.</li>
          <li>Cancellations made after the course or service has commenced may not be eligible for a refund.</li>
        </ul>

        <strong>2. Refund Policy:</strong>
        <ul>
          <li>Refund requests must be made in writing via email to our customer support team.</li>
          <li>Refunds will be issued based on the following criteria:
            <ul>
              <li>If a cancellation is made within the specified timeframe and meets the eligibility criteria, a full refund of the course/service fee will be issued.</li>
              <li>Refunds for cancellations made after the specified timeframe or outside of the eligibility criteria will be subject to review and may be issued at the discretion of EdLernity.</li>
            </ul>
          </li>
          <li>Refunds will be processed using the original method of payment within 7 business days of approval.</li>
        </ul>

        <strong>3. Course or Service Changes:</strong>
        <ul>
          <li>EdLernity reserves the right to cancel or reschedule courses or services due to unforeseen circumstances or low enrollment.</li>
          <li>In the event of a course or service cancellation by EdLernity, customers will be notified promptly, and alternative arrangements or a refund will be offered.</li>
        </ul>

        <strong>4. Exceptions:</strong>
        <ul>
          <li>Exceptions to this policy may be granted in extenuating circumstances, subject to review and approval by EdLernity management.</li>
        </ul>

        <p>
          By enrolling in our courses or using our services, you agree to abide by the terms and conditions outlined in this cancellation and refund policy. For any questions or assistance, please contact our customer support team at <NavLink to="mailto:info@edlernity.com" style={{color:"rgba(21,57,207,1)"}}>info@edlernity.com</NavLink>.
        </p>
      </div>
    </BaseLayout>
  );
}

export default CancellationAndRefundPolicy;
