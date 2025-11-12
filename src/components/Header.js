import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

const Header = () => {
  return (
    <SafeAreaView style={{ backgroundColor: '#84a58b' }}> 
      <View style={styles.headerContainer}>
        <View style={styles.avatar} />

        <Text style={styles.greetingText}>สวัสดี, คุณ 08xxxxxxxx</Text>

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