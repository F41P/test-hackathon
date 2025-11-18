import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DropDownPicker from 'react-native-dropdown-picker';

// ----------------------------------------------------------------
// ⭐ [FIX] 1. Import hooks ที่ขาดไป
// ----------------------------------------------------------------
import { usePlots } from '../context/PlotContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { getCategories } from '../services/dashboard.service';

const AddTransactionScreen = ({ navigation }) => {
  // ----------------------------------------------------------------
  // ⭐ [FIX] 2. ดึง user และ plots จาก context
  // ----------------------------------------------------------------
  const { user } = useAuth();
  const { plots } = usePlots(); // (แม้จะไม่ได้ใช้ใน plotItemsList แต่ก็ควรดึงมา)

  const [activeTab, setActiveTab] = useState('expense'); 
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState(''); // ⭐ [FIX] 3. เพิ่ม state 'notes' ที่ขาดไป
  const [date, setDate] = useState(new Date());

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [allCategories, setAllCategories] = useState({ expense: [], income: [] });

  // Dropdown — Category
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryValue, setCategoryValue] = useState(null); 
  const [categoryItems, setCategoryItems] = useState([]); 

  // Dropdown — Plot
  const [plotOpen, setPlotOpen] = useState(false);
  // ⭐ [FIX] 4. ตั้งค่าเริ่มต้น 'plotValue' เป็น null ให้ตรงกับ 'ไม่ระบุ'
  const [plotValue, setPlotValue] = useState(null); 
  // ⭐ [FIX] 5. ตั้งค่าเริ่มต้น 'plotItems' ให้ถูกต้อง
  const [plotItems, setPlotItems] = useState([
    { label: 'ไม่ระบุ', value: null }
  ]);
  
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handleDateConfirm = (selectedDate) => {
    setDate(selectedDate);
    hideDatePicker();
  };
  const formatDate = (date) => {
    // (ใช้ .toLocaleDateString ดีกว่า .toLocaleString)
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const onCategoryOpen = () => setPlotOpen(false);
  const onPlotOpen = () => setCategoryOpen(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);
        const data = await getCategories(); 
        
        // ----------------------------------------------------------------
        // ⭐ [FIX] 6. แปลง data ให้เป็น { label, value }
        // ----------------------------------------------------------------
        const expense = data
          .filter(c => c.type === 'expense')
          .map(c => ({ label: c.name, value: c.id }));
        const income = data
          .filter(c => c.type === 'income')
          .map(c => ({ label: c.name, value: c.id }));

        setAllCategories({ expense, income });
        
        setCategoryItems(expense);
        if (expense.length > 0) {
          setCategoryValue(expense[0].value);
        }

      } catch (err) {
        console.log("Load categories error:", err);
        Alert.alert("ผิดพลาด", "ไม่สามารถโหลดข้อมูลหมวดหมู่ได้");
      } finally {
        setLoadingCategories(false);
      }
    };
    loadCategories();
  }, []);
  

  const handleSave = async () => {
    try {
      if (!categoryValue) {
        Alert.alert("ผิดพลาด", "กรุณาเลือกหมวดหมู่");
        return;
      }
        
      const numericAmount = parseFloat(amount);
      // ----------------------------------------------------------------
      // ⭐ [FIX] 7. เพิ่มการตรวจสอบจำนวนเงิน
      // ----------------------------------------------------------------
      if (isNaN(numericAmount) || numericAmount <= 0) {
        Alert.alert("ผิดพลาด", "กรุณากรอกจำนวนเงินให้ถูกต้อง");
        return;
      }
      
      const finalAmount =
        activeTab === "expense"
          ? -Math.abs(numericAmount)
          : Math.abs(numericAmount);

      const payload = {
        user_id: user?.user_id,          
        plot_id: plotValue, // (ส่ง null ไปได้เลยถ้าเป็น 'ไม่ระบุ')
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

      Alert.alert("ผิดพลาด", `บันทึกรายการไม่สำเร็จ: ${err.response?.data?.error || err.message}`);
    }
  };
  
  const loadPlotItems = async () => {
    if (!user?.user_id) return; // (เพิ่มการตรวจสอบ user)
    try {
      const API_URL =
        Platform.OS === "android"
          ? "http://10.0.2.2:3005/api"
          : "http://localhost:3005/api";

      const res = await axios.get(`${API_URL}/dashboard/plots?user_id=${user.user_id}`);

      const list = [
        { label: "ไม่ระบุ", value: null },
        ...res.data.map((p) => ({
          label: p.plot_name,
          value: p.plot_id,
        }))
      ];

      setPlotItems(list);
    } catch (err) {
      console.log("Load plot items error:", err);
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
        keyboardShouldPersistTaps="handled" // (ดีมากครับ)
        onScroll={() => { 
          setCategoryOpen(false);
          setPlotOpen(false);
        }}
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
            style={[
              styles.tabButton, 
              // ----------------------------------------------------------------
              // ⭐ [FIX] 8. อ้างอิง style ที่มีอยู่จริงใน styles
              // ----------------------------------------------------------------
              activeTab === 'expense' && styles.tabActive 
            ]}
            onPress={() => {
              setActiveTab('expense');
              setCategoryItems(allCategories.expense);
              if (allCategories.expense.length > 0) {
                setCategoryValue(allCategories.expense[0].value);
              }
            }}
          >
            <Text style={activeTab === 'expense' ? styles.tabActiveText : styles.tabText}>
              ค่าใช้จ่าย
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.tabButton, 
              activeTab === 'income' && styles.tabActive
            ]}
            onPress={() => {
              setActiveTab('income');
              setCategoryItems(allCategories.income);
              if (allCategories.income.length > 0) {
                setCategoryValue(allCategories.income[0].value);
              }
            }}
          >
            <Text style={activeTab === 'income' ? styles.tabActiveText : styles.tabText}>
              รายได้
            </Text>
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
          <TouchableOpacity style={styles.dateInput} onPress={showDatePicker}>
            <Text style={styles.dateText}>{formatDate(date)}</Text>
            <Text>🗓️</Text>
          </TouchableOpacity>

          <Text style={styles.inputLabel}>หมวดหมู่</Text>
          {loadingCategories ? (
            <ActivityIndicator style={{ height: 55 }} />
          ) : (
            <DropDownPicker
              open={categoryOpen}
              value={categoryValue}
              items={categoryItems}
              setOpen={setCategoryOpen}
              setValue={setCategoryValue}
              setItems={setCategoryItems}
              style={styles.dropdown}
              containerStyle={styles.dropdownContainer}
              onOpen={onCategoryOpen}
              zIndex={3000}
              placeholder="เลือกหมวดหมู่"
              listMode="SCROLLVIEW"
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
            style={styles.dropdown}
            containerStyle={styles.dropdownContainer}
            onOpen={() => {
              setCategoryOpen(false);
              loadPlotItems();   
            }}
            zIndex={2000}
            placeholder="เลือกแปลง"
            listMode="SCROLLVIEW"
          />

          <Text style={styles.inputLabel}>หมายเหตุ (ถ้ามี)</Text>
          <TextInput
            style={styles.input}
            placeholder="บันทึกรายละเอียดเพิ่มเติม..."
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        {/* ---------------------------------------------------------------- */}
        {/* ⭐ [FIX] 9. เพิ่ม onPress ให้ปุ่มบันทึก */}
        {/* ---------------------------------------------------------------- */}
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
  container: { flex: 1, backgroundColor: 'white' },
  innerContainer: { 
    flexGrow: 1, 
    padding: 20,
    paddingBottom: 100, 
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backButton: { fontSize: 28, color: '#333', marginRight: 15, fontWeight: 'bold' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#84a58b' },
  subtitle: { fontSize: 16, color: 'grey' },
  tabContainer: {
    flexDirection: 'row',
    width: '100%',
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    padding: 5,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    // (ลบ backgroundColor: 'white' และ border ออก)
  },
  // ----------------------------------------------------------------
  // ⭐ [FIX] 10. แก้ไข Style ให้สอดคล้องกับ JSX
  // (JSX อ้างอิง 'tabActive' ไม่ใช่ 'tabActiveExpense')
  // ----------------------------------------------------------------
  tabActive: {
    backgroundColor: '#84a58b', // (ใช้สีเขียวหลักตามที่ style block ระบุ)
    borderColor: '#84a58b',
  },
  tabActiveText: {
    color: 'white',
    fontWeight: 'bold',
  },
  tabText: {
    color: 'grey',
    fontWeight: 'bold',
  },
  form: { width: '100%' },
  inputLabel: { marginTop: 10, marginBottom: 5, color: 'grey', fontSize: 14 },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    width: '100%',
    paddingHorizontal: 15,
    height: 55,
    fontSize: 16,
    marginBottom: 10,
  },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    width: '100%',
    paddingHorizontal: 15,
    height: 55,
    marginBottom: 10, 
  },
  dateText: { fontSize: 16 },
  dropdown: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    height: 55,
  },
  dropdownContainer: {
    marginBottom: 10, 
  },
  button: {
    backgroundColor: '#84a58b',
    padding: 15,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginTop: 30, 
  },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});


export default AddTransactionScreen;