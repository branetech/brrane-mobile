// hooks/useAppInitialization.ts
import { useEffect, useMemo } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useAppState } from '@/redux/store';

SplashScreen.preventAutoHideAsync();

export function useAppInitialization() {
  const { isLoading } = useAppState('auth');
  
  const [fontsLoaded, fontError] = useFonts({
    SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf'),
  });

  const isReady: boolean = useMemo(
    () => Boolean(fontsLoaded || fontError) && !isLoading,
    [fontsLoaded, fontError, isLoading]
  );


  // Hide splash screen when ready
  useEffect(() => {
    if (isReady) {
      const timer = setTimeout(() => {
        SplashScreen.hideAsync().catch(console.warn);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isReady]);

  return { isReady, fontError };
}