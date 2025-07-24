import React, { useEffect, useRef, useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    LayoutAnimation,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    UIManager,
    View,
} from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Feather } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mengaktifkan LayoutAnimation di Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Tipe untuk setiap pesan
type Message = {
  id: number;
  text: string;
  sender: 'ai' | 'user';
};

// --- KOMPONEN BARU: TAMPILAN CHAT LAYAR PENUH ---
const FullScreenChat = ({
  messages,
  onSend,
}: {
  messages: Message[];
  onSend: (text: string) => void;
}) => {
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];

  const handleSendPress = () => {
    if (inputText.trim()) {
      onSend(inputText);
      setInputText('');
    }
  };

  // Auto-scroll
  React.useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <SafeAreaView style={[styles.chatContainer, { backgroundColor: themeColors.background }]}>
      <KeyboardAvoidingView
        style={styles.flexOne}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
      >
        <ScrollView ref={scrollViewRef} style={styles.flexOne} contentContainerStyle={styles.chatContent}>
          {messages.map(msg => (
            <View
              key={msg.id}
              style={[
                styles.messageBubble,
                msg.sender === 'ai'
                  ? [styles.aiBubble, { backgroundColor: themeColors.secondary }]
                  : [styles.userBubble, { backgroundColor: themeColors.tint }],
              ]}
            >
              <Text style={[styles.messageText, { color: msg.sender === 'ai' ? themeColors.text : 'white' }]}>
                {msg.text}
              </Text>
            </View>
          ))}
        </ScrollView>
        <View style={[styles.inputContainer, { borderTopColor: themeColors.border, backgroundColor: themeColors.background }]}>
          <TextInput
            style={[styles.textInput, { backgroundColor: themeColors.secondary, color: themeColors.text }]}
            placeholder="Tanyakan pada Budayana..."
            placeholderTextColor="#999"
            value={inputText}
            onChangeText={setInputText}
            returnKeyType="send"
            onSubmitEditing={handleSendPress}
          />
          <TouchableOpacity style={[styles.sendButton, { backgroundColor: themeColors.tint }]} onPress={handleSendPress}>
            <Feather name="arrow-up" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};


// --- KOMPONEN UTAMA: HomeScreen ---
export default function HomeScreen() {
  const [isChatActive, setIsChatActive] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [initialInput, setInitialInput] = useState('');
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const headerOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);

  const animatedHeaderStyle = useAnimatedStyle(() => {
    return {
      opacity: headerOpacity.value,
    };
  });
  const animatedContentStyle = useAnimatedStyle(() => {
    return {
      opacity: contentOpacity.value,
    };
  });

  useEffect(() => {
    // Animasi untuk judul, muncul setelah 300ms
    headerOpacity.value = withDelay(300, withTiming(1, { duration: 700 }));
    // Animasi untuk konten, muncul setelah 500ms
    contentOpacity.value = withDelay(500, withTiming(1, { duration: 700 }));
  }, []);

  const handleInitialSend = () => {
    if (initialInput.trim() === '') return;

    // Menambahkan pesan pertama
    const userMessage: Message = {
      id: Date.now(),
      text: initialInput,
      sender: 'user',
    };
    // Menambahkan pesan sambutan dari AI
    const aiWelcomeMessage: Message = {
        id: Date.now() + 1,
        text: 'Tentu, saya akan bantu! Beri saya sejenak untuk memikirkan rekomendasi terbaik untuk Anda...',
        sender: 'ai'
    };
    setMessages([userMessage, aiWelcomeMessage]);
    
    // Memicu animasi dan transisi ke mode chat
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    setIsChatActive(true);
  };

  const handleChatSend = (text: string) => {
    const userMessage: Message = { id: Date.now(), text, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    // TODO: Logika untuk mendapatkan balasan AI
  };

  // Tampilan akan berganti di sini berdasarkan state `isChatActive`
  if (isChatActive) {
    return <FullScreenChat messages={messages} onSend={handleChatSend} />;
  }

  // --- TAMPILAN AWAL (PARALLAX) ---
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={<Image source={require('@/assets/images/partial-react-logo.png')} style={styles.reactLogo} />}
    >
      {/* [LANGKAH 5] Terapkan animated style ke ThemedView */}
      <Animated.View style={animatedHeaderStyle}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Selamat Datang di Budayana!</ThemedText>
        </ThemedView>
      </Animated.View>

      <Animated.View style={animatedContentStyle}>
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Asisten Perjalanan Budaya Anda</ThemedText>
          <ThemedText>
            Budayana dirancang untuk menjadi teman perjalanan Anda dalam menjelajahi kekayaan budaya Indonesia. Cukup beri tahu apa yang Anda inginkan, dan biarkan AI kami menyusun rencana perjalanan yang penuh makna dan tak terlupakan.
          </ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Mulai Petualangan Anda</ThemedText>
          <ThemedText>
            Ketik permintaan pertama Anda di bawah ini untuk memulai. Contoh: <Text style={styles.italicText}>"Saya di Jakarta dan punya waktu 3 jam, ingin melihat sesuatu yang bersejarah."</Text>
          </ThemedText>
          
          <View style={[styles.inputContainer, { borderTopColor: themeColors.border, backgroundColor: themeColors.background, paddingHorizontal: 0, marginTop: 20 }]}>
              <TextInput
                style={[styles.textInput, { backgroundColor: themeColors.secondary, color: themeColors.text }]}
                placeholder="Tanyakan pada Budayana..."
                placeholderTextColor="#999"
                value={initialInput}
                onChangeText={setInitialInput}
                returnKeyType="send"
                onSubmitEditing={handleInitialSend}
              />
              <TouchableOpacity style={[styles.sendButton, { backgroundColor: themeColors.tint }]} onPress={handleInitialSend}>
                  <Feather name="arrow-up" size={20} color="white" />
              </TouchableOpacity>
          </View>
        </ThemedView>
      </Animated.View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  // Style untuk Parallax View
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  italicText: {
    fontStyle: 'italic',
  },

  // Style untuk Full Screen Chat
  flexOne: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexGrow: 1,
  },
  messageBubble: {
    maxWidth: '80%',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 18,
    marginVertical: 4,
  },
aiBubble: {
    alignSelf: 'flex-start',
  },
  userBubble: {
    alignSelf: 'flex-end',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 20 : 12,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    paddingTop: Platform.OS === 'ios' ? 10 : 8,
    paddingBottom: Platform.OS === 'ios' ? 10 : 8,
  },
  sendButton: {
    marginLeft: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});