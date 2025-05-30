import 'package:flutter/material.dart';
import '../services/auth_service.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();

  bool _isLoading = false;

  void _loginUser() async {
    if (_formKey.currentState!.validate()) {
      setState(() => _isLoading = true);

      final userData = await AuthService().login(
        username: _usernameController.text.trim(),
        password: _passwordController.text.trim(),
      );

      setState(() => _isLoading = false);

      if (userData != null &&
          userData['user'] != null &&
          userData['user']['username'] != null) {
        Navigator.pushReplacementNamed(
          context,
          '/home',
          arguments: {'username': userData['user']['username']},
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Login failed. Check credentials.")),
        );
      }
    }
  }

  @override
  void dispose() {
    _usernameController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0),
          child: Form(
            key: _formKey,
            child: ListView(
              shrinkWrap: true,
              children: [
                Text(
                  'Smart Cart Login',
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.headlineMedium,
                ),
                const SizedBox(height: 32),
                TextFormField(
                  controller: _usernameController,
                  decoration: const InputDecoration(
                    labelText: 'Username',
                    border: OutlineInputBorder(),
                  ),
                  validator:
                      (value) =>
                          value == null || value.isEmpty
                              ? 'Enter username'
                              : null,
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _passwordController,
                  obscureText: true,
                  decoration: const InputDecoration(
                    labelText: 'Password',
                    border: OutlineInputBorder(),
                  ),
                  validator:
                      (value) =>
                          value == null || value.length < 6
                              ? 'Password too short'
                              : null,
                ),
                const SizedBox(height: 24),
                ElevatedButton(
                  onPressed: _isLoading ? null : _loginUser,
                  child:
                      _isLoading
                          ? const CircularProgressIndicator(color: Colors.white)
                          : const Text('Login'),
                ),
                const SizedBox(height: 12),
                TextButton(
                  onPressed: () {
                    Navigator.pushNamed(context, '/register');
                  },
                  child: const Text("Don't have an account? Register"),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
