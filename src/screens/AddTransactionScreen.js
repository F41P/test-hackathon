import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DropDownPicker from "react-native-dropdown-picker";

import { usePlots } from "../context/PlotContext";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const expenseCategories = [
  { label: "ค่าเมล็ดพันธุ์", value: 6 },
  { label: "ค่าปุ๋ย", value: 7 },
  { label: "ค่ายาฆ่าแมลง", value: 8 },
  { label: "ค่าเครื่องจักร", value: 9 },
  { label: "ค่าแรงงาน", value: 10 },
];

const incomeCategories = [
  { label: "ขายผลผลิต", value: 9 },
  { label: "ขายแปรรูป", value: 10 },
  // { label: 'อื่นๆ', value: 3 },
];

const AddTransactionScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { plots } = usePlots();

  const [activeTab, setActiveTab] = useState("expense");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(new Date());

  // Dropdown — Category
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryValue, setCategoryValue] = useState(
    expenseCategories[0].value
  );
  const [categoryItems, setCategoryItems] = useState(expenseCategories);

  // Dropdown — Plot
  const plotItemsList = [
    { label: "ไม่ระบุ", value: null },
    ...plots.map((p) => ({
      label: p.name,
      value: p.id,
    })),
  ];

  const [plotOpen, setPlotOpen] = useState(false);
  const [plotValue, setPlotValue] = useState(null);
  const [plotItems, setPlotItems] = useState(plotItemsList);

  // Date picker
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handleDateConfirm = (d) => {
    setDate(d);
    hideDatePicker();
  };

  const formatDate = (d) =>
    d.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  // ปิด dropdown ซ้อนทับ
  const onCategoryOpen = () => setPlotOpen(false);
  const onPlotOpen = () => setCategoryOpen(false);

  // ---------------------------------------
  // ⭐ SAVE TRANSACTION
  // ---------------------------------------
  const handleSave = async () => {
    try {
      const numericAmount = parseFloat(amount);
      const finalAmount =
        activeTab === "expense"
          ? -Math.abs(numericAmount)
          : Math.abs(numericAmount);

      const payload = {
        user_id: user?.user_id,
        plot_id: plotValue !== "ไม่ระบุ" ? plotValue : null,
        category_id: categoryValue,
        amount: finalAmount,
        note: notes,
        date: date.toISOString().split("T")[0],
      };

      console.log("POST payload:", payload);

      const API_URL =
        Platform.OS === "android"
          ? "http://10.0.2.2:3005/api"
          : "http://localhost:3005/api";

      const res = await axios.post(`${API_URL}/transactions`, payload);

      console.log("POST SUCCESS:", res.data);
      Alert.alert("สำเร็จ", "บันทึกรายการเรียบร้อยแล้ว");
      navigation.goBack();
    } catch (err) {
      console.log("Save error:", err);
      console.log("STATUS:", err.response?.status);
      console.log("DATA:", err.response?.data);

      Alert.alert(
        "ผิดพลาด",
        `บันทึกรายการไม่สำเร็จ: ${err.response?.data?.error || err.message}`
      );
    }
    // ⭐ โหลด plot real-time จาก API dashboard
    const loadPlotItems = async () => {
      try {
        const API_URL =
          Platform.OS === "android"
            ? "http://10.0.2.2:3005/api"
            : "http://localhost:3005/api";

        const res = await axios.get(
          `${API_URL}/dashboard/plots?user_id=${user.user_id}`
        );

        const list = [
          { label: "ไม่ระบุ", value: null },
          ...res.data.map((p) => ({
            label: p.plot_name,
            value: p.plot_id,
          })),
        ];

        setPlotItems(list);
      } catch (err) {
        console.log("Load plot items error:", err);
      }
    };

    // โหลดตอนเปิดหน้า
    useEffect(() => {
      loadPlotItems();
    }, []);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.innerContainer}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>{"<"}</Text>
          </TouchableOpacity>

          <View>
            <Text style={styles.title}>เพิ่มรายการ</Text>
            <Text style={styles.subtitle}>บันทึกรายรับ-รายจ่าย</Text>
          </View>
        </View>

        {/* TABS */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "expense" && styles.tabActive,
            ]}
            onPress={() => {
              setActiveTab("expense");
              setCategoryItems(expenseCategories);
              setCategoryValue(expenseCategories[0].value);
            }}
          >
            <Text
              style={
                activeTab === "expense" ? styles.tabActiveText : styles.tabText
              }
            >
              ค่าใช้จ่าย
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "income" && styles.tabActive,
            ]}
            onPress={() => {
              setActiveTab("income");
              setCategoryItems(incomeCategories);
              setCategoryValue(incomeCategories[0].value);
            }}
          >
            <Text
              style={
                activeTab === "income" ? styles.tabActiveText : styles.tabText
              }
            >
              รายได้
            </Text>
          </TouchableOpacity>
        </View>

        {/* FORM */}
        <View style={styles.form}>
          <Text style={styles.inputLabel}>จำนวนเงิน (บาท)</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          <Text style={styles.inputLabel}>วันที่ทำรายการ</Text>
          <TouchableOpacity style={styles.dateInput} onPress={showDatePicker}>
            <Text style={styles.dateText}>{formatDate(date)}</Text>
            <Text>📅</Text>
          </TouchableOpacity>

          {/* CATEGORY */}
          <Text style={styles.inputLabel}>หมวดหมู่</Text>
          <DropDownPicker
            open={categoryOpen}
            value={categoryValue}
            items={categoryItems}
            setOpen={setCategoryOpen}
            setValue={setCategoryValue}
            setItems={setCategoryItems}
            listMode="SCROLLVIEW" // ⭐ แก้บั๊ก VirtualizedList !!!
            style={styles.dropdown}
            containerStyle={styles.dropdownContainer}
            onOpen={onCategoryOpen}
            zIndex={3000}
          />

          {/* PLOT */}
          <Text style={styles.inputLabel}>แปลงที่เกี่ยวข้อง</Text>
          <DropDownPicker
            open={plotOpen}
            value={plotValue}
            items={plotItems}
            setOpen={setPlotOpen}
            setValue={setPlotValue}
            setItems={setPlotItems}
            listMode="SCROLLVIEW"
            style={styles.dropdown}
            containerStyle={styles.dropdownContainer}
            onOpen={() => {
              setCategoryOpen(false);
              loadPlotItems();
            }}
            zIndex={2000}
          />

          {/* NOTES */}
          <Text style={styles.inputLabel}>หมายเหตุ (ถ้ามี)</Text>
          <TextInput
            style={styles.input}
            placeholder="บันทึกรายละเอียดเพิ่มเติม..."
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        {/* SAVE BUTTON */}
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>บันทึก</Text>
        </TouchableOpacity>
      </ScrollView>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },

  innerContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 100,
  },

  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },

  backButton: {
    fontSize: 28,
    color: "#333",
    marginRight: 15,
    fontWeight: "bold",
  },

  title: { fontSize: 24, fontWeight: "bold", color: "#84a58b" },

  subtitle: { fontSize: 16, color: "grey" },

  // Tabs
  tabContainer: {
    flexDirection: "row",
    width: "100%",
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
    padding: 5,
    marginBottom: 20,
  },

  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },

  tabActive: {
    backgroundColor: "#84a58b",
    borderColor: "#84a58b",
  },

  tabActiveText: {
    color: "white",
    fontWeight: "bold",
  },

  tabText: {
    color: "grey",
    fontWeight: "bold",
  },

  // Form
  form: { width: "100%" },

  inputLabel: { marginTop: 10, marginBottom: 5, color: "grey", fontSize: 14 },

  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
    fontSize: 16,
    marginBottom: 10,
  },

  dateInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
    marginBottom: 10,
  },

  dateText: { fontSize: 16 },

  dropdown: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
  },

  dropdownContainer: {
    marginBottom: 10,
  },

  button: {
    backgroundColor: "#84a58b",
    padding: 15,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginTop: 30,
  },

  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});

export default AddTransactionScreen;
