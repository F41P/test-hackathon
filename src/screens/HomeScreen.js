import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Header from "../components/Header";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import { usePlots } from "../context/PlotContext";
import { getPlots } from "../services/plot.service";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import DonutChart from "../components/DonutChart.js";

const API_URL = "http://localhost:3005/api";

// ========================================================
// 1. Net Profit Card (การ์ดสรุปยอดรวม)
// ========================================================
const NetProfitCard = ({ income, expense, profit }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>กำไรสุทธิ</Text>
      <Text style={[styles.profitText, { color: profit >= 0 ? '#333' : '#e57373' }]}>
        {profit.toLocaleString()} บาท
      </Text>
      <View style={styles.row}>
        <View>
          <Text style={styles.subText}>รายได้รวม</Text>
          <Text style={styles.incomeText}>{income.toLocaleString()} บาท</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.subText}>ค่าใช้จ่ายรวม</Text>
          <Text style={styles.expenseText}>{expense.toLocaleString()} บาท</Text>
        </View>
      </View>
    </View>
  );
};
// --------------------------------------------------------
//  Analytics Card (สรุปค่าใช้จ่ายตามพืช)
// --------------------------------------------------------
// const AnalyticsCard = ({ reloadSignal }) => {
//   const { user } = useAuth();
//   const [activeTab, setActiveTab] = useState("expense");

