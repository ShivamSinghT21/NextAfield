import React, { useState } from 'react';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import './App.css';

const App = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="app-wrapper">
      {/* Toggle Buttons at Top */}
      <div className="toggle-buttons-container">
        <button 
          className={`toggle-btn ${isLogin ? 'active' : ''}`}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
        <button 
          className={`toggle-btn ${!isLogin ? 'active' : ''}`}
          onClick={() => setIsLogin(false)}
        >
          Sign Up
        </button>
        <div className={`toggle-slider ${isLogin ? 'left' : 'right'}`}></div>
      </div>

      {/* Form container with smooth transition */}
      <div className="form-container">
        {isLogin ? <Login /> : <Signup />}
      </div>

      {/* Ocean wave decoration */}
      <div className="ocean-waves">
        <div className="wave wave1"></div>
        <div className="wave wave2"></div>
        <div className="wave wave3"></div>
      </div>
    </div>
  );
};

export default App;
