import { useAuth } from "../../context/authContext";
import { Redirect, Stack } from "expo-router";

export default function Layout() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) return <Redirect href="/(auth)/sign-in" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
