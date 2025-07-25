import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Animated, FlatList, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// dummy
const landmarks = [
    { 
        id: '1', 
        title: 'Gedung Sate', 
        location: 'Gedung Sate, Jl. Diponegoro No.22, Citarum',
        image: require('@/assets/images/gedung-sate.png'),
        description: 'Selamat datang di ikon kebanggaan kota Bandung, Gedung Sate! Coba perhatikan kemegahan arsitektur di hadapan kita ini. Dibangun pada tahun 1920, gedung ini adalah mahakarya yang memadukan gaya Eropa dan sentuhan Nusantara. Lihatlah menara di puncaknya, ada ornamen yang menyerupai tusuk sate, bukan? Itu bukanlah hiasan biasa, melainkan simbol biaya pembangunannya yang mencapai enam juta Gulden, satu tusuk untuk setiap satu juta Gulden. Gedung yang dulunya merupakan kantor pusat pemerintahan Hindia Belanda ini juga menjadi saksi bisu perjuangan heroik tujuh pemuda yang gugur mempertahankannya pada masa revolusi, yang kini namanya diabadikan dalam sebuah monumen. Mari kita lanjutkan perjalanan kita untuk mengagumi lebih dekat perpaduan arsitektur Italia, Spanyol, hingga atap yang terinspirasi dari Pura di Bali, sambil mengenang sejarah panjang yang tersimpan di setiap sudutnya.'
    },
    { 
        id: '2', 
        title: 'Gedung Sate', 
        location: 'Gedung Sate, Jl. Diponegoro No.22, Citarum',
        image: require('@/assets/images/gedung-sate.png'),
        description: 'Selamat datang di ikon kebanggaan kota Bandung, Gedung Sate! Coba perhatikan kemegahan arsitektur di hadapan kita ini. Dibangun pada tahun 1920, gedung ini adalah mahakarya yang memadukan gaya Eropa dan sentuhan Nusantara.'
    },
    { 
        id: '3', 
        title: 'Gedung Sate', 
        location: 'Gedung Sate, Jl. Diponegoro No.22, Citarum',
        image: require('@/assets/images/gedung-sate.png'),
        description: 'Selamat datang di ikon kebanggaan kota Bandung, Gedung Sate! Coba perhatikan kemegahan arsitektur di hadapan kita ini. Dibangun pada tahun 1920, gedung ini adalah mahakarya yang memadukan gaya Eropa dan sentuhan Nusantara.'
    },
];
const cultures = [
    { 
        id: '1', 
        title: 'Sanggar Supubaka', 
        location: 'Sanggar Supubaka, Jl. Budaya No.15, Bandung',
        image: require('@/assets/images/sanggar.png'),
        description: 'Sanggar Supubaka adalah pusat kebudayaan tradisional yang melestarikan seni dan budaya Sunda. Di sini Anda dapat menyaksikan berbagai pertunjukan tari tradisional, musik angklung, dan berbagai kesenian lokal yang telah turun-temurun.'
    },
    { 
        id: '2', 
        title: 'Sanggar Supubaka', 
        location: 'Sanggar Supubaka, Jl. Budaya No.15, Bandung',
        image: require('@/assets/images/sanggar.png'),
        description: 'Sanggar Supubaka adalah pusat kebudayaan tradisional yang melestarikan seni dan budaya Sunda.'
    },
    { 
        id: '3', 
        title: 'Sanggar Supubaka', 
        location: 'Sanggar Supubaka, Jl. Budaya No.15, Bandung',
        image: require('@/assets/images/sanggar.png'),
        description: 'Sanggar Supubaka adalah pusat kebudayaan tradisional yang melestarikan seni dan budaya Sunda.'
    },
];
const museums = [
    { 
        id: '1', 
        title: 'Museum Geologi', 
        location: 'Museum Geologi, Jl. Diponegoro No.57, Cihaur Geulis, Kec. Cibeunying Kaler, Kota Bandung',
        image: require('@/assets/images/museum.png'),
        description: 'Selamat datang di Museum Geologi Bandung! Di sinilah perjalanan kita melintasi lorong waktu dimulai, jauh sebelum ada kota, bahkan sebelum ada manusia. Museum ini bukan sekedar tempat menyimpan batu dan fosil, tapi merupakan gerbang menuju sejarah bumi dan kehidupan yang membentuk kepulauan kita. Museum ini bukan sekedar tempat menyimpan benda-benda tua, melainkan sebuah buku raksasa yang menceritakan berbagai dinamis dan luar biasanya planet yang kita tinggali di Mari kita jelajahi sejarah kehidupan!'
    },
    { 
        id: '2', 
        title: 'Museum Geologi', 
        location: 'Museum Geologi, Jl. Diponegoro No.57, Cihaur Geulis, Kec. Cibeunying Kaler, Kota Bandung',
        image: require('@/assets/images/museum.png'),
        description: 'Selamat datang di Museum Geologi Bandung! Di sinilah perjalanan kita melintasi lorong waktu dimulai.'
    },
    { 
        id: '3', 
        title: 'Museum Geologi', 
        location: 'Museum Geologi, Jl. Diponegoro No.57, Cihaur Geulis, Kec. Cibeunying Kaler, Kota Bandung',
        image: require('@/assets/images/museum.png'),
        description: 'Selamat datang di Museum Geologi Bandung! Di sinilah perjalanan kita melintasi lorong waktu dimulai.'
    },
];

