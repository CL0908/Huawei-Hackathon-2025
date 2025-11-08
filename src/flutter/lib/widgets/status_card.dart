import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

/// Status Card Widget
/// 
/// Displays energy metrics like Power Usage, Solar Generation, Savings
/// Features hover effect and optional trend indicator
class StatusCard extends StatefulWidget {
  final IconData icon;
  final String value;
  final String label;
  final String? trend;
  final bool darkMode;
  final bool accent;

  const StatusCard({
    Key? key,
    required this.icon,
    required this.value,
    required this.label,
    this.trend,
    this.darkMode = false,
    this.accent = false,
  }) : super(key: key);

  @override
  State<StatusCard> createState() => _StatusCardState();
}

class _StatusCardState extends State<StatusCard> with SingleTickerProviderStateMixin {
  bool _isHovered = false;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) => setState(() => _isHovered = true),
      onTapUp: (_) => setState(() => _isHovered = false),
      onTapCancel: () => setState(() => _isHovered = false),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        transform: Matrix4.identity()
          ..scale(_isHovered ? 1.05 : 1.0)
          ..translate(0.0, widget.accent ? -4.0 : 0.0),
        decoration: BoxDecoration(
          color: widget.darkMode
              ? const Color.fromRGBO(58, 92, 74, 0.6)
              : const Color.fromRGBO(200, 230, 201, 0.5),
          borderRadius: BorderRadius.circular(16),
          border: widget.darkMode
              ? Border.all(
                  color: Colors.white.withOpacity(0.1),
                  width: 1,
                )
              : null,
        ),
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            // Icon
            Icon(
              widget.icon,
              size: 24,
              color: widget.darkMode 
                  ? AppTheme.accentGreen 
                  : const Color(0xFF14B8A6),
            ),
            
            const SizedBox(height: 8),
            
            // Value
            Text(
              widget.value,
              style: TextStyle(
                fontSize: 32,
                fontWeight: AppTheme.fontWeightBold,
                letterSpacing: -0.64,
                color: widget.darkMode 
                    ? AppTheme.darkTextPrimary 
                    : AppTheme.lightTextPrimary,
              ),
            ),
            
            // Label
            Text(
              widget.label,
              style: TextStyle(
                fontSize: 12,
                fontWeight: AppTheme.fontWeightLight,
                letterSpacing: 0.12,
                color: widget.darkMode
                    ? Colors.white.withOpacity(0.8)
                    : AppTheme.lightTextPrimary,
              ),
            ),
            
            // Trend (optional)
            if (widget.trend != null) ...[
              const SizedBox(height: 4),
              Text(
                widget.trend!,
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: AppTheme.fontWeightSemiBold,
                  color: widget.darkMode 
                      ? AppTheme.accentGreen 
                      : const Color(0xFF14B8A6),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
