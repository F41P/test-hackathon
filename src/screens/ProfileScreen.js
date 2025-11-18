// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
// import { useAuth } from '../context/AuthContext';
// import { SafeAreaView } from 'react-native-safe-area-context';

// const ProfileScreen = ({ navigation }) => {
//   const { phoneNumber } = useAuth();

//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.innerContainer}>

//         <View style={styles.header}>
//           <TouchableOpacity onPress={() => navigation.goBack()}>
//             <Text style={styles.backButton}>{"<"}</Text>
//           </TouchableOpacity>
//           <View>
//             <Text style={styles.title}>ข้อมูลส่วนตัว</Text> 
//             <Text style={styles.subtitle}>จัดการข้อมูลของคุณ</Text>
//           </View>
//         </View>
        
//         <View style={styles.avatarPlaceholder}>
//           <Text>อัปโหลดรูป</Text>
//         </View>

//         {/* Form */}
//         <View style={styles.form}>
//           <Text style={styles.inputLabel}>ชื่อผู้ใช้</Text>
//           <TextInput
//             style={[styles.input, styles.inputDisabled]}
//             value={phoneNumber} 
//             editable={false}
//           />
          
//           <Text style={styles.inputLabel}>โทรศัพท์</Text>
//           <TextInput
//             style={styles.input}
//             value={phoneNumber} 
//             keyboardType="phone-pad"
//             maxLength={10}
//           />

//           <Text style={styles.inputLabel}>ชื่อ</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="กรอกชื่อจริง"
//             value={firstName}
//             onChangeText={setFirstName}
//           />

//           <Text style={styles.inputLabel}>นามสกุล</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="กรอกนามสกุล"
//             value={lastName}
//             onChangeText={setLastName}
//           />
//         </View>

//         <TouchableOpacity 
//           style={styles.button}
//           onPress={() => { /* TODO: บันทึกข้อมูล (ยิง API) */ }}
//         >
//           <Text style={styles.buttonText}>บันทึกโปรไฟล์</Text>
//         </TouchableOpacity>
//       </View>
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
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   backButton: {
//     fontSize: 28,
//     color: '#333',
//     marginRight: 15,
//     fontWeight: 'bold',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#84a58b', 
//   },
//   subtitle: {
//     fontSize: 16,
//     color: 'grey',
//   },
//   avatarPlaceholder: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: '#f0f0f0',
//     justifyContent: 'center',
//     alignItems: 'center',
//     alignSelf: 'center',
//     marginBottom: 30,
//   },
//   form: {
//     width: '100%',
//   },
//   inputLabel: {
//     marginTop: 15,
//     marginBottom: 5,
//     color: 'grey',
//     fontSize: 14,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//     backgroundColor: '#f5f5f5',
//     borderRadius: 12,
//     width: '100%',
//     paddingHorizontal: 15,
//     height: 55,
//     fontSize: 16,
//   },
//   inputDisabled: {
//     backgroundColor: '#e0e0e0',
//     color: '#555',
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

// export default ProfileScreen;

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = "http://localhost:3005/api";

const ProfileScreen = ({ navigation }) => {
  const { user, setUser, logout } = useAuth();

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email] = useState(user?.email || "");
  const [userPicture, setUserPicture] = useState(user?.userPicture || "");

  // ---------------------------
  // สร้าง HTML สำหรับแสดง SVG แบบ fit
  // ---------------------------
  const svgHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          html, body {
            width: 100%;
            height: 100%;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            background: transparent;
          }
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        </style>
      </head>
      <body>
        <img src="${userPicture}" alt="avatar" />
      </body>
    </html>
  `;

  // ---------------------------
  // บันทึกข้อมูลโปรไฟล์
  // ---------------------------
  const handleSave = async () => {
    try {
      const payload = {
        firstName,
        lastName,
        userPicture,
      };

      const res = await axios.put(`${API_URL}/users/${user.user_id}`, payload);

      setUser(res.data);

      alert("อัปเดตสำเร็จ!");
    } catch (err) {
      console.log(err);
      alert("เกิดข้อผิดพลาด");
    }
  };

  // ---------------------------
  // ออกจากระบบ
  // ---------------------------
  const handleLogout = () => {
    logout();
    navigation.replace("LoginScreen");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image 
              source={require('../assets/images/back_icon.png')} 
              style={{ width: 40, height: 40, tintColor: '#333', marginRight: 15 }} 
            />
          </TouchableOpacity>

          <View>
            <Text style={styles.title}>ข้อมูลส่วนตัว</Text>
            <Text style={styles.subtitle}>จัดการข้อมูลของคุณ</Text>
          </View>
        </View>

        {/* Avatar */}
        <View style={styles.avatarWrapper}>
          {userPicture ? (
            <WebView
              source={{ html: svgHtml }}
              style={styles.avatar}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              bounces={false}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarPlaceholderText}>
                {firstName ? firstName.charAt(0).toUpperCase() : "?"}
              </Text>
            </View>
          )}
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.inputLabel}>อีเมล</Text>
          <TextInput
            style={[styles.input, styles.inputDisabled]}
            value={email}
            editable={false}
          />

          <Text style={styles.inputLabel}>ชื่อ</Text>
          <TextInput
            style={styles.input}
            placeholder="กรอกชื่อจริง"
            value={firstName}
            onChangeText={setFirstName}
          />

          <Text style={styles.inputLabel}>นามสกุล</Text>
          <TextInput
            style={styles.input}
            placeholder="กรอกนามสกุล"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>บันทึกโปรไฟล์</Text>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>ออกจากระบบ</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  innerContainer: { flex: 1, padding: 20 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  backButton: {
    fontSize: 28,
    color: '#333',
    marginRight: 15,
    fontWeight: 'bold',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#84a58b',
  },

  subtitle: {
    fontSize: 16,
    color: 'grey',
  },

  avatarWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    overflow: 'hidden',
    marginBottom: 30,
  },

  avatar: {
    width: 120,
    height: 120,
    backgroundColor: 'transparent',
  },

  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#84a58b',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarPlaceholderText: {
    fontSize: 48,
    color: 'white',
    fontWeight: 'bold',
  },

  form: { width: '100%' },

  inputLabel: {
    marginTop: 15,
    marginBottom: 5,
    color: 'grey',
    fontSize: 14,
  },

  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    width: '100%',
    paddingHorizontal: 15,
    height: 55,
    fontSize: 16,
  },

  inputDisabled: {
    backgroundColor: '#e0e0e0',
    color: '#555',
  },

  button: {
    backgroundColor: '#84a58b',
    padding: 15,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  logoutButton: {
    backgroundColor: '#ff6b6b',
  },

  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default ProfileScreen;