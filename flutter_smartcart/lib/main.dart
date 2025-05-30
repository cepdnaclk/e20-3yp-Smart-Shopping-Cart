import 'package:flutter/material.dart';
import 'pages/login_page.dart';
import 'pages/register_page.dart';
import 'pages/home_page.dart';
import 'pages/cart_page.dart';
import 'pages/profile_page.dart';
import 'pages/product_detail_page.dart';
import 'pages/product_list_page.dart';
import 'models/product_dto.dart'; // ✅ Make sure to import ProductDTO

void main() {
  runApp(const SmartCartApp());
}

class SmartCartApp extends StatelessWidget {
  const SmartCartApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Smart Cart',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(primarySwatch: Colors.teal, fontFamily: 'Roboto'),
      initialRoute: '/',
      onGenerateRoute: (settings) {
        // Handle named route + arguments
        switch (settings.name) {
          case '/':
            return MaterialPageRoute(builder: (_) => const LoginPage());
          case '/register':
            return MaterialPageRoute(builder: (_) => const RegisterPage());
          case '/home':
            final args = settings.arguments as Map<String, dynamic>?;
            return MaterialPageRoute(
              builder: (_) => HomePage(username: args?['username'] ?? ''),
            );
          case '/cart':
            return MaterialPageRoute(builder: (_) => const CartPage());
          case '/profile':
            final args = settings.arguments as Map<String, dynamic>?;
            return MaterialPageRoute(
              builder: (_) => ProfilePage(username: args?['username'] ?? ''),
            );
          case '/product-list':
            return MaterialPageRoute(builder: (_) => const ProductListPage());
          case '/product-detail':
            final product = settings.arguments;
            if (product == null || product is! ProductDTO) {
              return MaterialPageRoute(
                builder:
                    (_) => const Scaffold(
                      body: Center(child: Text('No product data provided')),
                    ),
              );
            }
            return MaterialPageRoute(
              builder: (_) => ProductDetailPage(product: product),
            );
          default:
            return MaterialPageRoute(
              builder:
                  (_) => const Scaffold(
                    body: Center(child: Text('Page not found')),
                  ),
            );
        }
      },
    );
  }
}
