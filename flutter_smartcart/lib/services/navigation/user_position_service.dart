import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:math';
import 'package:flutter/foundation.dart';
import 'package:mqtt_client/mqtt_client.dart';
import 'package:mqtt_client/mqtt_server_client.dart';
import 'package:flutter/services.dart' show rootBundle;
import 'package:path_provider/path_provider.dart'; 

import '../../models/navigation/fixture.dart';

class MqttConfig {
  final String server;
  final int port;
  final String username;
  final String password;
  final String topic;
  final String certPath;

  MqttConfig({
    required this.server,
    required this.port,
    required this.username,
    required this.password,
    required this.topic,
    required this.certPath,
  });

  static Future<MqttConfig?> load() async {
    try {
      final configPath = 'assets/config/emqx.env';
      debugPrint('Loading MQTT config from: $configPath');

      final configContent = await rootBundle.loadString(configPath);
      final lines = LineSplitter.split(configContent);

      final config = Map.fromEntries(
        lines
            .map((line) {
              if (line.trim().startsWith('//') || line.trim().isEmpty) {
                return MapEntry('', '');
              }
              final parts = line.split('=');
              return MapEntry(parts[0].trim(), parts[1].trim());
            })
            .where((entry) => entry.key.isNotEmpty),
      );

      final server = config['MQTT_SERVER'];
      final portStr = config['MQTT_PORT'];
      final username = config['MQTT_USER'];
      final password = config['MQTT_PASS'];
      final topic = config['MQTT_TOPIC'];

      if ([server, portStr, username, password, topic].contains(null)) {
        debugPrint('Missing required MQTT configuration values');
        return null;
      }

      final port = int.tryParse(portStr!);
      if (port == null) {
        debugPrint('Invalid port number in configuration');
        return null;
      }

      final certPath =
          'assets/config/emqxsl-ca.crt'; // Still needs special handling, see below

      return MqttConfig(
        server: server!,
        port: port,
        username: username!,
        password: password!,
        topic: topic!,
        certPath: certPath,
      );
    } catch (e) {
      debugPrint('Error loading MQTT config: $e');
      return null;
    }
  }
}

class UserPosition {
  final double x;
  final double y;
  final double z;

  UserPosition({required this.x, required this.y, required this.z});

  factory UserPosition.fromJson(Map<String, dynamic> json) {
    return UserPosition(
      x: (json['x'] as num).toDouble(),
      y: (json['y'] as num).toDouble(),
      z: (json['z'] as num).toDouble(),
    );
  }

  @override
  String toString() => 'UserPosition(x: $x, y: $y, z: $z)';
}

class UserPositionService {
  final String _clientId = 'flutter_store_layout_client';
  MqttConfig? _config;
  MqttServerClient? _client;
  final StreamController<UserPosition> _positionController =
      StreamController<UserPosition>.broadcast();
  UserPosition? _currentPosition;
  Timer? _simulationTimer;
  bool _isSimulating = false;

  final ValueNotifier<String?> errorMessage = ValueNotifier(null);
  final ValueNotifier<bool> isConnecting = ValueNotifier(false);

  Stream<UserPosition> get positionStream => _positionController.stream;
  UserPosition? get currentPosition => _currentPosition;

