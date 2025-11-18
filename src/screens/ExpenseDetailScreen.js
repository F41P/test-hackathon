import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  ActivityIndicator,
  Dimensions,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PieChart } from "react-native-chart-kit";
import axios from "axios";

const screenWidth = Dimensions.get("window").width;

const ExpenseDetailScreen = ({ navigation, route }) => {
  const { plotId, plotName } = route.params || {};

  const [loading, setLoading] = useState(true);
  const [totalExpense, setTotalExpense] = useState(0);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  // สีสำหรับ Pie Chart
  const chartColors = [
    "#FF6B6B", // แดง
    "#4ECDC4", // เขียวอมฟ้า
    "#45B7D1", // ฟ้า
    "#FFA07A", // ส้ม
    "#98D8C8", // เขียวอ่อน
    "#F7DC6F", // เหลือง
    "#BB8FCE", // ม่วง
    "#85C1E2", // ฟ้าอ่อน
  ];

  useEffect(() => {
    console.log("📦 Route params:", { plotId, plotName });

    if (!plotId) {
      setError("ไม่พบ plotId");
      setLoading(false);
      return;
    }

    loadExpense();
  }, [plotId]);

  const loadExpense = async () => {
    try {
      const API =
        Platform.OS === "android"
          ? "http://10.0.2.2:3005"
          : "http://localhost:3005";

      const url = `${API}/api/dashboard/plot-expense-detail/${plotId}`;

      console.log("🌐 Calling API:", url);

      const res = await axios.get(url);

      console.log("✅ Response:", res.data);

      setTotalExpense(res.data.total_expense || 0);
      setItems(res.data.details || []);
      setError(null);
    } catch (err) {
      console.error("❌ Load expense error:", err.response?.data || err.message);
      setError("ไม่สามารถโหลดข้อมูลได้");
    } finally {
      setLoading(false);
    }
  };

  const fmt = (n) => Number(n || 0).toLocaleString();

  // เตรียมข้อมูลสำหรับ Pie Chart
  const pieChartData = items.map((item, index) => ({
    name: item.name || "ไม่ระบุ",
    amount: Number(item.amount),
    color: chartColors[index % chartColors.length],
    legendFontColor: "#333",
    legendFontSize: 14,
  }));

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#84a58b" />
          <Text style={styles.loadingText}>กำลังโหลดข้อมูล...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setLoading(true);
              setError(null);
              loadExpense();
            }}
          >
            <Text style={styles.retryText}>ลองอีกครั้ง</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image 
              source={require('../assets/images/back_icon.png')} 
              style={{ width: 40, height: 40, tintColor: '#333', marginRight: 15 }} 
            />
          </TouchableOpacity>
          <Text style={styles.title}>{plotName || "รายละเอียดค่าใช้จ่าย"}</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* SUMMARY */}
        <View style={styles.summaryContainer}>
          <View style={[styles.summaryCard, styles.expenseCard]}>
            <Text style={styles.summaryLabel}>ค่าใช้จ่ายทั้งหมด</Text>
            <Text style={styles.summaryAmount}>{fmt(totalExpense)} บาท</Text>
          </View>
        </View>

        {/* PIE CHART */}
        {items.length > 0 && (
          <View style={styles.chartContainer}>
            <PieChart
              data={pieChartData}
              width={screenWidth - 40}
              height={220}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute // แสดงตัวเลขจริงแทน %
            />
          </View>
        )}

        {/* LIST */}
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>รายการค่าใช้จ่าย</Text>

          {items.length === 0 ? (
            <Text style={styles.emptyText}>ยังไม่มีรายการค่าใช้จ่าย</Text>
          ) : (
            items.map((item, index) => (
              <View style={styles.listItem} key={index}>
                <View style={styles.itemLeft}>
                  <View
                    style={[
                      styles.colorDot,
                      { backgroundColor: chartColors[index % chartColors.length] },
                    ]}
                  />
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name || "ไม่ระบุ"}</Text>
                    <Text style={styles.itemPercentage}>{item.percentage}%</Text>
                  </View>
                </View>
                <Text style={styles.itemAmount}>{fmt(item.amount)} บาท</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ExpenseDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7F2",
  },

  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },

  errorText: {
    fontSize: 16,
    color: "#d32f2f",
    textAlign: "center",
    marginBottom: 20,
  },

  retryButton: {
    backgroundColor: "#84a58b",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },

  retryText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },

  backButton: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#84a58b",
    flex: 1,
    textAlign: "center",
  },

  summaryContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  summaryCard: {
    padding: 20,
    borderRadius: 12,
  },

  expenseCard: {
    backgroundColor: "#ffcdd2",
  },

  summaryLabel: {
    fontSize: 16,
    color: "#333",
  },

  summaryAmount: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 8,
    color: "#333",
  },

  chartContainer: {
    alignItems: "center",
    marginVertical: 20,
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 12,
    paddingVertical: 20,
  },

  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },

  emptyText: {
    textAlign: "center",
    color: "#999",
    fontSize: 16,
    paddingVertical: 30,
  },

  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },

  itemInfo: {
    flex: 1,
  },

  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },

  itemPercentage: {
    fontSize: 13,
    color: "#666",
  },

  itemAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#d32f2f",
  },
});