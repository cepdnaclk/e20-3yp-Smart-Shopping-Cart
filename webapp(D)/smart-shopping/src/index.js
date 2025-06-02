import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import CashierDashboard from './pages/CashierDashboard/CashierDashboard/CashierDashboard';
import SuccessPage from './pages/SuccessPage/SuccessPage';
import BlockedPage from './pages/BlockedPage/BlockedPage';
import Checkout from './pages/Checkout/Checkout'; // If you’re using the checkout flow

import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<CashierDashboard />} />
        <Route path="/cashier" element={<CashierDashboard />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/blocked" element={<BlockedPage />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
