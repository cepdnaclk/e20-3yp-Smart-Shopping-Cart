import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../../models/navigation/fixture.dart';
import '../../models/navigation/item.dart';

class ApiService {
  static const String baseUrl =
      'http://localhost:5000/api'; // https://server-production-6f21.up.railway.app/api

  // Get stored token
  static Future<String?> _getToken() async {
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
  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    await prefs.remove('user');
  }

  // Create HTTP headers with authorization
  static Future<Map<String, String>> _getHeaders() async {
    final token = await _getToken();
    final headers = {'Content-Type': 'application/json'};

    if (token != null) {
      headers['Authorization'] = 'Bearer $token';
    }

    return headers;
  }

  // Authentication methods
  static Future<Map<String, dynamic>> register({
    required String firstName,
    required String lastName,
    required String email,
    required String password,
    required String phone,
    required String nic,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/register'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'firstName': firstName,
          'lastName': lastName,
          'email': email,
          'password': password,
          'phone': phone,
          'nic': nic,
        }),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = json.decode(response.body);
        if (data['token'] != null) {
          await _storeToken(data['token']);
          await _storeUser(data);
        }
        return data;
      } else {
        throw Exception('Registration failed: ${response.body}');
      }
    } catch (e) {
      throw Exception('Error during registration: $e');
    }
  }

  static Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/login'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'email': email, 'password': password}),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['token'] != null) {
          await _storeToken(data['token']);
          await _storeUser(data);
        }
        return data;
      } else {
        throw Exception('Login failed: ${response.body}');
      }
    } catch (e) {
      throw Exception('Error during login: $e');
    }
  }

  static Future<Map<String, dynamic>> changePassword({
    required String oldPassword,
    required String newPassword,
    required String confirmationPassword,
  }) async {
    try {
      final headers = await _getHeaders();
      final response = await http.patch(
        Uri.parse('$baseUrl/users/changePassword'),
        headers: headers,
        body: json.encode({
          'oldPassword': oldPassword,
          'newPassword': newPassword,
          'confirmationPassword': confirmationPassword,
        }),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        throw Exception('Password change failed: ${response.body}');
      }
    } catch (e) {
      throw Exception('Error changing password: $e');
    }
  }

  static Future<Map<String, dynamic>> forgotPassword({
    required String username,
    required String email,
  }) async {
    try {
      final response = await http.patch(
        Uri.parse('$baseUrl/users/forgetPassword'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'username': username, 'email': email}),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        throw Exception('Forgot password failed: ${response.body}');
      }
    } catch (e) {
      throw Exception('Error in forgot password: $e');
    }
  }

  static Future<Map<String, dynamic>> resetPassword({
    required String email,
    required String resetCode,
    required String newPassword,
    required String confirmationPassword,
  }) async {
    try {
      final response = await http.patch(
        Uri.parse('$baseUrl/users/resetPassword'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'email': email,
          'resetCode': resetCode,
          'changePasswordRequestDTO': {
            'newPassword': newPassword,
            'confirmationPassword': confirmationPassword,
          },
        }),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        throw Exception('Password reset failed: ${response.body}');
      }
    } catch (e) {
      throw Exception('Error resetting password: $e');
    }
  }

  // Layout operations
  static Future<Map<String, dynamic>> saveLayout({
    required Map<String, dynamic> fixtureLayout,
    required Map<String, dynamic> itemMap,
  }) async {
    try {
      final headers = await _getHeaders();
      final response = await http.post(
        Uri.parse('$baseUrl/layouts'),
        headers: headers,
        body: json.encode({'fixtureLayout': fixtureLayout, 'itemMap': itemMap}),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        return json.decode(response.body);
      } else {
        throw Exception('Failed to save layout: ${response.body}');
      }
    } catch (e) {
      throw Exception('Error saving layout: $e');
    }
  }

  static Future<Map<String, dynamic>> getLayout() async {
    try {
      final headers = await _getHeaders();
      final response = await http.get(
        Uri.parse('$baseUrl/layouts'),
        headers: headers,
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        throw Exception('Failed to get layout: ${response.body}');
      }
    } catch (e) {
      throw Exception('Error fetching layout: $e');
    }
  }

  static Future<Map<String, dynamic>> clearLayout() async {
    try {
      final headers = await _getHeaders();
      final response = await http.delete(
        Uri.parse('$baseUrl/layouts'),
        headers: headers,
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        throw Exception('Failed to clear layout: ${response.body}');
      }
    } catch (e) {
      throw Exception('Error clearing layout: $e');
    }
  }

  // Inventory operations
  static Future<List<dynamic>> getInventoryItems() async {
    try {
      final headers = await _getHeaders();
      final response = await http.get(
        Uri.parse('$baseUrl/inventory'),
        headers: headers,
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        throw Exception('Failed to get inventory: ${response.body}');
      }
    } catch (e) {
      throw Exception('Error fetching inventory: $e');
    }
  }

  // New layout fetching method
  static Future<
    ({
      Map<String, Fixture> fixtures,
      Map<String, List<List<List<Item>>>> itemMap,
    })
  >
  fetchFullLayout() async {
    try {
      final layout = await getLayout();

      final fixtureData =
          layout['fixtureLayout'] as Map<String, dynamic>? ?? {};
      final itemData = layout['itemMap'] as Map<String, dynamic>? ?? {};

      final fixtures = fixtureData.map(
        (key, value) => MapEntry(key, Fixture.fromJson(value)),
      );

      final Map<String, List<List<List<Item>>>> itemMap = {};
      itemData.forEach((edgeKey, edgeData) {
        List<List<List<Item>>> rows = [];
        for (var rowData in edgeData) {
          List<List<Item>> columns = [];
          for (var colData in rowData) {
            List<Item> items = [];
            for (var itemJson in colData) {
              items.add(Item.fromJson(itemJson));
            }
            columns.add(items);
          }
          rows.add(columns);
        }
        itemMap[edgeKey] = rows;
      });

      return (fixtures: fixtures, itemMap: itemMap);
    } catch (e) {
      throw Exception('Error fetching full layout: $e');
    }
  }

  // Updated fixture fetching method
  static Future<Map<String, Fixture>> fetchFixtures() async {
    try {
      final layout = await getLayout();
      final fixtureData =
          layout['fixtureLayout'] as Map<String, dynamic>? ?? {};

      return fixtureData.map(
        (key, value) => MapEntry(key, Fixture.fromJson(value)),
      );
    } catch (e) {
      throw Exception('Error fetching fixtures: $e');
    }
  }

  // Updated item map fetching method
  static Future<Map<String, List<List<List<Item>>>>> fetchItemMap() async {
    try {
      final layout = await getLayout();
      final itemData = layout['itemMap'] as Map<String, dynamic>? ?? {};
      final Map<String, List<List<List<Item>>>> loadedItemMap = {};

      itemData.forEach((edgeKey, edgeData) {
        List<List<List<Item>>> rows = [];
        for (var rowData in edgeData) {
          List<List<Item>> columns = [];
          for (var colData in rowData) {
            List<Item> items = [];
            for (var itemData in colData) {
              items.add(Item.fromJson(itemData));
            }
            columns.add(items);
          }
          rows.add(columns);
        }
        loadedItemMap[edgeKey] = rows;
      });
      print(loadedItemMap);
      return loadedItemMap;
    } catch (e) {
      throw Exception('Error fetching item map: $e');
    }
  }

  // Shopping list method (you may want to add this endpoint to your backend)
  static Future<List<String>> fetchShoppingList() async {
    try {
      final headers = await _getHeaders();
      final response = await http.get(
        Uri.parse('$baseUrl/shopping-list'),
        headers: headers,
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.cast<String>();
      } else {
        throw Exception('Failed to load shopping list: ${response.body}');
      }
    } catch (e) {
      // Let the data service handle the fallback
      throw Exception('Error fetching shopping list: $e');
    }
  }
}
