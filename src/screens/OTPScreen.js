import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import axios from "axios";
import { useAuth } from '../context/AuthContext';

const OTPScreen = ({ navigation, route }) => {
  const { phoneNumber } = route.params;
  const { login } = useAuth();

  // 👍 สร้างช่อง OTP
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef([]);

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const verifyOtp = async () => {
  try {
    const res = await axios.get(`http://localhost:3005/api/users/by-phone?phone=${phoneNumber}`);
    const user = res.data;

    login(user);

    // navigation.replace("Home");
  } catch (err) {
    console.log("OTP verify error:", err);
  }
};


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>

        <TouchableOpacity 
          style={styles.backButton}
          onPress={verifyOtp}
        >
          <Text style={styles.backButtonText}>{"<"} เปลี่ยนเบอร์</Text>
        </TouchableOpacity>

        <Text style={styles.title}>ยืนยัน OTP</Text>
        <Text style={styles.subtitle}>กรอกรหัส OTP 6 หลักที่ส่งไปยัง</Text>
        <Text style={styles.phoneText}>{phoneNumber}</Text>

        <Text style={styles.inputLabel}>รหัส OTP</Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputs.current[index] = ref)}
              style={styles.otpBox}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleOtpChange(text, index)}
            />
          ))}
        </View>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>ไม่ได้รับรหัส? </Text>
          <TouchableOpacity>
            <Text style={styles.resendLink}>ส่งอีกครั้ง</Text>
          </TouchableOpacity>
        </View>

        {/* ⛳ ปุ่มนี้ต้องเรียก verifyOtp() */}
        <TouchableOpacity 
          style={styles.button}
          onPress={verifyOtp}
        >
          <Text style={styles.buttonText}>ยืนยัน</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  innerContainer: { flex: 1, padding: 20 },
  backButtonText: { fontSize: 16, color: '#333' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginTop: 30 },
  subtitle: { textAlign: 'center', color: 'grey' },
  phoneText: { textAlign: 'center', marginBottom: 20 },
  otpContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  otpBox: {
    width: 50, height: 60, textAlign: 'center',
    borderWidth: 1, borderColor: '#e0e0e0',
    backgroundColor: '#f5f5f5', borderRadius: 12,
    fontSize: 22, fontWeight: 'bold'
  },
  resendContainer: { flexDirection: 'row', marginTop: 20, justifyContent: 'center' },
  resendLink: { color: '#84a58b', fontWeight: 'bold' },
  button: {
    backgroundColor: '#84a58b', padding: 15, borderRadius: 12,
    alignItems: 'center', marginTop: 'auto', marginBottom: 20
  },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});

export default OTPScreen;
