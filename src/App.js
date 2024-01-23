import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Headers/Navbar';
import Profile from './Components/Profilepage/Profile'
import Herosection from './Components/Herosectionpage/Herosection';
import Home from './Components/Homepage/Home';
import Footer from './Components/Footerpage/Footer'
function App() {
  return (
    <div className="App">
      <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile/>} />
          </Routes>
        </BrowserRouter>
      </>
    </div>
  );
}

export default App;
