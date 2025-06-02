import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../controllers/layout_controller.dart';
import '../mixins/position_tracking_mixin.dart';
import '../models/navigation/fixture.dart';
import '../models/navigation/item.dart';
import '../services/navigation/data_service.dart';

import '../widgets/navigation/connection_status_bar.dart';
import '../widgets/navigation/shopping_list_sidebar.dart';
import '../widgets/navigation/store_layout_painter.dart';

class StoreLayoutScreen extends StatefulWidget {
  const StoreLayoutScreen({super.key});

  @override
  State<StoreLayoutScreen> createState() => _StoreLayoutScreenState();
}

class _StoreLayoutScreenState extends State<StoreLayoutScreen>
    with PositionTrackingMixin {
  final TransformationController _controller = TransformationController();
  late final LayoutController _layoutController;
  Map<String, Fixture> fixtures = {};
  Map<String, List<List<List<Item>>>> itemMap = {};
  List<String> shoppingList = [];
  String? selectedItemId;
  Matrix4 transformationMatrix = Matrix4.identity();
  bool isLoading = true;
  Future<void> loadData() async {
    try {
      setState(() => isLoading = true);
      final fixturesData = await DataService.loadFixtures();
      final itemMapData = await DataService.loadItemMap();
      final shoppingListData = await DataService.loadShoppingList();

      setState(() {
        fixtures = fixturesData;
        itemMap = itemMapData;
        shoppingList = shoppingListData;
        isLoading = false;
      });

      WidgetsBinding.instance.addPostFrameCallback((_) {
        _layoutController.fitToScreen(context);
      });
    } catch (e) {
      if (mounted) {
        setState(() => isLoading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error loading data: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  void resetView() {
    _layoutController.fitToScreen(context);
  }

  void onItemSelected(String itemId) {
    setState(() {
      selectedItemId = selectedItemId == itemId ? null : itemId;
    });
  }

  @override
  void initState() {
    super.initState();
    SystemChrome.setPreferredOrientations([
      DeviceOrientation.landscapeLeft,
      DeviceOrientation.landscapeRight,
    ]);
    _layoutController = LayoutController(
      transformationController: _controller,
      fixtures: fixtures,
      onTransformationChanged: () {
        setState(() {
          transformationMatrix = _controller.value;
        });
      },
    );

    loadData();
  }

  @override
  void dispose() {
    SystemChrome.setPreferredOrientations(DeviceOrientation.values);
    _layoutController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : Stack(
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Column(
                        children: [
                          const SizedBox(height: 16), // Add top padding
                          Expanded(
                            child: InteractiveViewer(
                              transformationController: _controller,
                              minScale: 0.1,
                              maxScale: 5.0,
                              child: Container(
                                width: double.infinity,
                                height: double.infinity,
                                color: Colors.white,
                                child: CustomPaint(
                                  painter: StoreLayoutPainter(
                                    fixtures,
                                    _layoutController.scale,
                                    selectedItemId != null
                                        ? DataService.findItemPosition(
                                            selectedItemId!,
                                            fixtures,
                                            itemMap,
                                          )
                                        : null,
                                    userPosition,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                Positioned(
                  right: 0,
                  top: 0,
                  bottom: 0,
                  child: SizedBox(
                    height: MediaQuery.of(context).size.height * 0.7,
                    child: ShoppingListSidebar(
                      shoppingList: shoppingList,
                      fixtures: fixtures,
                      itemMap: itemMap,
                      selectedItemId: selectedItemId,
                      onItemSelected: onItemSelected,
                    ),
                  ),
                ),
                Positioned(
                  left: 16,
                  top: 16,
                  child: FloatingActionButton(
                    backgroundColor: Colors.white,
                    elevation: 4,
                    mini: true,
                    child: const Icon(Icons.arrow_back, color: Colors.black87),
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                ),
                // Connection status bar on top of everything
                Positioned(
                  left: 16,
                  bottom: 16,
                  right: MediaQuery.of(context).size.width * 0.3 + 16, // Leave space for shopping list
                  child: ConnectionStatusBar(positionService: positionService),
                ),
              ],
            ),
    );
  }
}
