import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../theme/app_theme.dart';
import '../widgets/app_background.dart';
import '../widgets/bottom_nav.dart';
import 'home_page.dart';
import 'insights_page.dart';
import 'transaction_page.dart';
import 'settings_page.dart';
import 'user_guidelines_page.dart';
import 'records_history_page.dart';

/// Main screen with bottom navigation
/// Manages navigation between Home, Insights, Trade, and Settings pages
class MainScreen extends StatefulWidget {
  const MainScreen({Key? key}) : super(key: key);

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  // Navigation state
  int _currentIndex = 0;
  
  // App settings state
  bool _darkMode = false;
  bool _notifications = true;
  bool _emailAlerts = true;
  
  // Sub-page navigation
  String? _subPage; // 'guidelines' or 'records'
  
  @override
  void initState() {
    super.initState();
    // Set status bar style
    _updateSystemUI();
  }
  
  @override
  void didUpdateWidget(MainScreen oldWidget) {
    super.didUpdateWidget(oldWidget);
    _updateSystemUI();
  }
  
  void _updateSystemUI() {
    SystemChrome.setSystemUIOverlayStyle(
      SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: _darkMode ? Brightness.light : Brightness.dark,
        systemNavigationBarColor: _darkMode 
            ? AppTheme.darkBackgroundPrimary 
            : AppTheme.lightBackgroundPrimary,
        systemNavigationBarIconBrightness: _darkMode ? Brightness.light : Brightness.dark,
      ),
    );
  }
  
  void _onNavigate(int index) {
    setState(() {
      _currentIndex = index;
      _subPage = null; // Clear sub-page when navigating via bottom nav
    });
  }
  
  void _onDarkModeToggle(bool value) {
    setState(() {
      _darkMode = value;
      _updateSystemUI();
    });
  }
  
  void _onNotificationsToggle(bool value) {
    setState(() {
      _notifications = value;
    });
  }
  
  void _onEmailAlertsToggle(bool value) {
    setState(() {
      _emailAlerts = value;
    });
  }
  
  void _onNavigateToGuidelines() {
    setState(() {
      _subPage = 'guidelines';
    });
  }
  
  void _onNavigateToRecords() {
    setState(() {
      _subPage = 'records';
    });
  }
  
  void _onBackToSettings() {
    setState(() {
      _subPage = null;
      _currentIndex = 3; // Settings page index
    });
  }
  
  Widget _buildCurrentPage() {
    // Show sub-pages if active
    if (_subPage == 'guidelines') {
      return UserGuidelinesPage(
        darkMode: _darkMode,
        onBack: _onBackToSettings,
      );
    }
    
    if (_subPage == 'records') {
      return RecordsHistoryPage(
        darkMode: _darkMode,
        onBack: _onBackToSettings,
      );
    }
    
    // Show main pages based on bottom nav selection
    switch (_currentIndex) {
      case 0:
        return HomePage(darkMode: _darkMode);
      case 1:
        return InsightsPage(darkMode: _darkMode);
      case 2:
        return TransactionPage(darkMode: _darkMode);
      case 3:
        return SettingsPage(
          darkMode: _darkMode,
          onDarkModeToggle: _onDarkModeToggle,
          onNavigateToGuidelines: _onNavigateToGuidelines,
          notifications: _notifications,
          onNotificationsToggle: _onNotificationsToggle,
          emailAlerts: _emailAlerts,
          onEmailAlertsToggle: _onEmailAlertsToggle,
          onOpenRecordsHistory: _onNavigateToRecords,
        );
      default:
        return HomePage(darkMode: _darkMode);
    }
  }
  
  @override
  Widget build(BuildContext context) {
    final showBottomNav = _subPage == null;
    
    return Scaffold(
      body: Container(
        // Fixed mobile width: 430px (as per design system)
        constraints: const BoxConstraints(maxWidth: 430),
        child: AppBackground(
          darkMode: _darkMode,
          child: Stack(
            children: [
              // Main content area with scroll
              Positioned.fill(
                child: _buildCurrentPage(),
              ),
              
              // Bottom navigation (only show on main pages)
              if (showBottomNav)
                Positioned(
                  left: 0,
                  right: 0,
                  bottom: 0,
                  child: BottomNav(
                    currentIndex: _currentIndex,
                    onNavigate: _onNavigate,
                    darkMode: _darkMode,
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
