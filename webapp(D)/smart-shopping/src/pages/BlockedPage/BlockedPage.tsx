import React from 'react';
import { useLocation } from 'react-router-dom';
import './BlockedPage.css';

interface LocationState {
  cartWeight?: number;
  totalWeight?: number;
}

const BlockedPage: React.FC = () => {
  const { state } = useLocation();
  const { cartWeight = 0, totalWeight = 0 } = (state as LocationState) || {};

  return (
    <div className="blocked-container">
      <div className="blocked-card">
        <h2>🚫 Cart Blocked</h2>
        <p><strong>Expected Weight:</strong> {totalWeight.toFixed(2)} kg</p>
        <p><strong>Actual Cart Weight:</strong> {cartWeight.toFixed(2)} kg</p>
        <p className="warning">Mismatch detected! Some items might not be scanned.</p>
      </div>
    </div>
  );
};

export default BlockedPage;
