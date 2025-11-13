import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../context/AuthContext';

const OTPScreen = ({ navigation, route }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputs = useRef([]); 

  const { login } = useAuth();

  const { phoneNumber } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()} 
        >
          <Text style={styles.backButtonText}>{"<"} เปลี่ยนเบอร์</Text>
        </TouchableOpacity>

        <Text style={styles.title}>ยืนยัน OTP</Text>
        <Text style={styles.subtitle}>กรอกรหัส OTP 6 หลักที่ส่งไปยัง</Text>
        <Text style={styles.phoneText}>{route.params.phoneNumber}</Text>

        <Text style={styles.inputLabel}>รหัส OTP</Text>
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => inputs.current[index] = ref} 
              style={styles.otpBox}
              keyboardType="number-pad"
              maxLength={1}
              onChangeText={(text) => {
                if (text && index < 5) {
                  inputs.current[index + 1].focus();
                }
              }}
            />
          ))}
        </View>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>ไม่ได้รับรหัส? </Text>
          <TouchableOpacity>
            <Text style={styles.resendLink}>ส่งอีกครั้ง</Text>
          </TouchableOpacity>
        </View>

       <TouchableOpacity 
        style={styles.button}
        onPress={() => { 
          login(phoneNumber); 
        }}
      >
        <Text style={styles.buttonText}>ยืนยัน</Text>
      </TouchableOpacity>
      </View>
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
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: 16,
    color: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'grey',
    textAlign: 'center',
  },
  phoneText: {
    fontSize: 16,
    color: 'black', 
    textAlign: 'center',
    marginBottom: 30,
  },
  inputLabel: {
    alignSelf: 'flex-start',
    marginBottom: 10,
    color: 'grey',
    fontSize: 14,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  otpBox: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    width: 50, 
    height: 60,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
  },
  resendContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
  },
  resendText: {
    color: 'grey',
  },
  resendLink: {
    color: '#84a58b', 
    fontWeight: 'bold',
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

export default OTPScreen;