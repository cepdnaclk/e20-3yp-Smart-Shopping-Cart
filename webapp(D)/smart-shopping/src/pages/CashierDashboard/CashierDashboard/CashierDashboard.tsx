import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CashierDashboard.css';

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  weight: number;
}

const CashierDashboard: React.FC = () => {
  const [cartId, setCartId] = useState<string>('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalWeight, setTotalWeight] = useState<number>(0);
  const [cartWeight, setCartWeight] = useState<number>(0);
  const [submittedCartId, setSubmittedCartId] = useState<string>('');
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const response = await axios.get<{ cartId: string; items: CartItem[] }>(
        `http://localhost:8080/api/cart/${cartId}`
      );
      const data = response.data;
      setCartItems(data.items);
      setSubmittedCartId(data.cartId);

      let weight = 0;
      data.items.forEach(item => {
        weight += item.weight * item.quantity;
      });
      setTotalWeight(weight);
      setCartWeight(weight + 0.2); // Simulated extra weight
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCartItems([]);
      setSubmittedCartId('');
      setTotalWeight(0);
      setCartWeight(0);
    }
  };

  const handleProceed = () => {
    if (Math.abs(cartWeight - totalWeight) <= 0.01) {
      navigate('/checkout', {
        state: { cartItems, cartWeight, totalWeight }
      });
    } else {
      navigate('/blocked', {
        state: { cartWeight, totalWeight }
      });
    }
  };

  return (
    <div className="cashier-dashboard">
      <img src={require('./cart-icon.png')} alt="Cart Icon" />
      <h2>Cashier Dashboard</h2>

      <div className="input-group">
        <input
          type="text"
          placeholder="Enter Cart ID"
          value={cartId}
          onChange={(e) => setCartId(e.target.value)}
        />
        <button onClick={handleSearch}>Search Cart</button>
      </div>

      {submittedCartId && cartItems.length > 0 && (
        <div className="cart-details">
          <h3>Cart ID: {submittedCartId}</h3>
          <table>
            <thead>
              <tr><th>Item</th><th>Qty</th><th>Price</th><th>Weight</th></tr>
            </thead>
            <tbody>
              {cartItems.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>{(item.weight * item.quantity).toFixed(2)} kg</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p><strong>Expected Total Weight:</strong> {totalWeight.toFixed(2)} kg</p>
          <p><strong>Actual Cart Weight:</strong> {cartWeight.toFixed(2)} kg</p>

          <button onClick={handleProceed}>
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default CashierDashboard;
