class Item {
  final String id;
  final String name;
  final int row;
  final int col;
  final int index;

  Item({
    required this.id,
    required this.name,
    required this.row,
    required this.col,
    required this.index,
  });

  factory Item.fromJson(Map<String, dynamic> json) {
    return Item(
      id: json['id'],
      name: json['name'],
      row: json['row'],
      col: json['col'],
      index: json['index'],
    );
  }
}