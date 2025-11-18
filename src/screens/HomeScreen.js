import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Header from '../components/Header'; 
import { useNavigation, useFocusEffect  } from '@react-navigation/native';
import { getSummary, getExpenseBreakdown, getIncomeBreakdown, getProfitByPlant } from '../services/dashboard.service';

import { usePlots } from '../context/PlotContext';
import { getPlots } from '../services/plot.service';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

import PieChart from 'react-native-pie-chart';

const API_URL = "http://localhost:3005/api";

// ----------------------------------------------------------------
// ⭐ [FIX] 1. แก้ไข NetProfitCard ให้รับ props (ลบค่า hardcode)
// ----------------------------------------------------------------
const NetProfitCard = ({ income, expense, profit }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>กำไรสุทธิ</Text>
      <Text style={styles.profitText}>{profit.toLocaleString()} บาท</Text>
      <View style={styles.row}>
        <View>
          <Text style={styles.subText}>รายได้รวม</Text>
          <Text style={styles.incomeText}>{income.toLocaleString()} บาท</Text>
        </View>
        <View style={{alignItems: 'flex-end'}}>
          <Text style={styles.subText}>ค่าใช้จ่ายรวม</Text>
          <Text style={styles.expenseText}>{expense.toLocaleString()} บาท</Text>
        </View>
      </View>
    </View>
  );
};


const AnalyticsCard = ({ expenseData = [], incomeData = [], profitData = [] }) => {
  const [activeTab, setActiveTab] = useState('expense'); 

  const renderChartContent = (data, type) => {
    let unit = '%'; 
    
    let dataForLegend = data; 
    let dataForPie = data;     

    if (type === 'profit') {
      unit = ' บาท';
      dataForPie = data.filter(item => parseFloat(item.amount) > 0); 
    }

    const seriesData = dataForPie.map((item, index) => ({
      value: Math.abs(parseFloat(item.amount)),
      color: BAR_COLORS[index % BAR_COLORS.length]
    }));

    return (
      <>
        <View style={styles.chartDisplayContainer}>
          {dataForPie.length > 0 && seriesData.some(s => s.value > 0) ? ( 
            <PieChart
              widthAndHeight={140}
              series={seriesData}    
              coverRadius={0.65} 
              coverFill={'#FFF'} 
            />
          ) : (
            <View style={styles.chartPlaceholder} /> 
          )}
        </View>
        
        <View style={styles.legendContainer}>
          {dataForLegend.length > 0 ? (
            dataForLegend.map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <View style={[styles.legendDot, { 
                    backgroundColor: (item.amount < 0) ? '#e57373' : BAR_COLORS[index % BAR_COLORS.length] 
                }]} />
                
                <Text style={styles.legendText}>
                  {item.name} {
                    (type === 'profit') 
                      ? `${item.amount.toLocaleString()}${unit}`
                      : `${item.percentage}${unit}`
                  }
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.placeholderText}>ไม่มีข้อมูล</Text>
          )}
        </View>
      </>
    );
  };

  return (
    <View style={styles.card}>
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
        {activeTab === 'expense' && renderChartContent(expenseData, 'expense')}
        {activeTab === 'income' && renderChartContent(incomeData, 'income')}
        {activeTab === 'profit' && renderChartContent(profitData, 'profit')}
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
            // ----------------------------------------------------------------
            // ⭐ [FIX] 2. แก้ไข key (ต้องเป็น .id ที่มาจาก formatted)
            // ----------------------------------------------------------------
            key={plot.id} 
            style={styles.plotButton}
            onPress={() => navigation.navigate('PlotDetail', { 
              plotId: plot.id, 
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
  const { user } = useAuth();
  const { plots, setPlots } = usePlots();     
  const [summary, setSummary] = useState({
    income_total: 0,
    expense_total: 0,
    profit_total: 0,
  });

  const [expenseBreakdown, setExpenseBreakdown] = useState([]);
  const [incomeBreakdown, setIncomeBreakdown] = useState([]);
  const [profitBreakdown, setProfitBreakdown] = useState([]);

  // ----------------------------------------------------------------
  // ⭐ [FIX] 3. เพิ่มการตรวจสอบ user.user_id ใน service calls
  // ----------------------------------------------------------------
  const loadPlots = async () => {
    if (!user?.user_id) return; // (เพิ่ม Guard clause)
    try {
      const res = await getPlots(user.user_id);
      const formatted = res.map((p) => ({
        id: p.plot_id,
        name: p.plot_name,
      }));
      setPlots(formatted);
    } catch (err) {
      console.log("Load plots error:", err);
    }
  };


  const loadSummary = async () => {
    if (!user?.user_id) return;
    try {
      const res = await getSummary(user.user_id); 
      console.log("SUMMARY:", res); 
      setSummary(res); 
    } catch (err) {
      console.log("Summary error:", err);
    }
  };

  const loadExpenseBreakdown = async () => {
    if (!user?.user_id) return;
    try {
      const res = await getExpenseBreakdown(user.user_id, null); 
      setExpenseBreakdown(res);
    } catch (err) {
      console.log("Load breakdown error:", err);
    }
  };

  const loadIncomeBreakdown = async () => {
    if (!user?.user_id) return;
    try {
      const res = await getIncomeBreakdown(user.user_id); 
      setIncomeBreakdown(res);
    } catch (err) {
      console.log("Load income breakdown error:", err);
    }
  };

  const loadProfitBreakdown = async () => {
    if (!user?.user_id) return;
    try {
      const res = await getProfitByPlant(user.user_id); 
      setProfitBreakdown(res);
    } catch (err) {
      console.log("Load profit breakdown error:", err);
    }
  };

  useFocusEffect(
  useCallback(() => {
    if (user) {
      loadSummary();
      loadPlots();
      loadExpenseBreakdown();
      loadIncomeBreakdown();
      loadProfitBreakdown();
    }
  }, [user])
);

  return (
    <View style={styles.screenContainer}>
      <Header /> 
      <ScrollView>
        <NetProfitCard 
          income={summary.income_total}
          expense={summary.expense_total}
          profit={summary.profit_total}
        />
        <AnalyticsCard 
          expenseData={expenseBreakdown} 
          incomeData={incomeBreakdown}
          profitData={profitBreakdown}
        />
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

export default HomeScreen;

const BAR_COLORS = ["#FFC107", "#2196F3", "#4CAF50", "#FF5722", "#9C27B0"];

// ----------------------------------------------------------------
// ⭐ [FIX] 4. ลบ styles ที่ซ้ำซ้อนออก
// ----------------------------------------------------------------
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
  chartDisplayContainer: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartPlaceholder: { 
    width: 140, 
    height: 140, 
    borderRadius: 70, 
    backgroundColor: '#f0f0f0' 
  },
  legendContainer: { 
    justifyContent: 'center', 
    flex: 1, 
    paddingLeft: 20 
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
  },
  placeholderText: { 
    flex: 1, 
    textAlign: 'center', 
    fontSize: 16, 
    color: 'grey' 
  },
  section: { 
    paddingHorizontal: 15, 
    marginTop: 10 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  addPlotText: { 
    color: '#84a58b', 
    fontWeight: 'bold' 
  },
  plotGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    marginTop: 10 
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