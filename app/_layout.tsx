import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import store from '@/redux/store';
import { Provider } from 'react-redux';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';


// export const unstable_settings = {
//   anchor: '(tabs)',
// };

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  useEffect(() => {
    // Hide after 2 seconds, or when your app is ready
    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 2000);
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === 'light' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>

        <StatusBar style={colorScheme === 'light' ? 'light' : 'dark'} />
      </ThemeProvider>
    </Provider>
  );
}
