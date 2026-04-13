import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import AuthMessage from "./AuthMessage";
import { AuthContext } from "./AuthContext";

function SignupForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { setStatus } = useContext(AuthContext);

  const handleSignup = (e) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      setStatus({ type: "error", message: "All fields are required" });
      return;
    }

    if (username.length < 3 || username.length > 20) {
      setStatus({ type: "error", message: "Username must be between 3 and 20 characters" });
      return;
    }

    if (!/^[a-zA-Z]/.test(username)) {
      setStatus({ type: "error", message: "Username must start with a letter" });
      return;
    }

    if (!/^[A-Za-z0-9_-]+$/.test(username)) {
      setStatus({ type: "error", message: "Username can only contain letters, numbers, underscores, and hyphens" });
      return;
    }

    if (!/^[\w.-]+@[\w.-]+\.\w+$/.test(email)) {
      setStatus({ type: "error", message: "Email must be in a valid format (e.g., example@email.com)" });
      return;
    }

    if (password.length < 8) {
      setStatus({ type: "error", message: "Password must be at least 8 characters long" });
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setStatus({ type: "error", message: "Password must contain at least one uppercase letter" });
      return;
    }

    if (!/[a-z]/.test(password)) {
      setStatus({ type: "error", message: "Password must contain at least one lowercase letter" });
      return;
    }

    if (!/\d/.test(password)) {
      setStatus({ type: "error", message: "Password must contain at least one number" });
      return;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setStatus({ type: "error", message: "Password must contain at least one special character" });
      return;
    }

    if (password !== confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match" });
      return;
    }

    fetch("http://127.0.0.1:5000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStatus({ type: "success", message: data.message });
          setTimeout(() => window.location = "/login", 2000);
        }
        else {
          setStatus({ type: "error", message: data.message });
        }
      })
      .catch(() => setStatus({ type: "error", message: "Failed to connect to server" }));
  };

  return (
    <div className="login-form">
      <form onSubmit={handleSignup}>
        <h2 className="login-title">Sign Up</h2>

        <label>Username</label>
        <br />
        <input
          className="login-input"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <br /><br />

        <label>Email</label>
        <br />
        <input
          className="login-input"
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />

        <label>Password</label>
        <br />
        <input
          className="login-input"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />

        <label>Confirm Password</label>
        <br />
        <input
          className="login-input"
          type="password"
          placeholder="Confirm Password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <br />

        <button
          className="login-button"
          type="submit"
        >
          Sign Up
        </button>

        <AuthMessage />

        <p>Already have an account? <Link to="/login" className="signup-link">Login</Link></p>
      </form>
    </div>
  );
}

export default SignupForm;