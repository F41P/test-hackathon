import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext'; 
import { getExpenseBreakdown } from '../services/dashboard.service'; 

import PieChart from 'react-native-pie-chart';

const BAR_COLORS = ["#FFC107", "#2196F3", "#4CAF50", "#FF5722", "#9C27B0"];

const DonutChart = ({ data = [] }) => {
  // เช็คว่ามีข้อมูล หรือ ข้อมูลทุกตัวเป็น 0 หรือไม่
  if (data.length === 0 || data.every(item => parseFloat(item.amount) === 0)) {
    return <View style={styles.chartPlaceholder} />;
  }
  
  // ----------------------------------------------------------------
  // ⭐ [FIX]
  // ----------------------------------------------------------------
  // 1. A. รวม series และ sliceColor เป็น array เดียว
  const seriesData = data.map((item, index) => ({
    value: Math.abs(parseFloat(item.amount)),
    color: BAR_COLORS[index % BAR_COLORS.length]
  }));
  // ----------------------------------------------------------------


  return (
    <View style={styles.chartDisplayContainer}>
      <PieChart
        widthAndHeight={180} 
        series={seriesData}       // 1. B. ใช้ array ใหม่
        // sliceColor={...}       // (ลบ prop นี้ทิ้ง)
        coverRadius={0.65} 
        coverFill={'#F4F7F2'} 
      />
    </View>
  );
};


const ExpenseDetailScreen = ({ navigation, route }) => {
  const { user } = useAuth(); 
  const { plotName, plotId } = route.params; 

  const [loading, setLoading] = useState(true);
  const [expenseData, setExpenseData] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      if (!user || !plotId) return;

      try {
        setLoading(true);
        // (เราใช้ API ที่เราสร้างไว้ใน controllers/dashboard.controller.js)
        const data = await getExpenseBreakdown(user.user_id, plotId);
        
        const total = data.reduce((sum, item) => sum + parseFloat(item.amount), 0);

        setExpenseData(data);
        setTotalExpense(total);
      } catch (err) {
        console.log("Load expense detail error:", err);
        alert("ไม่สามารถโหลดข้อมูลได้");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, plotId]);


  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>{"<"}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{plotName}</Text>
          <View style={{width: 40}} />
        </View>
        <ActivityIndicator size="large" color="#84a58b" style={{ marginTop: 50 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* --- Header --- */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>{"<"}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{plotName}</Text>
          <View style={{width: 40}} />
        </View>

        {/* --- สรุปค่าใช้จ่าย --- */}
        <View style={styles.summaryContainer}>
          <View style={[styles.summaryCard, styles.expenseCard]}>
            <Text style={styles.summaryLabel}>ค่าใช้จ่าย (แปลงนี้)</Text>
            <Text style={styles.summaryAmount}>{totalExpense.toLocaleString()} บาท</Text>
          </View>
        </View>

        <View style={styles.chartContainer}>
          <DonutChart data={expenseData} />
        </View>

        {/* --- รายการค่าใช้จ่าย --- */}
        <View style={styles.listContainer}>
          {expenseData.length === 0 ? (
            <Text style={{ textAlign: 'center', color: 'grey', padding: 20 }}>ไม่มีข้อมูลค่าใช้จ่ายสำหรับแปลงนี้</Text>
          ) : (
            expenseData.map((item, index) => (
              <View style={styles.listItem} key={index}>
                <View style={styles.itemLeft}>
                  <Text style={styles.itemPercentage}>{item.percentage}%</Text>
                  <Text style={styles.itemName}>{item.name}</Text>
                </View>
                <Text style={styles.itemAmount}>{item.amount.toLocaleString()} บาท</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7F2' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  backButton: { fontSize: 28, color: '#333', fontWeight: 'bold' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#84a58b' },
  summaryContainer: {
    paddingHorizontal: 20,
  },
  summaryCard: {
    padding: 15,
    borderRadius: 12,
  },
  expenseCard: { backgroundColor: '#ffcdd2' }, 
  summaryLabel: { fontSize: 16, color: '#333' },
  summaryAmount: { fontSize: 22, fontWeight: 'bold', marginTop: 5 },
  
  // --- Chart Styles ---
  chartContainer: {
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  
  chartDisplayContainer: {
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },

  chartPlaceholder: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'lightgrey',
  },
  
  // --- List Styles ---
  listContainer: {
    paddingHorizontal: 20,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemPercentage: {
    fontSize: 14,
    color: 'grey',
    width: 50, 
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ExpenseDetailScreen;