import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:3005/api";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleLogin = async () => {
    try {
      if (!email.includes("@")) {
        return Alert.alert("อีเมลไม่ถูกต้อง", "กรุณากรอกอีเมลให้ถูกต้อง");
      }

      // ⭐ ส่ง OTP ไปอีเมล
      await axios.post(`${API_URL}/users/send-otp`, { email });

      // ⭐ ไปหน้า OTP โดยส่ง email ไปด้วย
      navigation.navigate("OTP", { email });

    } catch (error) {
      console.log("Send OTP error:", error);
      Alert.alert("ไม่สามารถส่ง OTP ได้", "กรุณาลองใหม่อีกครั้ง");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.innerContainer}
      >
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/images/logo.png')}
            style={styles.logo}
          />
        </View>

        <Text style={styles.title}>เข้าสู่ระบบ</Text>
        <Text style={styles.subtitle}>กรอกอีเมลเพื่อเข้าใช้งาน</Text>

        <View style={styles.form}>
          <Text style={styles.inputLabel}>อีเมล</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="example@gmail.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>เข้าสู่ระบบ</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  innerContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  logoContainer: {
    width: 100,
    height: 100,
    marginVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    borderRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'grey',
    marginBottom: 30,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputLabel: {
    alignSelf: 'flex-start',
    marginBottom: 5,
    color: 'grey',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    width: '100%',
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    height: 55,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#84a58b',
    padding: 15,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default LoginScreen;
