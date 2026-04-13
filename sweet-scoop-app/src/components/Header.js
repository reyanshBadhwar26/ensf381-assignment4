import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

function Header() {
  const navigate = useNavigate();
  const { user, logoutUser } = useContext(AuthContext);

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <>
      <header>
        <img src="/images/logo.webp" alt="Sweet Scoop" />
        <h1>Sweet Scoop Ice Cream Shop</h1>
        <div className="auth-control">
          {user ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </header>

      <div className="navbar">
        <Link to="/">Home</Link>
        <Link to="/flavors">Flavors</Link>
        <Link to="/order-history">Order History</Link>
      </div>
    </>
  );
}

export default Header;