import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../widgets/wallet_card.dart';

/// Settings Page - User Preferences and Account Management
/// 
/// Features:
/// - User profile information
/// - Wallet card with balance and transaction history access
/// - App settings (dark mode, notifications, email alerts)
/// - User guidelines navigation
/// - Logout button
class SettingsPage extends StatelessWidget {
  final bool darkMode;
  final Function(bool) onDarkModeToggle;
  final VoidCallback onNavigateToGuidelines;
  final bool notifications;
  final Function(bool) onNotificationsToggle;
  final bool emailAlerts;
  final Function(bool) onEmailAlertsToggle;
  final VoidCallback onOpenRecordsHistory;

  const SettingsPage({
    Key? key,
    required this.darkMode,
    required this.onDarkModeToggle,
    required this.onNavigateToGuidelines,
    required this.notifications,
    required this.onNotificationsToggle,
    required this.emailAlerts,
    required this.onEmailAlertsToggle,
    required this.onOpenRecordsHistory,
  }) : super(key: key);

  Color get _textPrimary => darkMode 
      ? AppTheme.darkTextPrimary 
      : AppTheme.lightTextPrimary;

  Color get _textSecondary => darkMode 
      ? AppTheme.darkTextSecondary 
      : const Color(0xFF6B7280);

  Color get _iconColor => darkMode 
      ? AppTheme.darkTextPrimary 
      : const Color(0xFF0D9488);

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
                      color: darkMode 
                          ? Colors.white.withOpacity(0.8) 
                          : const Color(0xFF333333),
                      fontFamily: 'La Belle Aurore',
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'Settings',
                    style: TextStyle(
                      fontSize: 32,
                      fontWeight: AppTheme.fontWeightBold,
                      letterSpacing: -0.64,
                      color: _textPrimary,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Manage your account',
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

            // User Profile Card
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: AppTheme.getCardGradient(darkMode),
                  borderRadius: BorderRadius.circular(20),
                  border: darkMode
                      ? Border.all(color: Colors.white.withOpacity(0.1))
                      : null,
                ),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 30,
                      backgroundColor: darkMode 
                          ? AppTheme.accentSuccessDark 
                          : AppTheme.accentSuccessLight,
                      child: Icon(
                        Icons.person,
                        size: 32,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'John Anderson',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: AppTheme.fontWeightSemiBold,
                              color: _textPrimary,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'john.anderson@email.com',
                            style: TextStyle(
                              fontSize: 14,
                              color: _textSecondary,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 24),

            // Wallet Card
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: WalletCard(
                darkMode: darkMode,
                onTap: onOpenRecordsHistory,
              ),
            ),

            const SizedBox(height: 24),

            // Settings Section
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Preferences',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: AppTheme.fontWeightSemiBold,
                      color: _textPrimary,
                    ),
                  ),
                  const SizedBox(height: 16),
                  _buildSettingItem(
                    icon: darkMode ? Icons.dark_mode : Icons.light_mode,
                    title: 'Dark Mode',
                    trailing: Switch(
                      value: darkMode,
                      onChanged: onDarkModeToggle,
                      activeColor: AppTheme.accentSuccessLight,
                    ),
                  ),
                  _buildSettingItem(
                    icon: Icons.notifications,
                    title: 'Notifications',
                    trailing: Switch(
                      value: notifications,
                      onChanged: onNotificationsToggle,
                      activeColor: AppTheme.accentSuccessLight,
                    ),
                  ),
                  _buildSettingItem(
                    icon: Icons.email,
                    title: 'Email Alerts',
                    trailing: Switch(
                      value: emailAlerts,
                      onChanged: onEmailAlertsToggle,
                      activeColor: AppTheme.accentSuccessLight,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Links Section
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Column(
                children: [
                  _buildLinkItem(
                    icon: Icons.description,
                    title: 'User Guidelines',
                    onTap: onNavigateToGuidelines,
                  ),
                  const SizedBox(height: 12),
                  _buildLinkItem(
                    icon: Icons.logout,
                    title: 'Logout',
                    onTap: () {
                      // TODO: Implement logout
                    },
                    isDestructive: true,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSettingItem({
    required IconData icon,
    required String title,
    required Widget trailing,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: darkMode 
            ? AppTheme.darkCardBackground 
            : AppTheme.lightSurfaceCard,
        borderRadius: BorderRadius.circular(12),
        border: darkMode
            ? Border.all(color: Colors.white.withOpacity(0.1))
            : null,
      ),
      child: Row(
        children: [
          Icon(icon, color: _iconColor, size: 24),
          const SizedBox(width: 16),
          Expanded(
            child: Text(
              title,
              style: TextStyle(
                fontSize: 16,
                fontWeight: AppTheme.fontWeightMedium,
                color: _textPrimary,
              ),
            ),
          ),
          trailing,
        ],
      ),
    );
  }

  Widget _buildLinkItem({
    required IconData icon,
    required String title,
    required VoidCallback onTap,
    bool isDestructive = false,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        decoration: BoxDecoration(
          color: darkMode 
              ? AppTheme.darkCardBackground 
              : AppTheme.lightSurfaceCard,
          borderRadius: BorderRadius.circular(12),
          border: darkMode
              ? Border.all(color: Colors.white.withOpacity(0.1))
              : null,
        ),
        child: Row(
          children: [
            Icon(
              icon,
              color: isDestructive ? AppTheme.accentError : _iconColor,
              size: 24,
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Text(
                title,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: AppTheme.fontWeightMedium,
                  color: isDestructive ? AppTheme.accentError : _textPrimary,
                ),
              ),
            ),
            Icon(
              Icons.chevron_right,
              color: _textSecondary,
              size: 20,
            ),
          ],
        ),
      ),
    );
  }
}
