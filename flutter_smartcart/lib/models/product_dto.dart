class ProductDTO {
  final int id;
  final String name;
  final double price;
  final String weight;
  final String imageUrl;
  final int availableUnits; // <-- new field

  ProductDTO({
    required this.id,
    required this.name,
    required this.price,
    required this.weight,
    required this.imageUrl,
    required this.availableUnits, // <-- new field in constructor
  });

  factory ProductDTO.fromJson(Map<String, dynamic> json) {
    return ProductDTO(
      id: json['id'],
      name: json['name'],
      price: double.tryParse(json['price'].toString()) ?? 0.0,
      weight: json['weight'],
      imageUrl: json['imageUrl'] ?? '',
      availableUnits:
          json['qty'] ?? 0, // <-- parse available units with fallback
    );
  }
}
