import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import AuthMessage from "./AuthMessage";
import { AuthContext } from "./AuthContext";

function LoginForm() {

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const { setStatus, loginUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "" || password === "") {
      setStatus({ type: "error", message: "Fields cannot be empty" });
      return;
    }

    fetch("http://127.0.0.1:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          loginUser({ userId: data.userId, username: data.username });
          setStatus({ type: "success", message: data.message });
          setTimeout(() => navigate("/flavors"), 2000);
        } else {
          setStatus({ type: "error", message: data.message });
        }
      })
      .catch(err => setStatus({ type: "error", message: "Failed to connect to server" }));
  };

  return (

    <div className="login-form">
      <form onSubmit={handleLogin}>
        <h2 className="login-title">Login</h2>

        <label>Username </label>
        <input
          className="login-input"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <br /><br />
        <label>Password </label>
        <input
          className="login-input"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button
          className="login-button"
          type="submit"
        >
          Login
        </button>
        <br />
        <button type="button" className="forgot-password-btn">Forgot Password?</button>

        <AuthMessage />

        <p>Need an account? <Link to="/signup" className="signup-link">Sign up</Link></p>
      </form>
    </div>

  )

}

export default LoginForm;