// CheckoutPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./checkout.css";

type CartItem = {
  id: number;
  name: string;
  quantity: number;
  price: number;
};

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cartIdFromState = location.state?.cartId ?? "";
  const itemsFromState = location.state?.items ?? [];

  const [cartId, setCartId] = useState(cartIdFromState);
  const [cartItems, setCartItems] = useState<CartItem[]>(itemsFromState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "creditcard">("cash");
  const [showReleasedPopup, setShowReleasedPopup] = useState(false);

  useEffect(() => {
    if (!cartId) {
      setCartItems([]);
      return;
    }

    const fetchCart = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:3000/api/cart/${cartId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch cart data");
        }
        const data = await response.json();

        const items: CartItem[] = data.items.map((item: any, idx: number) => ({
          id: item.id || idx,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        }));

        setCartItems(items);
      } catch (err) {
        setCartItems([]);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [cartId]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const releaseCart = () => {
    setShowReleasedPopup(true);
  };

  const handleNewCart = () => {
    setShowReleasedPopup(false);
    setCartId("");
    setCartItems([]);
    navigate("/cart-entry");
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems((items) =>
      items.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
    );
  };

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  return (
    <div className="checkout-page" style={{ display: "flex", minHeight: "100vh" }}>
      {/* Left Section: Image + Payment */}
      <div className="checkout-left">
        <div className="payment-options">
          <h3>Payment Method</h3>
          <label>
            <input
              type="radio"
              value="cash"
              checked={paymentMethod === "cash"}
              onChange={() => setPaymentMethod("cash")}
            />
            Cash
          </label>
          <label>
            <input
              type="radio"
              value="creditcard"
              checked={paymentMethod === "creditcard"}
              onChange={() => setPaymentMethod("creditcard")}
            />
            Credit Card
          </label>
          <button className="release-btn" onClick={releaseCart}>
            Release Cart
          </button>
        </div>
      </div>

      {/* Right Section: Full Original Cart UI */}
      <div className="checkout-right">
        {/* Header */}
        <header className="header">
          <div className="logo">SMART SHOPPING</div>
          <img
            src="https://cdn-icons-png.flaticon.com/512/263/263142.png"
            alt="Logo"
            className="w-10 h-10 animate-bounce"
          />
          <div className="header-buttons">
            <button className="cart-button">
              🛒
              {cartItems.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
            </button>
            <button className="logout-button">Logout</button>
          </div>
        </header>

        {/* Cart Section */}
        <div className="cart-section">
          <h2>Shopping Cart</h2>

          <input
            className="cart-id-input"
            type="text"
            placeholder="Enter Cart ID"
            value={cartId}
            onChange={(e) => setCartId(e.target.value.trim())}
          />

          {loading ? (
            <div className="loading">Loading cart items...</div>
          ) : error ? (
            <div className="error-message">Error: {error}</div>
          ) : cartItems.length === 0 ? (
            <div className="empty-cart text-center py-12">
              <img
                src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-2130356-1800917.png"
                alt="Empty Cart"
                className="empty-cart-img"
              />
              <p className="text-gray-500 text-lg">Your cart is empty. Add some items!</p>
            </div>
          ) : (
            <ul className="cart-items">
              {cartItems.map((item) => (
                <li key={item.id} className="cart-item p-4 fade-in">
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    <p>${item.price.toFixed(2)} each</p>
                  </div>
                  <div className="item-controls">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <div className="item-total">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                  <button className="remove-btn" onClick={() => removeItem(item.id)}>
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}

          {cartItems.length > 0 && (
            <div className="subtotal">
              <strong>Subtotal:</strong> ${subtotal.toFixed(2)}
            </div>
          )}
        </div>
      </div>

      {/* Released popup */}
      {showReleasedPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Cart Released Successfully!</h3>
            <p>Your shopping cart has been successfully released.</p>
            <button onClick={handleNewCart} className="new-cart-btn">
              Start New Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
