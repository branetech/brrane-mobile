import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { ActivityIndicator} from "react-native";
import { useAppState } from "@/redux/store";
import expoSecureStorage from "@/utils/secureStore";
import { ThemedText } from "@/components/themed-text";
import { View } from "@idimma/rn-widget";
import ForgotPassword from "@/components/forgot-password";
import ForgotPasswordScreen from "./(auth)/forgot-password";


export default function Index() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const {isLoading, isAuthenticated} = useAppState('auth')

  // useEffect(() => {
  //   const checkInitialRoute = async () => {
  //     if (isLoading) return; 

  //     try {
  //       if (isAuthenticated) {
  //         router.replace("/(tabs)");
  //         return;
  //       }

  //       // ✅ Only check onboarding if user is NOT authenticated
  //       const hasSeenFirstSplash = await expoSecureStorage.getItem("hasSeenFirstSplash");
  //       const hasCompletedOnboarding = await expoSecureStorage.getItem("hasCompletedOnboarding");

  //       if (!hasSeenFirstSplash && !hasCompletedOnboarding) {
  //         router.replace("/(auth)");
  //       } else {
  //         router.replace("/splash");
  //       }
  //     } finally {
  //       setIsChecking(false);
  //     }
  //   };

  //   checkInitialRoute();
  // }, [isAuthenticated, isLoading, router]);

  // if (isLoading || isChecking) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <ActivityIndicator size="large" />
  //     </View>
  //   );
  // }

  // return null;
  return(
    <View flex>
      <ForgotPasswordScreen/>
    </View>
  )
}
