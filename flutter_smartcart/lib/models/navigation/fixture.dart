import 'dart:ui';

class Fixture {
  final String id;
  final double x;
  final double y;
  final List<double> points;
  final String name;
  final String? color;

  Fixture({
    required this.id,
    required this.x,
    required this.y,
    required this.points,
    required this.name,
    this.color,
  });

  factory Fixture.fromJson(Map<String, dynamic> json) {
    return Fixture(
      id: json['id'],
      x: json['x'].toDouble(),
      y: json['y'].toDouble(),
      points: List<double>.from(json['points'].map((x) => x.toDouble())),
      name: json['name'],
      color: json['color'],
    );
  }

  // Get number of edges in the fixture
  int get edgeCount => points.length ~/ 2;

  // Get start and end points of an edge
  EdgePoints getEdgePoints(int edgeIndex) {
    int startIdx = edgeIndex * 2;
    int endIdx = ((edgeIndex + 1) * 2) % points.length;
    
    return EdgePoints(
      start: Offset(x + points[startIdx], y + points[startIdx + 1]),
      end: Offset(x + points[endIdx], y + points[endIdx + 1]),
    );
  }
}

class EdgePoints {
  final Offset start;
  final Offset end;
  
  EdgePoints({required this.start, required this.end});
  
  double get length => (end - start).distance;
  
  // Get position along the edge (0.0 to 1.0)
  Offset getPositionAt(double ratio) {
    return Offset(
      start.dx + (end.dx - start.dx) * ratio,
      start.dy + (end.dy - start.dy) * ratio,
    );
  }
}