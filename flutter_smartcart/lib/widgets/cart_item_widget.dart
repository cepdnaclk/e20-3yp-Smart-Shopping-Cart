import 'package:flutter/material.dart';
import '../models/cart_dto.dart';

class CartItemWidget extends StatelessWidget {
  final CartDTO cartItem;

  const CartItemWidget({super.key, required this.cartItem});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: ListTile(
        title: Text(cartItem.name),
        subtitle: Text("Quantity: ${cartItem.quantity}"),
        trailing: Text("Rs. ${cartItem.price * cartItem.quantity}"),
      ),
    );
  }
}
