import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SuccessPage.css';

const SuccessPage = () => {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate('/cashier');
  };

  return (
    <div className="success-container">
      <div className="success-card">
        <img src={require('./success-check.gif')} alt="Success" />
        <h2>✅ Payment Successful!</h2>
        <p>Thank you! The cart is now free to move past the checkout line.</p>
        <button onClick={handleBackToDashboard}>Back to Dashboard</button>
      </div>
    </div>
  );
};

export default SuccessPage;
