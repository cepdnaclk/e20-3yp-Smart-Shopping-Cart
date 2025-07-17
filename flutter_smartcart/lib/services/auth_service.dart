import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter/foundation.dart' show debugPrint;

class AuthService {
  static const String baseUrl = 'https://server-production-6f21.up.railway.app/api/v1/auth';

  // Get stored token
  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }
  
  // Store token
  static Future<void> _storeToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('token', token);
  }
  
  // Store user data
  static Future<void> _storeUser(Map<String, dynamic> userData) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('user', json.encode(userData));
  }

  // Get stored user
  static Future<Map<String, dynamic>?> getCurrentUser() async {
    final prefs = await SharedPreferences.getInstance();
    final userStr = prefs.getString('user');
    if (userStr != null) {
      return json.decode(userStr);
    }
    return null;
  }

  // Clear stored data (logout)
  static Future<void> clearSession() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    await prefs.remove('user');
  }

  /// Logs in a user and returns the authentication response.
  static Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    try {
      debugPrint('Attempting login for email: $email');
      final response = await http.post(
        Uri.parse('$baseUrl/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        debugPrint('Login successful');
        
        // Store the JWT token and user data
        if (data['token'] != null) {
          await _storeToken(data['token']);
          await _storeUser(data);
        }
        
        return data;
      } else {
        final error = jsonDecode(response.body);
        debugPrint('Login failed: ${response.statusCode} - ${response.body}');
        throw Exception(error['message'] ?? 'Login failed');
      }
    } catch (e) {
      debugPrint('Login error: $e');
      rethrow;
    }
  }

  /// Registers a new user
  static Future<Map<String, dynamic>> register({
    required String firstName,
    required String lastName,
    required String email,
    required String password,
    required String phone,
    required String nic,
  }) async {
    try {
      debugPrint('Attempting registration for email: $email');
      final response = await http.post(
        Uri.parse('$baseUrl/register'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'firstName': firstName,
          'lastName': lastName,
          'email': email,
          'password': password,
          'phone': phone,
          'nic': nic,
        }),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = jsonDecode(response.body);
        debugPrint('Registration successful');
        
        // Store the JWT token and user data if provided
        if (data['token'] != null) {
          await _storeToken(data['token']);
          await _storeUser(data);
        }
        
        return data;
      } else {
        final error = jsonDecode(response.body);
        debugPrint('Registration failed: ${response.statusCode} - ${response.body}');
        throw Exception(error['message'] ?? 'Registration failed');
      }
    } catch (e) {
      debugPrint('Registration error: $e');
      rethrow;
    }
  }
}
