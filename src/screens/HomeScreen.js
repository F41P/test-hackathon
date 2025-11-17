import { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Header from '../components/Header'; 
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { usePlots } from '../context/PlotContext';
import { getPlots } from '../services/plot.service';
import { getSummary } from '../services/summary.service';
import { useAuth } from '../context/AuthContext';

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
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.subText}>ค่าใช้จ่ายรวม</Text>
          <Text style={styles.expenseText}>{expense.toLocaleString()} บาท</Text>
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
          <Text style={activeTab === 'expense' ? styles.tabActiveText : styles.tabText}>
            ค่าใช้จ่าย
          </Text>
        </TouchableOpacity>
       
        <TouchableOpacity 
          style={activeTab === 'income' ? styles.tabActive : styles.tab} 
          onPress={() => setActiveTab('income')}
        >
          <Text style={activeTab === 'income' ? styles.tabActiveText : styles.tabText}>
            รายได้
          </Text>
        </TouchableOpacity>
  
        <TouchableOpacity 
          style={activeTab === 'profit' ? styles.tabActive : styles.tab} 
          onPress={() => setActiveTab('profit')}
        >
          <Text style={activeTab === 'profit' ? styles.tabActiveText : styles.tabText}>
            กำไร
          </Text>
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
  const { plots } = usePlots();          // ✔ ใช้ plots จาก Context

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
    key={plot.id ?? plot.plot_id}
    style={styles.plotButton}
    onPress={() => navigation.navigate('PlotDetail', { 
      plotId: plot.id ?? plot.plot_id,
      plotName: plot.name ?? plot.plot_name,
    })}
  >
    <Text>{plot.name ?? plot.plot_name}</Text>
  </TouchableOpacity>
))}

      </View>
    </View>
  );
};

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { plots, setPlots } = usePlots();     // ใช้ setPlots จาก Context
  const [summary, setSummary] = useState({
    income_total: 0,
    expense_total: 0,
    profit_total: 0,
  });

  const loadPlots = async () => {
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
    try {
      const data = await getSummary(user.user_id);
      setSummary({
        income_total: parseFloat(data.income_total) || 0,
        expense_total: parseFloat(data.expense_total) || 0,
        profit_total: parseFloat(data.profit_total) || 0,
      });
    } catch (err) {
      console.log("Summary error:", err);
    }
  };

  useFocusEffect(
  useCallback(() => {
    if (user) {
      loadSummary();
      loadPlots();
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

export default HomeScreen;

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: '#F4F7F2' },
  card: { 
    padding: 15, 
    marginHorizontal: 15, 
    marginVertical: 10, 
    backgroundColor: 'white', 
    borderRadius: 12,
    elevation: 2,
  },
  cardTitle: { fontSize: 16, color: 'grey' },
  profitText: { fontSize: 32, fontWeight: 'bold', marginVertical: 10, color: '#333' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  subText: { color: 'grey', fontSize: 14 },
  incomeText: { color: '#84a58b', fontSize: 16, fontWeight: 'bold' },
  expenseText: { color: '#e57373', fontSize: 16, fontWeight: 'bold' },
  tabContainer: { flexDirection: 'row', marginBottom: 15 },
  tab: { paddingVertical: 5, paddingHorizontal: 10 },
  tabText: { color: 'grey', fontSize: 16 },
  tabActive: { paddingVertical: 5, paddingHorizontal: 10, borderBottomWidth: 2, borderBottomColor: '#84a58b' },
  tabActiveText: { color: '#333', fontSize: 16, fontWeight: 'bold' },
  chartRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', minHeight: 140 },
  chartPlaceholder: { width: 140, height: 140, borderRadius: 70, backgroundColor: 'lightgrey' },
  legendContainer: { justifyContent: 'center' },
  placeholderText: { flex: 1, textAlign: 'center', fontSize: 16, color: 'grey' },
  section: { paddingHorizontal: 15, marginTop: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  addPlotText: { color: '#84a58b', fontWeight: 'bold' },
  plotGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 10 },
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
  fabText: { fontSize: 30, color: 'white', lineHeight: 34 }
});
