import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DropDownPicker from 'react-native-dropdown-picker';
import { useAuth } from '../context/AuthContext';
import { getPlotsSummary } from '../services/summary.service';

const MAX_BAR_HEIGHT = 180;


const CompareScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [plotItems, setPlotItems] = useState([]);
  const [chartData, setChartData] = useState({});

  const [plot1Open, setPlot1Open] = useState(false);
  const [plot1Value, setPlot1Value] = useState(null);

  const [plot2Open, setPlot2Open] = useState(false);
  const [plot2Value, setPlot2Value] = useState(null);

  useEffect(() => {
    loadPlots();
  }, []);

  const loadPlots = async () => {
    try {
      const data = await getPlotsSummary(user.user_id);

      const items = data.map(p => ({
        label: p.plot_name,
        value: p.plot_id
      }));

      const dataMap = {};
      data.forEach(p => {
        dataMap[p.plot_id] = {
          name: p.plot_name,
          income: parseFloat(p.income_total) || 0,
          expense: parseFloat(p.expense_total) || 0,
          profit: parseFloat(p.profit) || 0
        };
      });

      setPlotItems(items);
      setChartData(dataMap);

      if (items.length > 0) setPlot1Value(items[0].value);
      if (items.length > 1) setPlot2Value(items[1].value);

      setLoading(false);
    } catch (err) {
      console.log("Load plots error:", err);
      setLoading(false);
    }
  };

  const onPlot1Open = () => setPlot2Open(false);
  const onPlot2Open = () => setPlot1Open(false);

  const data1 = chartData[plot1Value] || { name: '', income: 0, expense: 0, profit: 0 };
  const data2 = chartData[plot2Value] || { name: '', income: 0, expense: 0, profit: 0 };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <ActivityIndicator size="large" color="#84a58b" />
        <Text>กำลังโหลดข้อมูล...</Text>
      </View>
    );
  }
  // const maxValue = Math.max(
  //   data1.income, data1.expense, data1.profit,
  //   data2.income, data2.expense, data2.profit
  // );
  // const scale = maxValue / MAX_BAR_HEIGHT;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.innerContainer}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
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
            containerStyle={{ ...styles.dropdownContainer, zIndex: 2000 }}
          />
          <DropDownPicker
            open={plot2Open}
            value={plot2Value}
            items={plotItems}
            setOpen={setPlot2Open}
            setValue={setPlot2Value}
            onOpen={onPlot2Open}
            style={styles.dropdown}
            containerStyle={{ ...styles.dropdownContainer, zIndex: 1000 }}
          />
        </View>

        <View style={styles.chartContainer}>
          <View style={styles.barGroup}>
            <View style={[styles.bar, styles.barIncome, { height: data1.income  }]} />
            <View style={[styles.bar, styles.barExpense, { height: data1.expense  }]} />
            <View style={[styles.bar, styles.barProfit, { height: data1.profit  }]} />
          </View>

          <View style={styles.barGroup}>
            <View style={[styles.bar, styles.barIncome, { height: data2.income }]} />
            <View style={[styles.bar, styles.barExpense, { height: data2.expense }]} />
            <View style={[styles.bar, styles.barProfit, { height: data2.profit }]} />
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
    overflow: 'hidden',
  },
barGroup: {
  flexDirection: 'row',
  alignItems: 'flex-end',
  height: MAX_BAR_HEIGHT,   // ใช้ความสูงจริง
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