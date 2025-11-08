import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

/// Bottom navigation bar with 4 main sections
/// Features: Home, Insights, Trade, Settings
/// Implements glassmorphism effect and scale animation on active state
class BottomNav extends StatelessWidget {
  final int currentIndex;
  final Function(int) onNavigate;
  final bool darkMode;

  const BottomNav({
    Key? key,
    required this.currentIndex,
    required this.onNavigate,
    this.darkMode = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.centerLeft,
          end: Alignment.centerRight,
          colors: [
            Color.fromRGBO(98, 191, 212, 0.4),
            Color.fromRGBO(241, 221, 118, 0.4),
          ],
        ),
        border: Border(
          top: BorderSide(
            color: Colors.grey.withOpacity(0.15),
            width: 1,
          ),
        ),
      ),
      child: ClipRect(
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 15, sigmaY: 15),
          child: Container(
            padding: const EdgeInsets.only(
              left: 16,
              right: 16,
              top: 12,
              bottom: 24,
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildNavItem(
                  index: 0,
                  icon: Icons.home_outlined,
                  activeIcon: Icons.home,
                  label: 'Home',
                ),
                _buildNavItem(
                  index: 1,
                  icon: Icons.trending_up_outlined,
                  activeIcon: Icons.trending_up,
                  label: 'Insights',
                ),
                _buildNavItem(
                  index: 2,
                  icon: Icons.attach_money_outlined,
                  activeIcon: Icons.attach_money,
                  label: 'Trade',
                ),
                _buildNavItem(
                  index: 3,
                  icon: Icons.settings_outlined,
                  activeIcon: Icons.settings,
                  label: 'Settings',
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem({
    required int index,
    required IconData icon,
    required IconData activeIcon,
    required String label,
  }) {
    final isActive = currentIndex == index;
    
    return Expanded(
      child: GestureDetector(
        onTap: () => onNavigate(index),
        behavior: HitTestBehavior.opaque,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          transform: Matrix4.identity()
            ..translate(0.0, isActive ? -8.0 : 0.0)
            ..scale(isActive ? 1.1 : 1.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Icon container with gradient background when active
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  gradient: isActive ? AppTheme.getSuccessGradient() : null,
                  borderRadius: BorderRadius.circular(16),
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
                child: Icon(
                  isActive ? activeIcon : icon,
                  size: 24,
                  color: isActive
                      ? Colors.white
                      : (darkMode
                          ? AppTheme.darkTextSecondary
                          : AppTheme.lightTextSecondary),
                ),
              ),
              
              const SizedBox(height: 6),
              
              // Label text
              Text(
                label,
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: isActive
                      ? AppTheme.fontWeightSemiBold
                      : AppTheme.fontWeightNormal,
                  color: isActive
                      ? AppTheme.accentSuccessLight
                      : (darkMode
                          ? AppTheme.darkTextSecondary
                          : AppTheme.lightTextSecondary),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// Note: Import dart:ui for ImageFilter
import 'dart:ui';
