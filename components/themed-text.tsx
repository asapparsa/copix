import { StyleSheet, Text, type TextProps } from 'react-native';
import { scale } from 'react-native-size-matters';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

// Font size scaling with better readability on small screens
const scaleFont = (size: number): number => {
  const scaled = scale(size);
  // Ensure minimum font size for readability
  return Math.max(scaled, size * 0.8);
};

const styles = StyleSheet.create({
  default: {
    fontSize: scaleFont(16),
    lineHeight: scaleFont(24),
  },
  defaultSemiBold: {
    fontSize: scaleFont(16),
    lineHeight: scaleFont(24),
    fontWeight: '600',
  },
  title: {
    fontSize: scaleFont(32),
    fontWeight: 'bold',
    lineHeight: scaleFont(32),
  },
  subtitle: {
    fontSize: scaleFont(20),
    fontWeight: 'bold',
  },
  link: {
    lineHeight: scaleFont(30),
    fontSize: scaleFont(16),
    color: '#0a7ea4',
  },
});
