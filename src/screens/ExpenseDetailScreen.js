import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ข้อมูลจำลองสำหรับ "รายการค่าใช้จ่าย"
const expenseData = [
  { id: 1, name: 'ค่าปุ๋ย', amount: '9,XXX บาท', percentage: '35%' },
  { id: 2, name: 'ค่าแรงงาน', amount: '7,XXX บาท', percentage: '25%' },
  { id: 3, name: 'ค่าเครื่องจักร', amount: '5,XXX บาท', percentage: '20%' },
  { id: 4, name: 'ค่ายาฆ่าศัตรูพืช', amount: '4,XXX บาท', percentage: '15%' },
  { id: 5, name: 'ค่าพันธุ์ข้าว', amount: '1,XXX บาท', percentage: '5%' },
];

const ExpenseDetailScreen = ({ navigation, route }) => {
  // 1. รับชื่อแปลง (plotName) ที่ส่งมาจาก PlotDetailScreen
  const { plotName } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* --- Header ที่สร้างเอง --- */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>{"<"}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{plotName}</Text>
          <View style={{width: 40}} />
        </View>

        {/* --- สรุปค่าใช้จ่าย (เหมือนใน PlotDetail) --- */}
        <View style={styles.summaryContainer}>
          <View style={[styles.summaryCard, styles.expenseCard]}>
            <Text style={styles.summaryLabel}>ค่าใช้จ่าย</Text>
            <Text style={styles.summaryAmount}>28,XXX บาท</Text>
          </View>
        </View>

        {/* --- Donut Chart Placeholder --- */}
        <View style={styles.chartContainer}>
          <View style={styles.chartPlaceholder} />
        </View>

        {/* --- รายการค่าใช้จ่าย --- */}
        <View style={styles.listContainer}>
          {expenseData.map((item) => (
            <View style={styles.listItem} key={item.id}>
              <View style={styles.itemLeft}>
                <Text style={styles.itemPercentage}>{item.percentage}</Text>
                <Text style={styles.itemName}>{item.name}</Text>
              </View>
              <Text style={styles.itemAmount}>{item.amount}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Stylesheet (อิงจากในรูป)
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
  expenseCard: { backgroundColor: '#ffcdd2' }, // สีแดงอ่อน
  summaryLabel: { fontSize: 16, color: '#333' },
  summaryAmount: { fontSize: 22, fontWeight: 'bold', marginTop: 5 },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  chartPlaceholder: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'lightgrey',
  },
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