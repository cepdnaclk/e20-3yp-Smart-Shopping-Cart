import 'package:flutter/material.dart';

class HomePage extends StatelessWidget {
  final String username;

  const HomePage({super.key, required this.username});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Welcome, $username')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: GridView.count(
          crossAxisCount: 2,
          crossAxisSpacing: 16,
          mainAxisSpacing: 16,
          children: [
            _buildHomeCard(
              icon: Icons.qr_code_scanner,
              label: 'Scan Product',
              onTap: () {
                Navigator.pushNamed(context, '/scan-product');
              },
            ),
            _buildHomeCard(
              icon: Icons.shopping_bag,
              label: 'View Products',
              onTap: () {
                Navigator.pushNamed(context, '/product-list');
              },
            ),
            _buildHomeCard(
              icon: Icons.shopping_cart,
              label: 'My Cart',
              onTap: () {
                Navigator.pushNamed(context, '/cart');
              },
            ),
            _buildHomeCard(
              icon: Icons.person,
              label: 'My Profile',
              onTap: () {
                Navigator.pushNamed(
                  context,
                  '/profile',
                  arguments: {'username': username}, // Pass username here
                );
              },
            ),
            _buildHomeCard(
              icon: Icons.logout,
              label: 'Logout',
              onTap: () {
                Navigator.pushReplacementNamed(context, '/');
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHomeCard({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      child: Card(
        elevation: 4,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(icon, size: 48, color: Colors.teal),
              const SizedBox(height: 12),
              Text(label, style: const TextStyle(fontSize: 16)),
            ],
          ),
        ),
      ),
    );
  }
}
