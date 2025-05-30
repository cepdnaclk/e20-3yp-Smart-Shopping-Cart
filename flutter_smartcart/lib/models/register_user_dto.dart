class RegisterUserDto {
  final String name;
  final String email;
  final String phone;
  final String sex;
  final String password;

  RegisterUserDto({
    required this.name,
    required this.email,
    required this.phone,
    required this.sex,
    required this.password,
  });

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'email': email,
      'phone': phone,
      'sex': sex,
      'password': password,
    };
  }
}
