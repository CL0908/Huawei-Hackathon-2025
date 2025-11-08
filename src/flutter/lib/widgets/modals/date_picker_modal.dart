import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';

/// Date Picker Modal
/// Allows users to schedule maintenance appointments
class DatePickerModal extends StatefulWidget {
  final bool darkMode;
  final VoidCallback onClose;
  final VoidCallback onConfirm;

  const DatePickerModal({
    Key? key,
    required this.darkMode,
    required this.onClose,
    required this.onConfirm,
  }) : super(key: key);

  @override
  State<DatePickerModal> createState() => _DatePickerModalState();
}

class _DatePickerModalState extends State<DatePickerModal> {
  DateTime _selectedDate = DateTime.now();

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: widget.onClose,
      child: Container(
        color: Colors.black.withOpacity(0.5),
        child: Center(
          child: GestureDetector(
            onTap: () {}, // Prevent closing when tapping modal content
            child: Container(
              margin: const EdgeInsets.all(24),
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: widget.darkMode
                    ? LinearGradient(
                        colors: [
                          AppTheme.darkGradientStart.withOpacity(0.95),
                          AppTheme.darkGradientEnd.withOpacity(0.95),
                        ],
                      )
                    : null,
                color: widget.darkMode ? null : Colors.white.withOpacity(0.95),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    'Schedule Appointment',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: AppTheme.fontWeightBold,
                      color: widget.darkMode 
                          ? AppTheme.darkTextPrimary 
                          : AppTheme.lightTextPrimary,
                    ),
                  ),
                  const SizedBox(height: 24),
                  CalendarDatePicker(
                    initialDate: _selectedDate,
                    firstDate: DateTime.now(),
                    lastDate: DateTime.now().add(const Duration(days: 365)),
                    onDateChanged: (date) {
                      setState(() {
                        _selectedDate = date;
                      });
                    },
                  ),
                  const SizedBox(height: 24),
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton(
                          onPressed: widget.onClose,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.grey[300],
                            foregroundColor: Colors.black87,
                          ),
                          child: const Text('Cancel'),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: ElevatedButton(
                          onPressed: widget.onConfirm,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppTheme.accentSuccessLight,
                            foregroundColor: Colors.white,
                          ),
                          child: const Text('Confirm'),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
