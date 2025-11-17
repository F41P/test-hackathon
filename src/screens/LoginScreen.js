import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getUserByPhone } from "../services/user.service";

const LoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (loading) return;
    
    try {
      if (phoneNumber.length !== 10) {
        return Alert.alert("เบอร์โทรไม่ถูกต้อง", "กรุณากรอกเบอร์ 10 หลัก");
      }

      setLoading(true);

      // ตรวจสอบว่าเบอร์นี้มีในระบบหรือไม่
      const user = await getUserByPhone(phoneNumber);
      
      // ถ้าเจอ user (ไม่ throw error) แสดงว่าเบอร์มีอยู่แล้ว
      console.log("User found:", user);
      navigation.navigate('OTP', { 
        phoneNumber, 
        isExistingUser: true,
        userData: user 
      });

    } catch (error) {
      console.log("Error checking phone:", error.response?.status);
      
      // ถ้าไม่เจอ user (404) แสดงว่าเป็นการ register ใหม่
      if (error.response?.status === 404) {
        console.log("User not found - will register new user");
        navigation.navigate('OTP', { 
          phoneNumber, 
          isExistingUser: false 
        });
      } else if (error.message === 'Network Error') {
        // Network error - ไม่สามารถเชื่อมต่อ Backend
        Alert.alert(
          "ไม่สามารถเชื่อมต่อได้", 
          "กรุณาตรวจสอบ:\n\n• มือถือและคอมพิวเตอร์อยู่ใน Wi-Fi เดียวกัน\n• Backend กำลังรันอยู่\n• Firewall ไม่ได้บล็อก"
        );
      } else {
        // Error อื่นๆ
        Alert.alert(
          "ผิดพลาด", 
          `เกิดข้อผิดพลาด: ${error.response?.data?.message || error.message}`
        );
      }
    } finally {
      setLoading(false);
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

        <Text style={styles.title}>เข้าสู่ระบบ / สมัครสมาชิก</Text>
        <Text style={styles.subtitle}>กรอกเบอร์โทรศัพท์เพื่อเข้าใช้งาน</Text>

        <View style={styles.form}>
          <Text style={styles.inputLabel}>เบอร์โทรศัพท์</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="08XXXXXXXX"
              keyboardType="phone-pad"
              maxLength={10}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              editable={!loading}
            />
          </View>
          <Text style={styles.helperText}>กรอกเบอร์โทรศัพท์ 10 หลัก</Text>
        </View>

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleContinue}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'กำลังตรวจสอบ...' : 'ดำเนินการต่อ'}
          </Text>
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
  buttonDisabled: {
    backgroundColor: '#a8c5ad',
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default LoginScreen;
