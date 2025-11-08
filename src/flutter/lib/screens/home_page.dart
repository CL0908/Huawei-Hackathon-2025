import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../widgets/gauge_dial.dart';
import '../widgets/status_card.dart';
import '../widgets/next_schedule_card.dart';
import '../widgets/forecast_navigation_card.dart';
import '../widgets/community_map.dart';
import '../widgets/community_data_card.dart';
import '../widgets/modals/date_picker_modal.dart';
import '../widgets/modals/notification_modal.dart';

/// Home Page - Energy Dashboard
/// 
/// Four main zones:
/// 1. AT A GLANCE - Header, gauge dial, status cards
/// 2. PLANNING & FORECAST - Swipeable carousel with forecast data
/// 3. COMMUNITY & MARKET - Interactive map with battery/price data
/// 4. MAINTENANCE - Next schedule card
class HomePage extends StatefulWidget {
  final bool darkMode;

  const HomePage({
    Key? key,
    this.darkMode = false,
  }) : super(key: key);

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  bool _showScheduler = false;
  bool _showNotification = false;

  // Simulated backend data - Replace with actual API calls
  final Map<String, dynamic> _solarData = {
    'batteryLevel': 4.2,
    'percentage': 70,
    'status': 'Charging',
    'showSun': true,
    'isCharging': true,
  };

  final Map<String, double> _batteryData = {
    'currentLevel': 8.5,
    'maxCapacity': 13.5,
  };

  void _handleBookAppointment() {
    setState(() {
      _showScheduler = true;
    });
  }

  void _handleScheduleConfirm() {
    setState(() {
      _showScheduler = false;
      _showNotification = true;
    });
  }

  Color get _textPrimary => widget.darkMode 
      ? AppTheme.darkTextPrimary 
      : AppTheme.lightTextPrimary;

  Color get _textSecondary => widget.darkMode 
      ? AppTheme.darkTextSecondary 
      : AppTheme.lightTextSecondary;

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // Main scrollable content
        SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          child: Padding(
            padding: const EdgeInsets.only(bottom: 96),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // ==================== ZONE 1: AT A GLANCE ====================
                
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
                          color: widget.darkMode 
                              ? Colors.white.withOpacity(0.8) 
                              : const Color(0xFF333333),
                          fontFamily: 'La Belle Aurore',
                        ),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        'Welcome Home',
                        style: TextStyle(
                          fontSize: 32,
                          fontWeight: AppTheme.fontWeightBold,
                          letterSpacing: -0.64,
                          color: _textPrimary,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Your energy dashboard',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: AppTheme.fontWeightLight,
                          letterSpacing: 0.28,
                          color: widget.darkMode ? _textPrimary : const Color(0xFF333333),
                        ),
                      ),
                    ],
                  ),
                ),

                // Gauge Dial - Centered on Page
                Padding(
                  padding: const EdgeInsets.fromLTRB(24, 128, 24, 0),
                  child: Center(
                    child: GaugeDial(
                      value: _solarData['batteryLevel'].toString(),
                      percentage: _solarData['percentage'],
                      darkMode: widget.darkMode,
                      status: _solarData['status'],
                      showSun: _solarData['showSun'],
                      isCharging: _solarData['isCharging'],
                    ),
                  ),
                ),

                // Status Cards Grid
                Padding(
                  padding: const EdgeInsets.fromLTRB(24, 24, 24, 0),
                  child: Row(
                    children: [
                      Expanded(
                        child: StatusCard(
                          icon: Icons.flash_on,
                          value: '32.1',
                          label: 'Power Usage',
                          trend: '+5%',
                          darkMode: widget.darkMode,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: StatusCard(
                          icon: Icons.eco,
                          value: '45.2',
                          label: 'Solar Gen',
                          trend: '+12%',
                          darkMode: widget.darkMode,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: StatusCard(
                          icon: Icons.attach_money,
                          value: '12.50',
                          label: 'Savings',
                          trend: '+8%',
                          darkMode: widget.darkMode,
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 24),

                // ==================== ZONE 2: PLANNING & FORECAST ====================
                
                // Section header
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Row(
                    children: [
                      Icon(
                        Icons.calendar_today,
                        size: 18,
                        color: widget.darkMode 
                            ? AppTheme.accentSuccessDark 
                            : AppTheme.accentSuccessLight,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        'Planning & Forecast',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: AppTheme.fontWeightSemiBold,
                          color: _textPrimary,
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 16),

                // Forecast Navigation Card (Swipeable Carousel)
                ForecastNavigationCard(darkMode: widget.darkMode),

                const SizedBox(height: 24),

                // ==================== ZONE 3: COMMUNITY & MARKET ====================
                
                // Section header
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Row(
                    children: [
                      Icon(
                        Icons.people,
                        size: 18,
                        color: widget.darkMode 
                            ? AppTheme.accentSuccessDark 
                            : AppTheme.accentSuccessLight,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        'Community & Market',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: AppTheme.fontWeightSemiBold,
                          color: _textPrimary,
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 16),

                // Community Map
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: CommunityMap(darkMode: widget.darkMode),
                ),

                const SizedBox(height: 16),

                // Battery and Price Data Cards
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Row(
                    children: [
                      Expanded(
                        child: CommunityDataCard(
                          icon: Icons.battery_charging_full,
                          title: 'Battery',
                          value: '${_batteryData['currentLevel']} kWh',
                          subtitle: 'of ${_batteryData['maxCapacity']} kWh',
                          darkMode: widget.darkMode,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: CommunityDataCard(
                          icon: Icons.trending_up,
                          title: 'Market Price',
                          value: 'RM 0.45',
                          subtitle: 'per kWh',
                          darkMode: widget.darkMode,
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 24),

                // ==================== ZONE 4: MAINTENANCE ====================
                
                // Section header
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Row(
                    children: [
                      Icon(
                        Icons.build,
                        size: 18,
                        color: widget.darkMode 
                            ? AppTheme.accentSuccessDark 
                            : AppTheme.accentSuccessLight,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        'Maintenance',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: AppTheme.fontWeightSemiBold,
                          color: _textPrimary,
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 16),

                // Next Schedule Card
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: NextScheduleCard(
                    darkMode: widget.darkMode,
                    onBookAppointment: _handleBookAppointment,
                  ),
                ),
              ],
            ),
          ),
        ),

        // Modals
        if (_showScheduler)
          DatePickerModal(
            darkMode: widget.darkMode,
            onClose: () => setState(() => _showScheduler = false),
            onConfirm: _handleScheduleConfirm,
          ),

        if (_showNotification)
          NotificationModal(
            darkMode: widget.darkMode,
            message: 'Appointment scheduled successfully!',
            onClose: () => setState(() => _showNotification = false),
          ),
      ],
    );
  }
}
