import React, {useEffect} from 'react';
import {Slot, useRouter} from "expo-router";

import {PRIMARY} from '@/utils/colors';
import {StatusBar} from 'expo-status-bar';
import {View} from '@idimma/rn-widget';
// import {useAppState} from "@/store";

const Layout: React.FC<{ children: any }> = ({children}) => {
//   const {token} = useAppState();
  const router = useRouter()
  useEffect(() => {
    // if (token) {
      router.replace('/signup')
    //}
  })


  return (
    <View flex>
      <Slot/>
      <StatusBar animated backgroundColor={PRIMARY} translucent style='light' networkActivityIndicatorVisible={false}/>
    </View>
  );
}


export default Layout;
