import React from 'react';
import './ItemRegistration.css';

function ItemRegistration() {
  return (
    <div className="split-container">
      {/* Left side: Form */}
      <div className="form-section">
        <div className="form-card">
          <h2>🛒 Register New Product</h2>
          <form>
            <input type="text" placeholder="Product Barcode" required />
            <input type="text" placeholder="Product Name" />
            <input type="text" placeholder="Product Description" />
            <input type="number" placeholder="Price" />
            <input type="number" placeholder="Quantity" />
            <input type="text" placeholder="Category" />
            <input type="text" placeholder="Brand" />
            <input type="text" placeholder="Weight" />
            <input type="text" placeholder="Shelf Number" />
            <input type="text" placeholder="Row Number" />

            <div className="button-group">
              <button type="submit" className="submit">Submit</button>
              <button type="reset" className="reset">Reset</button>
            </div>
          </form>
        </div>
      </div>

      {/* Right side: Image & text */}
      <div className="info-section">
        <img src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png" alt="Shop" />
        <h3>Manage Your Store Easily</h3>
        <p>Track items, update stock, and optimize layout with a smart product registry.</p>
      </div>
    </div>
  );
}

export default ItemRegistration;
