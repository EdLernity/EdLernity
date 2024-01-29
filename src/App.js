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
import PageNotFound from './Components/PageNotFound/PageNotFound';
function App() {
  return (
    <div className="App">
      <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="auth/login" element={<Auth/>} />
            <Route path="auth/signup" element={<Auth/>} />
            <Route path="auth/reset" element={<Auth/>} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/about" element={<About />} />
            <Route path="/courses" element={<Courses1 />} />
            <Route path="/ui-ux-design" element={<Ui />} />
            <Route path="/blog" element={<Blog />} />
            <Route path='*' element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </>
    </div>
  );
}

export default App;
