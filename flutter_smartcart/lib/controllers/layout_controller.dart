import 'package:flutter/material.dart';

class LayoutController {
  final TransformationController transformationController;
  final double scale;
  final Map<String, dynamic> fixtures;
  final Function() onTransformationChanged;

  LayoutController({
    required this.transformationController,
    this.scale = 15.0,
    required this.fixtures,
    required this.onTransformationChanged,
  }) {
    transformationController.addListener(onTransformationChanged);
  }

  void fitToScreen(BuildContext context) {
    if (fixtures.isEmpty) return;

    double minX = double.infinity;
    double minY = double.infinity;
    double maxX = double.negativeInfinity;
    double maxY = double.negativeInfinity;

    for (final fixture in fixtures.values) {
      for (int i = 0; i < fixture.points.length; i += 2) {
        final x = fixture.x + fixture.points[i];
        final y = fixture.y + fixture.points[i + 1];
        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;
        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;
      }
    }

    final layoutWidth = (maxX - minX) * scale;
    final layoutHeight = (maxY - minY) * scale;

    final screenSize = MediaQuery.of(context).size;
    final fitScale = 0.7 *
        (screenSize.width * 0.7 / layoutWidth)
            .clamp(0.1, 5.0)
            .clamp(0.1, screenSize.height / layoutHeight);

    final centerX = (minX + maxX) / 2 * scale;
    final centerY = (minY + maxY) / 2 * scale;

    final dx = screenSize.width * 0.35 - centerX * fitScale;
    final dy = screenSize.height / 2 - centerY * fitScale;

    transformationController.value = Matrix4.identity()
      ..translate(dx, dy)
      ..scale(fitScale);
  }

  void dispose() {
    transformationController.removeListener(onTransformationChanged);
    transformationController.dispose();
  }
}
