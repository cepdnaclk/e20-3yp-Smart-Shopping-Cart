import 'dart:ui';

class ColorUtils {
  static Color parseColor(String? colorString) {
    if (colorString == null) return const Color(0xFF808080); // Grey
    String hex = colorString.replaceAll('#', '');
    if (hex.length == 6) {
      hex = 'FF$hex';
    }
    try {
      return Color(int.parse(hex, radix: 16));
    } catch (_) {
      return const Color(0xFF808080); // Grey fallback
    }
  }
}