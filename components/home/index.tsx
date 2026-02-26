import { useAppState } from "@/redux/store";
import { useRequest } from "@/services/useRequest";
import { getInitials } from "@/utils/helpers";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { View, TouchableOpacity } from "react-native";
import { Avatar } from "../avatar";
import { ThemedText } from "../themed-text";
import { Messages2, Notification } from "iconsax-react-native";

export const HomeHeader = () => {
    // const { user } = useAppState();
    const router = useRouter();
    // const { data: notifications } = useRequest(
    //   "/notification-service/notifications/user",
    //   {
    //     initialValue: [],
    //     params: { currentPage: 0, perPage: 300 },
    //   }
    // );
  
    // const { showChat, hideChat } = useOnHideZohoChat();
    // const openChat = () => {
    //   showChat();
    //   setTimeout(() => {
    //     hideChat();
    //   }, 5000);
    // };
  
    const now = new Date();
    const currentHour = now.getHours();
    const timeOfDay: string =
      currentHour >= 16 ? "evening" : currentHour >= 12 ? "afternoon" : "morning";
  
    // const hasUnreadNotifications = useMemo(() => {
    //   if (Array.isArray(notifications))
    //     return notifications?.some(
    //       (notification: any) => notification?.readAt === null
    //     );
    //   return false;
    // }, [notifications]);
  
    return (
      <View >
        {/* Left: Avatar + Greeting */}
        <TouchableOpacity
          
          onPress={() => router.push("/account")}
        >
          {/* <Avatar
            size={48}
            shape="circle"
            src={user?.image}
            style={{ backgroundColor: "#FFF3DB" }}
          >
            {getInitials("Tomi Balo")}
          </Avatar> */}
          <Avatar name="John Doe" size="lg" shape="rounded" />
          <View>
            <ThemedText>Good {timeOfDay} ☀️,</ThemedText>
            <ThemedText>@{"Tomi Balo"}</ThemedText>
          </View>
        </TouchableOpacity>
  
        {/* Right: Chat + Notifications */}
        <View>
          <TouchableOpacity>
            <Messages2 />
          </TouchableOpacity>
  
          <TouchableOpacity
            onPress={() => router.push("/notification")}
          >
            <Notification />
            {/* {hasUnreadNotifications && (
              <View />
            )} */}
          </TouchableOpacity>
        </View>
      </View>
    );
  };