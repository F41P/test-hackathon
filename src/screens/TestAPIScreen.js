import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { Platform } from 'react-native';

const TestAPIScreen = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = Platform.OS === "android"
    ? "http://10.0.2.2:3005/api"
    : "http://10.171.1.90:3005/api";

  const testAPI = async () => {
    setLoading(true);
    setResult('กำลังทดสอบ...');
    
    try {
      console.log('Testing API:', `${API_URL}/users/by-phone?phone=0982369714`);
      
      const response = await axios.get(`${API_URL}/users/by-phone`, {
        params: { phone: '0982369714' },
        timeout: 10000
      });
      
      console.log('Response:', response.data);
      setResult(JSON.stringify(response.data, null, 2));
      Alert.alert('สำเร็จ!', 'API ทำงานปกติ');
      
    } catch (error) {
      console.log('Error:', error);
      console.log('Error message:', error.message);
      console.log('Error response:', error.response?.data);
      
      let errorMsg = 'ไม่ทราบสาเหตุ';
      
      if (error.message === 'Network Error') {
        errorMsg = `Network Error - ไม่สามารถเชื่อมต่อ Backend ได้\n\nAPI URL: ${API_URL}\n\nตรวจสอบ:\n1. Backend รันอยู่หรือไม่\n2. มือถือและคอมอยู่ Wi-Fi เดียวกันหรือไม่\n3. Firewall ปิดหรือไม่`;
      } else if (error.code === 'ECONNABORTED') {
        errorMsg = 'Timeout - ใช้เวลานานเกินไป';
      } else if (error.response) {
        errorMsg = `HTTP ${error.response.status}: ${error.response.data?.message || 'Unknown error'}`;
      }
      
      setResult(errorMsg);
      Alert.alert('ผิดพลาด', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>ทดสอบการเชื่อมต่อ API</Text>
        
        <Text style={styles.info}>
          Platform: {Platform.OS}
        </Text>
        <Text style={styles.info}>
          API URL: {API_URL}
        </Text>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={testAPI}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'กำลังทดสอบ...' : 'ทดสอบ API'}
          </Text>
        </TouchableOpacity>
        
        {result ? (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>ผลลัพธ์:</Text>
            <Text style={styles.resultText}>{result}</Text>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  info: {
    fontSize: 14,
    color: 'grey',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#84a58b',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});

export default TestAPIScreen;
