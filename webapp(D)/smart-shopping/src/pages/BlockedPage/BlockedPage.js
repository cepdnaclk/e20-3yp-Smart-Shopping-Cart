import React from 'react';
import { useLocation } from 'react-router-dom';
import './BlockedPage.css';

const BlockedPage = () => {
  const { state } = useLocation();
  const { cartWeight, totalWeight } = state || {};

  return (
    <div className="blocked-container">
      <div className="blocked-card">
        <h2>🚫 Cart Blocked</h2>
        <p><strong>Expected Weight:</strong> {totalWeight?.toFixed(2)} kg</p>
        <p><strong>Actual Cart Weight:</strong> {cartWeight?.toFixed(2)} kg</p>
        <p className="warning">Mismatch detected! Some items might not be scanned.</p>
      </div>
    </div>
  );
};

export default BlockedPage;
