import CashierHome from './components/CashierHome';
import {Routes,Route} from 'react-router-dom';
import CartEntryPage from './components/CartEntryPage';
import BlockedPage from './components/Blocked';


function App() {
  return(
    <Routes>
      <Route path="/" element={<CashierHome />} />
      <Route path="/cart-entry" element={<CartEntryPage />} />
      <Route path="/blocked" element={<BlockedPage />} />
    </Routes>  )
}

export default App;
