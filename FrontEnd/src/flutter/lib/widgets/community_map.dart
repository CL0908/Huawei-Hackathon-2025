import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

/// Community Map Widget
/// Placeholder for interactive community map showing nearby energy traders
class CommunityMap extends StatelessWidget {
  final bool darkMode;

  const CommunityMap({
    Key? key,
    required this.darkMode,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 200,
      decoration: BoxDecoration(
        gradient: AppTheme.getCardGradient(darkMode),
        borderRadius: BorderRadius.circular(20),
        border: darkMode
            ? Border.all(color: Colors.white.withOpacity(0.1))
            : null,
      ),
      child: Stack(
        children: [
          // Map placeholder
          Center(
            child: Icon(
              Icons.map,
              size: 48,
              color: darkMode 
                  ? AppTheme.darkTextSecondary.withOpacity(0.5)
                  : AppTheme.lightTextSecondary.withOpacity(0.5),
            ),
          ),
          // Overlay text
          Center(
            child: Text(
              'Community Map',
              style: TextStyle(
                fontSize: 16,
                fontWeight: AppTheme.fontWeightMedium,
                color: darkMode 
                    ? AppTheme.darkTextSecondary 
                    : AppTheme.lightTextSecondary,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
