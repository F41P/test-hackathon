import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DropDownPicker from 'react-native-dropdown-picker';

const plotItems = [
  {label: 'ข้าวโพดหลังบ้าน', value: 'plot1'},
  {label: 'ขิงแปลงใหญ่', value: 'plot2'},
  {label: 'ข้าวหอมมะลิ', value: 'plot3'},
];

const chartData = {
  plot1: { name: 'ข้าวโพดหลังบ้าน', income: 8000, expense: 6500, profit: 1500 },
  plot2: { name: 'ขิงแปลงใหญ่', income: 10000, expense: 6000, profit: 4000 },
};

const CompareScreen = ({ navigation }) => {
  const [plot1Open, setPlot1Open] = useState(false);
  const [plot1Value, setPlot1Value] = useState(plotItems[0].value);
  
  const [plot2Open, setPlot2Open] = useState(false);
  const [plot2Value, setPlot2Value] = useState(plotItems[1].value);

  const onPlot1Open = () => setPlot2Open(false);
  const onPlot2Open = () => setPlot1Open(false);

  const data1 = chartData[plot1Value] || chartData.plot1;
  const data2 = chartData[plot2Value] || chartData.plot2;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.innerContainer}
        keyboardShouldPersistTaps="handled"
        onScroll={() => {
          setPlot1Open(false);
          setPlot2Open(false);
        }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>{"<"}</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>ข้อมูลเปรียบเทียบ</Text>
            <Text style={styles.subtitle}>รายได้ ค่าใช้จ่าย กำไร ในแต่ละรอบการผลิต</Text>
          </View>
        </View>

        <View style={styles.dropdownRow}>
          <DropDownPicker
            open={plot1Open}
            value={plot1Value}
            items={plotItems}
            setOpen={setPlot1Open}
            setValue={setPlot1Value}
            onOpen={onPlot1Open}
            style={styles.dropdown}
            containerStyle={{...styles.dropdownContainer, zIndex: 2000}}
          />
          <DropDownPicker
            open={plot2Open}
            value={plot2Value}
            items={plotItems}
            setOpen={setPlot2Open}
            setValue={setPlot2Value}
            onOpen={onPlot2Open}
            style={styles.dropdown}
            containerStyle={{...styles.dropdownContainer, zIndex: 1000}}
          />
        </View>

        <View style={styles.chartContainer}>
          <View style={styles.barGroup}>
            <View style={[styles.bar, styles.barIncome, {height: data1.income / 50}]} />
            <View style={[styles.bar, styles.barExpense, {height: data1.expense / 50}]} />
            <View style={[styles.bar, styles.barProfit, {height: data1.profit / 50}]} />
          </View>

          <View style={styles.barGroup}>
            <View style={[styles.bar, styles.barIncome, {height: data2.income / 50}]} />
            <View style={[styles.bar, styles.barExpense, {height: data2.expense / 50}]} />
            <View style={[styles.bar, styles.barProfit, {height: data2.profit / 50}]} />
          </View>
        </View>
        
        <View style={styles.legend}>
          <View style={[styles.legendDot, styles.barIncome]} />
          <Text style={styles.legendText}>รายได้</Text>
          <View style={[styles.legendDot, styles.barExpense]} />
          <Text style={styles.legendText}>ค่าใช้จ่าย</Text>
          <View style={[styles.legendDot, styles.barProfit]} />
          <Text style={styles.legendText}>กำไร</Text>
        </View>

        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>ข้อสรุป และ คำแนะนำเบื้องต้น</Text>
          <Text style={styles.summaryText}>
            • {data2.name} สร้างกำไรได้ "ดีกว่า" {data1.name}
          </Text>
          <Text style={styles.summaryText}>
            • {data1.name} มีปัญหาเรื่องต้นทุนที่ "สูงเกินไป"
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  innerContainer: { flexGrow: 1, padding: 20, paddingBottom: 100 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: { fontSize: 28, color: '#333', marginRight: 15, fontWeight: 'bold' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#84a58b' },
  subtitle: { fontSize: 16, color: 'grey' },
  dropdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 1000,
  },
  dropdownContainer: {
    width: '48%',
    marginBottom: 10,
  },
  dropdown: {
    backgroundColor: '#f5f5f5',
    borderColor: '#e0e0e0',
    borderRadius: 12,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 250, 
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
    marginTop: 20,
  },
  barGroup: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: '100%',
    position: 'relative',
    paddingHorizontal: 10,
  },
  barLabel: {
    position: 'absolute',
    top: -20,
    width: 150,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bar: {
    width: 25,
    marginHorizontal: 5,
    borderRadius: 4,
  },
  barIncome: { backgroundColor: '#64b5f6' },
  barExpense: { backgroundColor: '#e57373' }, 
  barProfit: { backgroundColor: '#81c784' },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
    marginLeft: 15,
  },
  legendText: {
    fontSize: 14,
  },
  summaryBox: {
    backgroundColor: '#F4F7F2',
    borderRadius: 12,
    padding: 15,
    marginTop: 20,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
});

export default CompareScreen;