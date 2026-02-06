import { Tabs } from 'expo-router';
import React from 'react';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Platform } from 'react-native';
import { Gift, Home3, Profile, Receipt1 } from 'iconsax-react-nativejs'

export default function TabLayout() {
  const colorScheme = useColorScheme();
  // #F7F7F8E5
  return (
     <Tabs
    screenOptions={{
        tabBarActiveTintColor: '#013D25',
        headerShown: false,
        tabBarShowLabel: true,
        tabBarIconStyle: { marginHorizontal: 'auto' },
        tabBarStyle: Platform.select({
            ios: {
                position: 'absolute',
                height: 80,
                paddingTop: 12,
            },
            default: {
                backgroundColor: '#F7F7F8E5',
                height: 80,
                paddingTop: 12,
            },
        }),
    }}>
  <Tabs.Screen
    name="index"
    options={{
      title: 'Home',
      tabBarIcon: ({ color }) => <Home3 size={24} color={color}/>,
    }}
  />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Transactions',
          tabBarIcon: ({ color }) => <Receipt1 size={24} color={color}/>,        }}
      />
      <Tabs.Screen
        name="stocks"
        options={{
          title: 'Stocks',
          tabBarIcon: ({ color }) => <Gift size={24} color={color}/>,        }}
      />
       <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => <Profile size={24} color={color}/>,        }}
      />
    </Tabs>
  );
}
