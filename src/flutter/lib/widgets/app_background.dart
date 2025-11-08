import 'package:flutter/material.dart';

/// App background with gradient and image layers
/// Supports both light and dark modes with different background images
class AppBackground extends StatelessWidget {
  final Widget child;
  final bool darkMode;

  const AppBackground({
    Key? key,
    required this.child,
    required this.darkMode,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // Background color layer
        Positioned.fill(
          child: Container(
            color: darkMode ? const Color(0xFF1E2A23) : Colors.white,
          ),
        ),
        
        // Background image layer (Light mode)
        if (!darkMode)
          Positioned.fill(
            child: Opacity(
              opacity: 0.5,
              child: Container(
                decoration: const BoxDecoration(
                  // NOTE: Replace with actual background image asset
                  // image: DecorationImage(
                  //   image: AssetImage('assets/images/light_bg.png'),
                  //   fit: BoxFit.cover,
                  //   alignment: Alignment.topCenter,
                  // ),
                ),
              ),
            ),
          ),
        
        // White transparency overlay for light mode
        if (!darkMode)
          Positioned.fill(
            child: Container(
              color: Colors.white.withOpacity(0.4),
            ),
          ),
        
        // Background image layer (Dark mode)
        if (darkMode)
          Positioned.fill(
            child: Opacity(
              opacity: 0.8,
              child: Container(
                decoration: const BoxDecoration(
                  // NOTE: Replace with actual dark mode background image asset
                  // image: DecorationImage(
                  //   image: AssetImage('assets/images/dark_bg.png'),
                  //   fit: BoxFit.cover,
                  //   alignment: Alignment.topCenter,
                  // ),
                ),
              ),
            ),
          ),
        
        // Content layer
        Positioned.fill(
          child: child,
        ),
      ],
    );
  }
}
