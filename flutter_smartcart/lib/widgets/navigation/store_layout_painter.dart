import 'package:flutter/material.dart';
import '../../services/navigation/user_position_service.dart';
import '../../models/navigation/fixture.dart';
import '../../models/navigation/item_position.dart';
import '../../utils/color_utils.dart';

class StoreLayoutPainter extends CustomPainter {
  final Map<String, Fixture> fixtures;
  final double scale;
  final ItemPosition? selectedItemPosition;
  final UserPosition? userPosition;

  StoreLayoutPainter(
    this.fixtures,
    this.scale,
    this.selectedItemPosition,
    this.userPosition,
  );

  @override
  void paint(Canvas canvas, Size size) {
    for (final fixture in fixtures.values) {
      _drawFixture(canvas, fixture);
    }

    // Draw item position circle if an item is selected
    if (selectedItemPosition != null) {
      _drawItemPosition(canvas, selectedItemPosition!);
    }

    // Draw user position if available
    if (userPosition != null) {
      _drawUserPosition(canvas, userPosition!);
    }
  }

  void _drawFixture(Canvas canvas, Fixture fixture) {
    final path = Path();
    final points = _getScaledPoints(fixture);

    if (points.isEmpty) return;

    path.moveTo(points[0].dx, points[0].dy);
    for (int i = 1; i < points.length; i++) {
      path.lineTo(points[i].dx, points[i].dy);
    }
    path.close();

    final fillPaint = Paint()
      ..color = ColorUtils.parseColor(fixture.color)
      ..style = PaintingStyle.fill;

    final strokePaint = Paint()
      ..color = const Color.fromARGB(30, 0, 0, 0)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1;

    canvas.drawPath(path, fillPaint);
    canvas.drawPath(path, strokePaint);
  }

  void _drawItemPosition(Canvas canvas, ItemPosition itemPosition) {
    final position = Offset(
      itemPosition.position.dx * scale,
      itemPosition.position.dy * scale,
    );

    // Draw pulsing circle
    final circlePaint = Paint()
      ..color = const Color.fromARGB(255, 0, 40, 169)
      ..style = PaintingStyle.fill;

    final outerCirclePaint = Paint()
      ..color = const Color.fromARGB(82, 0, 38, 255)
      ..style = PaintingStyle.fill;

    // Draw outer pulsing circle
    canvas.drawCircle(position, 2, outerCirclePaint);
    // Draw inner circle
    canvas.drawCircle(position, 1.5, circlePaint);

    // // Draw item name near the circle
    // final textPainter = TextPainter(
    //   text: TextSpan(
    //     text: itemPosition.item.name,
    //     style: const TextStyle(
    //       color: Color.fromARGB(255, 255, 114, 104),
    //       fontSize: 12,
    //       fontWeight: FontWeight.bold,
    //       backgroundColor: Colors.white,
    //     ),
    //   ),
    //   textDirection: TextDirection.ltr,
    // );

    // textPainter.layout();
    // textPainter.paint(
    //   canvas,
    //   Offset(position.dx + 20, position.dy - textPainter.height / 2),
    // );
  }

  List<Offset> _getScaledPoints(Fixture fixture) {
    List<Offset> points = [];
    for (int i = 0; i < fixture.points.length; i += 2) {
      double x = (fixture.x + fixture.points[i]) * scale;
      double y = (fixture.y + fixture.points[i + 1]) * scale;
      points.add(Offset(x, y));
    }
    return points;
  }

  void _drawUserPosition(Canvas canvas, UserPosition userPosition) {
    // Get absolute position based on "start" fixture
    final absolutePos = UserPositionService.getAbsolutePosition(
      userPosition,
      fixtures,
    );

    final position = Offset(
      absolutePos['x']! * scale,
      absolutePos['y']! * scale,
    );

    // Draw user as a person icon/circle
    final userPaint = Paint()
      ..color = const Color.fromARGB(255, 255, 131, 8)
      ..style = PaintingStyle.fill;

    final userOuterPaint = Paint()
      ..color = const Color.fromARGB(169, 255, 137, 19)
      ..style = PaintingStyle.fill;

    // Draw outer circle (movement indicator)
    canvas.drawCircle(position, 2, userOuterPaint);

    // Draw main user circle
    canvas.drawCircle(position, 1.5, userPaint);

    // // Draw user label with coordinates
    // final userTextPainter = TextPainter(
    //   text: TextSpan(
    //     text: 'YOU\n(${userPosition.x.toStringAsFixed(1)}, ${userPosition.y.toStringAsFixed(1)})',
    //     style: const TextStyle(
    //       color: Color.fromARGB(220, 250, 113, 15),
    //       fontSize: 10,
    //       fontWeight: FontWeight.bold,
    //       height: 1.2,
    //     ),
    //   ),
    //   textDirection: TextDirection.ltr,
    //   textAlign: TextAlign.center,
    // );

    // userTextPainter.layout();
    // userTextPainter.paint(
    //   canvas,
    //   Offset(
    //     position.dx - userTextPainter.width / 2,
    //     position.dy + 15
    //   ),
    // );

    // Draw connection line to start fixture (origin)
    Fixture? startFixture;
    for (final fixture in fixtures.values) {
      if (fixture.name.toLowerCase().contains('start')) {
        startFixture = fixture;
        break;
      }
    }

    if (startFixture != null) {
      final startPos = Offset(startFixture.x * scale, startFixture.y * scale);
      final connectionPaint = Paint()
        ..color = const Color.fromARGB(255, 235, 54, 244)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 1;

      // Draw dashed line
      final double dashWidth = 5;
      final double dashSpace = 5;
      double distance = (position - startPos).distance;
      double drawn = 0;

      while (drawn < distance) {
        double remainingDistance = distance - drawn;
        double currentDash = remainingDistance > dashWidth
            ? dashWidth
            : remainingDistance;

        double progress = drawn / distance;
        Offset start = Offset.lerp(startPos, position, progress)!;
        progress = (drawn + currentDash) / distance;
        Offset end = Offset.lerp(startPos, position, progress)!;

        canvas.drawLine(start, end, connectionPaint);
        drawn += dashWidth + dashSpace;
      }
    }
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => true;
}
