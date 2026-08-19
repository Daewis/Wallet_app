import { TouchableOpacity, Alert, Platform } from "react-native";
import { useAuth } from "../context/authContext";
import { styles } from "../assets/styles/home.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";
 

export default function SignOutButton() {
  const { signOut } = useAuth();

 /* const handlesignOut = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {text: "cancel", style: "cancel"},
      {text: "Logout", styles: "destructive", onPress: signOut}
    ]);
  };**/

  const handlesignOut = () => {
    console.log("Sign out button pressed"); // Debugging log

    if (Platform.OS === 'web') {
      // Web fallback
      if (window.confirm("Are you sure you want to logout?")) {
        signOut();
      }
    } else {
      // Native App
      Alert.alert("Logout", "Are you sure you want to logout?", [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive", // Fixed typo: 'styles' -> 'style'
          onPress: () => {
            console.log("User confirmed logout");
            signOut();
          } 
        }
      ]);
    }
  };

  return (
    <TouchableOpacity style={styles.logoutButton} onPress={handlesignOut}>
      <Ionicons name="log-out-outline" size={22} color={COLORS.text}/>
    </TouchableOpacity>
  );
}