// ========================================================
// 2. Analytics Card (กราฟวงกลม แยกประเภท)
// ========================================================
const AnalyticsCard = ({ reloadSignal }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("expense");
  const [loading, setLoading] = useState(true);
  
  const [expenseData, setExpenseData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [profitData, setProfitData] = useState([]);

  // โหลดข้อมูลกราฟทั้ง 3 ประเภท
  const loadData = async () => {
    if (!user?.user_id) return;
    setLoading(true);
    try {
      const [expenseRes, incomeRes, profitRes] = await Promise.all([
        axios.get(`${API_URL}/dashboard/expense-by-plant?user_id=${user.user_id}`),
        axios.get(`${API_URL}/dashboard/income-by-plant?user_id=${user.user_id}`),
        axios.get(`${API_URL}/dashboard/profit-by-plant?user_id=${user.user_id}`),
      ]);

      setExpenseData(expenseRes.data.plants || []);
      setIncomeData(incomeRes.data.plants || []);
      setProfitData(profitRes.data.plants || []);
    } catch (err) {
      console.log("LOAD ANALYTICS ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [reloadSignal, user]);

  // ฟังก์ชัน Render กราฟและ Legend
  const renderChartContent = (data, type) => {
    const BAR_COLORS = ["#FFC107", "#2196F3", "#4CAF50", "#FF5722", "#9C27B0", "#795548", "#607D8B"];
    
    let chartData = [];
    let lossData = []; // สำหรับเก็บรายการขาดทุน (กรณี Profit)

    // ------------------------------------------------------
    // ⭐ LOGIC การคำนวณข้อมูลกราฟ
    // ------------------------------------------------------
    if (type === 'profit') {
      // 1. กรองเฉพาะที่มีกำไร (Amount > 0) เพื่อนำไปวาดกราฟ
      const positiveItems = data.filter(d => parseFloat(d.amount) > 0);
      
      // 2. หาผลรวมกำไรที่เป็นบวกทั้งหมด (เพื่อใช้เป็นฐาน 100%)
      const totalPositive = positiveItems.reduce((sum, item) => sum + parseFloat(item.amount), 0);

      // 3. Map ข้อมูลสำหรับกราฟ
      chartData = positiveItems.map((item, index) => ({
        name: item.plant_name || "ไม่ระบุ",
        amount: parseFloat(item.amount),
        // คำนวณ % เทียบกับยอดกำไรรวมที่เป็นบวก
        percentage: totalPositive > 0 
          ? ((parseFloat(item.amount) / totalPositive) * 100).toFixed(1) 
          : 0,
        color: BAR_COLORS[index % BAR_COLORS.length]
      }));

      // 4. แยกรายการขาดทุน (Amount < 0) ออกมาแสดงต่างหาก
      lossData = data.filter(d => parseFloat(d.amount) < 0).map(item => ({
        name: item.plant_name || "ไม่ระบุ",
        amount: parseFloat(item.amount)
      }));

    } else {
      // กรณี Income หรือ Expense (ปกติค่ามาเป็นบวกอยู่แล้ว หรือถ้า Expense เป็นลบก็แปลงเป็น Absolute)
      const total = data.reduce((sum, item) => sum + Math.abs(parseFloat(item.amount)), 0);
      
      chartData = data.map((item, index) => ({
        name: item.plant_name || "ไม่ระบุ",
        amount: Math.abs(parseFloat(item.amount)),
        percentage: total > 0 
          ? ((Math.abs(parseFloat(item.amount)) / total) * 100).toFixed(1) 
          : 0,
        color: BAR_COLORS[index % BAR_COLORS.length]
      }));
    }

    // ------------------------------------------------------
    // ⭐ การแสดงผล (UI)
    // ------------------------------------------------------
    return (
      <>
        {(chartData.length > 0 || lossData.length > 0) ? (
          <>
            {/* กราฟวงกลม (เฉพาะยอดบวก) */}
            {chartData.length > 0 && (
              <View style={styles.chartWrapper}>
                <DonutChart size={130} strokeWidth={20} data={chartData} />
              </View>
            )}

            {/* Legend (รายการข้อมูล) */}
            <View style={styles.legendContainer}>
              
              {/* รายการปกติ (กำไร/รายได้/รายจ่าย) */}
              {chartData.map((p, index) => (
                <View key={`chart-${index}`} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: p.color }]} />
                  <View style={styles.legendTextContainer}>
                    <Text style={styles.legendTitle}>{p.name}</Text>
                    <Text style={styles.legendSubtitle}>
                      {p.percentage}% ({p.amount.toLocaleString()} บ.)
                    </Text>
                  </View>
                </View>
              ))}

              {/* รายการขาดทุน (แสดงเฉพาะ Tab กำไร) */}
              {type === 'profit' && lossData.map((l, index) => (
                <View key={`loss-${index}`} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#e57373' }]} />
                  <View style={styles.legendTextContainer}>
                    <Text style={styles.legendTitle}>{l.name} (ขาดทุน)</Text>
                    <Text style={[styles.legendSubtitle, { color: '#d32f2f' }]}>
                      {l.amount.toLocaleString()} บ.
                    </Text>
                  </View>
                </View>
              ))}
              
            </View>
          </>
        ) : (
          <Text style={styles.noDataText}>ไม่มีข้อมูล</Text>
        )}
      </>
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.tabContainer}>
        {['expense', 'income', 'profit'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={activeTab === tab ? styles.tabActive : styles.tab}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={activeTab === tab ? styles.tabActiveText : styles.tabText}>
              {tab === 'expense' ? 'ค่าใช้จ่าย' : tab === 'income' ? 'รายได้' : 'กำไร'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.chartRow}>
        {loading ? (
          <ActivityIndicator size="large" color="#84a58b" />
        ) : (
          <>
            {activeTab === "expense" && renderChartContent(expenseData, "expense")}
            {activeTab === "income" && renderChartContent(incomeData, "income")}
            {activeTab === "profit" && renderChartContent(profitData, "profit")}
          </>
        )}
      </View>

      <Text style={{ marginTop: 10, textAlign: "center", color: "grey" }}>
        รวมค่าใช้จ่ายทั้งหมด {total.toLocaleString()} บาท
      </Text>
    </View>
  );
};

// ========================================================
// 3. My Plots Section (รายการแปลง)
// ========================================================
const MyPlotsSection = () => {
  const navigation = useNavigation();
  const { plots } = usePlots();

  return (
    <View style={styles.section}>
      <View style={styles.rowHeader}>
        <Text style={styles.sectionTitle}>แปลงของฉัน</Text>
        <TouchableOpacity onPress={() => navigation.navigate("AddPlot")}>
          <Text style={styles.addPlotText}>+ เพิ่มแปลง</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.plotGrid}>
        {plots.map((plot) => (
          <TouchableOpacity
            key={plot.id ?? plot.plot_id}
            style={styles.plotButton}
            onPress={() =>
              navigation.navigate("PlotDetail", {
                plotId: plot.id ?? plot.plot_id,
                plotName: plot.name ?? plot.plot_name,
              })
            }
          >
            <Text style={styles.plotButtonText}>{plot.name ?? plot.plot_name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// ========================================================
// 4. Main Home Screen
// ========================================================
const HomeScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { setPlots } = usePlots();

  const [summary, setSummary] = useState({
    income_total: 0, expense_total: 0, profit_total: 0,
  });
  const [reloadSignal, setReloadSignal] = useState(0);

  const loadSummary = async () => {
    try {
      const res = await axios.get(`${API_URL}/dashboard/summary?user_id=${user.user_id}`);
      setSummary(res.data);
    } catch (err) {
      console.log("Summary error:", err);
    }
  };

  const loadPlots = async () => {
    try {
      const res = await getPlots(user.user_id);
      const formatted = res.map((p) => ({ id: p.plot_id, name: p.plot_name }));
      setPlots(formatted);
    } catch (err) {
      console.log("Load plots error:", err);
    }
  };

  const reloadAll = async () => {
    await loadSummary();
    await loadPlots();
    setReloadSignal((prev) => prev + 1);
  };

  useFocusEffect(
    useCallback(() => {
      if (user) reloadAll();
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
        <AnalyticsCard reloadSignal={reloadSignal} />
        <MyPlotsSection />
        <View style={{ height: 100 }} />
      </ScrollView>
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("AddTransaction")}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

// ========================================================
// Styles
// ========================================================
const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: "#F4F7F2" },
  
  // Card
  card: { padding: 15, marginHorizontal: 15, marginVertical: 10, backgroundColor: "white", borderRadius: 12, elevation: 2 },
  cardTitle: { fontSize: 16, color: "grey", marginBottom: 5 },
  profitText: { fontSize: 32, fontWeight: "bold", marginBottom: 15 },
  
  // Rows
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  rowHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  
  // Text Stats
  subText: { color: "grey", fontSize: 14 },
  incomeText: { color: "#84a58b", fontSize: 16, fontWeight: "bold" },
  expenseText: { color: "#e57373", fontSize: 16, fontWeight: "bold" },
  
  // Tabs
  tabContainer: { flexDirection: "row", marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  tab: { paddingVertical: 10, paddingHorizontal: 15, marginRight: 10 },
  tabText: { color: "grey", fontSize: 16 },
  tabActive: { paddingVertical: 10, paddingHorizontal: 15, borderBottomWidth: 3, borderBottomColor: "#84a58b", marginRight: 10 },
  tabActiveText: { color: "#333", fontWeight: "bold", fontSize: 16 },
  
  // Chart & Legend Layout
  chartRow: { 
    flexDirection: "row", 
    alignItems: "flex-start", // จัดให้ชิดบนเพื่อความสวยงามเมื่อรายการเยอะ
    minHeight: 150,
    paddingVertical: 5
  },
  chartWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    paddingTop: 10, // ดันลงนิดนึง
  },
  legendContainer: { 
    flex: 1, 
    justifyContent: "flex-start",
  },
  legendItem: { 
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    marginBottom: 12,
  },
  legendDot: { 
    width: 12, 
    height: 12, 
    borderRadius: 6, 
    marginRight: 10,
    marginTop: 4 // จัดตำแหน่งจุดให้ตรงกับบรรทัดแรกของตัวหนังสือ
  },
  legendTextContainer: {
    flex: 1,
  },
  legendTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
    flexWrap: 'wrap', // ให้ตัดคำลงบรรทัดใหม่ถ้าชื่อยาว
  },
  legendSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  noDataText: { flex: 1, textAlign: 'center', fontSize: 16, color: 'grey', marginTop: 20 },

  // Sections
  section: { paddingHorizontal: 15, marginTop: 15 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: '#333' },
  addPlotText: { color: "#84a58b", fontWeight: "bold", fontSize: 15 },
  
  // Grid
  plotGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  plotButton: { 
    borderWidth: 1, 
    borderColor: "#e0e0e0", 
    backgroundColor: "white", 
    paddingVertical: 20, 
    paddingHorizontal: 10,
    marginVertical: 5, 
    width: "48%", 
    borderRadius: 12, 
    alignItems: "center",
    justifyContent: 'center'
  },
  plotButtonText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center'
  },

  // FAB
  fab: { position: "absolute", right: 25, bottom: 25, width: 60, height: 60, backgroundColor: "#84a58b", borderRadius: 30, alignItems: "center", justifyContent: "center", elevation: 5, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.25, shadowRadius: 3.84 },
  fabText: { color: "white", fontSize: 30, lineHeight: 32 },
});
