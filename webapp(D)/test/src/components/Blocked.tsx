import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface LocationState {
  cartWeight?: number;
  totalWeight?: number;
  cartId?: string;
  actualWeight?: number;
}

const BlockedPage: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  
  // Destructure with default values
  const locationState = state as LocationState | undefined;
  
  const cartId = locationState?.cartId || '';
  const totalWeight = locationState?.totalWeight || 0;
  const actualWeight = locationState?.actualWeight || 0;
  
  const difference = Math.abs(actualWeight - totalWeight);

  const handleContinue = () => {
    navigate('/cart-entry', { 
      state: {
        cartId,
        shouldReload: true  // This flag tells CartEntry to reload the data
      },
      replace: true
    });
  };

  // Styles (same as before)
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'radial-gradient(circle, #ffe6e6, #ffcccc)',
      padding: '20px',
    },
    card: {
      backgroundColor: 'white',
      padding: '40px',
      borderRadius: '12px',
      boxShadow: '0 0 12px rgba(255, 0, 0, 0.3)',
      textAlign: 'center',
      maxWidth: '500px',
      width: '100%',
    },
    title: {
      color: '#cc0000',
      marginBottom: '20px',
      fontSize: '28px',
    },
    weightDetails: {
      textAlign: 'left',
      margin: '20px 0',
      padding: '15px',
      backgroundColor: '#fff9f9',
      borderRadius: '8px',
    },
    warning: {
      color: '#cc0000',
      fontWeight: 'bold',
      margin: '20px 0',
      fontSize: '18px',
    },
    actionButton: {
      backgroundColor: '#cc0000',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: 'bold',
      transition: 'background 0.3s',
      marginTop: '20px',
      ':hover': {
        backgroundColor: '#a30000',
      },
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🚫 Cart Blocked</h2>
        <div style={styles.weightDetails}>
          <p><strong>Cart ID:</strong> {cartId || 'No cart ID available'}</p>
          <p><strong>Expected Weight:</strong> {totalWeight.toFixed(2)} kg</p>
          <p><strong>Actual Cart Weight:</strong> {actualWeight.toFixed(2)} kg</p>
          <p><strong>Difference:</strong> {difference.toFixed(2)} kg</p>
        </div>
        <p style={styles.warning}>
          Weight mismatch detected! Please verify your items.
        </p>
        {cartId && (
          <button 
            onClick={handleContinue}
            style={styles.actionButton}
          >
            Continue with Cart: {cartId}
          </button>
        )}
      </div>
    </div>
  );
};

export default BlockedPage;