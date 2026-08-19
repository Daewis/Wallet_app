import { Slot } from "expo-router";
import SafeScreen from '@/components/SafeScreen';
import { AuthProvider } from '../context/authContext';
import {StatusBar} from "expo-status-bar";



export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeScreen>
        <Slot />
      </SafeScreen>   
      <StatusBar style="dark" />     
    </AuthProvider>  
  );
}