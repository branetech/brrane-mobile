// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Toaster } from 'sonner-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAppInitialization } from '@/hooks/useAppInitialization';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import { Provider } from 'react-redux';
import store, { persistor } from '@/redux/store';
import { PersistGate } from 'redux-persist/integration/react';

function RootLayoutContent() {
  const colorScheme = useColorScheme();
  const { isReady, fontError } = useAppInitialization();
  
  // Protect routes based on authentication
  useRouteProtection(isReady);

  // Show nothing while initializing
  if (!isReady) {
    return null;
  }

  // Optional: Handle font loading errors
  if (fontError) {
    console.error('Font loading error:', fontError);
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'light' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }} />
        <StatusBar hidden={true} />
        <Toaster />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RootLayoutContent />
      </PersistGate>
    </Provider>
  );
}