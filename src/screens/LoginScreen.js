// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import axios from 'axios';
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useAuth } from "../context/AuthContext";

// // const LoginScreen = ({ navigation }) => {
// //   const [phoneNumber, setPhoneNumber] = useState('');

// //   return (
// //     <SafeAreaView style={styles.container}>e
// //       <KeyboardAvoidingView
// //         behavior={Platform.OS === "ios" ? "padding" : "height"}
// //         style={styles.innerContainer}
// //       >
// //         <View style={styles.logoContainer}>
// //           <Image 
// //             source={require('../assets/images/logo.png')} 
// //             style={styles.logo} 
// //           />
// //         </View>
        
// //         <Text style={styles.title}>เข้าสู่ระบบ</Text>
// //         <Text style={styles.subtitle}>กรอกเบอร์โทรศัพท์เพื่อเข้าใช้งาน</Text>

// //         <View style={styles.form}>
// //           <Text style={styles.inputLabel}>เบอร์โทรศัพท์</Text>
// //           <View style={styles.inputContainer}>
// //             <Text style={styles.inputIcon}></Text> 
// //             <TextInput
// //               style={styles.input}
// //               placeholder="08XXXXXXXX"
// //               keyboardType="phone-pad"
// //               maxLength={10}
// //               value={phoneNumber}
// //               onChangeText={setPhoneNumber}
// //             />
// //           </View>
// //           <Text style={styles.helperText}>กรอกเบอร์โทรศัพท์ 10 หลัก</Text>
// //         </View>

// //         <TouchableOpacity 
// //         style={styles.button}
// //         onPress={() => navigation.navigate('OTP', { phoneNumber: phoneNumber })} // 1. ส่ง state ที่ชื่อ phoneNumber ไปด้วย
// //         >
// //           <Text style={styles.buttonText}>เข้าสู่ระบบ</Text>
// //         </TouchableOpacity>
// //       </KeyboardAvoidingView>
// //     </SafeAreaView>
// //   );
// // };
// const API_URL = "http://localhost:3005/api";   // ← เปลี่ยนเป็น IP ของ backend จริงเวลาใช้มือถือทดสอบ

// const LoginScreen = ({ navigation }) => {
//   const [phoneNumber, setPhoneNumber] = useState('');

//   const handleLogin = async () => {
//     try {
//       if (phoneNumber.length !== 10) {
//         return Alert.alert("เบอร์โทรไม่ถูกต้อง", "กรุณากรอกเบอร์ 10 หลัก");
//       }

//       // 🔥 ยิง API หาผู้ใช้
//       const res = await axios.get(`${API_URL}/users/by-phone`, {
//         params: { phone: phoneNumber }
//       });

//       const user = res.data;

//       // 🔥 บันทึก user_id ลง Storage
//       await AsyncStorage.setItem("user_id", String(user.user_id));

//       // 🔥 ไปหน้า Home
//       // navigation.replace("Home");

//     } catch (error) {
//       console.log("Login error:", error);
//       Alert.alert("เข้าสู่ระบบไม่สำเร็จ", "ไม่พบหมายเลขโทรศัพท์นี้");
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         style={styles.innerContainer}
//       >
//         <View style={styles.logoContainer}>
//           <Image 
//             source={require('../assets/images/logo.png')}
//             style={styles.logo}
//           />
//         </View>

//         <Text style={styles.title}>เข้าสู่ระบบ</Text>
//         <Text style={styles.subtitle}>กรอกเบอร์โทรศัพท์เพื่อเข้าใช้งาน</Text>

//         <View style={styles.form}>
//           <Text style={styles.inputLabel}>เบอร์โทรศัพท์</Text>
//           <View style={styles.inputContainer}>
//             <TextInput
//               style={styles.input}
//               placeholder="08XXXXXXXX"
//               keyboardType="phone-pad"
//               maxLength={10}
//               value={phoneNumber}
//               onChangeText={setPhoneNumber}
//             />
//           </View>
//         </View>

//         <TouchableOpacity style={styles.button} onPress={handleLogin}>
//           <Text style={styles.buttonText}>เข้าสู่ระบบ</Text>
//         </TouchableOpacity>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'white',
//   },
//   innerContainer: {
//     flex: 1,
//     padding: 20,
//     alignItems: 'center',
//   },
//   logoContainer: {
//     width: 100,
//     height: 100,
//     marginVertical: 40, 
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   logo: {
//     width: 100,
//     height: 100,
//     resizeMode: 'contain',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: 'grey',
//     marginBottom: 30,
//     textAlign: 'center',
//   },
//   form: {
//     width: '100%', 
//   },
//   inputLabel: {
//     alignSelf: 'flex-start',
//     marginBottom: 5,
//     color: 'grey',
//     fontSize: 14,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5', 
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//     borderRadius: 12,
//     width: '100%',
//     paddingHorizontal: 15,
//   },
//   inputIcon: {
//     marginRight: 10,
//     fontSize: 20,
//   },
//   input: {
//     flex: 1,
//     height: 55, 
//     fontSize: 16,
//   },
//   helperText: {
//     alignSelf: 'flex-start',
//     marginTop: 5,
//     color: 'grey',
//     fontSize: 12,
//   },
//   button: {
//     backgroundColor: '#84a58b',
//     padding: 15,
//     borderRadius: 12, 
//     width: '100%',
//     alignItems: 'center',
//     marginTop: 'auto', 
//     marginBottom: 20, 
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   }
// });

