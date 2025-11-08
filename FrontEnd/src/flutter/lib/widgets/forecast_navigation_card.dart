import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

/// Forecast Navigation Card with Swipeable Carousel
/// Displays weather, solar, consumption, and cost forecasts
class ForecastNavigationCard extends StatefulWidget {
  final bool darkMode;

  const ForecastNavigationCard({
    Key? key,
    required this.darkMode,
  }) : super(key: key);

  @override
  State<ForecastNavigationCard> createState() => _ForecastNavigationCardState();
}

class _ForecastNavigationCardState extends State<ForecastNavigationCard> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  final List<Map<String, dynamic>> _slides = [
    {
      'icon': Icons.wb_sunny,
      'title': 'Weather',
      'value': '28°C',
      'subtitle': 'Sunny',
    },
    {
      'icon': Icons.solar_power,
      'title': 'Solar',
      'value': '45 kWh',
      'subtitle': 'Today',
    },
    {
      'icon': Icons.flash_on,
      'title': 'Consumption',
      'value': '32 kWh',
      'subtitle': 'Today',
    },
    {
      'icon': Icons.attach_money,
      'title': 'Cost',
      'value': 'RM 12.50',
      'subtitle': 'Savings',
    },
  ];

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        SizedBox(
          height: 150,
          child: PageView.builder(
            controller: _pageController,
            onPageChanged: (index) {
              setState(() {
                _currentPage = index;
              });
            },
            itemCount: _slides.length,
            itemBuilder: (context, index) {
              final slide = _slides[index];
              return Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Container(
                  decoration: BoxDecoration(
                    gradient: AppTheme.getCardGradient(widget.darkMode),
                    borderRadius: BorderRadius.circular(20),
                    border: widget.darkMode
                        ? Border.all(color: Colors.white.withOpacity(0.1))
                        : null,
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        slide['icon'],
                        size: 40,
                        color: widget.darkMode 
                            ? AppTheme.accentSuccessDark 
                            : AppTheme.accentSuccessLight,
                      ),
                      const SizedBox(height: 12),
                      Text(
                        slide['title'],
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: AppTheme.fontWeightMedium,
                          color: widget.darkMode 
                              ? AppTheme.darkTextSecondary 
                              : AppTheme.lightTextSecondary,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        slide['value'],
                        style: TextStyle(
                          fontSize: 28,
                          fontWeight: AppTheme.fontWeightBold,
                          color: widget.darkMode 
                              ? AppTheme.darkTextPrimary 
                              : AppTheme.lightTextPrimary,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        slide['subtitle'],
                        style: TextStyle(
                          fontSize: 12,
                          color: widget.darkMode 
                              ? AppTheme.darkTextSecondary 
                              : AppTheme.lightTextSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
        const SizedBox(height: 16),
        // Page indicators
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(
            _slides.length,
            (index) => Container(
              margin: const EdgeInsets.symmetric(horizontal: 4),
              width: _currentPage == index ? 24 : 8,
              height: 8,
              decoration: BoxDecoration(
                color: _currentPage == index
                    ? (widget.darkMode 
                        ? AppTheme.accentSuccessDark 
                        : AppTheme.accentSuccessLight)
                    : (widget.darkMode 
                        ? Colors.white.withOpacity(0.3) 
                        : Colors.grey.withOpacity(0.3)),
                borderRadius: BorderRadius.circular(4),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
