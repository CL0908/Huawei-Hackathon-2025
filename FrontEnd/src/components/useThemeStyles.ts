export function useThemeStyles(darkMode: boolean) {
  // Card background with 90° gradient at 40% opacity
  const cardBg = 'linear-gradient(90deg, rgba(98, 191, 212, 0.4) 0%, rgba(241, 221, 118, 0.4) 100%)';

  return {
    cardBg,
    textPrimary: 'var(--text-primary)',
    surfaceCard: 'var(--surface-card)',
    backgroundPrimary: 'var(--background-primary)',
  };
}