// export default LoginScreen;


// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import axios from 'axios';
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useAuth } from "../context/AuthContext";

// const API_URL = "http://localhost:3005/api";

// const LoginScreen = ({ navigation }) => {
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const { login } = useAuth();  // ← ดึง login จาก context

//   const handleLogin = async () => {
//     try {
//       if (phoneNumber.length !== 10) {
//         return Alert.alert("เบอร์โทรไม่ถูกต้อง", "กรุณากรอกเบอร์ 10 หลัก");
//       }

//       const res = await axios.get(`${API_URL}/users/by-phone`, {
//         params: { phone: phoneNumber }
//       });

//       const user = res.data;

//       // เก็บ user_id
//       await AsyncStorage.setItem("user_id", String(user.user_id));

//       // ⭐ ทำให้ isLoggedIn = true
//       login(user);   // ← สำคัญที่สุด!!!

//     } catch (error) {
//       console.log("Login error:", error);
//       Alert.alert("เข้าสู่ระบบไม่สำเร็จ", "ไม่พบหมายเลขโทรศัพท์นี้");
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         style={styles.innerContainer}
//       >
//         <View style={styles.logoContainer}>
//           <Image 
//             source={require('../assets/images/logo.png')}
//             style={styles.logo}
//           />
//         </View>

//         <Text style={styles.title}>เข้าสู่ระบบ</Text>
//         <Text style={styles.subtitle}>กรอกเบอร์โทรศัพท์เพื่อเข้าใช้งาน</Text>

//         <View style={styles.form}>
//           <Text style={styles.inputLabel}>เบอร์โทรศัพท์</Text>
//           <View style={styles.inputContainer}>
//             <TextInput
//               style={styles.input}
//               placeholder="08XXXXXXXX"
//               keyboardType="phone-pad"
//               maxLength={10}
//               value={phoneNumber}
//               onChangeText={setPhoneNumber}
//             />
//           </View>
//         </View>

//         <TouchableOpacity style={styles.button} onPress={handleLogin}>
//           <Text style={styles.buttonText}>เข้าสู่ระบบ</Text>
//         </TouchableOpacity>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'white',
//   },
//   innerContainer: {
//     flex: 1,
//     padding: 20,
//     alignItems: 'center',
//   },
//   logoContainer: {
//     width: 100,
//     height: 100,
//     marginVertical: 40, 
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   logo: {
//     width: 100,
//     height: 100,
//     resizeMode: 'contain',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: 'grey',
//     marginBottom: 30,
//     textAlign: 'center',
//   },
//   form: {
//     width: '100%', 
//   },
//   inputLabel: {
//     alignSelf: 'flex-start',
//     marginBottom: 5,
//     color: 'grey',
//     fontSize: 14,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5', 
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//     borderRadius: 12,
//     width: '100%',
//     paddingHorizontal: 15,
//   },
//   inputIcon: {
//     marginRight: 10,
//     fontSize: 20,
//   },
//   input: {
//     flex: 1,
//     height: 55, 
//     fontSize: 16,
//   },
//   helperText: {
//     alignSelf: 'flex-start',
//     marginTop: 5,
//     color: 'grey',
//     fontSize: 12,
//   },
//   button: {
//     backgroundColor: '#84a58b',
//     padding: 15,
//     borderRadius: 12, 
//     width: '100%',
//     alignItems: 'center',
//     marginTop: 'auto', 
//     marginBottom: 20, 
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   }
// });

// export default LoginScreen;

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:3005/api";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  //const { login } = useAuth();

  // const handleLogin = async () => {
  //   try {
  //     if (!email.includes("@")) {
  //       return Alert.alert("อีเมลไม่ถูกต้อง", "กรุณากรอกอีเมลให้ถูกต้อง");
  //     }

  //     const res = await axios.get(`${API_URL}/users/by-email`, {
  //       params: { email }
  //     });

  //     const user = res.data;

  //     // เก็บ user_id
  //     await AsyncStorage.setItem("user_id", String(user.user_id));

  //     // login context
  //     login(user);

  //   } catch (error) {
  //     console.log("Login error:", error);
  //     Alert.alert("เข้าสู่ระบบไม่สำเร็จ", "ไม่พบอีเมลนี้ในระบบ");
  //   }
  // };
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
