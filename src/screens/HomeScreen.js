import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Header from '../components/Header'; 
import { useNavigation } from '@react-navigation/native';

/*
 * โครง Card กำไรสุทธิ
 */
const NetProfitCard = () => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>กำไรสุทธิ</Text>
      <Text style={styles.profitText}>150,000 บาท</Text>
      <View style={styles.row}>
        <View>
          <Text style={styles.subText}>รายได้รวม</Text>
          <Text style={styles.incomeText}>450,000 บาท</Text>
        </View>
        <View style={{alignItems: 'flex-end'}}>
          <Text style={styles.subText}>ค่าใช้จ่ายรวม</Text>
          <Text style={styles.expenseText}>300,000 บาท</Text>
        </View>
      </View>
    </View>
  );
};

/*
 * โครง Card สรุป (Chart)
 */
const AnalyticsCard = () => {
  return (
    <View style={styles.card}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity style={styles.tabActive}>
          <Text style={styles.tabActiveText}>ค่าใช้จ่าย</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>รายได้</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>กำไร</Text>
        </TouchableOpacity>
      </View>
      
      {/* Chart & Legend Placeholder */}
      <View style={styles.chartRow}>
        <View style={styles.chartPlaceholder} /> 
        <View style={styles.legendContainer}>
          <Text>ข้าวโพด 35%</Text>
          <Text>ขิง 25%</Text>
          <Text>ข้าวหอมมะลิ 20%</Text>
          <Text>พริก 15%</Text>
          <Text>ผักบุ้ง 5%</Text>
        </View>
      </View>
    </View>
  );
};

/*
 * โครง "แปลงของฉัน"
 */
const MyPlotsSection = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.section}>
      <View style={styles.row}>
        <Text style={styles.sectionTitle}>แปลงของฉัน</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddPlot')}>
          <Text style={styles.addPlotText}>+ เพิ่มแปลง</Text>
        </TouchableOpacity>
      </View>
      
      {/* Plot Buttons (Grid) */}
      <View style={styles.plotGrid}>
        <TouchableOpacity style={styles.plotButton}><Text>ข้าวโพดหลังบ้าน</Text></TouchableOpacity>
        <TouchableOpacity style={styles.plotButton}><Text>ข้าวหอมมะลิ</Text></TouchableOpacity>
        <TouchableOpacity style={styles.plotButton}><Text>ขิงแปลงใหญ่</Text></TouchableOpacity>
        <TouchableOpacity style={styles.plotButton}><Text>พริกข้างเทศบาล</Text></TouchableOpacity>
      </View>
    </View>
  );
};

/*
 * หน้าจอหลัก (HomeScreen)
 */
const HomeScreen = () => {
  return (
    <View style={styles.screenContainer}>
      <Header /> 
      <ScrollView>
        <NetProfitCard />
        <AnalyticsCard />
        <MyPlotsSection />
        <View style={{ height: 100 }} /> 
      </ScrollView>

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

// Stylesheet ที่พยายามเลียนแบบในรูป
const styles = StyleSheet.create({
  screenContainer: { 
    flex: 1, 
    backgroundColor: '#F4F7F2' // สีพื้นหลังแอป (สีขาวนวลๆ)
  },
  card: { 
    padding: 15, 
    marginHorizontal: 15, 
    marginVertical: 10, 
    backgroundColor: 'white', 
    borderRadius: 12, // ทำให้ขอบมน
    elevation: 2, // เงาจางๆ (Android)
    shadowColor: '#000', // เงาจางๆ (iOS)
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardTitle: { 
    fontSize: 16, 
    color: 'grey' 
  },
  profitText: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    marginVertical: 10,
    color: '#333'
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginTop: 10,
  },
  subText: {
    color: 'grey',
    fontSize: 14,
  },
  incomeText: {
    color: '#84a58b', // สีเขียว
    fontSize: 16,
    fontWeight: 'bold',
  },
  expenseText: { 
    color: '#e57373', // สีแดง
    fontSize: 16,
    fontWeight: 'bold',
  },
  tabContainer: { 
    flexDirection: 'row', 
    justifyContent: 'flex-start', // ชิดซ้าย
    marginBottom: 15,
  },
  tab: { 
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  tabText: {
    color: 'grey',
    fontSize: 16,
  },
  tabActive: { 
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 2, 
    borderBottomColor: '#84a58b', // สีเขียว
  },
  tabActiveText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around', // จัดให้อยู่กลางๆ
  },
  chartPlaceholder: { 
    width: 140, 
    height: 140, 
    borderRadius: 70, 
    backgroundColor: 'lightgrey' 
  },
  legendContainer: {
    justifyContent: 'center',
  },
  section: { 
    paddingHorizontal: 15,
    marginTop: 10,
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold',
    color: '#333',
  },
  addPlotText: { 
    color: '#84a58b', // สีเขียว
    fontWeight: 'bold',
  },
  plotGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    marginTop: 10,
  },
  plotButton: { 
    borderWidth: 1, 
    borderColor: '#e0e0e0', // สีเทาจางๆ
    backgroundColor: 'white', 
    paddingVertical: 20, 
    marginVertical: 5, 
    width: '48%', // ให้กว้างเกือบครึ่ง (มีช่องว่าง)
    borderRadius: 8, 
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    right: 25,
    bottom: 25,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#84a58b', // สีเขียว
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4, // เงา
  },
  fabText: { 
    fontSize: 30, 
    color: 'white',
    lineHeight: 34 // จัด + ให้อยู่กลาง
  }
});

export default HomeScreen;