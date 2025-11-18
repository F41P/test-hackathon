import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DropDownPicker from "react-native-dropdown-picker";
import axios from "axios";

// 1. นำเข้า AuthContext
import { useAuth } from "../context/AuthContext"; 

const API_URL = "http://localhost:3005/api/dashboard/plots";

const CompareScreen = ({ navigation, route }) => {
  // 2. ดึงข้อมูล user ที่ login อยู่จาก Context
  const { user } = useAuth();
  
  // ใช้ user_id ของคนที่ login อยู่
  const user_id = user?.user_id; 

  const [plotItems, setPlotItems] = useState([]);
  const [plotData, setPlotData] = useState({});
  const [plot1Value, setPlot1Value] = useState(null);
  const [plot2Value, setPlot2Value] = useState(null);

  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);

  const [loading, setLoading] = useState(true);

  // โหลดข้อมูลครั้งแรกเมื่อมี user_id
  useEffect(() => {
    if (user_id) {
      fetchPlotSummary();
    }
  }, [user_id]); // เพิ่ม dependency ให้ทำงานเมื่อ user_id พร้อม

  const fetchPlotSummary = async () => {
    try {
      setLoading(true);
      // ส่ง user_id ที่ได้จาก context ไปกับ request
      const res = await axios.get(API_URL, { params: { user_id } });

      const items = res.data.map((p) => ({
        label: p.plot_name,
        value: p.plot_id,
      }));

      const map = {};
      res.data.forEach((p) => {
        map[p.plot_id] = {
          name: p.plot_name,
          income: Number(p.income_total),
          expense: Number(p.expense_total),
          profit: Number(p.profit),
        };
      });

      setPlotItems(items);
      setPlotData(map);

      if (items.length >= 2) {
        setPlot1Value(items[0].value);
        setPlot2Value(items[1].value);
      } else if (items.length === 1) {
        setPlot1Value(items[0].value);
      }
    } catch (e) {
      // console.error(e);
      // alert("โหลดข้อมูลไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  const fmt = (n) => Number(n).toLocaleString();

  const data1 = plotData[plot1Value] || { income: 0, expense: 0, profit: 0 };
  const data2 = plotData[plot2Value] || { income: 0, expense: 0, profit: 0 };

  const chartHeight = 240;

  const values = [
    data1.income,
    data1.expense,
    data1.profit,
    data2.income,
    data2.expense,
    data2.profit,
  ];

  const maxVal = Math.max(...values, 0);
  const minVal = Math.min(...values, 0);
  const diff = maxVal - minVal;
  
  // ป้องกันการหารด้วย 0 กรณีข้อมูลเป็น 0 ทั้งหมด
  const scale = diff === 0 ? 1 : chartHeight / diff;

  // ระดับ baseline
  const baseY = diff === 0 ? chartHeight / 2 : (maxVal / diff) * chartHeight;

  const renderBar = (value, color) => {
    const height = Math.abs(value) * scale;
    const isPositive = value >= 0;
    const labelOffset = 16; 

    return (
      <View style={styles.barWrap}>
        {/* ตัวเลข */}
        <Text
          style={[
            styles.barValueLabel, // เปลี่ยนชื่อ style ไม่ให้ซ้ำกับด้านล่าง
            {
              top: isPositive ? baseY - height - labelOffset : baseY + height,
              color: value < 0 ? "#d9534f" : "#333",
            },
          ]}
        >
          {fmt(value)}
        </Text>

        {/* แท่งกราฟ */}
        <View
          style={[
            styles.bar,
            { backgroundColor: color },
            isPositive
              ? { height, top: baseY - height }
              : { height, top: baseY },
          ]}
        />
      </View>
    );
  };
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#84a58b" />
          <Text>กำลังโหลดข้อมูล...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        nestedScrollEnabled={true}
        scrollEnabled={!open1 && !open2}
        contentContainerStyle={{ padding: 20 }}
        onScrollBeginDrag={() => {
          setOpen1(false);
          setOpen2(false);
        }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.back}>{"<"}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>ข้อมูลเปรียบเทียบ</Text>
        </View>

        <Text style={styles.subtitle}>
          รายได้ ค่าใช้จ่าย กำไร ในแต่ละรอบการผลิต
        </Text>

        {/* DROPDOWN */}
        <View style={styles.row}>
          <View style={[styles.ddContainer, { zIndex: 3000 }]}>
            <DropDownPicker
              open={open1}
              value={plot1Value}
              setOpen={setOpen1}
              setValue={setPlot1Value}
              items={plotItems}
              placeholder="เลือกแปลง"
              style={styles.dd}
              dropDownContainerStyle={styles.ddDrop}
              onOpen={() => setOpen2(false)}
              listMode="SCROLLVIEW"
            />
          </View>

          <View style={[styles.ddContainer, { zIndex: 2000 }]}>
            <DropDownPicker
              open={open2}
              value={plot2Value}
              setOpen={setOpen2}
              setValue={setPlot2Value}
              items={plotItems}
              placeholder="เลือกแปลง"
              style={styles.dd}
              dropDownContainerStyle={styles.ddDrop}
              onOpen={() => setOpen1(false)}
              listMode="SCROLLVIEW"
            />
          </View>
        </View>

        {/* CHART */}
        <View style={styles.chartBox}>
          <View style={styles.chartArea}>
            {/* baseline */}
            <View style={[styles.baseline, { top: baseY }]} />

            {/* ชุดแปลง 1 */}
            <View style={styles.group}>
              {renderBar(data1.income, "#64B5F6")}
              {renderBar(data1.expense, "#E57373")}
              {renderBar(data1.profit, "#81C784")}
            </View>

            {/* ชุดแปลง 2 */}
            <View style={styles.group}>
              {renderBar(data2.income, "#64B5F6")}
              {renderBar(data2.expense, "#E57373")}
              {renderBar(data2.profit, "#81C784")}
            </View>
          </View>

          {/* Legend */}
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: "#64B5F6" }]} />
            <Text>รายได้</Text>

            <View style={[styles.legendDot, { backgroundColor: "#E57373" }]} />
            <Text>ค่าใช้จ่าย</Text>

            <View style={[styles.legendDot, { backgroundColor: "#81C784" }]} />
            <Text>กำไร</Text>
          </View>
        </View>

        {/* SUMMARY */}
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>ข้อสรุป และคำแนะนำเบื้องต้น</Text>

          <Text style={styles.summaryText}>
            • {data1.name || "แปลง 1"} ต้นทุน: {fmt(data1.expense)} บาท
          </Text>

          <Text style={styles.summaryText}>
            • {data2.name || "แปลง 2"} {data2.profit < 0 ? "ขาดทุน" : "ทำกำไร"}:{" "}
            {fmt(data2.profit)} บาท
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CompareScreen;

