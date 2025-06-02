import 'package:flutter/material.dart';
import '../../models/navigation/item.dart';
import '../../models/navigation/fixture.dart';
import '../../services/navigation/data_service.dart';

class ShoppingListSidebar extends StatelessWidget {
  final List<String> shoppingList;
  final Map<String, Fixture> fixtures;
  final Map<String, List<List<List<Item>>>> itemMap;
  final String? selectedItemId;
  final Function(String) onItemSelected;

  const ShoppingListSidebar({
    super.key,
    required this.shoppingList,
    required this.fixtures,
    required this.itemMap,
    required this.selectedItemId,
    required this.onItemSelected,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 160,
      decoration: BoxDecoration(
        color: const Color.fromARGB(255, 255, 255, 255),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: const Color.fromARGB(97, 0, 0, 0),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: const Color.fromARGB(255, 255, 255, 255),
              borderRadius: const BorderRadius.vertical(
                top: Radius.circular(16),
              ),
            ),
            child: const Text(
              'Shopping List',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: Color.fromARGB(255, 0, 0, 0),
              ),
            ),
          ),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(vertical: 8),
              itemCount: shoppingList.length,
              itemBuilder: (context, index) {
                final itemId = shoppingList[index];
                final itemPosition = DataService.findItemPosition(
                  itemId,
                  fixtures,
                  itemMap,
                );
                final isSelected = selectedItemId == itemId;
                return Container(
                  margin: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: isSelected
                        ? const Color.fromARGB(255, 160, 245, 255)
                        : const Color.fromARGB(255, 255, 255, 255),
                    borderRadius: BorderRadius.circular(12),
                    boxShadow: [
                      BoxShadow(
                        color: const Color.fromARGB(96, 77, 77, 77),
                        blurRadius: 2,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Material(
                    color: Colors.transparent,
                    child: InkWell(
                      borderRadius: BorderRadius.circular(12),
                      onTap: () => onItemSelected(itemId),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 12,
                        ),
                        child: Text(
                          itemPosition?.item.name ?? itemId,
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.black87,
                            fontWeight: isSelected
                                ? FontWeight.w600
                                : FontWeight.normal,
                          ),
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
