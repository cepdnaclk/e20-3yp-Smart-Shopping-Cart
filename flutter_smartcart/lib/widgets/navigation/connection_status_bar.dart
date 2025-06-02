import 'package:flutter/material.dart';
import '../../services/navigation/user_position_service.dart';
import 'dart:async';

class ConnectionStatusBar extends StatefulWidget {
  final UserPositionService positionService;

  const ConnectionStatusBar({super.key, required this.positionService});

  @override
  State<ConnectionStatusBar> createState() => _ConnectionStatusBarState();
}

class _ConnectionStatusBarState extends State<ConnectionStatusBar>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  Timer? _hideTimer;
  bool _shouldBeVisible = true;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 300),
    );
    _animationController.value = 1.0;

    widget.positionService.isConnecting.addListener(_handleConnectionChange);
    widget.positionService.errorMessage.addListener(_handleErrorChange);
  }

  @override
  void dispose() {
    _hideTimer?.cancel();
    _animationController.dispose();
    widget.positionService.isConnecting.removeListener(_handleConnectionChange);
    widget.positionService.errorMessage.removeListener(_handleErrorChange);
    super.dispose();
  }

  void _handleConnectionChange() {
    _updateVisibility();
  }

  void _handleErrorChange() {
    _updateVisibility();
  }

  void _updateVisibility() {
    final bool isConnecting = widget.positionService.isConnecting.value;
    final String? error = widget.positionService.errorMessage.value;

    if (error != null || isConnecting) {
      _hideTimer?.cancel();
      _shouldBeVisible = true;
      _animationController.forward();
    } else {
      _hideTimer?.cancel();
      _hideTimer = Timer(const Duration(seconds: 3), () {
        if (mounted) {
          _shouldBeVisible = false;
          _animationController.reverse();
        }
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _animationController,
      builder: (context, child) {
        if (_animationController.value == 0 && !_shouldBeVisible) {
          return const SizedBox.shrink();
        }

        return Opacity(
          opacity: _animationController.value,
          child: ValueListenableBuilder<bool>(
            valueListenable: widget.positionService.isConnecting,
            builder: (context, isConnecting, _) {
              return ValueListenableBuilder<String?>(
                valueListenable: widget.positionService.errorMessage,
                builder: (context, error, _) {
                  final Color backgroundColor = error != null
                      ? const Color.fromARGB(255, 255, 214, 218)
                      : isConnecting
                      ? const Color.fromARGB(255, 201, 252, 255)
                      : const Color.fromARGB(255, 200, 255, 201);
                  final Color textColor = error != null
                      ? const Color.fromARGB(255, 234, 27, 27)
                      : isConnecting
                      ? const Color.fromARGB(255, 7, 129, 210)
                      : const Color.fromARGB(255, 33, 124, 39);
                  final IconData statusIcon = error != null
                      ? Icons.error_outline
                      : isConnecting
                      ? Icons.sync
                      : Icons.check_circle_outline;
                  final String statusText = error != null
                      ? 'Position Tracking Error'
                      : isConnecting
                      ? 'Connecting to Position Tracking...'
                      : 'Connected Successfully';

                  return Card(
                    color: backgroundColor,
                    child: Container(
                      constraints: const BoxConstraints(maxWidth: 400),
                      child: Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: IntrinsicHeight(
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(statusIcon, color: textColor),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Text(
                                      statusText,
                                      style: TextStyle(
                                        fontWeight: FontWeight.bold,
                                        color: textColor,
                                      ),
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                    if (error != null) ...[
                                      const SizedBox(height: 4),
                                      Text(
                                        error,
                                        style: TextStyle(
                                          fontSize: 12,
                                          color: textColor,
                                        ),
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ],
                                  ],
                                ),
                              ),
                              const SizedBox(width: 16),
                              if (error != null)
                                TextButton.icon(
                                  onPressed: isConnecting
                                      ? null
                                      : () => widget.positionService
                                            .retryConnection(),
                                  icon: isConnecting
                                      ? const SizedBox(
                                          width: 16,
                                          height: 16,
                                          child: CircularProgressIndicator(
                                            strokeWidth: 2,
                                          ),
                                        )
                                      : const Icon(Icons.refresh),
                                  label: Text(
                                    isConnecting ? 'Connecting...' : 'Retry',
                                  ),
                                  style: TextButton.styleFrom(
                                    backgroundColor: Colors.white,
                                    foregroundColor: textColor,
                                  ),
                                ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  );
                },
              );
            },
          ),
        );
      },
    );
  }
}
