# Global Theme Design System

## Overview
This mobile energy management app implements a comprehensive design system with global dark mode support through CSS custom properties (CSS variables) that mirror Figma's Color Variables Collection approach.

## Global_Theme Color Variables Collection

### CSS Custom Properties (defined in `/styles/globals.css`)

#### Light Mode Values (`:root`)
- `--background-primary`: #F9F9F9 - Main page background
- `--surface-card`: #FFFFFF - Cards, boxes, and bottom navigation background  
- `--text-primary`: #000000 - All main text, headers, and navigation icons

#### Dark Mode Values (`.dark`)
- `--background-primary`: #1A1A1A - Main page background
- `--surface-card`: #2C2C2C - Cards, boxes, and bottom navigation background
- `--text-primary`: #FFFFFF - All main text, headers, and navigation icons

### Accent Gradient System
Card overlays use adaptive gradients:
- **Light Mode**: `linear-gradient(180deg, rgba(98, 191, 212, 0.00) 0%, rgba(241, 221, 118, 0.20) 100%), rgba(218, 234, 214, 0.67)`
- **Dark Mode**: `linear-gradient(180deg, rgba(30, 41, 59, 0.00) 0%, rgba(51, 65, 85, 0.50) 100%), rgba(44, 44, 44, 0.9)`

## Implementation

### Dark Mode Control
- Global dark mode state managed in `/App.tsx`
- Settings page controls the theme toggle
- Dark mode class applied to `document.documentElement`
- All CSS variables update automatically when `.dark` class is applied

### Component Usage Pattern
```tsx
// Background
style={{ backgroundColor: 'var(--background-primary)' }}

// Text
style={{ color: 'var(--text-primary)' }}

// Cards with gradient
const cardBg = darkMode
  ? 'linear-gradient(...), rgba(44, 44, 44, 0.9)'  
  : 'linear-gradient(...), rgba(218, 234, 214, 0.67)';
  
style={{ background: cardBg }}
```

### Six Screens Implementation

1. **Home Page** - Energy dashboard with gauge dial and status cards
2. **Insights Page** - AI recommendations with dynamic trading list (loading → success states)
3. **Maintenance Page** - Service history with DatePickerModal for scheduling
4. **Forecast Page** - Energy predictions and charts
5. **Transaction (Trade) Page** - Buy/sell interface with trading modal
6. **Settings/Profile Page** - User preferences with dark mode toggle

### Universal Linkage
- ✅ Bottom Navigation Bar - uses `var(--surface-card)` and `var(--text-primary)`
- ✅ All page backgrounds - use `var(--background-primary)`  
- ✅ All card surfaces - use gradient system with surface-card base
- ✅ All text elements - use `var(--text-primary)` with opacity modifiers

### Interactive Flows
- **Insights Page**: "Optimize Now" and "Set EV Now" → NotificationModal (95% opacity)
- **Maintenance Page**: "Schedule a Technician" → DatePickerModal
- **Transaction Page**: Buy/Sell buttons → TradingModal
- **Insights Trading List**: Auto Schedule → Notification "You have successfully scheduled the transaction!"
- **Settings Page**: Dark mode toggle → Global theme change
- **Settings Page**: "User Guidelines" link → UserGuidelinesPage

## Design Specifications
- Frame Size: 430x932px (mobile)
- Corner Radius: 35px for all main cards
- Font Family: Inter
- Modal Opacity: 95%
- Bottom Nav: Fixed position, theme-aware background

## Notes
- The design system ensures visual consistency across light and dark modes
- Gradient overlays maintain aesthetic appeal in both themes
- All components are responsive to the global theme state
- CSS custom properties provide a single source of truth for colors
