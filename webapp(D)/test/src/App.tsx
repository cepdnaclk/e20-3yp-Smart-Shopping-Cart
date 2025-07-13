import CashierHome from './components/CashierHome';
import {Routes,Route} from 'react-router-dom';
import CartEntryPage from './components/CartEntryPage';


function App() {
  return(
    <Routes>
      <Route path="/" element={<CashierHome />} />
      <Route path="/cart-entry" element={<CartEntryPage />} />
    </Routes>  )
}

export default App;
