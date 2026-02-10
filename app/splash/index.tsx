// app/onboarding.tsx

import { View, Image } from '@idimma/rn-widget';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';



export default function Splash() {
  const router = useRouter()
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/splash/onboard');
    }, 60000);

    // Cleanup timer on unmount
    return () => clearTimeout(timer);
  }, [router])
  return (
    <View flex bg='#013D25' spaced  aligned>
      <View h={250} radius={50}>
      <Image source={require('@/assets/images/el.png')} contain/>
      </View>
      <Image source={require('@/assets/images/icon.png')} contain/>
      <Image source={require('@/assets/images/brane.png')} contain/>
    </View>
  );
}
