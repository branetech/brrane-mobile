import { View, Image } from '@idimma/rn-widget';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import expoSecureStorage from '@/utils/secureStore';

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(async () => {
      await expoSecureStorage.setItem("hasSeenFirstSplash", "true");
      router.replace('/splash/onboard');
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View flex bg='#013D25' spaced aligned>
      <View h={250} radius={50}>
        <Image source={require('@/assets/images/el.png')} contain />
      </View>
      <Image source={require('@/assets/images/icon.png')} contain />
      <Image source={require('@/assets/images/brane.png')} contain />
    </View>
  );
}