import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Profile from './Components/Profilepage/Profile'
import Home from './Components/Homepage/Home';
import Auth from './Components/Auth/Auth';
function App() {
  return (
    <div className="App">
      <>
      
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="auth/login" element={<Auth/>} />
            <Route path="auth/signup" element={<Auth/>} />
          </Routes>
        </BrowserRouter>
      </>
    </div>
  );
}

export default App;
