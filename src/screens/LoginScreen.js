import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');

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
        <Text style={styles.subtitle}>กรอกเบอร์โทรศัพท์เพื่อเข้าใช้งาน</Text>

        {/* Input Form */}
        <View style={styles.form}>
          <Text style={styles.inputLabel}>เบอร์โทรศัพท์</Text>
          <View style={styles.inputContainer}>
            {/* Placeholder for phone icon */}
            <Text style={styles.inputIcon}>📞</Text> 
            <TextInput
              style={styles.input}
              placeholder="08XXXXXXXX"
              keyboardType="phone-pad"
              maxLength={10}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>
          <Text style={styles.helperText}>กรอกเบอร์โทรศัพท์ 10 หลัก</Text>
        </View>

        <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('OTP', { phoneNumber: phoneNumber })} // 1. ส่ง state ที่ชื่อ phoneNumber ไปด้วย
        >
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
    borderRadius: 24, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 60,
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
  inputIcon: {
    marginRight: 10,
    fontSize: 20,
  },
  input: {
    flex: 1,
    height: 55, 
    fontSize: 16,
  },
  helperText: {
    alignSelf: 'flex-start',
    marginTop: 5,
    color: 'grey',
    fontSize: 12,
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