import React, { useState } from "react";
import authService from "../services/authService";
import "./Login.css";

import Logo from "../pages/mv3.png"

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await authService.login(username, password);
      window.location = "/dashboard";
    } catch (error) {
      setErrorMessage("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
          <button type="submit" className="login-button">Login</button>
        </form>
        {errorMessage && <p className="login-error">{errorMessage}</p>}
      </div>
      <div className="login-logo">
        {/* Aqui você pode colocar o seu logo */}
        <img src={Logo} alt="Logo" />
      </div>
    </div>
  );
};

export default Login;
