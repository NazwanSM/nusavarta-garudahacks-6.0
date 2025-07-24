import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/HapticTab';
import { TabBarIcon } from '@/components/TabBarIcon'; // Ganti import
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          position: 'absolute',
          borderTopWidth: 0, // Hilangkan border atas
          elevation: 0, // Hilangkan shadow di Android
        },
        tabBarShowLabel: true, // Tampilkan label di bawah ikon
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              source={require('@/assets/images/home-icon.png')} // Ganti dengan path ikon Anda
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore" // Ganti 'explore' dengan 'chat' jika Anda punya halaman chat
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              source={require('@/assets/images/chat-icon.png')} // Ganti dengan path ikon Anda
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="HomeScreen" // Ganti 'explore' dengan 'chat' jika Anda punya halaman chat
        options={{
          title: 'History',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              source={require('@/assets/images/history-icon.png')} // Ganti dengan path ikon Anda
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      {/* Tambahkan tab lain di sini jika perlu */}
    </Tabs>
  );
}