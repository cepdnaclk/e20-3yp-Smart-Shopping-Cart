import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SuccessPage from './pages/SuccessPage/SuccessPage';
import Checkout from './pages/Checkout/Checkout';
import BlockedPage from './pages/BlockedPage/BlockedPage';
import CashierDashboard from './pages/CashierDashboard/CashierDashboard/CashierDashboard';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/success" element={<SuccessPage />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/blocked" element={<BlockedPage />} />
      <Route path="/cashier" element={<CashierDashboard />} />
    </Routes>
  );
};

export default App;
