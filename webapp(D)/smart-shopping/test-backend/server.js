// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8080;

app.use(cors());

// Sample cart data
const carts = {
  Cart123: {
    cartId: "Cart123",
    items: [
      { id: 1, name: "Apple", price: 2, weight: 0.5, quantity: 3 },
      { id: 2, name: "Bread", price: 3, weight: 0.4, quantity: 1 }
    ]
  },
  Cart456: {
    cartId: "Cart456",
    items: [
      { id: 3, name: "Milk", price: 4, weight: 1.2, quantity: 2 },
      { id: 4, name: "Eggs", price: 5, weight: 0.8, quantity: 1 }
    ]
  }
};

// API to get cart by ID
app.get('/api/cart/:cartId', (req, res) => {
  const cartId = req.params.cartId;
  const cart = carts[cartId];

  if (cart) {
    res.json(cart);
  } else {
    res.status(404).json({ error: 'Cart not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
