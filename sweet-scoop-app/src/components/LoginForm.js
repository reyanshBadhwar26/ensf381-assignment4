import React,{useState,createContext} from "react";
import { Link } from "react-router-dom";
import AuthMessage from "./AuthMessage";

export const AuthContext = createContext();

function LoginForm(){

const [username,setUsername]=useState("")
const [password,setPassword]=useState("")
const [status,setStatus]=useState(null)

const handleLogin = (e) => {
  e.preventDefault();
  if (username === "" || password === "") {
    setStatus({ type: "error", message: "Fields cannot be empty" });
    return;
  }
  if (password.length < 8) {
    setStatus({ type: "error", message: "Password must be at least 8 characters" });
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
        localStorage.setItem("user", JSON.stringify({ userId: data.userId, username: data.username }));
        setStatus({ type: "success", message: data.message });
        setTimeout(() => window.location = "/flavors", 2000);
      } else {
        setStatus({ type: "error", message: data.message });
      }
    })
    .catch(err => setStatus({ type: "error", message: "Failed to connect to server" }));
};

return(

<AuthContext.Provider value={{status}}>

<div className="login-form">
<form>
<h2 className="login-title">Login</h2>

<label>Username </label>
<input
className="login-input"
placeholder="Username"
onChange={(e)=>setUsername(e.target.value)}
/>
<br/><br/>
<label>Password </label>
<input
className="login-input"
type="password"
placeholder="Password"
onChange={(e)=>setPassword(e.target.value)}
/>
<br/>
<button
className="login-button"
onClick={handleLogin}
>
Login
</button>
<br/>
<button type="button" className="forgot-password-btn">Forgot Password?</button>

<AuthMessage/>

<p>Need an account? <Link to="/signup" className="signup-link">Sign up</Link></p>
</form>
</div>

</AuthContext.Provider>

)

}

export default LoginForm;