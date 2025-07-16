import CashierHome from './components/CashierHome';
import {Routes,Route} from 'react-router-dom';
import CartEntryPage from './components/CartEntryPage';
import CheckoutPage from './components/Checkout';


function App() {
  return(
    <Routes>
      <Route path="/" element={<CashierHome />} />
      <Route path="/cart-entry" element={<CartEntryPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
    </Routes>  )
}

export default App;