  Future<bool> connect() async {
  isConnecting.value = true;

  try {
    disconnect();

    _config ??= await MqttConfig.load();
    if (_config == null) {
      errorMessage.value = 'Failed to load MQTT configuration.';
      isConnecting.value = false;
      return false;
    }

    _client = MqttServerClient.withPort(
      _config!.server,
      _clientId,
      _config!.port,
    );

    // TLS setup — fixed for mobile
    try {
      if (_config!.certPath.isNotEmpty) {
        final certBytes = await rootBundle.load(_config!.certPath);
        final tempDir = await getTemporaryDirectory();
        final tempCertFile = File('${tempDir.path}/emqxsl-ca.crt');
        await tempCertFile.writeAsBytes(certBytes.buffer.asUint8List());

        final securityContext = SecurityContext(withTrustedRoots: true);
        securityContext.setTrustedCertificates(tempCertFile.path);

        _client!.securityContext = securityContext;
        _client!.secure = true;

        debugPrint('TLS certificate loaded from temp: ${tempCertFile.path}');
      } else {
        _client!.secure = false;
      }
    } catch (e) {
      debugPrint('TLS config failed: $e');
      _client!.secure = false;
    }

    _client!
      ..keepAlivePeriod = 60
      ..connectTimeoutPeriod = 30000
      ..autoReconnect = true
      ..connectionMessage = MqttConnectMessage()
          .withWillTopic('smart_cart/disconnect')
          .withWillMessage('Cart disconnected')
          .withWillQos(MqttQos.atLeastOnce)
          .withWillRetain()
          .startClean()
          .authenticateAs(_config!.username, _config!.password)
      ..onConnected = _onConnected
      ..onDisconnected = _onDisconnected
      ..onSubscribed = _onSubscribed;

    debugPrint(
      'Connecting to MQTT broker at ${_config!.server}:${_config!.port}',
    );

    final connMessage = await _client!.connect();

    if (connMessage?.state == MqttConnectionState.connected) {
      debugPrint('MQTT connected successfully');
      errorMessage.value = null;
      isConnecting.value = false;
      _subscribeToPositionUpdates();
      return true;
    } else {
      errorMessage.value = 'MQTT connection failed: ${connMessage?.state}, return code: ${connMessage?.returnCode}';
      isConnecting.value = false;
      return false;
    }
  } catch (e) {
    errorMessage.value = 'Error connecting to MQTT: $e';
    isConnecting.value = false;
    return false;
  }
}

  Future<void> retryConnection() async {
    disconnect();
    errorMessage.value = null;
    await connect();
  }

  void _onConnected() => debugPrint('MQTT client connected');
  void _onDisconnected() => debugPrint('MQTT client disconnected');
  void _onSubscribed(String topic) => debugPrint('Subscribed to topic: $topic');

  void _subscribeToPositionUpdates() {
    if (_client?.connectionStatus?.state == MqttConnectionState.connected) {
      _client!.subscribe(_config!.topic, MqttQos.atLeastOnce);
      _client!.updates!.listen((
        List<MqttReceivedMessage<MqttMessage>> messages,
      ) {
        for (final message in messages) {
          if (message.payload is MqttPublishMessage) {
            final publishMessage = message.payload as MqttPublishMessage;
            final payload = utf8.decode(publishMessage.payload.message);
            _handlePositionUpdate(payload);
          }
        }
      });
    }
  }

  void _handlePositionUpdate(String data) {
    try {
      final decoded = json.decode(data);
      final position = UserPosition.fromJson(decoded);
      _currentPosition = position;
      _positionController.add(position);
      debugPrint('Received position update: $position');
    } catch (e) {
      debugPrint('Failed to parse position data: $e');
    }
  }

  void startSimulation(Map<String, Fixture> fixtures) {
    if (_isSimulating) return;
    _isSimulating = true;

    Fixture? startFixture = fixtures.values.firstWhere(
      (f) => f.name.toLowerCase().contains('start'),
      orElse: () => fixtures.values.first,
    );

    final originX = startFixture.x;
    final originY = startFixture.y;

    debugPrint('Starting simulation from ($originX, $originY)');

    double angle = 0.0;

    _simulationTimer = Timer.periodic(const Duration(seconds: 2), (timer) {
      angle += 0.2;
      final simulatedX = 3.0 * cos(angle);
      final simulatedY = 3.0 * sin(angle);
      final position = UserPosition(x: simulatedX, y: simulatedY, z: 0.0);

      _currentPosition = position;
      _positionController.add(position);

      debugPrint('Simulated position: ($simulatedX, $simulatedY)');
    });
  }

  void stopSimulation() {
    _isSimulating = false;
    _simulationTimer?.cancel();
    _simulationTimer = null;
  }

  void disconnect() {
    stopSimulation();
    _client?.disconnect();
  }

  void dispose() {
    disconnect();
    _positionController.close();
    errorMessage.dispose();
    isConnecting.dispose();
  }

  static Map<String, double> getAbsolutePosition(
    UserPosition relative,
    Map<String, Fixture> fixtures,
  ) {
    Fixture? startFixture = fixtures.values.firstWhere(
      (f) => f.name.toLowerCase().contains('start'),
      orElse: () => fixtures.values.first,
    );

    final originX = startFixture.x;
    final originY = startFixture.y;

    return {'x': originX + relative.x, 'y': originY + relative.y};
  }
}
