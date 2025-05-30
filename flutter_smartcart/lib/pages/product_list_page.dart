import 'package:flutter/material.dart';
import '../models/product_dto.dart';
import '../services/product_service.dart';

class ProductListPage extends StatefulWidget {
  const ProductListPage({super.key});

  @override
  State<ProductListPage> createState() => _ProductListPageState();
}

class _ProductListPageState extends State<ProductListPage> {
  List<ProductDTO> _products = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    loadProducts();
  }

  Future<void> loadProducts() async {
    final products = await ProductService().fetchAllProducts();
    setState(() {
      _products = products;
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('All Products')),
      body:
          _isLoading
              ? const Center(child: CircularProgressIndicator())
              : ListView.builder(
                itemCount: _products.length,
                itemBuilder: (context, index) {
                  final product = _products[index];
                  return Card(
                    margin: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 6,
                    ),
                    child: ListTile(
                      leading:
                          product.imageUrl.isNotEmpty
                              ? Image.network(
                                product.imageUrl,
                                width: 50,
                                height: 50,
                                fit: BoxFit.cover,
                              )
                              : const Icon(Icons.shopping_bag),
                      title: Text(product.name),
                      subtitle: Text('Rs. ${product.price.toStringAsFixed(2)}'),
                      trailing: Text(product.weight),
                      onTap: () {
                        // ✅ Pass the product instance correctly
                        Navigator.pushNamed(
                          context,
                          '/product-detail',
                          arguments: product,
                        );
                      },
                    ),
                  );
                },
              ),
    );
  }
}
