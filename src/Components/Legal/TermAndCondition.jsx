import React from 'react';
import BaseLayout from '../../Layout/BaseLayout';
import { Helmet } from 'react-helmet';
import './module.css';
import { NavLink } from 'react-router-dom';

function TermAndCondition() {
  return (
    <BaseLayout>
      <Helmet>
        <meta charSet="utf-8" />
        <title>EdLernity | Term-And-Condition</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>

      <div className="term-and-condition-container">
      <h1 className='text-center mt-10 text-3xl justify-center underline' style={{color:"rgba(21,57,207,1)"}}>Term-And-Condition</h1>
        <h3 className='text-2xl mt-18'>Welcome to EdLernity</h3>
        <p>
          These terms and conditions outline the rules and regulations for the use of EdLernity Tech (OPC) Private Limited's Website, located at [https://edlernity.com]. By accessing this website, we assume you accept these terms and conditions. Do not continue to use EdLernity if you do not agree to take all of the terms and conditions stated on this page.
        </p>

        <strong>1. Definitions:</strong>
        <p>
          - "Client," "You," and "Your" refer to you, the person logging on this website and compliant to the Company’s terms and conditions.
          <br />
          - "The Company," "Ourselves," "We," "Our," and "Us" refer to EdLernity Tech (OPC) Private Limited.
          <br />
          - "Party," "Parties," or "Us" refer to both the Client and ourselves.
        </p>

        <strong>2. Cookies:</strong>
        <p>
          We use cookies in accordance with EdLernity Tech (OPC) Private Limited's Privacy Policy. By accessing EdLernity, you agree to the use of cookies.
        </p>

        <strong>3. License:</strong>
        <p>
          Unless otherwise stated, EdLernity Tech (OPC) Private Limited and/or its licensors own the intellectual property rights for all material on EdLernity. All intellectual property rights are reserved. You may access this from EdLernity for your own personal use, subject to restrictions set in these terms and conditions. You must not republish, sell, rent, sub-license, reproduce, duplicate, copy, or redistribute material from EdLernity.
        </p>

        <strong>4. User-Generated Content (Comments):</strong>
        <p>
          Parts of this website offer an opportunity for users to post and exchange opinions and information. EdLernity (OPC) Private Limited does not filter, edit, publish, or review Comments prior to their presence on the website. Comments do not reflect our views and opinions. We are not liable for the Comments or any liability, damages, or expenses caused as a result of any use or posting of the Comments. We reserve the right to monitor and remove inappropriate, offensive, or breaching Comments.
        </p>

        <p>
          <strong>You warrant and represent that:</strong>
          <br />
          - You are entitled to post the Comments on our website and have all necessary licenses and consents to do so.
          <br />
          - The Comments do not invade any intellectual property right of any third party.
          <br />
          - The Comments do not contain any defamatory, libelous, offensive, indecent, or otherwise unlawful material that invades privacy.
          <br />
          - The Comments will not be used to solicit or promote business or custom, present commercial activities, or unlawful activity.
          <br />
          - You grant EdLernity Tech (OPC) Private Limited a non-exclusive license to use, reproduce, edit, and authorize others to use, reproduce, and edit any of your Comments in any and all forms, formats, or media.
        </p>

        <strong>5. Governing Law:</strong>
        <p>
          These Terms and Conditions are governed by and construed in accordance with the laws of India.
        </p>

        <strong>6. Contact Us:</strong>
        <p>
          If you have any questions about these Terms and Conditions, please contact us at <NavLink to="mailto:info@edlernity.com" style={{color:"rgba(21,57,207,1)"}}>info@edlernity.com</NavLink>.
        </p>
      </div>
    </BaseLayout>
  );
}

export default TermAndCondition;
