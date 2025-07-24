// app/index.tsx

import React, { useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { router } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay } from 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

// Ganti dengan path gambar aset Anda
const LOGO_IMAGE = require('@/assets/images/logo-nusavarta.png');
const TEXT_IMAGE = require('@/assets/images/tulisan-nusavarta.png');

export default function SplashScreen() {
    const colorScheme = useColorScheme();
    const themeColors = Colors[colorScheme ?? 'light'];

    const logoOpacity = useSharedValue(0);
    const logoScale = useSharedValue(0.8);
    const textOpacity = useSharedValue(0);
    const textTranslateY = useSharedValue(20);

    const logoAnimatedStyle = useAnimatedStyle(() => ({
        opacity: logoOpacity.value,
        transform: [{ scale: logoScale.value }],
    }));

    const textAnimatedStyle = useAnimatedStyle(() => ({
        opacity: textOpacity.value,
        transform: [{ translateY: textTranslateY.value }],
    }));

    useEffect(() => {
        // Jalankan animasi
        logoOpacity.value = withTiming(1, { duration: 800 });
        logoScale.value = withTiming(1, { duration: 800 });
        textOpacity.value = withDelay(500, withTiming(1, { duration: 800 }));
        textTranslateY.value = withDelay(500, withTiming(0, { duration: 800 }));

        // Setelah animasi selesai, pindah ke aplikasi utama
        const timer = setTimeout(() => {
        // 'replace' akan mengganti halaman splash screen, jadi pengguna tidak bisa kembali ke sini
        router.replace('/(tabs)');
        }, 2500); // Total durasi splash screen

        return () => clearTimeout(timer); // Membersihkan timer jika komponen di-unmount
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <Animated.Image
            source={LOGO_IMAGE}
            style={[styles.logo, logoAnimatedStyle]}
            resizeMode="contain"
        />
        <Animated.Image
            source={TEXT_IMAGE}
            style={[styles.textImage, textAnimatedStyle]}
            resizeMode="contain"
        />
        </View>
    );
    }

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 150,
        height: 150,
    },
    textImage: {
        width: 200,
        height: 50,
        marginTop: 20,
    },
});