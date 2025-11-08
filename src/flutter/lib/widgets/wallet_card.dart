import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

/// Wallet Card Widget
/// Displays wallet balance and provides access to transaction history
class WalletCard extends StatelessWidget {
  final bool darkMode;
  final VoidCallback onTap;

  const WalletCard({
    Key? key,
    required this.darkMode,
    required this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          gradient: darkMode
              ? LinearGradient(
                  begin: Alignment.centerLeft,
                  end: Alignment.centerRight,
                  colors: [
                    AppTheme.darkGradientStart.withOpacity(0.85),
                    AppTheme.darkGradientEnd.withOpacity(0.85),
                  ],
                )
              : LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    AppTheme.accentGreen.withOpacity(0.8),
                    AppTheme.accentLime.withOpacity(0.8),
                  ],
                ),
          borderRadius: BorderRadius.circular(20),
          border: darkMode
              ? Border.all(color: Colors.white.withOpacity(0.1))
              : null,
          boxShadow: !darkMode
              ? [
                  BoxShadow(
                    color: AppTheme.accentGreen.withOpacity(0.2),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  ),
                ]
              : null,
        ),
        child: Row(
          children: [
            // Solar Logo Placeholder
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.2),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(
                Icons.wb_sunny,
                color: Colors.white,
                size: 24,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Wallet Balance',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: AppTheme.fontWeightLight,
                      color: Colors.white.withOpacity(0.9),
                      letterSpacing: 0.5,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'RM 1,234.50',
                        style: const TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.w700,
                          color: Colors.white,
                          letterSpacing: -0.48,
                        ),
                      ),
                      Icon(
                        Icons.chevron_right,
                        color: Colors.white.withOpacity(0.8),
                        size: 24,
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
