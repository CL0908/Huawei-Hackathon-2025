import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

/// Next Schedule Card
/// Displays next maintenance appointment and book button
class NextScheduleCard extends StatelessWidget {
  final bool darkMode;
  final VoidCallback onBookAppointment;

  const NextScheduleCard({
    Key? key,
    required this.darkMode,
    required this.onBookAppointment,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: AppTheme.getCardGradient(darkMode),
        borderRadius: BorderRadius.circular(20),
        border: darkMode
            ? Border.all(color: Colors.white.withOpacity(0.1))
            : null,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                Icons.calendar_today,
                color: darkMode 
                    ? AppTheme.accentSuccessDark 
                    : AppTheme.accentSuccessLight,
                size: 20,
              ),
              const SizedBox(width: 8),
              Text(
                'Next Service',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: AppTheme.fontWeightSemiBold,
                  color: darkMode 
                      ? AppTheme.darkTextPrimary 
                      : AppTheme.lightTextPrimary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            'March 15, 2024',
            style: TextStyle(
              fontSize: 20,
              fontWeight: AppTheme.fontWeightBold,
              color: darkMode 
                  ? AppTheme.darkTextPrimary 
                  : AppTheme.lightTextPrimary,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'Annual system inspection',
            style: TextStyle(
              fontSize: 14,
              color: darkMode 
                  ? AppTheme.darkTextSecondary 
                  : AppTheme.lightTextSecondary,
            ),
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: onBookAppointment,
              style: ElevatedButton.styleFrom(
                backgroundColor: darkMode 
                    ? AppTheme.accentSuccessDark 
                    : AppTheme.accentSuccessLight,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: const Text('Book Appointment'),
            ),
          ),
        ],
      ),
    );
  }
}
