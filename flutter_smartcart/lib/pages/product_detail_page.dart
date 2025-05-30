import 'package:flutter/material.dart';
import '../models/product_dto.dart';

class ProductDetailPage extends StatelessWidget {
  final ProductDTO product;

  const ProductDetailPage({super.key, required this.product});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(product.name)),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Product Image
            Center(
              child: ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: Image.network(
                  product.imageUrl.isNotEmpty
                      ? product.imageUrl
                      : 'https://via.placeholder.com/150',
                  height: 250,
                  width: double.infinity,
                  fit: BoxFit.cover,
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Product Name
            Text(
              product.name,
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),

            // Price
            Text(
              'Price: Rs. ${product.price.toStringAsFixed(2)}',
              style: const TextStyle(fontSize: 18),
            ),

            const SizedBox(height: 8),
            // Weight
            Text(
              'Weight: ${product.weight}',
              style: const TextStyle(fontSize: 18),
            ),

            const SizedBox(height: 8),
            // Quantity Available
            Text(
              'Available Units: ${product.availableUnits}', // fixed here
              style: const TextStyle(fontSize: 18, color: Colors.green),
            ),

            const Spacer(),

            // (Optional) Add to Cart button
            Center(
              child: ElevatedButton.icon(
                onPressed: () {
                  // TODO: Implement add to cart logic
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Added to cart!')),
                  );
                },
                icon: const Icon(Icons.add_shopping_cart),
                label: const Text('Add to Cart'),
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 24,
                    vertical: 12,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
