import React from 'react';
import { StyleSheet, View, Text, TextInput, Image, ScrollView, FlatList, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Data tidak diubah
const landmarks = [
    { id: '1', title: 'Gedung Sate', image: require('@/assets/images/gedung-sate.png') },
    { id: '2', title: 'Gedung Sate', image: require('@/assets/images/gedung-sate.png') },
    { id: '3', title: 'Gedung Sate', image: require('@/assets/images/gedung-sate.png') },
];
const cultures = [
    { id: '1', title: 'Sanggar Supubaka', image: require('@/assets/images/sanggar.png') },
    { id: '2', title: 'Sanggar Supubaka', image: require('@/assets/images/sanggar.png') },
    { id: '3', title: 'Sanggar Supubaka', image: require('@/assets/images/sanggar.png') },
];
const museums = [
    { id: '1', title: 'Museum Geologi', image: require('@/assets/images/museum.png') },
    { id: '2', title: 'Museum Geologi', image: require('@/assets/images/museum.png') },
    { id: '3', title: 'Museum Geologi', image: require('@/assets/images/museum.png') },
];

// Komponen Card dan Section tidak diubah
const ItemCard = ({ item }: { item: { title: string, image: any } }) => (
    <TouchableOpacity style={styles.cardContainer}>
        <Image source={item.image} style={styles.cardImage} />
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.cardGradient} />
        <Text style={styles.cardTitle}>{item.title}</Text>
    </TouchableOpacity>
);
const Section = ({ title, data }: { title: string, data: any[] }) => (
    <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <FlatList
            data={data}
            renderItem={({ item }) => <ItemCard item={item} />}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
        />
    </View>
);

// --- KOMPONEN UTAMA HOMESCREEN ---
export default function HomeScreen() {
    const colorScheme = useColorScheme();
    const themeColors = Colors[colorScheme ?? 'light'];

    // --- PENYESUAIAN 1: Menambahkan logika animasi ---
    const focusAnim = React.useRef(new Animated.Value(0)).current;

    const handleFocus = () => {
        Animated.timing(focusAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    const handleBlur = () => {
        Animated.timing(focusAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    const animatedSearchBoxStyle = {
        transform: [
            { translateY: styles.searchBoxContainer.transform[0].translateY }, 
            {
                scale: focusAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.05], // Sedikit perbesaran
                }),
            },
        ],
        borderColor: focusAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [themeColors.background, 'rgba(79, 116, 68, 0.4)'], // dari warna background ke biru
        }),
        shadowOpacity: focusAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.1, 0.2], // Perkuat shadow yang sudah ada
        }),
        shadowRadius: focusAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [8, 12], // Perbesar radius shadow
        }),
        elevation: focusAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [5, 10], // Naikkan elevasi untuk Android
        }),
    };
    // --- AKHIR PENYESUAIAN 1 ---

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]} edges={['right', 'left']}>
            <ScrollView
                style={styles.flexOne}
                showsVerticalScrollIndicator={false}
                contentInsetAdjustmentBehavior="never"
            >
                {/* Header Section (tidak diubah) */}
                <View style={styles.headerContainer}>
                    <Image
                        source={require('@/assets/images/borobudur-bg.png')}
                        style={styles.headerImage}
                    />
                    <View style={styles.headerContent}>
                        <TouchableOpacity style={styles.locationButton}>
                            <Feather name="map-pin" size={16} color="white" />
                            <Text style={styles.locationText}>Institut Teknologi Bandung</Text>
                        </TouchableOpacity>
                        <Text style={styles.greetingText}>Hai, Garudie!</Text>
                        <Text style={styles.subGreetingText}>Where are you going today?</Text>
                    </View>
                </View>

                {/* Search & Content Section */}
                <View style={[styles.contentContainer, { backgroundColor: themeColors.background }]}>
                    {/* --- PENYESUAIAN 2: Menerapkan animasi --- */}
                    <Animated.View style={[styles.searchBoxContainer, animatedSearchBoxStyle]}>
                        <Feather name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
                        <TextInput
                            placeholder="Ask nusaAI ..."
                            placeholderTextColor="#8E8E93"
                            style={styles.searchInput}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        />
                    </Animated.View>
                    {/* --- AKHIR PENYESUAIAN 2 --- */}

                    <Section title="Surrounding Landmarks" data={landmarks} />
                    <Section title="Surrounding Cultures" data={cultures} />
                    <Section title="Surrounding Museums" data={museums} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    background: { flex: 1, },
    safeArea: { flex: 1, },
    flexOne: { flex: 1, },
    headerContainer: { height: 300, width: '100%', },
    headerImage: { width: '100%', height: '100%', position: 'absolute', },
    headerContent: { flex: 1, paddingHorizontal: 20, paddingTop: 60, },
    locationButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, alignSelf: 'flex-start', },
    locationText: { color: 'white', marginLeft: 8, fontWeight: '600', },
    greetingText: { fontSize: 28, fontWeight: 'bold', color: 'white', marginTop: 85, },
    subGreetingText: { fontSize: 24, color: 'white', },
    contentContainer: { borderTopLeftRadius: 0, borderTopRightRadius: 0, marginTop: -20, paddingTop: 20, paddingBottom: 100, },
    searchBoxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 30,
        marginHorizontal: 16,
        paddingHorizontal: 15,
        height: 50,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        transform: [{ translateY: -45 }],
        marginBottom: -25,
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    searchIcon: { marginRight: 10, },
    searchInput: { flex: 1, fontSize: 16, color: '#000', },
    sectionContainer: { marginTop: 20, },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, paddingHorizontal: 16, },
    cardContainer: { width: 150, height: 200, borderRadius: 16, marginRight: 12, overflow: 'hidden', },
    cardImage: { width: '100%', height: '100%', },
    cardGradient: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '50%', },
    cardTitle: { position: 'absolute', bottom: 12, left: 12, right: 12, color: 'white', fontSize: 16, fontWeight: 'bold', },
});