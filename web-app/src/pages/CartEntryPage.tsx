import React, { useEffect, useState, useCallback } from 'react';
import { ref, onValue } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import styles from './CartEntry.module.css'; // Import the CSS module
import { db, auth } from '../utils/firebase';
import { productService } from "../hooks/services/productService.ts";

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
  const [username, setUsername] = useState('');
  const [expectedWeightFromBill, setExpectedWeightFromBill] = useState<number | null>(null);


  const fetchDataForUser = async (userId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const itemsData = await productService.getShoppingListItems(userId);
      setItems(itemsData);

      const billWeight = await productService.getTotalWeight(userId);
      setExpectedWeightFromBill(billWeight);

      setTimeout(() => {
        const table = document.getElementById('items-table');
        if (table) table.style.opacity = '1';
      }, 50);

    } catch (err) {
      console.error('Error fetching data:', err);
      setItems([]);
      setExpectedWeightFromBill(null);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

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
          weightElement.style.transform = 'scale(1.1)';
          setTimeout(() => {
            weightElement.style.transform = 'scale(1)';
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
            table.style.opacity = '1';
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

  const calculateWeightDifference = useCallback(() => {
    if (actualWeight === null || expectedWeightFromBill === null) return null;
    return actualWeight - expectedWeightFromBill;
  }, [actualWeight, expectedWeightFromBill]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // useEffect(() => {
  //   if (calculateWeightDifference() !== null && Math.abs(calculateWeightDifference()!) > 50) {
  //     navigate('/blocked', {
  //       state: {
  //         cartId: debouncedCartId,
  //         cartWeight: actualWeight ? actualWeight / 1000 : 0, // Convert to kg
  //         actualWeight: actualWeight ? actualWeight / 1000 : 0,
  //         totalWeight: calculateExpectedWeight() / 1000 // Convert to kg
  //       },
  //       replace: true
  //     });
  //   }
  // }, [calculateWeightDifference, actualWeight, calculateExpectedWeight, navigate, debouncedCartId]);

  return (
    <div className={styles.container}>
      {/* Dashboard Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerFlex}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <h1 className={styles.headerTitle}>Cart Weight Analytics</h1>
            </div>
            <nav className={styles.navbarNav}>
              <button
                onClick={() => navigate('/')}
                className={styles.navButton}
              >
                Home
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className={styles.navButton}
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className={styles.navButton}
              >
                Logout
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Cart Weight Analysis</h2>

          <div className={styles.inputGroup}>
            <label htmlFor="cart-id" className={styles.label}>
              Cart ID
            </label>
            <input
              id="cart-id"
              value={cartId}
              onChange={(e) => setCartId(e.target.value)}
              placeholder="Enter Cart ID"
              className={styles.input}
            />
            {isLoading && (
              <div className={styles.spinnerContainer}>
                <div className={styles.spinner}></div>
              </div>
            )}
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.label}>
              Username
            </label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span className={styles.inputPrefix}>USER</span>
              <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      e.stopPropagation();
                      fetchDataForUser(`USER${username.trim()}`);
                    }
                  }}
                  placeholder="e.g., 60523"
                  className={styles.input}
                  style={{ flex: 1 }}
              />
            </div>
          </div>

          {/* Weight Comparison Section */}
          <div className={styles.weightComparisonSection}>
            {/* Left side - Weight Verification */}
            <div className={styles.weightColumn}>
              <h3 className={styles.sectionHeading}>Weight Verification</h3>
              <div className={styles.weightCardsContainer}>
                <div className={`${styles.weightCard} ${styles.expectedWeightCard}`}>
                  <h4 className={styles.weightCardTitle}>Expected Weight</h4>
                  <div className={styles.weightValue}>
                    {expectedWeightFromBill !== null ? (
                        <span>{expectedWeightFromBill.toLocaleString()}<span className={styles.weightUnit}> g</span></span>
                    ) : (
                        <span style={{ color: '#9ca3af' }}>-</span>
                    )}
                  </div>
                  <p className={styles.weightDescription}>Fetched from bill data</p>
                </div>

                <div className={`${styles.weightCard} ${styles.actualWeightCard}`}>
                  <h4 className={styles.weightCardTitle}>Actual Weight</h4>
                  <div
                    id="actual-weight-display"
                    className={styles.actualWeightDisplay}
                  >
                    {actualWeight !== null ? (
                      <span>{actualWeight.toLocaleString()} <span className={styles.weightUnit}>g</span></span>
                    ) : (
                      <span style={{ color: '#9ca3af' }}>-</span> /* text-gray-400 */
                    )}
                  </div>
                  <p className={styles.weightDescription}>From scale measurement</p>
                </div>

                <div className={`${styles.differenceCard}`} style={{
                  backgroundColor: calculateWeightDifference() === null ? '#f9fafb' :
                    Math.abs(calculateWeightDifference()!) <= 50 ? '#f0fdf4' :
                      '#fef2f2'
                }}>
                  <h4 className={styles.weightCardTitle}>Difference (±50g tolerance)</h4>
                  <div className={styles.differenceValue}>
                    {calculateWeightDifference() !== null ? (
                      <span style={{
                        color: Math.abs(calculateWeightDifference()!) <= 50 ? '#16a34a' : '#dc2626'
                      }}>
                        {calculateWeightDifference()!.toLocaleString()}
                        <span className={styles.differenceUnit}>g</span>
                      </span>
                    ) : (
                      <span style={{ color: '#9ca3af' }}>-</span> /* text-gray-400 */
                    )}
                  </div>
                  <p className={styles.differenceMessage}>
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
            <div className={styles.weightColumn}>
              {/* Weight Difference Visualization */}
              {calculateWeightDifference() !== null && (
                <div className={styles.visualizationContainer}>
                  <div className={styles.visualizationLabels}>
                   <span>
                    Expected: {expectedWeightFromBill !== null ? expectedWeightFromBill.toLocaleString() : '-'}g
                  </span>
                    <span>Actual: {actualWeight!.toLocaleString()}g</span>
                  </div>
                  <div className={styles.progressBarBackground}>
                    <div
                      className={styles.progressBarFill}
                      style={{
                        width: `${Math.min(expectedWeightFromBill as number, actualWeight!) / Math.max(expectedWeightFromBill as number, actualWeight!) * 100}%`,
                        backgroundColor: Math.abs(calculateWeightDifference()!) <= 50 ? '#4f46e5' : '#ef4444'
                      }}
                    ></div>
                  </div>
                  <div className={styles.visualizationMessage}>
                    {calculateWeightDifference()! > 50 ? (
                      <span style={{ color: '#dc2626' }}>Scale shows {calculateWeightDifference()!.toLocaleString()}g more than expected</span>
                    ) : calculateWeightDifference()! < -50 ? (
                      <span style={{ color: '#dc2626' }}>Scale shows {Math.abs(calculateWeightDifference()!).toLocaleString()}g less than expected</span>
                    ) : (
                      <span style={{ color: '#16a34a' }}>Within acceptable range (±50g)</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Cart Items Section */}
          <section className={styles.cartItemsSection}>
            <div className={styles.cartItemsHeader}>
              <h3 className={styles.cartItemsHeading}>Cart Items</h3>
              {items.length > 0 && (
                <div className={styles.cartItemsSummary}>
                  <span className={styles.fontMedium}>{items.length} items</span> {/* Corrected line */}
                  <span className={styles.separator}>•</span> {/* Corrected line */}
                  <span>{expectedWeightFromBill !== null ? expectedWeightFromBill.toLocaleString() : '-'}g expected</span>
                </div>
              )}
            </div>

            {error ? (
              <div className={styles.errorMessage}>
                <p>{error}</p>
              </div>
            ) : isLoading ? (
              <div className={styles.loadingSpinnerContainer}>
                <div className={styles.loadingSpinner}></div>
              </div>
            ) : items.length === 0 ? (
              <div className={styles.noItemsMessage}>
                <p>No items found.</p>
                <p>Enter a valid cart ID to view items</p>
              </div>
            ) : (
              <div className={styles.tableContainer}>
                <table
                  id="items-table"
                  className={styles.itemsTable}
                >
                  <thead className={styles.tableHeader}>
                    <tr>
                      <th className={styles.tableHeaderTh}>Item</th>
                      <th className={`${styles.tableHeaderTh} ${styles.tableCellRight}`}>Qty</th>
                      <th className={`${styles.tableHeaderTh} ${styles.tableCellRight}`}>Unit Weight</th>
                      <th className={`${styles.tableHeaderTh} ${styles.tableCellRight}`}>Total Weight</th>
                    </tr>
                  </thead>
                  <tbody className={styles.tableBody}>
                    {items.map((item, i) => (
                      <tr
                        key={i}
                        className={styles.tableRow}
                        style={{ backgroundColor: i % 2 === 0 ? '#ffffff' : '#f9fafb' }}
                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#eef2ff'; }}
                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = i % 2 === 0 ? '#ffffff' : '#f9fafb'; }}
                      >
                        <td className={`${styles.tableCell} ${styles.tableCellName}`}>{item.name}</td>
                        <td className={`${styles.tableCell} ${styles.tableCellRight}`}>{item.quantity}</td>
                        <td className={`${styles.tableCell} ${styles.tableCellRight}`}>{item.weight.toLocaleString()}g</td>
                        <td className={`${styles.tableCell} ${styles.tableCellRight} ${styles.tableCellTotalWeight}`}>
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
            <div className={styles.summarySection}>
              <div className={styles.summaryGrid}>
                <div>
                  <h4 className={styles.summaryCardTitle}>Expected Total Weight</h4>
                  <p className={styles.summaryValue}>
                    {expectedWeightFromBill !== null ? expectedWeightFromBill.toLocaleString() : '-'}g
                  </p>
                  <p className={styles.summaryDescription}>
                    Calculated from {items.length} item{items.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div>
                  <h4 className={styles.summaryCardTitle}>Actual Measured Weight</h4>
                  <p className={styles.summaryValue}>
                    {actualWeight !== null ? actualWeight.toLocaleString() + 'g' : '-'}
                  </p>
                  {calculateWeightDifference() !== null && (
                    <p className={styles.summaryStatus} style={{
                      color: Math.abs(calculateWeightDifference()!) <= 50 ? '#dcfce7' : '#fecaca'
                    }}>
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