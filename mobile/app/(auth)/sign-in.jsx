import { useState } from "react";
import { Text, TextInput, View, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { Link, useRouter, Stack } from "expo-router";
import { useAuth } from "../../context/authContext";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {styles} from "../../assets/styles/auth.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

export default function SignInScreen() {
  const { signIn, setActive } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onLogin = async () => {
     if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setError(""); // Clear previous errors
    setLoading(true);

    try {
      await signIn(email, password);

    } catch (err) {
      // Debugging: Log the full error to console
      console.log("Full Firebase Error:", err);

      const errorCode = err.code;
      // Convert message to lowercase to handle case-sensitivity issues
      const errorMessage = (err.message || "").toLowerCase();

      if (
        errorCode === 'auth/invalid-credential' || 
        errorCode === 'auth/user-not-found' || 
        errorCode === 'auth/wrong-password' ||
        errorMessage.includes("invalid-credential") ||
        errorMessage.includes("invalid_login_credentials") // Handles the raw API error
      ) {
        setError("Password is incorrect. Please try again.");
      } else if (errorCode === 'auth/too-many-requests') {
        setError("Too many failed attempts. Please try again later.");
      } else if (errorCode === 'auth/invalid-email') {
         setError("Please enter a valid email address.");
      } else if (errorCode === 'auth/network-request-failed') { 
         setError("Network error. Please check your internet connection.");
      }else {
        setError(err.message || "Sign in failed. Please check your connection.");
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
        <Image source={require("../../assets/images/revenue-i4.png")} style={styles.illustration}/>
      <Text style={styles.title}>Welcome Back</Text>

      {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError("")}>
              <Ionicons name="close" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        ) : null}

      <TextInput
        value={email}
        placeholder="Enter email"
        placeholderTextColor="#9A8478"
        onChangeText={setEmail}
        autoCapitalize="none"
        style={[styles.input, error && styles.errorInput]}
      />

      <TextInput
        value={password}
        placeholder="Password"
        placeholderTextColor="#9A8478"
        onChangeText={setPassword}
       secureTextEntry={true}
        style={[styles.input, error && styles.errorInput]}
      />

      {loading ? (
           <ActivityIndicator size="large" color={COLORS.primary} style={{ marginVertical: 20 }} />
        ) : (
          <TouchableOpacity style={styles.button} onPress={onLogin}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        )}

       <View style={[styles.footerContainer, { flexDirection: 'column', gap: 15 }]}>
        <Link href="/(auth)/reset-password">
          <Text style={styles.linkText}>Forgot Password?</Text>
        </Link>
       
       <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
        <Text style={styles.footerText}>Don&apos;t have an account?</Text>
          <TouchableOpacity onPress={() => router.replace("/(auth)/sign-up")}>
             <Text style={styles.linkText}>Sign up</Text>
          </TouchableOpacity>
         </View>
       </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

