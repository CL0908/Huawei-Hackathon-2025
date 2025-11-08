import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

/// Transaction Page (Trade Page) - Buy and Sell Energy
/// 
/// Features:
/// - Total balance card
/// - Primary action buttons (Sell Energy / Buy Energy)
/// - Each button opens a modal with Grid vs Community options
/// - P2P Market with order book
/// - Limit order placement
class TransactionPage extends StatefulWidget {
  final bool darkMode;

  const TransactionPage({
    Key? key,
    this.darkMode = false,
  }) : super(key: key);

  @override
  State<TransactionPage> createState() => _TransactionPageState();
}

class _TransactionPageState extends State<TransactionPage> {
  Color get _textPrimary => widget.darkMode 
      ? AppTheme.darkTextPrimary 
      : AppTheme.lightTextPrimary;

  Color get _textSecondary => widget.darkMode 
      ? AppTheme.darkTextSecondary 
      : AppTheme.lightTextSecondary;

  void _showSellOptions() {
    // TODO: Show sell options modal (Grid vs Community)
  }

  void _showBuyOptions() {
    // TODO: Show buy options modal (Grid vs Community)
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      child: Padding(
        padding: const EdgeInsets.only(bottom: 96),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Header
            Padding(
              padding: const EdgeInsets.fromLTRB(24, 32, 24, 0),
              child: Column(
                children: [
                  Text(
                    'Luméa',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: AppTheme.fontWeightBold,
                      letterSpacing: -0.24,
                      color: const Color(0xFF333333),
                      fontFamily: 'La Belle Aurore',
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'Energy Trading',
                    style: TextStyle(
                      fontSize: 32,
                      fontWeight: AppTheme.fontWeightBold,
                      letterSpacing: -0.64,
                      color: _textPrimary,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Buy and sell energy',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: AppTheme.fontWeightLight,
                      letterSpacing: 0.28,
                      color: _textSecondary,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Total Balance Card
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  gradient: widget.darkMode
                      ? const LinearGradient(
                          begin: Alignment.centerLeft,
                          end: Alignment.centerRight,
                          colors: [
                            Color.fromRGBO(42, 64, 53, 0.85),
                            Color.fromRGBO(53, 90, 70, 0.85),
                          ],
                        )
                      : AppTheme.getSuccessGradient(),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Total Balance',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: AppTheme.fontWeightLight,
                        color: Colors.white.withOpacity(0.9),
                        letterSpacing: 0.5,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'RM 1,234.50',
                      style: const TextStyle(
                        fontSize: 40,
                        fontWeight: FontWeight.w700,
                        color: Colors.white,
                        letterSpacing: -0.8,
                      ),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 24),

            // Primary Action Buttons
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Row(
                children: [
                  Expanded(
                    child: _buildActionButton(
                      label: 'Sell Energy',
                      icon: Icons.arrow_upward,
                      color: AppTheme.accentGreen,
                      onTap: _showSellOptions,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildActionButton(
                      label: 'Buy Energy',
                      icon: Icons.arrow_downward,
                      color: const Color(0xFF3B82F6),
                      onTap: _showBuyOptions,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Energy Chart Placeholder
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Container(
                height: 200,
                decoration: BoxDecoration(
                  gradient: AppTheme.getCardGradient(widget.darkMode),
                  borderRadius: BorderRadius.circular(20),
                  border: widget.darkMode
                      ? Border.all(color: Colors.white.withOpacity(0.1))
                      : null,
                ),
                child: Center(
                  child: Text(
                    'Energy Chart',
                    style: TextStyle(color: _textPrimary),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActionButton({
    required String label,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [color, color.withOpacity(0.8)],
          ),
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: color.withOpacity(0.3),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: Colors.white, size: 20),
            const SizedBox(width: 8),
            Text(
              label,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: Colors.white,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
