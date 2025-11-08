import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

/// Insights Page - AI-powered Trading Recommendations
/// 
/// Features:
/// - Market price card with real-time data
/// - Tab navigation (Overview / Suggestions)
/// - Trading suggestions list with AI recommendations
/// - Optimize and EV charging actions
class InsightsPage extends StatefulWidget {
  final bool darkMode;

  const InsightsPage({
    Key? key,
    this.darkMode = false,
  }) : super(key: key);

  @override
  State<InsightsPage> createState() => _InsightsPageState();
}

class _InsightsPageState extends State<InsightsPage> {
  String _activeTab = 'overview'; // 'overview' or 'suggestions'

  Color get _textPrimary => widget.darkMode 
      ? AppTheme.darkTextPrimary 
      : AppTheme.lightTextPrimary;

  Color get _textSecondary => widget.darkMode 
      ? AppTheme.darkTextSecondary 
      : AppTheme.lightTextSecondary;

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
                    'Energy Insights',
                    style: TextStyle(
                      fontSize: 32,
                      fontWeight: AppTheme.fontWeightBold,
                      letterSpacing: -0.64,
                      color: _textPrimary,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'AI-powered trading recommendations',
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

            // Market Price Card (Placeholder)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Container(
                height: 150,
                decoration: BoxDecoration(
                  gradient: AppTheme.getCardGradient(widget.darkMode),
                  borderRadius: BorderRadius.circular(20),
                  border: widget.darkMode
                      ? Border.all(color: Colors.white.withOpacity(0.1))
                      : null,
                ),
                child: Center(
                  child: Text(
                    'Market Price Card',
                    style: TextStyle(color: _textPrimary),
                  ),
                ),
              ),
            ),

            const SizedBox(height: 24),

            // Tabs
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Row(
                children: [
                  Expanded(
                    child: _buildTab('overview', 'Overview', Icons.bar_chart),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: _buildTab('suggestions', 'Suggestions', Icons.lightbulb_outline),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Tab Content
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: _activeTab == 'overview'
                  ? _buildOverviewContent()
                  : _buildSuggestionsContent(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTab(String tabId, String label, IconData icon) {
    final isActive = _activeTab == tabId;
    
    return GestureDetector(
      onTap: () => setState(() => _activeTab = tabId),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          gradient: isActive
              ? AppTheme.getSuccessGradient()
              : null,
          color: isActive
              ? null
              : (widget.darkMode
                  ? const Color.fromRGBO(42, 64, 53, 0.3)
                  : const Color(0xFFF3F4F6)),
          borderRadius: BorderRadius.circular(12),
          boxShadow: isActive
              ? [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.15),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  ),
                ]
              : null,
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              size: 16,
              color: isActive
                  ? Colors.white
                  : (widget.darkMode
                      ? Colors.white.withOpacity(0.8)
                      : const Color(0xFF6B7280)),
            ),
            const SizedBox(width: 8),
            Text(
              label,
              style: TextStyle(
                fontSize: 14,
                fontWeight: isActive
                    ? AppTheme.fontWeightSemiBold
                    : AppTheme.fontWeightMedium,
                color: isActive
                    ? Colors.white
                    : (widget.darkMode
                        ? Colors.white.withOpacity(0.8)
                        : const Color(0xFF6B7280)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildOverviewContent() {
    return Container(
      height: 200,
      decoration: BoxDecoration(
        gradient: AppTheme.getCardGradient(widget.darkMode),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Center(
        child: Text(
          'Overview Content',
          style: TextStyle(color: _textPrimary),
        ),
      ),
    );
  }

  Widget _buildSuggestionsContent() {
    return Container(
      height: 200,
      decoration: BoxDecoration(
        gradient: AppTheme.getCardGradient(widget.darkMode),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Center(
        child: Text(
          'AI Suggestions',
          style: TextStyle(color: _textPrimary),
        ),
      ),
    );
  }
}
