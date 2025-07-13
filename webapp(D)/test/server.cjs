// server.cjs (CommonJS style)
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const cartData = {
  cart001: [
    { name: 'Milk', quantity: 2, price: 250 ,weight: 500},
    { name: 'Bread', quantity: 1, price: 150,weight: 300 },
    { name: 'Eggs', quantity: 1, price: 400 ,weight: 600 }
  ],
  cart002: [
    { name: 'Biscuits', quantity: 3, price: 100 ,weight: 200 },
    { name: 'Juice', quantity: 2, price: 200,weight: 400 },
  ],
  cart003: []
};

app.get('/api/cart/:cartId', (req, res) => {
  const cartId = req.params.cartId;
  const items = cartData[cartId];

  if (items) {
    res.json({ cartId, items });
  } else {
    res.status(404).json({ message: 'Cart not found' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
