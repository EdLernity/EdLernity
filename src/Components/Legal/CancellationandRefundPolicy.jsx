import React from 'react';
import { Helmet } from 'react-helmet';
import { NavLink } from 'react-router-dom';
import BaseLayout from '../../Layout/BaseLayout';
import './module.css';

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
          We are committed to ensuring your satisfaction with any product, service, course, or workshop you have purchased from us. Please read the following terms carefully as they govern our refund policy.
        </p>

        <strong>Workshops:</strong>
        <ul>
          <li>No refunds or credits will be granted against payments related to workshops.</li>
        </ul>

        <strong>Courses:</strong>
        <ul>
          <li>We do not offer refunds for courses. Please carefully consider your schedule and commitment before enrolling.</li>
          <li>You may transfer your enrollment to a subsequent cohort. A nominal administrative fee will apply for such transfers.</li>
        </ul>

        <strong>Contact us:</strong>
        <p>
          If you have any questions about our refund policy, please contact us by email at <NavLink to="mailto:info@edlernity.com" style={{color:"rgba(21,57,207,1)"}}>info@edlernity.com</NavLink>.
        </p>
      </div>
    </BaseLayout>
  );
}

export default CancellationAndRefundPolicy;
