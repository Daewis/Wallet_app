import { Slot } from "expo-router";
import SafeScreen from '@/components/SafeScreen';
import { AuthProvider } from '../context/authContext';
import {StatusBar} from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";



export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <SafeScreen>
          <Slot />
        </SafeScreen>   
        <StatusBar style="dark" />     
      </AuthProvider>  
    </GestureHandlerRootView>
  );
}