// ================== STYLES ==================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F7F2" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  back: { fontSize: 28, fontWeight: "bold", marginRight: 10 },
  title: { fontSize: 24, fontWeight: "bold", color: "#84a58b" },
  subtitle: { textAlign: "center", color: "grey", marginBottom: 20 },

  row: { flexDirection: "row", justifyContent: "space-between" },
  ddContainer: { width: "48%", marginBottom: 20 },
  dd: { backgroundColor: "#fff", borderColor: "#ddd" },
  ddDrop: { borderColor: "#ddd" },

  chartBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  chartArea: {
    height: 240,
    position: "relative",
    flexDirection: "row",
    justifyContent: "space-around",
  },

  baseline: {
    position: "absolute",
    width: "100%",
    height: 2,
    backgroundColor: "#bbb",
  },

  group: { flexDirection: "row", gap: 10 },
  barWrap: { width: 40, alignItems: "center" },

  bar: {
    width: 28,
    position: "absolute",
    borderRadius: 6,
  },

  barValueLabel: { // เปลี่ยนชื่อ class เพื่อความชัดเจน
    position: "absolute",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    width: 60, // เพิ่มความกว้างนิดหน่อยกันตกขอบ
    marginBottom: 3,
  },

  legendRow: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    alignItems: "center",
  },
  legendDot: { width: 12, height: 12, borderRadius: 6 },

  summaryBox: { backgroundColor: "#fff", padding: 15, borderRadius: 12 },
  summaryTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  summaryText: { fontSize: 15, marginBottom: 6 },
});
