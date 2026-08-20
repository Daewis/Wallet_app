import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../context/authContext";

export default function AuthLayout() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user) {
    return <Redirect href="/" />;
  }

  return <Stack />;
}