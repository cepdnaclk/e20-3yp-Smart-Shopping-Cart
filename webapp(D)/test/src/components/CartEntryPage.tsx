import React, { useEffect, useState, useCallback } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

interface CartItem {
  name: string;
  price: number;
  quantity: number;
  weight: number; // in grams
}

const CartEntry: React.FC = () => {
  const navigate = useNavigate();
  const [cartId, setCartId] = useState('');
  const [debouncedCartId, setDebouncedCartId] = useState(cartId);
  const [actualWeight, setActualWeight] = useState<number | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce cart ID input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCartId(cartId.trim());
    }, 500);
    return () => clearTimeout(handler);
  }, [cartId]);

  // Read actual weight from Firebase
  useEffect(() => {
    if (!debouncedCartId) {
      setActualWeight(null);
      return;
    }

    const weightRef = ref(db, `carts/${debouncedCartId}/weight`);
    const unsub = onValue(weightRef, (snapshot) => {
      const newWeight = snapshot.val();
      setActualWeight(newWeight);
      
      if (newWeight !== null) {
        const weightElement = document.getElementById('actual-weight-display');
        if (weightElement) {
          weightElement.classList.add('scale-110');
          setTimeout(() => {
            weightElement.classList.remove('scale-110');
          }, 300);
        }
      }
    });

    return () => unsub();
  }, [debouncedCartId]);

  // Fetch items from backend API
  useEffect(() => {
    if (!debouncedCartId) {
      setItems([]);
      return;
    }
//backend API
    const fetchItems = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:3000/api/cart/${debouncedCartId}`);
        if (!res.ok) throw new Error('Failed to fetch cart data');
        const data = await res.json();
        setItems(data.items || []);
        
        setTimeout(() => {
          const table = document.getElementById('items-table');
          if (table) {
            table.classList.remove('opacity-0');
            table.classList.add('opacity-100');
          }
        }, 50);
      } catch (err) {
        console.error('Error fetching cart:', err);
        setItems([]);
        setError(err instanceof Error ? err.message : 'Failed to load cart data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [debouncedCartId]);

  const calculateTotal = useCallback(() => 
    items.reduce((total, item) => total + item.price * item.quantity, 0), 
    [items]
  );

  const calculateExpectedWeight = useCallback(() => 
    items.reduce((total, item) => total + (item.weight * item.quantity), 0), 
    [items]
  );

  const calculateWeightDifference = useCallback(() => {
    if (actualWeight === null || items.length === 0) return null;
    return actualWeight - calculateExpectedWeight();
  }, [actualWeight, items, calculateExpectedWeight]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  // Inside the CartEntry component, modify the useEffect that checks the weight difference
useEffect(() => {
  if (calculateWeightDifference() !== null && Math.abs(calculateWeightDifference()!) > 50) {
    navigate('/blocked', {
      state: {
        cartId: debouncedCartId,
        cartWeight: actualWeight ? actualWeight / 1000 : 0, // Convert to kg
        actualWeight: actualWeight ? actualWeight / 1000 : 0,
        totalWeight: calculateExpectedWeight() / 1000 // Convert to kg
      },
      replace: true
    });
  }
}, [calculateWeightDifference(), actualWeight, calculateExpectedWeight, navigate,debouncedCartId]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-indigo-600">Cart Weight Analytics</h1>
            </div>
            <nav className="flex space-x-4">
              <button 
                onClick={() => navigate('/')}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition"
              >
                Home
              </button>
              <button 
                onClick={() => navigate('/profile')}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition"
              >
                Profile
              </button>
              <button 
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition"
              >
                Logout
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6 text-indigo-600">Cart Weight Analysis</h2>
          
          <div className="mb-6 relative">
            <label htmlFor="cart-id" className="block text-sm font-medium text-gray-700 mb-1">
              Cart ID
            </label>
            <input
              id="cart-id"
              value={cartId}
              onChange={(e) => setCartId(e.target.value)}
              placeholder="Enter Cart ID"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-sm"
            />
            {isLoading && (
              <div className="absolute right-3 top-9">
                <div className="animate-spin h-5 w-5 border-2 border-indigo-500 rounded-full border-t-transparent"></div>
              </div>
            )}
          </div>

          {/* Weight Comparison Section */}
          <div className="mb-8 flex flex-col md:flex-row gap-6">
            {/* Left side - Weight Verification */}
            <div className="w-full md:w-1/2">
              <h3 className="text-lg font-semibold mb-4 text-indigo-700">Weight Verification</h3>
              <div className="space-y-4">
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-indigo-700 mb-2">Expected Weight</h4>
                  <div className="text-2xl font-bold">
                    {items.length > 0 ? (
                      <span>{calculateExpectedWeight().toLocaleString()} <span className="text-sm text-gray-500">g</span></span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Sum of all item weights</p>
                </div>

                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-indigo-700 mb-2">Actual Weight</h4>
                  <div 
                    id="actual-weight-display"
                    className="text-2xl font-bold transition-transform duration-300"
                  >
                    {actualWeight !== null ? (
                      <span>{actualWeight.toLocaleString()} <span className="text-sm text-gray-500">g</span></span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">From scale measurement</p>
                </div>

                <div className={`p-4 rounded-lg ${
                  calculateWeightDifference() === null ? 'bg-gray-50' : 
                  Math.abs(calculateWeightDifference()!) <= 50 ? 'bg-green-50' : 
                  'bg-red-50'
                }`}>
                  <h4 className="text-sm font-medium mb-2">Difference (±50g tolerance)</h4>
                  <div className="text-2xl font-bold">
                    {calculateWeightDifference() !== null ? (
                      <span className={
                        Math.abs(calculateWeightDifference()!) <= 50 ? 'text-green-600' : 'text-red-600'
                      }>
                        {calculateWeightDifference()!.toLocaleString()} 
                        <span className="text-sm">g</span>
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </div>
                  <p className="text-xs mt-1">
                    {calculateWeightDifference() !== null && (
                      Math.abs(calculateWeightDifference()!) <= 50 ? 
                      '✅ Within tolerance' : 
                      '⚠️ Check for discrepancies'
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Right side - Other content */}
            <div className="w-full md:w-1/2">
              {/* Weight Difference Visualization */}
              {calculateWeightDifference() !== null && (
                <div className="mt-10">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Expected: {calculateExpectedWeight().toLocaleString()}g</span>
                    <span>Actual: {actualWeight!.toLocaleString()}g</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="h-4 rounded-full" 
                      style={{
                        width: `${Math.min(calculateExpectedWeight(), actualWeight!) / Math.max(calculateExpectedWeight(), actualWeight!) * 100}%`,
                        backgroundColor: Math.abs(calculateWeightDifference()!) <= 50 ? '#4f46e5' : '#ef4444'
                      }}
                    ></div>
                  </div>
                  <div className="mt-2 text-center text-sm">
                    {calculateWeightDifference()! > 50 ? (
                      <span className="text-red-600">Scale shows {calculateWeightDifference()!.toLocaleString()}g more than expected</span>
                    ) : calculateWeightDifference()! < -50 ? (
                      <span className="text-red-600">Scale shows {Math.abs(calculateWeightDifference()!).toLocaleString()}g less than expected</span>
                    ) : (
                      <span className="text-green-600">Within acceptable range (±50g)</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Cart Items Section */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-indigo-700">Cart Items</h3>
              {items.length > 0 && (
                <div className="text-sm">
                  <span className="font-medium">{items.length} items</span>
                  <span className="mx-2">•</span>
                  <span>{calculateExpectedWeight().toLocaleString()}g expected</span>
                </div>
              )}
            </div>

            {error ? (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            ) : isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin h-10 w-10 border-4 border-indigo-500 rounded-full border-t-transparent"></div>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500">No items found.</p>
                <p className="text-sm text-gray-400 mt-1">Enter a valid cart ID to view items</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-xs">
                <table 
                  id="items-table"
                  className="w-full border-collapse opacity-0 transition-opacity duration-300"
                >
                  <thead className="bg-indigo-600 text-white">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm">Item</th>
                      <th className="px-4 py-2 text-right text-sm">Qty</th>
                      <th className="px-4 py-2 text-right text-sm">Unit Weight</th>
                      <th className="px-4 py-2 text-right text-sm">Total Weight</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {items.map((item, i) => (
                      <tr key={i} className="hover:bg-indigo-50">
                        <td className="px-4 py-2 text-sm font-medium">{item.name}</td>
                        <td className="px-4 py-2 text-sm text-right">{item.quantity}</td>
                        <td className="px-4 py-2 text-sm text-right">{item.weight.toLocaleString()}g</td>
                        <td className="px-4 py-2 text-sm text-right font-medium text-indigo-700">
                          {(item.weight * item.quantity).toLocaleString()}g
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Summary Section */}
          {items.length > 0 && (
            <div className="mt-8 p-6 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg text-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium opacity-80">Expected Total Weight</h4>
                  <p className="text-2xl font-bold mt-1">
                    {calculateExpectedWeight().toLocaleString()}g
                  </p>
                  <p className="text-sm opacity-80 mt-2">
                    Calculated from {items.length} item{items.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium opacity-80">Actual Measured Weight</h4>
                  <p className="text-2xl font-bold mt-1">
                    {actualWeight !== null ? actualWeight.toLocaleString() + 'g' : '-'}
                  </p>
                  {calculateWeightDifference() !== null && (
                    <p className={`text-sm font-medium mt-2 ${
                      Math.abs(calculateWeightDifference()!) <= 50 ? 'text-green-300' : 'text-red-300'
                    }`}>
                      {Math.abs(calculateWeightDifference()!) <= 50 ? (
                        '✅ Weight matches within tolerance'
                      ) : (
                        '⚠️ Weight discrepancy detected'
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CartEntry;