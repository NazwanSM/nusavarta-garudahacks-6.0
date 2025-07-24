import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider, useAuth } from '../context/AuthContext'; // Perbarui path import

// Mencegah splash screen hilang secara otomatis
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { user, isLoading } = useAuth(); // Dapatkan status user dan loading dari context
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Jika loading sudah selesai
    if (!isLoading) {
      const inTabsGroup = segments[0] === '(tabs)';

      if (user && !inTabsGroup) {
        // Jika pengguna sudah login dan belum berada di dalam grup (tabs)
        // Arahkan ke halaman utama
        router.replace('/(tabs)');
      } else if (!user) {
        // Jika pengguna belum login
        // Arahkan ke halaman login
        router.replace('/login');
      }
      
      // Sembunyikan splash screen setelah logika navigasi selesai
      SplashScreen.hideAsync();
    }
  }, [user, isLoading, segments]); // Jalankan efek ini setiap kali user, isLoading, atau segments berubah

  // Selama loading, jangan tampilkan apa-apa (splash screen masih terlihat)
  if (isLoading) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      // Jangan sembunyikan splash screen di sini lagi
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    // Bungkus seluruh navigasi dengan AuthProvider
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}