import React from "react";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

function OrderHistorySection() {

  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  const { user, setStatus } = useContext(AuthContext);
  const userId = user ? user.userId : null;

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setStatus({ type: "error", message: "Please log in to view your order history." });
      navigate("/login");
    }
  }, [user, navigate, setStatus]);

  useEffect(() => {
    if (!userId) return;
    fetch(`http://127.0.0.1:5000/orders?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOrders(data.orders);
          if (data.orders.length === 0) {
            setMessage("You have not placed any orders yet.");
          }
        } else {
          setMessage(data.message);
        }
      })
      .catch(err => setMessage("Failed to load order history."));
  }, [userId]);

  return (
    <div className="order-history-content">
      <h2>Order History</h2>
      {message && <p>{message}</p>}
      {orders.map((order) => (
        <div className="order-list" key={order.orderId}>
          <h3>Order #{order.orderId}</h3>
          <p>{order.timestamp}</p>
          {order.items.map((item) => (
            <p key={item.flavorId}>
              {item.name} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
            </p>
          ))}
          <p className="order-total">Total: ${order.total.toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
}

export default OrderHistorySection;