import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData ? userData.userId : null;

  useEffect(() => {
    if (!userId) {
      setMessage("Please log in to view your order history.");
      return;
    }

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
    <div className="flavors-page">
      <Header />
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
      <Footer />
    </div>
  );
}

export default OrderHistoryPage;
