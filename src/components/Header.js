import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// 1. Import hook 'useAuth'
import { useAuth } from '../context/AuthContext'; 
// 2. Import SafeAreaView ที่ถูกต้อง
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

// 3. ลบ (route) ออก
const Header = () => {
  // 4. ดึง 'phoneNumber' มาจาก Context
  const { phoneNumber } = useAuth(); 
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ backgroundColor: '#84a58b' }}> 
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.avatar}
          onPress={() => navigation.navigate('Profile')} 
        ></TouchableOpacity>

        <Text style={styles.greetingText}>สวัสดี, คุณ {phoneNumber}</Text>

        <TouchableOpacity>
          <Text style={styles.menuIcon}>☰</Text> 
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#84a58b',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white', 
  },
  greetingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuIcon: {
    color: 'white',
    fontSize: 24,
  }
});

export default Header;