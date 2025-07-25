import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Easing,
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
};

const ChatButton = ({ onPress, text }: { onPress: () => void; text: string }) => (
  <TouchableOpacity style={styles.chatButton} onPress={onPress}>
    <Text style={styles.chatButtonText}>{text}</Text>
  </TouchableOpacity>
);

export default function ChatScreen() {
  const { message } = useLocalSearchParams();
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const typingAnim = useRef(new Animated.Value(0)).current;
  
  const [isTyping, setIsTyping] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([
    {
        id: 1,
        text: 'Saya ingin mengunjungi museum',
        sender: 'user',
        timestamp: new Date(),
    },
    {
        id: 2,
        text: 'Sebelumnya, apakah anda ingin mengunjungi landmark terlebih dahulu?',
        sender: 'ai',
        timestamp: new Date(),
    },
    {
        id: 3,
        text: 'Apakah anda ingin diperlihkan rute ?',
        sender: 'ai',
        timestamp: new Date(),
    }
]);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  // Start entrance animation on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.back(1.2)), // Reduced back intensity
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // Handle incoming message from navigation
  useEffect(() => {
    if (message && typeof message === 'string') {
      const newMessage: Message = {
        id: Date.now(),
        text: message,
        sender: 'user',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, newMessage]);
      
      // Show typing indicator
      setIsTyping(true);
      
      // Start typing animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnim, {
            toValue: 1,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(typingAnim, {
            toValue: 0,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
      
      // Simulate AI response
      setTimeout(() => {
        setIsTyping(false);
        typingAnim.stopAnimation();
        typingAnim.setValue(0);
        
        const aiResponse: Message = {
          id: Date.now() + 1,
          text: 'Terima kasih atas pertanyaan Anda! Saya akan membantu Anda menemukan informasi yang dibutuhkan.',
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 2000);
    }
  }, [message, typingAnim]);

  const handleSend = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now(),
        text: inputText.trim(),
        sender: 'user',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, newMessage]);
      setInputText('');
      
      // Show typing indicator for AI response
      setIsTyping(true);
      
      // Start typing animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnim, {
            toValue: 1,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(typingAnim, {
            toValue: 0,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
      
      // Simulate AI response
      setTimeout(() => {
        setIsTyping(false);
        typingAnim.stopAnimation();
        typingAnim.setValue(0);
        
        const aiResponse: Message = {
          id: Date.now() + 1,
          text: 'Baik, saya akan membantu Anda menemukan museum dan menyusun rute yang sesuai.',
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 2000);
    }
  };

  const handleOptionPress = (option: string) => {
    const newMessage: Message = {
      id: Date.now(),
      text: option,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <Animated.View 
        style={[
          { flex: 1 },
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <LinearGradient
          colors={['#E8F4F8', '#D4E7DD', '#C8DDD1']}
          style={styles.gradient}
        >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Image 
              source={require('@/assets/images/nusa-ai-logo.png')} 
              style={styles.logo} 
            />
            <Image 
              source={require('@/assets/images/nusa-ai-text.png')} 
              style={styles.textHeader} 
            />
          </View>
        </View>

        <KeyboardAvoidingView
          style={styles.flex1}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
        >
          {/* Messages */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((message, index) => (
              <View key={message.id}>
                {/* User message */}
                {message.sender === 'user' && (
                  <View style={styles.userMessageWrapper}>
                    <View style={styles.userMessageContainer}>
                      <View style={styles.userMessageHeader}>
                        <Text style={styles.senderName}>You</Text>
                        <Text style={styles.timestamp}>{formatTime(message.timestamp)}</Text>
                      </View>
                      <View style={styles.userMessageBubble}>
                        <Text style={styles.userMessageText}>
                          {message.text}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.userAvatar}>
                      <Image 
                        source={require('@/assets/images/profile-icon.png')}
                        style={styles.avatarIcon}
                      />
                    </View>
                  </View>
                )}

                {/* AI message */}
                {message.sender === 'ai' && (
                  <View style={styles.aiMessageWrapper}>
                    <View style={styles.aiAvatar}>
                      <Image 
                        source={require('@/assets/images/nusa-ai-logo.png')}
                        style={styles.avatarIcon}
                      />
                    </View>
                    <View style={styles.aiMessageContainer}>
                      <View style={styles.aiMessageHeader}>
                        <Text style={styles.senderName}>nusaAI</Text>
                        <Text style={styles.timestamp}>{formatTime(message.timestamp)}</Text>
                      </View>
                      <View style={styles.aiMessageBubble}>
                        <Text style={styles.aiMessageText}>
                          {message.text}
                        </Text>
                      </View>
                      
                      {/* Show action buttons for the last AI message */}
                      {index === messages.length - 1 && message.sender === 'ai' && (
                        <View style={styles.actionButtons}>
                          <ChatButton 
                            onPress={() => handleOptionPress('Ya')} 
                            text="Ya" 
                          />
                          <ChatButton 
                            onPress={() => handleOptionPress('Tidak')} 
                            text="Tidak" 
                          />
                        </View>
                      )}
                    </View>
                  </View>
                )}
              </View>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <View style={styles.typingContainer}>
                <View style={styles.typingBubble}>
                  <Animated.View 
                    style={[
                      styles.typingDot,
                      {
                        opacity: typingAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.3, 1],
                        }),
                      },
                    ]}
                  />
                  <Animated.View 
                    style={[
                      styles.typingDot,
                      {
                        opacity: typingAnim.interpolate({
                          inputRange: [0, 0.5, 1],
                          outputRange: [0.3, 1, 0.3],
                        }),
                      },
                    ]}
                  />
                  <Animated.View 
                    style={[
                      styles.typingDot,
                      {
                        opacity: typingAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 0.3],
                        }),
                      },
                    ]}
                  />
                </View>
              </View>
            )}
          </ScrollView>

          {/* Bottom input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputRow}>
              <TouchableOpacity style={styles.attachButton}>
                <Feather name="paperclip" size={20} color="#999" />
              </TouchableOpacity>
              
              <TextInput
                style={styles.textInput}
                placeholder="Message AI..."
                placeholderTextColor="#999"
                value={inputText}
                onChangeText={setInputText}
                multiline={true}
                textAlignVertical="center"
              />
              
              <TouchableOpacity style={styles.micButton}>
                <Feather name="mic" size={20} color="#999" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.sendButton} 
                onPress={handleSend}
              >
                <Ionicons name="arrow-up" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  flex1: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  textHeader: {
    width: 160,
    height: 35,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E4B',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 20,
  },
  userMessageWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  userMessageContainer: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 8,
  },
  userMessageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userMessageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#4F7444',
    borderRadius: 20,
    borderTopRightRadius: 8,
  },
  userMessageText: {
    fontSize: 14,
    lineHeight: 20,
    color: 'white',
  },
  aiMessageWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  aiMessageContainer: {
    flex: 1,
    alignItems: 'flex-start',
    marginLeft: 8,
  },
  aiMessageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarIcon: {
    width: 20,
    height: 20,
  },
  aiMessageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderRadius: 20,
    borderTopLeftRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  aiMessageText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#2C3E4B',
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    marginRight: 8,
    color: '#2C3E4B',
  },
  timestamp: {
    fontSize: 10,
    color: '#999',
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  chatButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  chatButtonText: {
    fontSize: 14,
    color: '#2C3E4B',
    fontWeight: '500',
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 15,
    paddingBottom: 55,
    backgroundColor: 'transparent',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  attachButton: {
    padding: 8,
    paddingBottom: 13,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 14,
    color: '#2C3E4B',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  micButton: {
    padding: 8,
    paddingBottom: 13,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4F7444',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    marginBottom: 6,
  },
  disclaimer: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  typingContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  typingBubble: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#666',
    marginHorizontal: 2,
  },
});
