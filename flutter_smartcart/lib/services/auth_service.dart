import 'dart:convert';
import 'package:http/http.dart' as http;

class AuthService {
  final String baseUrl = 'http://localhost:3000';

  /// Logs in a user and returns user data (e.g., username) if successful.
  Future<Map<String, dynamic>?> login({
    required String username,
    required String password,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'username': username, 'password': password}),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        print('Login success: $data');
        return data; // e.g. {'username': 'abc', 'fullname': 'John Doe'}
      } else {
        print('Login failed: ${response.statusCode} - ${response.body}');
        return null;
      }
    } catch (e) {
      print('Login error: $e');
      return null;
    }
  }

  /// Registers a new user
  Future<bool> register({
    required String fullname,
    required String username,
    required String contact,
    required String sex,
    required String password,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/register'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'fullname': fullname,
          'username': username,
          'contact': contact,
          'sex': sex,
          'password': password,
        }),
      );

      if (response.statusCode == 200) {
        print('Register success: ${response.body}');
        return true;
      } else {
        print('Register failed: ${response.statusCode} - ${response.body}');
        return false;
      }
    } catch (e) {
      print('Register error: $e');
      return false;
    }
  }
}
