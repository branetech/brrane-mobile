import { useAppState } from "@/redux/store";
import { useRequest } from "@/services/useRequest";
import { getInitials } from "@/utils/helpers";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Avatar } from "../avatar";
import { ThemedText } from "../themed-text";
import { Messages2, Notification } from "iconsax-react-native";
import { TouchableOpacity, View } from "@idimma/rn-widget";
import { ImageBackground } from "react-native";
import { usePreference } from "@/services/data";

export const CardStyle = ({children}: any) => {
    const router = useRouter();
    const { onToggleBalance, showBalance } = usePreference();

    return(
       <View w='100%' h={196} radius={16} bg={'#013D25'}>
         <ImageBackground
        source={require("@/assets/images/bg.png")}
        style={{ flex: 1, width: "100%", height: 'auto', overflow: "hidden" }}
        resizeMode="cover"
      >
        <View p={20}>
          {children}
        </View>
      </ImageBackground>
       </View>
    )
}


export const HomeCard = () => {
   
    return (
      <View w='100%' my={8}>
        <CardStyle>
            <ThemedText>Hello</ThemedText>
        </CardStyle>
      </View>
    );
  };