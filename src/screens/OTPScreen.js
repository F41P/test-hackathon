import { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from '../context/AuthContext';
import { registerUser, loginUser } from '../services/user.service';

const OTPScreen = ({ navigation, route }) => {
  const { phoneNumber, isExistingUser, userData } = route.params;
  const { login } = useAuth();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const inputs = useRef([]);

  useEffect(() => {
    // สร้าง OTP แบบสุ่ม 6 หลัก
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
    
    // แสดง notification หรือ alert ให้ user เห็น OTP
    Alert.alert(
      "รหัส OTP ของคุณ", 
      `รหัส OTP: ${randomOtp}\n\n(ในการใช้งานจริงจะส่งผ่าน SMS)`,
      [{ text: "ตกลง" }]
    );
  }, []);

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleResendOtp = () => {
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
    setOtp(["", "", "", "", "", ""]);
    
    Alert.alert(
      "ส่ง OTP ใหม่", 
      `รหัส OTP ใหม่: ${randomOtp}`,
      [{ text: "ตกลง" }]
    );
  };

  const verifyOtp = async () => {
    try {
      const enteredOtp = otp.join("");
      
      if (enteredOtp.length !== 6) {
        return Alert.alert("ข้อมูลไม่ครบ", "กรุณากรอก OTP ให้ครบ 6 หลัก");
      }

      // ตรวจสอบ OTP
      if (enteredOtp !== generatedOtp) {
        return Alert.alert("OTP ไม่ถูกต้อง", "กรุณาตรวจสอบรหัส OTP อีกครั้ง");
      }

      // ถ้า OTP ถูกต้อง
      if (isExistingUser) {
        // User เดิม - ทำการ login
        console.log("Logging in existing user...");
        const response = await loginUser(phoneNumber);
        console.log("Login response:", response);
        
        // response = { status: 'success', data: { user_id, phone, ... } }
        await AsyncStorage.setItem("user_id", String(response.data.user_id));
        login(response.data);
        
      } else {
        // User ใหม่ - ทำการ register
        console.log("Registering new user...");
        const response = await registerUser({
          phone: phoneNumber,
          firstName: null,
          lastName: null
        });
        console.log("Register response:", response);
        
        // response = { status: 'success', data: { user_id, phone, ... } }
        await AsyncStorage.setItem("user_id", String(response.data.user_id));
        login(response.data);
      }

    } catch (err) {
      console.log("OTP verify error:", err);
      console.log("Error response:", err.response?.data);
      Alert.alert(
        "ผิดพลาด", 
        err.response?.data?.message || "ไม่สามารถยืนยัน OTP ได้"
      );
    }
  };

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
        <Text style={styles.subtitle}>
          {isExistingUser ? "เข้าสู่ระบบด้วยเบอร์" : "สมัครสมาชิกด้วยเบอร์"}
        </Text>
        <Text style={styles.phoneText}>{phoneNumber}</Text>
        <Text style={styles.infoText}>
          กรอกรหัส OTP 6 หลักที่แสดงในข้อความ
        </Text>

        <Text style={styles.inputLabel}>รหัส OTP</Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={`otp-input-${index}`}
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
          <TouchableOpacity onPress={handleResendOtp}>
            <Text style={styles.resendLink}>ส่งอีกครั้ง</Text>
          </TouchableOpacity>
        </View>

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
  backButton: { marginBottom: 10 },
  backButtonText: { fontSize: 16, color: '#333' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginTop: 30 },
  subtitle: { textAlign: 'center', color: 'grey', marginTop: 10 },
  phoneText: { textAlign: 'center', marginBottom: 10, fontWeight: 'bold', fontSize: 18 },
  infoText: { textAlign: 'center', color: '#84a58b', marginBottom: 20, fontSize: 14 },
  inputLabel: { fontSize: 14, color: 'grey', marginBottom: 10 },
  otpContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  otpBox: {
    width: 50, height: 60, textAlign: 'center',
    borderWidth: 1, borderColor: '#e0e0e0',
    backgroundColor: '#f5f5f5', borderRadius: 12,
    fontSize: 22, fontWeight: 'bold'
  },
  resendContainer: { flexDirection: 'row', marginTop: 20, justifyContent: 'center' },
  resendText: { color: 'grey' },
  resendLink: { color: '#84a58b', fontWeight: 'bold' },
  button: {
    backgroundColor: '#84a58b', padding: 15, borderRadius: 12,
    alignItems: 'center', marginTop: 'auto', marginBottom: 20
  },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});

export default OTPScreen;
