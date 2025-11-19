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
import PredictedYieldCard from "../components/PredictedYieldCard";

const API_URL = "http://localhost:3005/api";

// ========================================================
// 1. Net Profit Card (การ์ดสรุปยอดรวม)
// ========================================================
const NetProfitCard = ({ income, expense, profit }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>กำไรสุทธิ</Text>
      <Text
        style={[styles.profitText, { color: profit >= 0 ? "#333" : "#e57373" }]}
      >
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

// ========================================================
// 2. Analytics Card (กราฟวงกลม/แท่ง แยกประเภท)
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
        axios.get(
          `${API_URL}/dashboard/expense-by-plant?user_id=${user.user_id}`
        ),
        axios.get(
          `${API_URL}/dashboard/income-by-plant?user_id=${user.user_id}`
        ),
        axios.get(
          `${API_URL}/dashboard/profit-by-plant?user_id=${user.user_id}`
        ),
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

  const fmt = (n) => Number(n).toLocaleString();

  // ------------------------------------------------------
  // ⭐ ฟังก์ชัน Render แผนภูมิแท่งแนวนอน (สำหรับ Tab กำไร)
  // ------------------------------------------------------
  const renderHorizontalBarChart = (data) => {
    // กรองเฉพาะรายการที่มีมูลค่า (ทั้งบวกและลบ)
    const activeData = data.filter(d => Math.abs(parseFloat(d.amount)) > 0);
    if (activeData.length === 0) {
        return <Text style={styles.noDataText}>ไม่มีข้อมูลกำไรหรือขาดทุน</Text>;
    }
    
    // หาค่าสูงสุด (ทั้งบวกและลบ) เพื่อกำหนด Scale ของแท่ง
    const allAmounts = activeData.map(d => Math.abs(parseFloat(d.amount)));
    const maxAmount = Math.max(...allAmounts, 0);
    const scaleFactor = maxAmount > 0 ? 150 / maxAmount : 0; // 150px คือความกว้างสูงสุดของแท่ง

    return (
      <View style={styles.barChartContainer}>
        {activeData.map((item, index) => {
          const amount = parseFloat(item.amount);
          const isProfit = amount >= 0;
          const barWidth = Math.abs(amount) * scaleFactor;
          const barColor = isProfit ? '#81C784' : '#E57373'; // เขียว: กำไร, แดง: ขาดทุน
          const displayAmount = isProfit ? `+${fmt(amount)}` : fmt(amount);
          
          return (
            <View key={index} style={styles.barItem}>
              <Text style={styles.barItemTitle}>{item.plant_name || "ไม่ระบุ"}</Text>
              
              <View style={styles.barVisuals}>
                {/* Visual Bar */}
                <View style={[styles.barVisual, { 
                  width: barWidth, 
                  backgroundColor: barColor,
                }]} />
                
                {/* Value Label */}
                <Text style={[styles.barItemAmount, { color: barColor }]}>
                  {displayAmount} บ.
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  };
  
  // ------------------------------------------------------
  // ฟังก์ชัน Render กราฟวงกลมและ Legend (สำหรับ Tab รายได้/ค่าใช้จ่าย)
  // ------------------------------------------------------
  const renderDonutChartAndLegend = (data) => {
    const BAR_COLORS = ["#FFC107", "#2196F3", "#4CAF50", "#FF5722", "#9C27B0", "#795548", "#607D8B"];
    
    // สำหรับ Income/Expense เราคำนวณจากยอดรวม
    const total = data.reduce((sum, item) => sum + Math.abs(parseFloat(item.amount)), 0);
    
    const chartData = data.map((item, index) => ({
      name: item.plant_name || "ไม่ระบุ",
      amount: Math.abs(parseFloat(item.amount)),
      percentage: total > 0 
        ? ((Math.abs(parseFloat(item.amount)) / total) * 100).toFixed(1) 
        : 0,
      color: BAR_COLORS[index % BAR_COLORS.length]
    }));

    if (chartData.length === 0 || total === 0) {
      return <Text style={styles.noDataText}>ไม่มีข้อมูล</Text>;
    }

    return (
      <View style={styles.chartRow}>
        {/* กราฟวงกลม */}
        {chartData.length > 0 && (
          <View style={styles.chartWrapper}>
            <DonutChart size={130} strokeWidth={20} data={chartData} />
          </View>
        )}

        {/* Legend (รายการข้อมูล) */}
        <View style={styles.legendContainer}>
          {chartData.map((p, index) => (
            <View key={`chart-${index}`} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: p.color }]} />
              <View style={styles.legendTextContainer}>
                <Text style={styles.legendTitle}>{p.name}</Text>
                <Text style={styles.legendSubtitle}>
                  {p.percentage}% ({fmt(p.amount)} บ.)
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.tabContainer}>
        {["expense", "income", "profit"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={activeTab === tab ? styles.tabActive : styles.tab}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={activeTab === tab ? styles.tabActiveText : styles.tabText}>
              {tab === 'expense' ? 'ค่าใช้จ่าย' : tab === 'income' ? 'รายได้' : 'กำไร/ขาดทุน'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ minHeight: 150, paddingVertical: 5 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#84a58b" />
        ) : (
          <>
            {/* 💡 ถ้าเป็น Tab 'กำไร' ให้ใช้ Bar Chart */}
            {activeTab === "profit" ? (
              renderHorizontalBarChart(profitData)
            ) : (
              /* ถ้าเป็น Tab อื่น ให้ใช้ Donut Chart */
              activeTab === "expense" ? (
                renderDonutChartAndLegend(expenseData)
              ) : (
                renderDonutChartAndLegend(incomeData)
              )
            )}
          </>
        )}
      </View>
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
            <Text style={styles.plotButtonText}>
              {plot.name ?? plot.plot_name}
            </Text>
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
  const { plots, setPlots } = usePlots();
  const [selectedPlotId, setSelectedPlotId] = useState(null);
  const [selectedPlotName, setSelectedPlotName] = useState("");
  const [predictedYield, setPredictedYield] = useState(null);

  const [summary, setSummary] = useState({
    income_total: 0,
    expense_total: 0,
    profit_total: 0,
  });
  const [reloadSignal, setReloadSignal] = useState(0);

  const loadSummary = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/dashboard/summary?user_id=${user.user_id}`
      );
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

      // ⭐ ตั้งค่าแปลงแรกเป็นค่าเริ่ม
      if (formatted.length > 0) {
        setSelectedPlotId(formatted[0].id);
        setSelectedPlotName(formatted[0].name);
        // loadPredictedYield(formatted[0].id); // โหลดผลผลิตทันที
      }
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

  const loadPredictedYield = async (plotId) => {
    if (!plotId) return;

    console.log("LOAD PREDICT -> plotId:", plotId);

    // reset ก่อนเพื่อไม่ให้แสดงค่าของ plot เดิม
    // setPredictedYield(null);

    try {
      const res = await axios.get(`${API_URL}/predict-yield/${plotId}`);
      console.log("PREDICT RES:", res.data);

      if (res.data.ok) {
        setPredictedYield(res.data.predictedYieldKg);
      } else {
        setPredictedYield(null);
      }
    } catch (err) {
      console.log("predict error", err);
    }
  };

  useEffect(() => {
    if (selectedPlotId) {
      loadPredictedYield(selectedPlotId);
    }
  }, [selectedPlotId]);

  return (
    <View style={styles.screenContainer}>
      <Header />
      <ScrollView>
        <NetProfitCard
          income={summary.income_total}
          expense={summary.expense_total}
          profit={summary.profit_total}
        />

        {/* 🔽 เลือกแปลงที่ต้องการดูผลผลิต */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ paddingHorizontal: 15, marginTop: 10 }}
        >
          {plots.map((plot) => (
            <TouchableOpacity
              key={`${plot.id}-${plot.name}`}
              onPress={() => {
                setSelectedPlotId(plot.id);
                setSelectedPlotName(plot.name);
                // loadPredictedYield(plot.id);
              }}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 18,
                backgroundColor:
                  selectedPlotId === plot.id ? "#84a58b" : "white",
                borderRadius: 20,
                borderWidth: 1,
                borderColor: "#ddd",
                marginRight: 10,
              }}
            >
              <Text
                style={{
                  color: selectedPlotId === plot.id ? "white" : "#555",
                  fontWeight: "600",
                }}
              >
                {plot.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <PredictedYieldCard
          yieldKg={predictedYield}
          plotName={selectedPlotName}
          plotId={selectedPlotId}
          onUpdated={() => loadPredictedYield(selectedPlotId)}
        />

        <AnalyticsCard reloadSignal={reloadSignal} />
        <MyPlotsSection />
        <View style={{ height: 100 }} />
      </ScrollView>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AddTransaction")}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

// ========================================================
// Styles (มีการเพิ่ม Styles สำหรับ Bar Chart)
// ========================================================
const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: "#F4F7F2" },

  // Card
  card: {
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 10,
    backgroundColor: "white",
    borderRadius: 12,
    elevation: 2,
  },
  cardTitle: { fontSize: 16, color: "grey", marginBottom: 5 },
  profitText: { fontSize: 32, fontWeight: "bold", marginBottom: 15 },

  // Rows
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  // Text Stats
  subText: { color: "grey", fontSize: 14 },
  incomeText: { color: "#84a58b", fontSize: 16, fontWeight: "bold" },
  expenseText: { color: "#e57373", fontSize: 16, fontWeight: "bold" },

  // Tabs
  tabContainer: {
    flexDirection: "row",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  tab: { paddingVertical: 10, paddingHorizontal: 15, marginRight: 10 },
  tabText: { color: "grey", fontSize: 16 },
  tabActive: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 3,
    borderBottomColor: "#84a58b",
    marginRight: 10,
  },
  tabActiveText: { color: "#333", fontWeight: "bold", fontSize: 16 },
  
  // Chart & Legend Layout (สำหรับ Donut Chart)
  chartRow: { 
    flexDirection: "row", 
    alignItems: "flex-start", 
    minHeight: 150,
    paddingVertical: 5,
  },
  chartWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
    paddingTop: 10, 
  },
  legendContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
    marginTop: 4 
  },
  legendTextContainer: {
    flex: 1,
  },
  legendTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
    flexWrap: 'wrap', 
  },
  legendSubtitle: {
    fontSize: 13,
    color: "#666",
  },
  noDataText: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    color: "grey",
    marginTop: 20,
  },

  // ⭐ New Styles for Horizontal Bar Chart (for Profit Tab)
  barChartContainer: {
    paddingHorizontal: 10,
  },
  barItem: {
    marginBottom: 15,
  },
  barItemTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  barVisuals: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  barVisual: {
    height: 15,
    borderRadius: 4,
    marginRight: 10,
  },
  barItemAmount: {
    fontSize: 15,
    fontWeight: 'bold',
  },

  // Sections
  section: { paddingHorizontal: 15, marginTop: 15 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  addPlotText: { color: "#84a58b", fontWeight: "bold", fontSize: 15 },

  // Grid
  plotGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
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
    justifyContent: "center",
  },
  plotButtonText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },

  // FAB
  fab: {
    position: "absolute",
    right: 25,
    bottom: 25,
    width: 60,
    height: 60,
    backgroundColor: "#84a58b",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabText: { color: "white", fontSize: 30, lineHeight: 32 },
});