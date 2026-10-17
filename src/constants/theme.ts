/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

// CloneCV design-system tokens (from the "CloneCV mobile app" design).
export const Colors = {
  light: {
    text: '#0F1E3D',
    background: '#F6F9FC',
    backgroundElement: '#EDF2F8',
    backgroundSelected: '#E4EFFE',
    textSecondary: '#4E5D78',
    surfaceRaised: '#FFFFFF',
    line: '#DCE4EE',
    lineStrong: '#7686A1',
    navy: '#0F1E3D',
    onNavy: '#FFFFFF',
    sky: '#2563C9',
    skyPressed: '#1D51A8',
    onSky: '#FFFFFF',
    skySoft: '#E4EFFE',
  },
  dark: {
    text: '#EEF3FA',
    background: '#0B1426',
    backgroundElement: '#08101F',
    backgroundSelected: '#14305C',
    textSecondary: '#A6B4CA',
    surfaceRaised: '#121E36',
    line: '#24324F',
    lineStrong: '#6C7FA3',
    navy: '#0F1E3D',
    onNavy: '#FFFFFF',
    sky: '#6AAEFF',
    skyPressed: '#8EC2FF',
    onSky: '#0B1426',
    skySoft: '#14305C',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

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
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
