/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#13192733';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#0B0014',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#131927',
    tabIconSelected: tintColorLight,
    borderColor: "#D0D0D0",
  },
  dark: {
    text: '#FFFFFF',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    borderColor: "#333",
  },
};
