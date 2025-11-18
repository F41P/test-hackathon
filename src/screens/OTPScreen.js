// import React, { useState, useRef } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// import axios from "axios";
// import { useAuth } from '../context/AuthContext';

// const OTPScreen = ({ navigation, route }) => {
//   const { phoneNumber } = route.params;
//   const { login } = useAuth();

//   // 👍 สร้างช่อง OTP
//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const inputs = useRef([]);

//   const handleOtpChange = (text, index) => {
//     const newOtp = [...otp];
//     newOtp[index] = text;
//     setOtp(newOtp);

//     if (text && index < 5) {
//       inputs.current[index + 1].focus();
//     }
//   };

//   const verifyOtp = async () => {
//   try {
//     const res = await axios.get(`http://localhost:3005/api/users/by-phone?phone=${phoneNumber}`);
//     const user = res.data;

//     login(user);

//     // navigation.replace("Home");
//   } catch (err) {
//     console.log("OTP verify error:", err);
//   }
// };


//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.innerContainer}>

//         <TouchableOpacity 
//           style={styles.backButton}
//           onPress={verifyOtp}
//         >
//           <Text style={styles.backButtonText}>{"<"} เปลี่ยนเบอร์</Text>
//         </TouchableOpacity>

//         <Text style={styles.title}>ยืนยัน OTP</Text>
//         <Text style={styles.subtitle}>กรอกรหัส OTP 6 หลักที่ส่งไปยัง</Text>
//         <Text style={styles.phoneText}>{phoneNumber}</Text>

//         <Text style={styles.inputLabel}>รหัส OTP</Text>

//         <View style={styles.otpContainer}>
//           {otp.map((digit, index) => (
//             <TextInput
//               key={index}
//               ref={(ref) => (inputs.current[index] = ref)}
//               style={styles.otpBox}
//               keyboardType="number-pad"
//               maxLength={1}
//               value={digit}
//               onChangeText={(text) => handleOtpChange(text, index)}
//             />
//           ))}
//         </View>

//         <View style={styles.resendContainer}>
//           <Text style={styles.resendText}>ไม่ได้รับรหัส? </Text>
//           <TouchableOpacity>
//             <Text style={styles.resendLink}>ส่งอีกครั้ง</Text>
//           </TouchableOpacity>
//         </View>

//         {/* ⛳ ปุ่มนี้ต้องเรียก verifyOtp() */}
//         <TouchableOpacity 
//           style={styles.button}
//           onPress={verifyOtp}
//         >
//           <Text style={styles.buttonText}>ยืนยัน</Text>
//         </TouchableOpacity>

//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: 'white' },
//   innerContainer: { flex: 1, padding: 20 },
//   backButtonText: { fontSize: 16, color: '#333' },
//   title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginTop: 30 },
//   subtitle: { textAlign: 'center', color: 'grey' },
//   phoneText: { textAlign: 'center', marginBottom: 20 },
//   otpContainer: { flexDirection: 'row', justifyContent: 'space-between' },
//   otpBox: {
//     width: 50, height: 60, textAlign: 'center',
//     borderWidth: 1, borderColor: '#e0e0e0',
//     backgroundColor: '#f5f5f5', borderRadius: 12,
//     fontSize: 22, fontWeight: 'bold'
//   },
//   resendContainer: { flexDirection: 'row', marginTop: 20, justifyContent: 'center' },
//   resendLink: { color: '#84a58b', fontWeight: 'bold' },
//   button: {
//     backgroundColor: '#84a58b', padding: 15, borderRadius: 12,
//     alignItems: 'center', marginTop: 'auto', marginBottom: 20
//   },
//   buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
// });

// export default OTPScreen;

import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from "axios";
import { useAuth } from '../context/AuthContext';

const API_URL = "http://localhost:3005/api";

const OTPScreen = ({ navigation, route }) => {
  const { email } = route.params;
  const { login } = useAuth();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef([]);
  const [isResending, setIsResending] = useState(false);

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  // ---------------------------------------
  // 🔥 ยืนยัน OTP
  // ---------------------------------------
  const verifyOtp = async () => {
    try {
      const code = otp.join("");

      if (code.length !== 6) {
        Alert.alert("กรุณากรอกรหัสให้ครบ 6 หลัก");
        return;
      }

      const res = await axios.post(`${API_URL}/users/verify-otp`, {
        email,
        otp: code
      });

      const user = res.data.user;   // 🔥 ได้ user จาก backend เลย

      login(user);

      navigation.replace("HomeScreen");

    } catch (err) {
      console.log("OTP error:", err);
      Alert.alert("รหัส OTP ไม่ถูกต้อง", "กรุณาลองใหม่อีกครั้ง");
    }
  };

  // ---------------------------------------
  // 🔄 ส่ง OTP ใหม่
  // ---------------------------------------
  const resendOtp = async () => {
    try {
      setIsResending(true);

      await axios.post(`${API_URL}/users/send-otp`, { email });

      Alert.alert("ส่ง OTP ใหม่แล้ว", "กรุณาตรวจสอบอีเมล");

      setIsResending(false);
    } catch (err) {
      console.log("Resend OTP error:", err);
      Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถส่งรหัสอีกครั้งได้");
      setIsResending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>

        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>{"<"} เปลี่ยนอีเมล</Text>
        </TouchableOpacity>

        <Text style={styles.title}>ยืนยัน OTP</Text>
        <Text style={styles.subtitle}>กรอกรหัส OTP 6 หลักที่ส่งไปยัง</Text>
        <Text style={styles.phoneText}>{email}</Text>

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

          <TouchableOpacity disabled={isResending} onPress={resendOtp}>
            <Text style={[styles.resendLink, isResending && { opacity: 0.4 }]}>
              {isResending ? "กำลังส่ง..." : "ส่งอีกครั้ง"}
            </Text>
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
