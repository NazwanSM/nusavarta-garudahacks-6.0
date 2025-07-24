import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { GoogleSignInService, useGoogleAuth } from '../../services/googleSignInService';
import { InputField } from './InputField';

export const RegisterForm: React.FC = () => {
  const { register, loginWithGoogle, isLoading } = useAuth();
  const [, response, promptAsync] = useGoogleAuth();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Google auth response
  useEffect(() => {
    if (response?.type === 'success') {
      const handleGoogleResponse = async () => {
        setIsSubmitting(true);
        try {
          const googleResult = await GoogleSignInService.processGoogleAuthResult(response.authentication);
          
          if (googleResult) {
            const loginResult = await loginWithGoogle(googleResult.idToken);
            
            if (loginResult.success) {
              Alert.alert(
                'Welcome to Nusavarta!',
                'Your account has been created successfully.',
                [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
              );
            } else {
              Alert.alert('Registration Failed', loginResult.error || 'Google registration failed');
            }
          } else {
            Alert.alert('Error', 'Google authentication failed');
          }
        } catch (error) {
          console.error('Google registration error:', error);
          Alert.alert('Error', 'Failed to register with Google. Please try again.');
        } finally {
          setIsSubmitting(false);
        }
      };

      handleGoogleResponse();
    }
  }, [response, loginWithGoogle]);

  const handleGoogleRegister = async () => {
    try {
      await promptAsync();
    } catch (error) {
      console.error('Google Sign-In error:', error);
      Alert.alert('Error', 'Google Sign-In failed. Please try again.');
    }
  };

  const handleRegister = async () => {
    if (isSubmitting || isLoading) return;

    // Basic validation
    if (!firstName.trim()) {
      Alert.alert('Error', 'First name is required');
      return;
    }
    
    if (!lastName.trim()) {
      Alert.alert('Error', 'Last name is required');
      return;
    }
    
    if (!email.trim()) {
      Alert.alert('Error', 'Email is required');
      return;
    }
    
    if (!password.trim()) {
      Alert.alert('Error', 'Password is required');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match!');
      return;
    }
    
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await register({
        email: email.trim(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim()
      });

      if (result.success) {
        Alert.alert(
          'Success!', 
          'Account created successfully! You can now start exploring NusaVarta.',
          [
            {
              text: 'Get Started',
              onPress: () => router.replace('/(tabs)')
            }
          ]
        );
      } else {
        Alert.alert('Registration Failed', result.error || 'An error occurred during registration');
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = () => {
    router.push('/login' as any);
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image 
          source={require('@/assets/images/logo-nusavarta-kecil.png')}
          style={styles.logoImage}
        />
      </View>

      {/* Title and subtitle */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Sign Up</Text>
        <Text style={styles.subtitle}>Create an account to continue!</Text>
      </View>

      {/* Input fields */}
      <View style={styles.fieldContainer}>
        <InputField
          label="First Name"
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Lois"
          style={styles.inputField}
        />
        <InputField
          label="Second Name"
          value={lastName}
          onChangeText={setLastName}
          placeholder="Becket"
          style={styles.inputField}
        />
        <InputField
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="loisbecket@gmail.com"
          style={styles.inputField}
        />
        <InputField
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="•••••••"
          secureTextEntry={true}
          showPasswordToggle={true}
          style={styles.inputField}
        />
        <InputField
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="•••••••"
          secureTextEntry={true}
          showPasswordToggle={true}
          style={styles.inputField}
        />
      </View>

      {/* Register button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          onPress={handleRegister} 
          style={[
            styles.registerButtonContainer,
            (isSubmitting || isLoading) && styles.buttonDisabled
          ]}
          disabled={isSubmitting || isLoading}
        >
          <LinearGradient
            colors={['rgba(79, 116, 68, 0.40)', 'rgba(79, 116, 68, 0.40)']}
            style={styles.registerButton}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.registerButtonText}>Register</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Google Sign-In button */}
        <TouchableOpacity 
          onPress={handleGoogleRegister} 
          style={[
            styles.googleButtonContainer,
            (isSubmitting || isLoading) && styles.buttonDisabled
          ]}
          disabled={isSubmitting || isLoading}
        >
          <View style={styles.googleButton}>
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#666666" />
            ) : (
              <>
                <Image 
                  source={{ uri: 'https://developers.google.com/identity/images/g-logo.png' }}
                  style={styles.googleIcon}
                />
                <Text style={styles.googleButtonText}>Continue with Google</Text>
              </>
            )}
          </View>
        </TouchableOpacity>

        {/* Login link */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account?</Text>
          <TouchableOpacity onPress={handleLogin}>
            <Text style={styles.loginLink}> Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 343,
    padding: 24,
    alignItems: 'center',
    gap: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.60)',
    position: 'relative',
  },
  logoContainer: {
    width: 59,
    height: 64.581,
    position: 'relative',
    marginBottom: 10,
  },
  logoImage: {
    width: 59,
    height: 65,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  titleContainer: {
    alignItems: 'center',
    gap: 12,
    alignSelf: 'stretch',
  },
  title: {
    color: '#111827',
    fontFamily: 'Agency',
    fontSize: 32,
    fontWeight: '400',
    lineHeight: 41.6,
    letterSpacing: -0.64,
  },
  subtitle: {
    color: '#6C7278',
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16.8,
    letterSpacing: -0.12,
    textAlign: 'center',
  },
  fieldContainer: {
    alignItems: 'flex-end',
    gap: 4,
    alignSelf: 'stretch',
    marginBottom: 10,
  },
  inputField: {
    alignSelf: 'stretch',
  },
  buttonContainer: {
    alignItems: 'flex-start',
    gap: 16,
    alignSelf: 'stretch',
  },
  registerButtonContainer: {
    height: 48,
    alignSelf: 'stretch',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    shadowColor: 'rgba(37, 62, 167, 0.48)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2,
  },
  registerButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'rgba(79, 116, 68, 0.40)',
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 19.6,
    letterSpacing: -0.14,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 0,
    alignSelf: 'stretch',
    marginTop: 8,
  },
  loginText: {
    color: '#6C7278',
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16.8,
    letterSpacing: -0.12,
  },
  loginLink: {
    color: 'rgba(47, 93, 140, 1)',
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16.8,
    letterSpacing: -0.12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  googleButtonContainer: {
    width: '100%',
    marginTop: 12,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  googleIcon: {
    width: 20,
    height: 20,
  },
  googleButtonText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },
});
