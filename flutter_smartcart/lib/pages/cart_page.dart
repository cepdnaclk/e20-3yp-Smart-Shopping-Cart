import 'package:flutter/material.dart';
import '../models/cart_dto.dart';
import '../widgets/cart_item_widget.dart';

class CartPage extends StatefulWidget {
  const CartPage({super.key});

  @override
  State<CartPage> createState() => _CartPageState();
}

class _CartPageState extends State<CartPage> {
  // Dummy data for now
  List<CartDTO> cartItems = [
    CartDTO(productName: "Apple", quantity: 2, price: 100.0),
    CartDTO(productName: "Bread", quantity: 1, price: 150.0),
  ];

  double get totalAmount {
    return cartItems.fold(0, (sum, item) => sum + (item.quantity * item.price));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('My Cart')),
      body:
          cartItems.isEmpty
              ? const Center(child: Text("Your cart is empty."))
              : Column(
                children: [
                  Expanded(
                    child: ListView.builder(
                      itemCount: cartItems.length,
                      itemBuilder: (context, index) {
                        return CartItemWidget(cartItem: cartItems[index]);
                      },
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Text(
                          "Total: Rs. $totalAmount",
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 10),
                        ElevatedButton(
                          onPressed: () {
                            // TODO: Proceed to payment or checkout
                          },
                          child: const Text('Checkout'),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
    );
  }
}
