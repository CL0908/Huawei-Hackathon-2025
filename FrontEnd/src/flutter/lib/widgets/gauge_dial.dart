import 'package:flutter/material.dart';
import 'dart:math' as math;
import '../theme/app_theme.dart';

/// Futuristic Solar/Battery Status Gauge
/// 
/// Displays battery level with a semi-circular arc gauge
/// Features animated gradient fill and sun icon for solar charging indication
class GaugeDial extends StatefulWidget {
  final String value;
  final String label;
  final int percentage;
  final bool darkMode;
  final String status;
  final bool showSun;
  final bool isCharging;

  const GaugeDial({
    Key? key,
    required this.value,
    this.label = 'Total Usage',
    this.percentage = 65,
    this.darkMode = false,
    this.status = 'Charging',
    this.showSun = true,
    this.isCharging = true,
  }) : super(key: key);

  @override
  State<GaugeDial> createState() => _GaugeDialState();
}

class _GaugeDialState extends State<GaugeDial> with SingleTickerProviderStateMixin {
  late AnimationController _pulseController;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 3),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final sunColor = widget.isCharging 
        ? const Color(0xFFFCD34D) 
        : (widget.darkMode ? const Color(0xFF6B7280) : const Color(0xFF9CA3AF));
    
    final statusColor = widget.isCharging
        ? (widget.darkMode ? AppTheme.accentGreen : const Color(0xFF059669))
        : (widget.darkMode ? const Color(0xFF6B7280) : const Color(0xFF374151));

    return Container(
      width: 260,
      height: 180,
      child: Stack(
        alignment: Alignment.center,
        children: [
          // Outer glow ring (animated pulse)
          if (widget.isCharging && widget.darkMode)
            AnimatedBuilder(
              animation: _pulseController,
              builder: (context, child) {
                return Opacity(
                  opacity: 0.4 * (1 - _pulseController.value * 0.3),
                  child: Container(
                    width: 260,
                    height: 130,
                    decoration: BoxDecoration(
                      gradient: RadialGradient(
                        center: Alignment.topCenter,
                        radius: 1.0,
                        colors: [
                          AppTheme.accentGreen.withOpacity(0.3),
                          Colors.transparent,
                        ],
                        stops: const [0.0, 0.7],
                      ),
                    ),
                  ),
                );
              },
            ),

          // Background container with tech border
          Positioned(
            left: 10,
            right: 10,
            top: 10,
            bottom: 10,
            child: Container(
              decoration: BoxDecoration(
                gradient: widget.darkMode
                    ? const LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Color.fromRGBO(45, 74, 62, 0.4),
                          Color.fromRGBO(58, 92, 74, 0.6),
                        ],
                      )
                    : null,
                color: widget.darkMode ? null : Colors.white.withOpacity(0.7),
                borderRadius: const BorderRadius.vertical(top: Radius.circular(120)),
                border: Border.all(
                  color: widget.darkMode
                      ? (widget.isCharging 
                          ? AppTheme.accentGreen.withOpacity(0.3) 
                          : Colors.white.withOpacity(0.1))
                      : Colors.black.withOpacity(0.05),
                  width: 1,
                ),
              ),
            ),
          ),

          // Main gauge arc
          Positioned(
            left: 30,
            right: 30,
            top: 30,
            child: CustomPaint(
              size: const Size(200, 100),
              painter: _GaugeArcPainter(
                percentage: widget.percentage,
                isCharging: widget.isCharging,
                darkMode: widget.darkMode,
              ),
            ),
          ),

          // Center content
          Positioned(
            left: 0,
            right: 0,
            top: 60,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Sun icon (if charging and solar active)
                if (widget.showSun)
                  Icon(
                    Icons.wb_sunny,
                    size: 32,
                    color: sunColor,
                  ),
                
                const SizedBox(height: 8),

                // Battery value
                Text(
                  '${widget.value} kWh',
                  style: TextStyle(
                    fontSize: 36,
                    fontWeight: AppTheme.fontWeightBold,
                    letterSpacing: -0.72,
                    color: widget.darkMode 
                        ? AppTheme.darkTextPrimary 
                        : AppTheme.lightTextPrimary,
                  ),
                ),

                const SizedBox(height: 4),

                // Status text
                Text(
                  widget.status,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: AppTheme.fontWeightMedium,
                    color: statusColor,
                    letterSpacing: 0.5,
                  ),
                ),

                const SizedBox(height: 2),

                // Percentage
                Text(
                  '${widget.percentage}%',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: AppTheme.fontWeightLight,
                    color: widget.darkMode 
                        ? AppTheme.darkTextSecondary 
                        : AppTheme.lightTextSecondary,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// Custom painter for the gauge arc
class _GaugeArcPainter extends CustomPainter {
  final int percentage;
  final bool isCharging;
  final bool darkMode;

  _GaugeArcPainter({
    required this.percentage,
    required this.isCharging,
    required this.darkMode,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height);
    final radius = size.width / 2;
    const strokeWidth = 16.0;

    // Background arc (grey)
    final bgPaint = Paint()
      ..color = darkMode 
          ? Colors.white.withOpacity(0.1) 
          : Colors.grey.withOpacity(0.2)
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round;

    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      math.pi, // Start at 180 degrees (left side)
      math.pi, // Sweep 180 degrees (semicircle)
      false,
      bgPaint,
    );

    // Foreground arc (gradient)
    final rect = Rect.fromCircle(center: center, radius: radius);
    final gradient = SweepGradient(
      startAngle: math.pi,
      endAngle: 2 * math.pi,
      colors: [
        const Color(0xFFFCD34D), // Yellow
        const Color(0xFFFDE68A), // Light yellow
        const Color(0xFF86EFAC), // Green
      ],
      stops: const [0.0, 0.5, 1.0],
    );

    final fgPaint = Paint()
      ..shader = gradient.createShader(rect)
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round;

    // Draw arc based on percentage
    final sweepAngle = (percentage / 100) * math.pi;
    canvas.drawArc(
      rect,
      math.pi,
      sweepAngle,
      false,
      fgPaint,
    );
  }

  @override
  bool shouldRepaint(covariant _GaugeArcPainter oldDelegate) {
    return oldDelegate.percentage != percentage ||
        oldDelegate.isCharging != isCharging ||
        oldDelegate.darkMode != darkMode;
  }
}
