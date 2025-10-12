import { Dimensions } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const { width } = Dimensions.get('window');

// Font size scaling with better readability on small screens
export const scaleFont = (size: number): number => {
  const scaled = scale(size);
  // Ensure minimum font size for readability
  return Math.max(scaled, size * 0.8);
};

// Icon size scaling
export const scaleIcon = (size: number): number => {
  const scaled = scale(size);
  // Icons should scale proportionally but not get too small
  return Math.max(scaled, size * 0.9);
};

// Button and touch target scaling
export const scaleButton = (size: number): number => {
  const scaled = scale(size);
  // Ensure minimum touch target size (44pt as per iOS guidelines)
  return Math.max(scaled, 44);
};

// Spacing and margin scaling (using verticalScale for better vertical spacing)
export const scaleSpacing = (size: number): number => verticalScale(size);

// Border radius scaling
export const scaleBorderRadius = (size: number): number => scale(size);

// Dialog and modal width calculation
export const getDialogWidth = (): number => {
  const maxWidth = width * 0.9;
  const minWidth = 280;
  return Math.min(Math.max(maxWidth, minWidth), 400);
};

// Screen size detection
export const isSmallScreen = width < 380;
export const isMediumScreen = width < 600;
export const isLargeScreen = width >= 600;

// Re-export the main size-matters functions for convenience
export { moderateScale, scale, verticalScale };

