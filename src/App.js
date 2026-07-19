import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import About from './Components/Aboutpage/About';
import Auth from './Components/Auth/Auth';
import SucessPage from './Components/Auth/SuccessPage/SuccessPage.jsx';
import Blog from './Components/Blogpage/Blog';
import Contactus from './Components/Contactpage/Contactus.jsx';
import UploadFolder from './Components/CourseUploader/UploadFolder.jsx';
import Courses from './Components/Courses/Courses.jsx';
import VideoPlayer from './Components/Courses/Video/VideoPlayer.jsx';
import Courses1 from './Components/CoursesOverview/Courses1.jsx';
import Ui from './Components/CoursesOverview/Ui/Ui.jsx';
import Home from './Components/Homepage/Home';
import ReviewPage from './Components/Reviewpage/ReviewPage';
import CancellationandRefundPolicy from './Components/Legal/CancellationandRefundPolicy.jsx';
import PrivacyPolicy from './Components/Legal/PrivacyPolicy.jsx';
import TermAndCondition from './Components/Legal/TermAndCondition.jsx';
import Member from './Components/Memberpage/Member.jsx';
import InternshipPrograms from './Components/InternshipPrograms/InternshipPrograms.jsx';
import InternshipTrackDetail from './Components/InternshipPrograms/InternshipTrackDetail.jsx';
import InternshipDashboard from './Components/InternshipPrograms/InternshipDashboard.jsx';
import InternshipAssignmentPage from './Components/InternshipPrograms/InternshipAssignmentPage.jsx';
import InternOnboard from './Components/InternshipPrograms/InternOnboard.jsx';
import AdminInternshipsRedirect from './Components/Admin/AdminInternshipsRedirect.jsx';
import TrainerInternshipDashboard from './Components/InternshipPrograms/TrainerInternshipDashboard.jsx';
import TrainerProgramEditor from './Components/InternshipPrograms/TrainerProgramEditor.jsx';
import InternshipCart from './Components/InternshipPrograms/InternshipCart.jsx';
import MyCourses from './Components/MyCourses/MyCourses.jsx';
import PageNotFound from './Components/PageNotFound/PageNotFound';
import Payment from './Components/Paymentpage/Payment.jsx';
import Paytm from './Components/paytm/paytm.jsx';
import BaseLayout from './Layout/BaseLayout';
import ScrollToBottomTop from './Utils/ScrollToBottomTop.jsx';
import ScrollToTop from './Utils/ScrollToTop.jsx';


import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CertificateVerifyPage from './Components/CertificateVerify/CertificateVerifyPage.jsx';
import CredentialSharePage from './Components/CertificateVerify/CredentialSharePage.jsx';
import WorkshopsPage from './Components/Workshops/WorkshopsPage.jsx';
import TransactionData from './Components/Admin/TransactionData.jsx';
import ReVerifyMail from './Components/Auth/SuccessPage/ReVerifyMail.jsx';
import VerifyMail from './Components/Auth/SuccessPage/VerifyMail.jsx';
import InternShip from './Components/Carrers/InternShip.jsx';
import CareersPage from './Components/Carrers/CareersPage.jsx';
import IssueOfferLetter from './Components/OfferLetter/IssueOfferLetter.jsx';
import ProfilePage from './Components/Profilepage/ProfilePage.jsx';
function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, []);
  return (
  
      <>
      <div>
        
        <BrowserRouter>
        <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="auth/login" element={<Auth/>} />
            <Route path="auth/signup" element={<Auth/>} />
            <Route path="auth/reset" element={<Auth/>} />
            <Route path="auth/updatePassword" element={<Auth/>} />
            {/* <Route path="/profile" element={<Profile/>} /> */}
            <Route path="/profile" element={<BaseLayout ><ProfilePage/></BaseLayout>} />
            <Route path="/about" element={<About />} />
            <Route path="/courses/overview/" element={<Courses1 />} />
            <Route path="/courses/overview/:dynamicValue" element={<Ui />} />
            <Route path="/mycourses/:id" element={ <BaseLayout ><Courses /></BaseLayout>} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/reviews" element={<ReviewPage />} />
            <Route path='*' element={<PageNotFound />} />
            <Route path='/upload' element={<BaseLayout ><UploadFolder /></BaseLayout>} />
            <Route path='/offerletter' element={<IssueOfferLetter />} />
            <Route path='/video' element={<VideoPlayer />} />
            <Route path='/payment' element={<Payment />} />
            <Route path='/contact' element={<Contactus />} />
            <Route path='/privacy-policy' element={<PrivacyPolicy />} />
            <Route path='/terms-and-conditions' element={<TermAndCondition />} />
            <Route path='/cancellation-and-refund-policy' element={<CancellationandRefundPolicy />} />
            <Route path='/success' element={<SucessPage />} />
            <Route path='/paytm' element={<Paytm />} />
            <Route path='/member' element={<Member />} />
            <Route path='/internship-programs' element={<InternshipPrograms />} />
            <Route path='/internship-programs/:slug' element={<InternshipTrackDetail />} />
            <Route
              path='/my-internships/:slug/assignments/:weekIndex/:classId'
              element={<InternshipAssignmentPage />}
            />
            <Route path='/my-internships/:slug/:section' element={<InternshipDashboard />} />
            <Route path='/my-internships/:slug' element={<InternshipDashboard />} />
            <Route path='/intern-onboard/:token' element={<InternOnboard />} />
            <Route path='/admin/internships' element={<AdminInternshipsRedirect />} />
            <Route path='/trainer/internships' element={<TrainerInternshipDashboard />} />
            <Route path='/trainer/internships/:slug' element={<TrainerProgramEditor />} />
            <Route path='/cart' element={<InternshipCart />} />
            <Route path='/verify-email' element={<VerifyMail/>} />
            <Route path='/reverify-email' element={<ReVerifyMail/>} />
            <Route path='/mycourses' element={<MyCourses />} />
            <Route path='/careers' element={<CareersPage />} />
            <Route path='/internship' element={<InternShip />} />
            <Route path='/verify-certificate' element={<CertificateVerifyPage />} />
            <Route path='/credential/:uuid' element={<CredentialSharePage />} />
            <Route path='/workshops' element={<WorkshopsPage />} />
            <Route path='/get-transaction/:name/:secretKeys' element={<TransactionData />} />
          </Routes>
          <ToastContainer position="bottom-center" autoClose={5000} />
        </BrowserRouter>
        
        <ScrollToBottomTop/>
        </div>
      </>
  
  );
}

export default App;
