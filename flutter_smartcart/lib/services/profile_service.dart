import 'dart:convert';
import 'package:http/http.dart' as http;

class ProfileService {
  final String baseUrl = 'http://localhost:3000';

  Future<Map<String, dynamic>?> getProfile(String username) async {
    final response = await http.get(Uri.parse('$baseUrl/profile/$username'));

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }
    return null;
  }

  Future<List<dynamic>> getOrders(String username) async {
    final response = await http.get(Uri.parse('$baseUrl/orders/$username'));

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }
    return [];
  }
}
