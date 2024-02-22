import './App.css';
import { BrowserRouter, Route, Routes  } from 'react-router-dom';
import Profile from './Components/Profilepage/Profile';
import Home from './Components/Homepage/Home';
import About from './Components/Aboutpage/About';
import Courses1 from './Components/CoursesOverview/Courses1.jsx';
import Blog from './Components/Blogpage/Blog';
import Ui from './Components/CoursesOverview/Ui.jsx';
import Auth from './Components/Auth/Auth';
import BaseLayout from './Layout/BaseLayout';
import PageNotFound from './Components/PageNotFound/PageNotFound';
import UploadFolder from './Components/CourseUploader/UploadFolder.jsx'
import VideoPlayer from './Components/Courses/Video/VideoPlayer.jsx';
import  Payment from  './Components/Paymentpage/Payment.jsx'
import Contactus from './Components/Contactpage/Contactus.jsx';
import ScrollToTop from './Utils/ScrollToTop.jsx';
import PrivacyPolicy from './Components/Legal/PrivacyPolicy.jsx';
import TermAndCondition from './Components/Legal/TermAndCondition.jsx'
import CancellationandRefundPolicy from './Components/Legal/CancellationandRefundPolicy.jsx'
import Courses from './Components/Courses/Courses.jsx';
function App() {
  return (
    <div className="App">
      <>
        <BrowserRouter>
        <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="auth/login" element={<Auth/>} />
            <Route path="auth/signup" element={<Auth/>} />
            <Route path="auth/reset" element={<Auth/>} />
            <Route path="auth/updatePassword" element={<Auth/>} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/about" element={<About />} />
            <Route path="/courses/overview/" element={<Courses1 />} />
            <Route path="/courses/overview/:dynamicValue" element={<Ui />} />
            {/* <Route path="/courses/overview/ui-ux-design" element={<Ui />} /> */}
            <Route path="/courses/:id" element={ <BaseLayout ><Courses /></BaseLayout>} />
            <Route path="/blog" element={<Blog />} />
            <Route path='*' element={<PageNotFound />} />
            <Route path='/upload' element={<BaseLayout ><UploadFolder /></BaseLayout>} />
            <Route path='/video' element={<VideoPlayer />} />
            <Route path='/Payment-method' element={<Payment />} />
            <Route path='/Contact-us' element={<Contactus />} />
            <Route path='/privacy-policy' element={<PrivacyPolicy />} />
            <Route path='/terms-and-conditions' element={<TermAndCondition />} />
            <Route path='/cancellation-and-refund-policy' element={<CancellationandRefundPolicy />} />
          </Routes>
        </BrowserRouter>
      </>
    </div>
  );
}

export default App;
