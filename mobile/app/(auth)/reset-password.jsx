import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter, Stack } from "expo-router";
import { useAuth } from "../../context/authContext";
import { styles } from "@/assets/styles/auth.styles.js";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";


export default function ResetPassword() {
  const router = useRouter();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onReset = async () => {
     setError("");
     setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    }catch (err) {
      console.log("Full Firebase Error:", err);

      const errorCode = err.code;
      const errorMessage = (err.message || "").toLowerCase();

      if (
        errorCode === 'auth/missing-email' || 
        errorCode === 'auth/user-not-found' || 
        errorCode === 'auth/wrong-password' ||
        errorMessage.includes("missing-email") ||
        errorMessage.includes("invalid_login_credentials") 
      ) {
        setError("Invalid email or user not found.");
      } else if (errorCode === 'auth/too-many-requests') {
        setError("Too many failed attempts. Please try again later.");
      } else if (errorCode === 'auth/invalid-email') {
         setError("Please enter a valid email address.");
      } else if (errorCode === 'auth/network-request-failed') { 
         setError("Network error. Please check your internet connection.");
      } else {
        setError(err.message || "Request failed. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
          enableOnAndroid={true}
          enableAutomaticScroll={true}
          extraScrollHeight={30}
          showsVerticalScrollIndicator={false}
        >
          
        <Stack.Screen options={{ headerShown: false }} />

    <View>
      <Image
         source={require("../../assets/images/revenue-i5.png")}
         style={styles.illustration}
     />
      <Text style={styles.title}>Reset Password</Text>

       {error ? (
                <View style={styles.errorBox}>
                  <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
                  <Text style={styles.errorText}>{error}</Text>
                  <TouchableOpacity onPress={() => setError("")}>
                    <Ionicons name="close" size={20} color={COLORS.textLight} />
                  </TouchableOpacity>
                </View>
              ) : null}
      

      {!sent && (
        <>
          <TextInput
                  value={email}
                  placeholder="Enter email"
                  placeholderTextColor="#9A8478"
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  style={[styles.input, error && styles.errorInput]}
                />

           <TouchableOpacity style={styles.button} onPress={onReset}>
               <Text style={styles.buttonText}>Send Reset Email</Text>
           </TouchableOpacity>
        </>
      )}

      {sent && (
       <View style={{ paddingHorizontal: 20, alignItems: 'center', marginTop: 10 }}>
            <Text style={{ 
                textAlign: 'center', 
                fontSize: 16, 
                color: '#555', 
                lineHeight: 24 
            }}>
              Password reset link has been sent to your email.
            </Text>
            <Text style={{ 
                textAlign: 'center', 
                fontSize: 14, 
                color: '#888', 
                marginTop: 5 
            }}>
              Please check your inbox and spam folder.
            </Text>
          </View>
      )}

      <View style={[styles.footerContainer, { flexDirection: 'column', marginTop: 30 }]}>
            
          <TouchableOpacity onPress={() => router.replace("/(auth)/sign-in")}>
                    <Text style={styles.linkText}>Back to sign in?</Text>
          </TouchableOpacity>
      </View>

      
    </View>
    </KeyboardAwareScrollView>
  );
}

