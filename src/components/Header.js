// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import { useAuth } from '../context/AuthContext'; 
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useNavigation } from '@react-navigation/native';

// const Header = () => {
//   const { phoneNumber } = useAuth(); 
//   const navigation = useNavigation();

//   return (
//     <SafeAreaView style={{ backgroundColor: '#84a58b' }}> 
//       <View style={styles.headerContainer}>
//         <TouchableOpacity 
//           style={styles.avatar}
//           onPress={() => navigation.navigate('Profile')} 
//         ></TouchableOpacity>

//         <Text style={styles.greetingText}>สวัสดี, คุณ {phoneNumber}</Text>

//         <TouchableOpacity onPress={() => navigation.navigate('Compare')}>
//           <Text style={styles.menuIcon}>📊</Text> 
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   headerContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     backgroundColor: '#84a58b',
//   },
//   avatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: 'white', 
//   },
//   greetingText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   menuIcon: {
//     color: 'white',
//     fontSize: 24,
//   }
// });

// export default Header;

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useAuth } from '../context/AuthContext'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';

const Header = () => {
  const { user } = useAuth(); 
  const navigation = useNavigation();

  // สร้าง HTML สำหรับแสดง SVG
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
        <img src="${user?.userPicture || ''}" alt="avatar" />
      </body>
    </html>
  `;

  // แสดงชื่อ หรือ email
  const displayName = user?.firstName || user?.email || 'ผู้ใช้';

  return (
    <SafeAreaView style={{ backgroundColor: '#84a58b' }}> 
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.avatarWrapper}
          onPress={() => navigation.navigate('Profile')} 
        >
          {user?.userPicture ? (
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
              <Text style={styles.avatarText}>
                {displayName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.greetingText}>สวัสดี, คุณ {displayName}</Text>

        <TouchableOpacity onPress={() => navigation.navigate('Compare')}>
          <Image 
              source={require('../assets/images/menu_icon.png')} 
              style={{ width: 28, height: 28, tintColor: 'white' }} 
           />
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
  avatarWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: 'transparent',
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6b8e7f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
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