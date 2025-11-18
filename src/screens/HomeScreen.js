import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Header from "../components/Header";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import { usePlots } from "../context/PlotContext"; 
import { getPlots } from "../services/plot.service";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const API_URL = "http://localhost:3005/api";

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
const AnalyticsCard = ({ reloadSignal }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("expense");

  const [plantData, setPlantData] = useState([]);
  const [total, setTotal] = useState(0);

  const loadData = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/dashboard/expense-by-plant?user_id=${user.user_id}`
      );
      setPlantData(res.data.plants);
      setTotal(res.data.total_expense);
    } catch (err) {
      console.log("LOAD EXPENSE-BY-PLANT ERROR:", err);
    }
  };

  // โหลดใหม่ทุกครั้งที่ reloadSignal เปลี่ยนค่า
  useEffect(() => {
    loadData();
  }, [reloadSignal]);

  return (
    <View style={styles.card}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={activeTab === "expense" ? styles.tabActive : styles.tab}
          onPress={() => setActiveTab("expense")}
        >
          <Text style={activeTab === "expense" ? styles.tabActiveText : styles.tabText}>
            ค่าใช้จ่าย
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={activeTab === "income" ? styles.tabActive : styles.tab}
          onPress={() => setActiveTab("income")}
        >
          <Text style={activeTab === "income" ? styles.tabActiveText : styles.tabText}>
            รายได้
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={activeTab === "profit" ? styles.tabActive : styles.tab}
          onPress={() => setActiveTab("profit")}
        >
          <Text style={activeTab === "profit" ? styles.tabActiveText : styles.tabText}>
            กำไร
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.chartRow}>
        <View style={styles.chartPlaceholder} />
        <View style={styles.legendContainer}>
          {plantData.map((p, index) => (
            <Text key={index}>{p.plant_name} {p.percentage}%</Text>
          ))}
        </View>
      </View>

      <Text style={{ marginTop: 10, textAlign: "center", color: "grey" }}>
        รวมค่าใช้จ่ายทั้งหมด {total.toLocaleString()} บาท
      </Text>
    </View>
  );
};

// --------------------------------------------------------
//  Plot List Section
// --------------------------------------------------------
const MyPlotsSection = () => {
  const navigation = useNavigation();
  const { plots } = usePlots();

  return (
    <View style={styles.section}>
      <View style={styles.row}>
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
            <Text>{plot.name ?? plot.plot_name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// --------------------------------------------------------
//  Home Screen (โหลดข้อมูล real-time)
// --------------------------------------------------------
const HomeScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { setPlots } = usePlots();

  const [summary, setSummary] = useState({
    income_total: 0,
    expense_total: 0,
    profit_total: 0,
  });

  const [reloadSignal, setReloadSignal] = useState(0);

  // โหลดสรุปผล
  const loadSummary = async () => {
    try {
      const res = await axios.get(`${API_URL}/dashboard/summary?user_id=${user.user_id}`);
      setSummary(res.data);
    } catch (err) {
      console.log("Summary error:", err);
    }
  };

  // โหลดแปลงทั้งหมด
  const loadPlots = async () => {
    try {
      const res = await getPlots(user.user_id);
      const formatted = res.map((p) => ({ id: p.plot_id, name: p.plot_name }));
      setPlots(formatted);
    } catch (err) {
      console.log("Load plots error:", err);
    }
  };

  // โหลดทุกอย่าง—เรียกเมื่อกลับมาหน้า Home
  const reloadAll = async () => {
    await loadSummary();
    await loadPlots();
    setReloadSignal((prev) => prev + 1); // กระตุ้น AnalyticsCard ให้ reload
  };

  // refresh ทุกครั้งที่กลับมาหน้านี้
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

// --------------------------------------------------------
//   STYLE
// --------------------------------------------------------
const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: "#F4F7F2" },
  card: {
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 10,
    backgroundColor: "white",
    borderRadius: 12,
    elevation: 2,
  },
  cardTitle: { fontSize: 16, color: "grey" },
  profitText: { fontSize: 32, fontWeight: "bold", marginVertical: 10 },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },

  subText: { color: "grey", fontSize: 14 },
  incomeText: { color: "#84a58b", fontSize: 16, fontWeight: "bold" },
  expenseText: { color: "#e57373", fontSize: 16, fontWeight: "bold" },

  tabContainer: { flexDirection: "row", marginBottom: 15 },
  tab: { paddingVertical: 5, paddingHorizontal: 10 },
  tabText: { color: "grey" },
  tabActive: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#84a58b",
  },
  tabActiveText: { color: "#333", fontWeight: "bold" },

  chartRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    minHeight: 140,
  },
  chartPlaceholder: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "lightgrey",
  },
  legendContainer: { justifyContent: "center" },

  section: { paddingHorizontal: 15, marginTop: 10 },
  sectionTitle: { fontSize: 18, fontWeight: "bold" },

  addPlotText: { color: "#84a58b", fontWeight: "bold" },

  plotGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
  },
  plotButton: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "white",
    paddingVertical: 20,
    marginVertical: 5,
    width: "48%",
    borderRadius: 8,
    alignItems: "center",
  },

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
  },
  fabText: { color: "white", fontSize: 30 },
});
