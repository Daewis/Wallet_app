import { useState, useEffect } from "react";
import { View, Text, TextInput, Button, TouchableOpacity, ActivityIndicator } from "react-native";
import { useAuth } from "../../context/authContext";
import { Link, useRouter, Stack } from "expo-router";
import { styles } from "@/assets/styles/auth.styles.js";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";

WebBrowser.maybeCompleteAuthSession();

const redirectUri = AuthSession.makeRedirectUri({ scheme: "mobile" });

export default function SignUpScreen() {
  const { signUp, resendVerificationEmail, signInWithGoogle } = useAuth();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    redirectUri,
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      signInWithGoogle(id_token).catch((err) => setError(err.message));
    }
  }, [response]);

  const onSignUp = async () => {
    setError(""); // Clear previous errors
    setLoading(true);
    try {
      await signUp(emailAddress, password);
      setPending(true); 
    } catch (err) {

      console.log("Full Firebase Error:", err);

      const errorCode = err.code;
      // Convert message to lowercase to handle case-sensitivity issues
      const errorMessage = (err.message || "").toLowerCase();
      if (
        errorCode === 'auth/email-already-in-use' || 
        errorMessage.includes("invalid-credential") ||
        errorMessage.includes("invalid_login_credentials") 
      ) {
        setError("That email address is already in use. Please try another.");
      } else if (errorCode === 'auth/too-many-requests') {
        setError("Too many failed attempts. Please try again later.");
      } else if (errorCode === 'auth/invalid-email') {
         setError("Please enter a valid email address.");
      } else if (errorCode === 'auth/network-request-failed') { 
         setError("Network error. Please check your internet connection.");
      } else {
        setError(error.message || "An error occurred. Please try again");
      }
    } finally {
      setLoading(false);
    }
  };


  const onResend = async () => {
    try {
      await resendVerificationEmail();
      alert("Verification email sent again.");
    } catch (err) {
      alert(err.message);
    }
  };

  // ✔ Show verification screen
  if (pending) {
    return (
      <View style={styles.verificationContainer}>
        {/* Hide header on verification screen too */}
        <Stack.Screen options={{ headerShown: false }} />
        
        <Text style={styles.verificationTitle}>Verify Your Email</Text>

        <Text style={styles.verificationText}>
          A verification link has been sent to your email. Click the link to
          confirm your account.
        </Text>

        <Button title="Resend Email" onPress={onResend} />

        <TouchableOpacity onPress={() => router.replace("/(auth)/sign-in")}>
          <Text style={{ marginTop: 20, color: COLORS.primary }}>
            Return to Sign In
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

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
          source={require("../../assets/images/revenue-i2.png")}
          style={styles.illustration}
        />

        <Text style={styles.title}>Create Account</Text>

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
          style={[styles.input, error && styles.errorInput]}
          autoCapitalize="none"
          value={emailAddress}
          placeholderTextColor="#9A8478"
          placeholder="Enter email"
          onChangeText={setEmailAddress}
        />

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          value={password}
          placeholderTextColor="#9A8478"
          placeholder="Enter password"
          secureTextEntry={true}
          onChangeText={setPassword}
        />

        {loading ? (
                   <ActivityIndicator size="large" color={COLORS.primary} style={{ marginVertical: 20 }} />
                ) : (
                  <TouchableOpacity style={styles.button} onPress={onSignUp}>
                    <Text style={styles.buttonText}>Sign up</Text>
                  </TouchableOpacity>
                )}

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={styles.googleButton}
          disabled={!request}
          onPress={() => promptAsync()}
        >
          <Ionicons name="logo-google" size={20} color={COLORS.text} />
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        {/* Footer with Forgot Password & Sign In Link */}
        <View style={[styles.footerContainer, { flexDirection: 'column', gap: 15 }]}>
            
            <Link href="/(auth)/reset-password">
                <Text style={styles.linkText}>Forgot Password?</Text>
            </Link>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <Text style={styles.footerText}>Already have an account?</Text>
                <TouchableOpacity onPress={() => router.replace("/(auth)/sign-in")}>
                    <Text style={styles.linkText}>Sign in</Text>
                </TouchableOpacity>
            </View>

        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}