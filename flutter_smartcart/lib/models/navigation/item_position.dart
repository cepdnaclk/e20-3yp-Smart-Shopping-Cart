import 'dart:ui';
import 'item.dart';

class ItemPosition {
  final String fixtureId;
  final int edgeIndex;
  final Offset position;
  final Item item;

  ItemPosition({
    required this.fixtureId,
    required this.edgeIndex,
    required this.position,
    required this.item,
  });
}