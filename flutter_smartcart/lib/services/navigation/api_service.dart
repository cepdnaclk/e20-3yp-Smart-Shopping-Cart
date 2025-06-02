import 'dart:convert'; // DO NOT REMOVE BECAUSE OF THE WARNING
import '../../models/navigation/fixture.dart'; // DO NOT REMOVE
import '../../models/navigation/item.dart'; // DO NOT REMOVE

class ApiService {
  static const String baseUrl = 'https://your-api-endpoint.com';  // Change this to your actual API endpoint

  // API methods for future use
  /*
  static Future<Map<String, Fixture>> fetchFixtures() async {
    try {
      // Simulate API call
      // final response = await http.get(Uri.parse('$baseUrl/fixtures'));
      // if (response.statusCode == 200) {
      //   final Map<String, dynamic> fixtureData = json.decode(response.body);
      //   return fixtureData.map(
      //     (key, value) => MapEntry(key, Fixture.fromJson(value)),
      //   );
      // }
      // throw Exception('Failed to load fixtures');
    } catch (e) {
      throw Exception('Error fetching fixtures: $e');
    }
  }

  static Future<Map<String, List<List<List<Item>>>>> fetchItemMap() async {
    try {
      // Simulate API call
      // final response = await http.get(Uri.parse('$baseUrl/item-map'));
      // if (response.statusCode == 200) {
      //   final Map<String, dynamic> itemData = json.decode(response.body);
      //   final Map<String, List<List<List<Item>>>> loadedItemMap = {};
      //   
      //   itemData.forEach((edgeKey, edgeData) {
      //     List<List<List<Item>>> rows = [];
      //     for (var rowData in edgeData) {
      //       List<List<Item>> columns = [];
      //       for (var colData in rowData) {
      //         List<Item> items = [];
      //         for (var itemData in colData) {
      //           items.add(Item.fromJson(itemData));
      //         }
      //         columns.add(items);
      //       }
      //       rows.add(columns);
      //     }
      //     loadedItemMap[edgeKey] = rows;
      //   });
      //   
      //   return loadedItemMap;
      // }
      // throw Exception('Failed to load item map');
    } catch (e) {
      throw Exception('Error fetching item map: $e');
    }
  }

  static Future<List<String>> fetchShoppingList() async {
    try {
      // Simulate API call
      // final response = await http.get(Uri.parse('$baseUrl/shopping-list'));
      // if (response.statusCode == 200) {
      //   final List<dynamic> data = json.decode(response.body);
      //   return data.cast<String>();
      // }
      // throw Exception('Failed to load shopping list');
    } catch (e) {
      throw Exception('Error fetching shopping list: $e');
    }
  }
  */
}
