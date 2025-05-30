import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/product_dto.dart';

class ProductService {
  final String baseUrl = 'http://10.0.2.2:3000'; // Or your IP if on real device

  Future<List<ProductDTO>> fetchAllProducts() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/products'));

      if (response.statusCode == 200) {
        final List<dynamic> jsonData = jsonDecode(response.body);

        return jsonData.map((item) => ProductDTO.fromJson(item)).toList();
      } else {
        throw Exception('Failed to load products');
      }
    } catch (e) {
      print('Fetch products error: $e');
      return [];
    }
  }
}
