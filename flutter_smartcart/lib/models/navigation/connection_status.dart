import 'package:flutter/material.dart';

enum ConnectionStatus {
  disconnected,
  connecting,
  connected,
  error;

  String get message {
    switch (this) {
      case ConnectionStatus.disconnected:
        return 'Disconnected from position tracking';
      case ConnectionStatus.connecting:
        return 'Connecting to position tracking...';
      case ConnectionStatus.connected:
        return 'Successfully connected to position tracking';
      case ConnectionStatus.error:
        return 'Position tracking error';
    }
  }

  Color get color {
    switch (this) {
      case ConnectionStatus.disconnected:
        return Colors.grey;
      case ConnectionStatus.connecting:
        return Colors.orange;
      case ConnectionStatus.connected:
        return Colors.green;
      case ConnectionStatus.error:
        return Colors.red;
    }
  }
}
