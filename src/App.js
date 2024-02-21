import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Headers/Navbar';
import Profile from './Components/Profilepage/Profile'
import Herosection from './Components/Herosectionpage/Herosection';
import Home from './Components/Homepage/Home';
import Footer from './Components/Footerpage/Footer'
import Courses from './Components/Courses/Courses';
import About from './Components/Aboutpage/About';
import Courses1 from './Components/Coursespage/Courses1';
import Blog from './Components/Blogpage/Blog';
import Ui from './Components/Coursespage/Ui';
import Auth from './Components/Auth/Auth';
import BaseLayout from './Layout/BaseLayout';
import PageNotFound from './Components/PageNotFound/PageNotFound';
import UploadFolder from './Components/CourseUploader/UploadFolder.jsx'
import VideoPlayer from './Components/Video/VideoPlayer.jsx';
import ChatBot from './Components/Footerpage/ChatBot.jsx';
import whatsapp from './Components/Footerpage/Whatsapp.jsx';
import  Payment from  './Components/Paymentpage/Payment.jsx'
import Contactus from './Components/Contactpage/Contactus.jsx';
import ScrollToTop from './Utils/ScrollToTop.jsx';
import PrivacyPolicy from './Components/Legal/PrivacyPolicy.jsx';
import TermAndCondition from './Components/Legal/TermAndCondition.jsx'
import CancellationandRefundPolicy from './Components/Legal/CancellationandRefundPolicy.jsx'
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
            <Route path="/courses" element={<Courses1 />} />
            <Route path="/ui-ux-design" element={<Ui />} />
            <Route path="/blog" element={<Blog />} />
            <Route path='*' element={<PageNotFound />} />
            <Route path='/upload' element={<UploadFolder />} />
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
