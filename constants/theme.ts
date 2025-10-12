/**
 * CopiX App Theme - Teal Green and Black theme
 */

import { Platform } from 'react-native';

// Dark theme with green accents
const darkGreen = '#0A2F0A';
const forestGreen = '#1B5E20';
const emeraldGreen = '#2E7D32';
const lightGreen = '#4CAF50';
const pureBlack = '#000000';
const darkGray = '#1a1a1a';
const mediumGray = '#2a2a2a';
const lightGray = '#f5f5f5';

export const Colors = {
  light: {
    text: pureBlack,
    background: lightGray,
    tint: forestGreen,
    icon: darkGreen,
    tabIconDefault: darkGray,
    tabIconSelected: forestGreen,
    primary: forestGreen,
    secondary: emeraldGreen,
    backgroundSecondary: '#f0f8f0',
    surface: '#ffffff',
    error: '#dc2626',
    success: '#16a34a',
    warning: forestGreen,
    border: '#e5e7eb',
  },
  dark: {
    text: lightGray,
    background: pureBlack,
    tint: emeraldGreen,
    icon: emeraldGreen,
    tabIconDefault: mediumGray,
    tabIconSelected: emeraldGreen,
    primary: emeraldGreen,
    secondary: forestGreen,
    backgroundSecondary: mediumGray,
    surface: darkGray,
    error: '#ef4444',
    success: '#22c55e',
    warning: emeraldGreen,
    border: '#404040',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'Inter-Medium',
    serif: 'serif',
    rounded: 'NunitoSans-SemiBold',
    mono: 'JetBrainsMono-Regular',
  },
  web: {
    sans: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'Nunito Sans', 'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "'JetBrains Mono', SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// Font configurations for @expo-google-fonts
export const fontConfig = {
  Inter: {
    400: 'Inter-Regular',
    500: 'Inter-Medium',
    600: 'Inter-SemiBold',
    700: 'Inter-Bold',
  },
  NunitoSans: {
    400: 'NunitoSans-Regular',
    600: 'NunitoSans-SemiBold',
    700: 'NunitoSans-Bold',
  },
  JetBrainsMono: {
    400: 'JetBrainsMono-Regular',
    500: 'JetBrainsMono-Medium',
  },
};
