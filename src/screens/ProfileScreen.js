import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
// 1. Import hook 'useAuth' เพื่อดึงเบอร์โทรมาโชว์
import { useAuth } from '../context/AuthContext';
// 2. Import 'SafeAreaView' ตัวที่ถูกต้อง
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileScreen = () => {
  // 3. ดึงเบอร์โทรจาก Context
  const { phoneNumber } = useAuth();

  // 4. สร้าง State สำหรับเก็บชื่อและนามสกุลที่กรอก
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Back Button (Placeholder, navigator จะสร้างให้ถ้าเราไม่ซ่อน) */}
        {/* <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text>{"<"} กลับ</Text>
        </TouchableOpacity> */}
        
        <Text style={styles.title}>ข้อมูลส่วนตัว</Text>
        <Text style={styles.subtitle}>จัดการข้อมูลของคุณ</Text>

        {/* Profile Picture Placeholder */}
        <View style={styles.avatarPlaceholder}>
          <Text>อัปโหลดรูป</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.inputLabel}>ชื่อผู้ใช้</Text>
          <TextInput
            style={[styles.input, styles.inputDisabled]}
            value={phoneNumber} // ดึงเบอร์จาก Context
            editable={false}
          />
          
          <Text style={styles.inputLabel}>โทรศัพท์</Text>
          <TextInput
            style={styles.input}
            value={phoneNumber} // ดึงเบอร์จาก Context
            keyboardType="phone-pad"
            maxLength={10}
            // เราอาจจะอนุญาตให้แก้ไขเบอร์ได้ในอนาคต
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
        <TouchableOpacity 
          style={styles.button}
          onPress={() => { /* TODO: บันทึกข้อมูล (ยิง API) */ }}
        >
          <Text style={styles.buttonText}>บันทึกโปรไฟล์</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'grey',
    marginBottom: 20,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 30,
  },
  form: {
    width: '100%',
  },
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
    backgroundColor: '#e0e0e0', // สีเทาสำหรับช่องที่แก้ไขไม่ได้
    color: '#555',
  },
  button: {
    backgroundColor: '#84a58b', // สีเขียว
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

export default ProfileScreen;