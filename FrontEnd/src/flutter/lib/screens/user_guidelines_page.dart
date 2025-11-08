import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

/// User Guidelines Page
/// Displays app usage guidelines and documentation
class UserGuidelinesPage extends StatelessWidget {
  final bool darkMode;
  final VoidCallback onBack;

  const UserGuidelinesPage({
    Key? key,
    required this.darkMode,
    required this.onBack,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: Icon(
            Icons.arrow_back,
            color: darkMode ? AppTheme.darkTextPrimary : AppTheme.lightTextPrimary,
          ),
          onPressed: onBack,
        ),
        title: Text(
          'User Guidelines',
          style: TextStyle(
            color: darkMode ? AppTheme.darkTextPrimary : AppTheme.lightTextPrimary,
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Text(
          'User Guidelines Content',
          style: TextStyle(
            color: darkMode ? AppTheme.darkTextPrimary : AppTheme.lightTextPrimary,
          ),
        ),
      ),
    );
  }
}
