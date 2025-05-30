import 'package:flutter/material.dart';
import '../services/profile_service.dart';

class ProfilePage extends StatefulWidget {
  final String username; // Passed from login

  const ProfilePage({super.key, required this.username});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  Map<String, dynamic>? _profile;
  List<dynamic> _orders = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchProfileData();
  }

  void _fetchProfileData() async {
    final profile = await ProfileService().getProfile(widget.username);
    final orders = await ProfileService().getOrders(widget.username);

    setState(() {
      _profile = profile;
      _orders = orders;
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("My Profile")),
      body:
          _isLoading
              ? const Center(child: CircularProgressIndicator())
              : SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const CircleAvatar(
                      radius: 40,
                      child: Icon(Icons.person, size: 40),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      "Name: ${_profile?['fullname']}",
                      style: const TextStyle(fontSize: 18),
                    ),
                    Text(
                      "Phone: ${_profile?['contact']}",
                      style: const TextStyle(fontSize: 18),
                    ),
                    const SizedBox(height: 24),
                    const Text(
                      "Past Orders",
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 10),
                    ..._orders.map(
                      (order) => Card(
                        child: ListTile(
                          leading: const Icon(Icons.receipt_long),
                          title: Text("Order ID: ${order['id']}"),
                          subtitle: Text(
                            "Date: ${order['date']} - Status: ${order['status']}",
                          ),
                          trailing: Text("Rs. ${order['total']}"),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
    );
  }
}
