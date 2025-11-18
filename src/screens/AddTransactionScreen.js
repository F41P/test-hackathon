import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DropDownPicker from "react-native-dropdown-picker";

import { usePlots } from "../context/PlotContext";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const API_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:3005/api"
    : "http://localhost:3005/api";

const AddTransactionScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { plots } = usePlots();

  const [activeTab, setActiveTab] = useState("expense");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(new Date());

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [allCategories, setAllCategories] = useState({ expense: [], income: [] });

  // Dropdown — Category
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryValue, setCategoryValue] = useState(null);
  const [categoryItems, setCategoryItems] = useState([]);

  // Dropdown — Plot
  const [plotOpen, setPlotOpen] = useState(false);
  const [plotValue, setPlotValue] = useState(null);
  const [plotItems, setPlotItems] = useState([
    { label: "ไม่ระบุ", value: null },
    ...plots.map((p) => ({ label: p.name, value: p.id })),
  ]);

  // Date picker
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const formatDate = (d) =>
    d.toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await axios.get(`${API_URL}/transactions/categories`);
        
        // สมมติ: type_id 1=expense, 2=income (ปรับตาม DB จริงของคุณ)
        const expenses = res.data
          .filter(c => c.type_id === 1) // เช็ค DB ว่าใช้เลขนี้จริงไหม
          .map(c => ({ label: c.name, value: c.id }));
        
        const incomes = res.data
          .filter(c => c.type_id === 2)
          .map(c => ({ label: c.name, value: c.id }));

        setAllCategories({ expense: expenses, income: incomes });
        setCategoryItems(expenses);
        if (expenses.length > 0) setCategoryValue(expenses[0].value);

      } catch (err) {
        console.log("Load categories error:", err);
      } finally {
        setLoadingCategories(false);
      }
    };
    loadCategories();
  }, []);

  const handleSave = async () => {
    try {
      const numericAmount = parseFloat(amount);
      if (isNaN(numericAmount) || numericAmount <= 0) {
        Alert.alert("ผิดพลาด", "กรุณากรอกจำนวนเงินให้ถูกต้อง");
        return;
      }
      if (!categoryValue) {
         Alert.alert("ผิดพลาด", "กรุณาเลือกหมวดหมู่");
        return;
      }

      const finalAmount = activeTab === "expense" ? -Math.abs(numericAmount) : Math.abs(numericAmount);

      const payload = {
        user_id: user?.user_id,
        plot_id: plotValue,
        category_id: categoryValue,
        amount: finalAmount,
        note: notes,
        date: date.toISOString().split("T")[0],
      };

      await axios.post(`${API_URL}/transactions`, payload);
      Alert.alert("สำเร็จ", "บันทึกรายการเรียบร้อยแล้ว");
      navigation.goBack();
    } catch (err) {
      console.log("Save error:", err);
      Alert.alert("ผิดพลาด", `บันทึกรายการไม่สำเร็จ`);
    }
  };

  useEffect(() => {
    if (user?.user_id) {
      loadPlotItems();
    }
  }, [user]);


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.innerContainer}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>{"<"}</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>เพิ่มรายการ</Text>
            <Text style={styles.subtitle}>บันทึกรายรับ-รายจ่าย</Text>
          </View>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "expense" && styles.tabActive]}
            onPress={() => {
              setActiveTab("expense");
              setCategoryItems(allCategories.expense);
              setCategoryValue(allCategories.expense[0]?.value || null);
            }}
          >
            <Text style={activeTab === "expense" ? styles.tabActiveText : styles.tabText}>ค่าใช้จ่าย</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === "income" && styles.tabActive]}
            onPress={() => {
              setActiveTab("income");
              setCategoryItems(allCategories.income);
              setCategoryValue(allCategories.income[0]?.value || null);
            }}
          >
            <Text style={activeTab === "income" ? styles.tabActiveText : styles.tabText}>รายได้</Text>
          </TouchableOpacity>
        </View>

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
          <TouchableOpacity style={styles.dateInput} onPress={() => setDatePickerVisibility(true)}>
            <Text style={styles.dateText}>{formatDate(date)}</Text>
            <Text>📅</Text>
          </TouchableOpacity>

          <Text style={styles.inputLabel}>หมวดหมู่</Text>
          {loadingCategories ? (
            <ActivityIndicator style={{height: 55}} />
          ) : (
            <DropDownPicker
              open={categoryOpen}
              value={categoryValue}
              items={categoryItems}
              setOpen={setCategoryOpen}
              setValue={setCategoryValue}
              setItems={setCategoryItems}
              listMode="SCROLLVIEW"
              style={styles.dropdown}
              containerStyle={styles.dropdownContainer}
              onOpen={() => { setPlotOpen(false); setCategoryOpen(true); }}
              zIndex={3000}
              placeholder="เลือกหมวดหมู่"
            />
          )}

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
            onOpen={() => { setCategoryOpen(false); setPlotOpen(true); }}
            zIndex={2000}
            placeholder="เลือกแปลง (ไม่บังคับ)"
          />

          <Text style={styles.inputLabel}>หมายเหตุ (ถ้ามี)</Text>
          <TextInput
            style={styles.input}
            placeholder="บันทึกรายละเอียดเพิ่มเติม..."
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>บันทึก</Text>
        </TouchableOpacity>
      </ScrollView>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={(d) => { setDate(d); setDatePickerVisibility(false); }}
        onCancel={() => setDatePickerVisibility(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  innerContainer: { flexGrow: 1, padding: 20, paddingBottom: 100 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  backButton: { fontSize: 28, color: "#333", marginRight: 15, fontWeight: "bold" },
  title: { fontSize: 24, fontWeight: "bold", color: "#84a58b" },
  subtitle: { fontSize: 16, color: "grey" },
  tabContainer: { flexDirection: "row", width: "100%", borderRadius: 12, backgroundColor: "#f0f0f0", padding: 5, marginBottom: 20 },
  tabButton: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: "center", backgroundColor: "white", borderWidth: 1, borderColor: "#f0f0f0" },
  tabActive: { backgroundColor: "#84a58b", borderColor: "#84a58b" },
  tabActiveText: { color: "white", fontWeight: "bold" },
  tabText: { color: "grey", fontWeight: "bold" },
  form: { width: "100%" },
  inputLabel: { marginTop: 10, marginBottom: 5, color: "grey", fontSize: 14 },
  input: { borderWidth: 1, borderColor: "#e0e0e0", backgroundColor: "#f5f5f5", borderRadius: 12, paddingHorizontal: 15, height: 55, fontSize: 16, marginBottom: 10 },
  dateInput: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 1, borderColor: "#e0e0e0", backgroundColor: "#f5f5f5", borderRadius: 12, paddingHorizontal: 15, height: 55, marginBottom: 10 },
  dateText: { fontSize: 16 },
  dropdown: { borderWidth: 1, borderColor: "#e0e0e0", backgroundColor: "#f5f5f5", borderRadius: 12 },
  dropdownContainer: { marginBottom: 10 },
  button: { backgroundColor: "#84a58b", padding: 15, borderRadius: 12, width: "100%", alignItems: "center", marginTop: 30 },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});


export default AddTransactionScreen;