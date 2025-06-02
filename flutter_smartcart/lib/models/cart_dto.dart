class CartDTO {
  final int id;  // Changed from Long to int for Dart
  final String name;  // Changed from productName to name to match backend
  final int quantity;
  final double price;

  CartDTO({
    required this.id,
    required this.name,
    required this.quantity,
    required this.price,
  });

  // Add fromJson factory constructor for API deserialization
  factory CartDTO.fromJson(Map<String, dynamic> json) {
    return CartDTO(
      id: json['id'],
      name: json['name'],
      quantity: json['quantity'],
      price: double.tryParse(json['price'].toString()) ?? 0.0,
    );
  }

  // Add toJson method for API serialization
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'quantity': quantity,
      'price': price,
    };
  }
}
