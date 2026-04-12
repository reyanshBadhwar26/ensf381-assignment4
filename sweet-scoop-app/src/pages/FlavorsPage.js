// src/pages/FlavorsPage.js
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FlavorCatalog from "../components/FlavorCatalog";
import OrderList from "../components/OrderList";

function FlavorsPage() {
  const [flavors, setFlavors] = useState([]);
  const [order, setOrder] = useState([]);
  const [status, setStatus] = useState(null);

  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData ? userData.userId : null;

  useEffect(() => {
    fetch("http://127.0.0.1:5000/flavors")
      .then(res => res.json())
      .then(data => {
        if (data.success) setFlavors(data.flavors);
      })
      .catch(err => console.error("Failed to fetch flavors:", err));

    if (userId) {
      fetch(`http://127.0.0.1:5000/cart?userId=${userId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setOrder(data.cart);
        })
        .catch(err => console.error("Failed to fetch cart:", err));
    }
  }, [userId]);

  const addToOrder = (flavor) => {
    if (!userId) {
      setStatus({ type: "error", message: "Please log in to add items to your cart." });
      return;
    }

    const existing = order.find(item => item.flavorId === flavor.flavorId);

    if (existing) {
      fetch("http://127.0.0.1:5000/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, flavorId: flavor.flavorId, quantity: existing.quantity + 1 })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setOrder(data.cart);
            setStatus({ type: "success", message: data.message });
          } else {
            setStatus({ type: "error", message: data.message });
          }
        })
        .catch(err => setStatus({ type: "error", message: "Failed to update cart." }));
    } else {
      fetch("http://127.0.0.1:5000/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, flavorId: flavor.flavorId })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setOrder(data.cart);
            setStatus({ type: "success", message: data.message });
          } else {
            setStatus({ type: "error", message: data.message });
          }
        })
        .catch(err => setStatus({ type: "error", message: "Failed to add to cart." }));
    }
  };

  const removeFromOrder = (flavorId) => {
    fetch("http://127.0.0.1:5000/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, flavorId })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOrder(data.cart);
          setStatus({ type: "success", message: data.message });
        } else {
          setStatus({ type: "error", message: data.message });
        }
      })
      .catch(err => setStatus({ type: "error", message: "Failed to remove from cart." }));
  };

  const placeOrder = () => {
    if (!userId) {
      setStatus({ type: "error", message: "Please log in to place an order." });
      return;
    }

    fetch("http://127.0.0.1:5000/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOrder([]);
          setStatus({ type: "success", message: data.message });
        } else {
          setStatus({ type: "error", message: data.message });
        }
      })
      .catch(err => setStatus({ type: "error", message: "Failed to place order." }));
  };

  return (
    <div className="flavors-page">
      <Header />
      <div className="content">
        <FlavorCatalog flavors={flavors} addToOrder={addToOrder} />
        {status && (
          <p style={{ color: status.type === "success" ? "green" : "red", fontWeight: "bold" }}>
            {status.message}
          </p>
        )}
        <OrderList order={order} removeFromOrder={removeFromOrder} placeOrder={placeOrder} />
      </div>
      <Footer />
    </div>
  );
}

export default FlavorsPage;
