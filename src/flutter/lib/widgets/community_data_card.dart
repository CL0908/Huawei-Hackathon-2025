import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

/// Community Data Card
/// Displays battery level or market price information
class CommunityDataCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String value;
  final String subtitle;
  final bool darkMode;

  const CommunityDataCard({
    Key? key,
    required this.icon,
    required this.title,
    required this.value,
    required this.subtitle,
    required this.darkMode,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: AppTheme.getCardGradient(darkMode),
        borderRadius: BorderRadius.circular(16),
        border: darkMode
            ? Border.all(color: Colors.white.withOpacity(0.1))
            : null,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(
            icon,
            size: 24,
            color: darkMode 
                ? AppTheme.accentSuccessDark 
                : AppTheme.accentSuccessLight,
          ),
          const SizedBox(height: 8),
          Text(
            title,
            style: TextStyle(
              fontSize: 12,
              fontWeight: AppTheme.fontWeightMedium,
              color: darkMode 
                  ? AppTheme.darkTextSecondary 
                  : AppTheme.lightTextSecondary,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: TextStyle(
              fontSize: 20,
              fontWeight: AppTheme.fontWeightBold,
              color: darkMode 
                  ? AppTheme.darkTextPrimary 
                  : AppTheme.lightTextPrimary,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            subtitle,
            style: TextStyle(
              fontSize: 11,
              color: darkMode 
                  ? AppTheme.darkTextSecondary 
                  : AppTheme.lightTextSecondary,
            ),
          ),
        ],
      ),
    );
  }
}
