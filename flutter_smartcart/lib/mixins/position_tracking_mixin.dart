import 'package:flutter/material.dart';
import '../services/navigation/user_position_service.dart';

mixin PositionTrackingMixin<T extends StatefulWidget> on State<T> {
  final UserPositionService positionService = UserPositionService();
  UserPosition? userPosition;

  @override
  void initState() {
    super.initState();
    _setupPositionTracking();
  }

  @override
  void dispose() {
    positionService.dispose();
    super.dispose();
  }

  Future<void> _setupPositionTracking() async {
    final connected = await positionService.connect();
    if (!connected) {
      debugPrint('Failed to connect to MQTT broker');
      return;
    }

    positionService.positionStream.listen((position) {
      if (mounted) {
        setState(() {
          userPosition = position;
        });
      }
    });
  }
}