const DetailModal = ({ visible, item, onClose }: { 
    visible: boolean, 
    item: { title: string, location: string, image: any, description: string } | null, 
    onClose: () => void 
}) => {
    if (!item) return null;

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <TouchableOpacity 
                    style={styles.modalBackdrop} 
                    activeOpacity={1} 
                    onPress={onClose}
                />
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Feather name="x" size={24} color="#000" />
                    </TouchableOpacity>
                    
                    <View style={styles.modalImageContainer}>
                        <Image source={item.image} style={styles.modalImage} />
                        <LinearGradient 
                            colors={['transparent', 'rgba(0,0,0,0.6)']} 
                            style={styles.modalImageGradient} 
                        />
                        <View style={styles.modalTitleContainer}>
                            <Text style={styles.modalTitle}>{item.title}</Text>
                        </View>
                    </View>
                    
                    <View style={styles.modalContent}>
                        <Text style={styles.modalLocation}>{item.location}</Text>
                        <ScrollView style={styles.modalDescriptionContainer} showsVerticalScrollIndicator={false}>
                            <Text style={styles.modalDescription}>{item.description}</Text>
                        </ScrollView>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const ItemCard = ({ item, onPress }: { 
    item: { title: string, image: any }, 
    onPress: () => void 
}) => (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
        <Image source={item.image} style={styles.cardImage} />
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.cardGradient} />
        <Text style={styles.cardTitle}>{item.title}</Text>
    </TouchableOpacity>
);
const Section = ({ title, data, onItemPress }: { 
    title: string, 
    data: any[], 
    onItemPress: (item: any) => void 
}) => (
    <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <FlatList
            data={data}
            renderItem={({ item }) => <ItemCard item={item} onPress={() => onItemPress(item)} />}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
        />
    </View>
);

export default function HomeScreen() {
    const colorScheme = useColorScheme();
    const themeColors = Colors[colorScheme ?? 'light'];

    // --- State untuk modal ---
    const [modalVisible, setModalVisible] = React.useState(false);
    const [selectedItem, setSelectedItem] = React.useState<{
        title: string, 
        location: string, 
        image: any, 
        description: string
    } | null>(null);

    // Handler untuk membuka modal
    const handleItemPress = (item: any) => {
        setSelectedItem(item);
        setModalVisible(true);
    };

    // Handler untuk menutup modal
    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedItem(null);
    };

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
            outputRange: [themeColors.background, 'rgba(79, 116, 68, 0.4)'],
        }),
        shadowOpacity: focusAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.1, 0.2],
        }),
        shadowRadius: focusAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [8, 12],
        }),
        elevation: focusAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [5, 10],
        }),
    };

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
                            <BlurView
                                intensity={25}
                                tint="light"
                                style={StyleSheet.absoluteFill} // Membuat blur mengisi seluruh tombol
                            />
                            <Feather name="map-pin" size={16} color="white" />
                            <Text style={styles.locationText}>Institut Teknologi Bandung</Text>
                        </TouchableOpacity>
                        <Text style={styles.greetingText}>Hai, Garudie!</Text>
                        <Text style={styles.subGreetingText}>Where are you going today?</Text>
                    </View>
                </View>

                {/* Search & Content Section */}
                <View style={[styles.contentContainer, { backgroundColor: themeColors.background }]}>
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

                    <Section title="Surrounding Landmarks" data={landmarks} onItemPress={handleItemPress} />
                    <Section title="Surrounding Cultures" data={cultures} onItemPress={handleItemPress} />
                    <Section title="Surrounding Museums" data={museums} onItemPress={handleItemPress} />
                </View>
            </ScrollView>
            
            {/* Detail Modal */}
            <DetailModal 
                visible={modalVisible} 
                item={selectedItem} 
                onClose={handleCloseModal} 
            />
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
    locationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignSelf: 'flex-start',
        overflow: 'hidden',
    },
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
    
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBackdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    modalContainer: {
        width: 320,
        backgroundColor: 'white',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 100,
        elevation: 10,
        maxHeight: '80%',
    },
    closeButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    modalImageContainer: {
        width: '100%',
        height: 208,
        position: 'relative',
        overflow: 'hidden',
    },
    modalImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    modalImageGradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '30%',
    },
    modalTitleContainer: {
        position: 'absolute',
        bottom: 12,
        left: 16,
        right: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.0)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 24,
        alignItems: 'center',
    },
    modalTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        fontFamily: 'Montserrat',
        textAlign: 'center',
    },
    modalContent: {
        padding: 16,
    },
    modalLocation: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
        fontFamily: 'Poppins',
        textAlign: 'justify',
        marginBottom: 12,
        lineHeight: 18,
    },
    modalDescriptionContainer: {
        maxHeight: 300,
    },
    modalDescription: {
        fontSize: 12,
        color: '#000',
        fontFamily: 'Poppins',
        textAlign: 'justify',
        lineHeight: 16,
    },
});