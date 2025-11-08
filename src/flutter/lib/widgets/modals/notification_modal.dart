import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';

/// Notification Modal
/// Displays success/info messages to the user
class NotificationModal extends StatelessWidget {
  final bool darkMode;
  final String message;
  final VoidCallback onClose;

  const NotificationModal({
    Key? key,
    required this.darkMode,
    required this.message,
    required this.onClose,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onClose,
      child: Container(
        color: Colors.black.withOpacity(0.5),
        child: Center(
          child: GestureDetector(
            onTap: () {}, // Prevent closing when tapping modal content
            child: Container(
              margin: const EdgeInsets.all(24),
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: darkMode
                    ? LinearGradient(
                        colors: [
                          AppTheme.darkGradientStart.withOpacity(0.95),
                          AppTheme.darkGradientEnd.withOpacity(0.95),
                        ],
                      )
                    : null,
                color: darkMode ? null : Colors.white.withOpacity(0.95),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppTheme.accentGreen.withOpacity(0.2),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      Icons.check_circle,
                      size: 48,
                      color: darkMode 
                          ? AppTheme.accentSuccessDark 
                          : AppTheme.accentSuccessLight,
                    ),
                  ),
                  const SizedBox(height: 24),
                  Text(
                    'Success!',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: AppTheme.fontWeightBold,
                      color: darkMode 
                          ? AppTheme.darkTextPrimary 
                          : AppTheme.lightTextPrimary,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    message,
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 16,
                      color: darkMode 
                          ? AppTheme.darkTextSecondary 
                          : AppTheme.lightTextSecondary,
                    ),
                  ),
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: onClose,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: darkMode 
                            ? AppTheme.accentSuccessDark 
                            : AppTheme.accentSuccessLight,
                        foregroundColor: Colors.white,
                      ),
                      child: const Text('OK'),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
