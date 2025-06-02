import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Checkout.css';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { cartItems, cartWeight, totalWeight } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amount, setAmount] = useState('');

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handlePayment = () => {
    if (parseFloat(amount) >= total) {
      navigate('/success');
    } else {
      alert('Insufficient amount entered.');
    }
  };

  if (!cartItems) {
    return <p>No cart data. Please go back to dashboard.</p>;
  }

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <table>
        <thead>
          <tr><th>Item</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr>
        </thead>
        <tbody>
          {cartItems.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>${item.price.toFixed(2)}</td>
              <td>${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p><strong>Total Amount:</strong> ${total.toFixed(2)}</p>
      <p><strong>Expected Weight:</strong> {totalWeight.toFixed(2)} kg</p>
      <p><strong>Actual Cart Weight:</strong> {cartWeight.toFixed(2)} kg</p>

      <div className="payment-section">
        <h3>Select Payment Method</h3>
        <label>
          <input
            type="radio"
            name="payment"
            value="cash"
            checked={paymentMethod === 'cash'}
            onChange={() => setPaymentMethod('cash')}
          />
          Cash
        </label>
        <label>
          <input
            type="radio"
            name="payment"
            value="card"
            checked={paymentMethod === 'card'}
            onChange={() => setPaymentMethod('card')}
          />
          Card
        </label>

        <div className="amount-input">
          <label>Enter Amount:</label>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
      </div>

      <button onClick={handlePayment} className="btn-pay">
        Process Payment
      </button>
    </div>
  );
};

export default Checkout;
