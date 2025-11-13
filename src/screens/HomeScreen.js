import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Header from '../components/Header'; 
import { useNavigation } from '@react-navigation/native';
import { usePlots } from '../navigation/PlotContext';

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

const AnalyticsCard = () => {

  const [activeTab, setActiveTab] = useState('expense'); 

  return (
    <View style={styles.card}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={activeTab === 'expense' ? styles.tabActive : styles.tab} 
          onPress={() => setActiveTab('expense')} 
        >
          <Text style={activeTab === 'expense' ? styles.tabActiveText : styles.tabText}>ค่าใช้จ่าย</Text>
        </TouchableOpacity>
       
        <TouchableOpacity 
          style={activeTab === 'income' ? styles.tabActive : styles.tab} 
          onPress={() => setActiveTab('income')} 
        >
          <Text style={activeTab === 'income' ? styles.tabActiveText : styles.tabText}>รายได้</Text>
        </TouchableOpacity>
  
        <TouchableOpacity 
          style={activeTab === 'profit' ? styles.tabActive : styles.tab} 
          onPress={() => setActiveTab('profit')} 
        >
          <Text style={activeTab === 'profit' ? styles.tabActiveText : styles.tabText}>กำไร</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.chartRow}>
        {activeTab === 'expense' && (
          <>
            <View style={styles.chartPlaceholder} /> 
            <View style={styles.legendContainer}>
              <Text>ข้าวโพด 35%</Text>
              <Text>ขิง 25%</Text>
              <Text>ข้าวหอมมะลิ 20%</Text>
              <Text>พริก 15%</Text>
              <Text>ผักบุ้ง 5%</Text>
            </View>
          </>
        )}
        {activeTab === 'income' && (
          <Text style={styles.placeholderText}>แสดงข้อมูล "รายได้" ที่นี่</Text>
        )}
        {activeTab === 'profit' && (
          <Text style={styles.placeholderText}>แสดงข้อมูล "กำไร" ที่นี่</Text>
        )}
      </View>
    </View>
  );
};

const MyPlotsSection = () => {
  const navigation = useNavigation();
  const { plots } = usePlots();
  return (
    <View style={styles.section}>
      <View style={styles.row}>
        <Text style={styles.sectionTitle}>แปลงของฉัน</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddPlot')}>
          <Text style={styles.addPlotText}>+ เพิ่มแปลง</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.plotGrid}>
        {plots.map((plot) => (
          <TouchableOpacity 
            key={plot.id}
            style={styles.plotButton}
            onPress={() => navigation.navigate('PlotDetail', { 
              plotId: plot.id, // (ส่ง ID ไปแทน)
              plotName: plot.name 
            })}
          >
            <Text>{plot.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const HomeScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.screenContainer}>
      <Header /> 
      <ScrollView>
        <NetProfitCard />
        <AnalyticsCard />
        <MyPlotsSection />
        <View style={{ height: 100 }} /> 
      </ScrollView>

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('AddTransaction')}
      >
        <Text style={styles.fabText}>+</Text> 
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: { 
    flex: 1, 
    backgroundColor: '#F4F7F2'
  },
  card: { 
    padding: 15, 
    marginHorizontal: 15, 
    marginVertical: 10, 
    backgroundColor: 'white', 
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
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
    color: '#84a58b',
    fontSize: 16,
    fontWeight: 'bold',
  },
  expenseText: { 
    color: '#e57373',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tabContainer: { 
    flexDirection: 'row', 
    justifyContent: 'flex-start',
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
    borderBottomColor: '#84a58b',
  },
  tabActiveText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    minHeight: 140, 
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
  placeholderText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    color: 'grey',
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
    color: '#84a58b',
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
    borderColor: '#e0e0e0',
    backgroundColor: 'white', 
    paddingVertical: 20, 
    marginVertical: 5, 
    width: '48%',
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
    backgroundColor: '#84a58b',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  fabText: { 
    fontSize: 30, 
    color: 'white',
    lineHeight: 34
  }
});

export default HomeScreen;