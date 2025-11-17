import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DropDownPicker from 'react-native-dropdown-picker';
import { usePlots } from '../context/PlotContext';
import { useAuth } from '../context/AuthContext';
import { createTransaction, getExpenseCategories, getIncomeCategories } from '../services/transaction.service';
import { getPlotsSummary } from '../services/summary.service';

const AddTransactionScreen = ({ navigation }) => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('expense');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date());

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryValue, setCategoryValue] = useState(null);
  const [categoryItems, setCategoryItems] = useState([]);

  const [plotOpen, setPlotOpen] = useState(false);
  const [plotValue, setPlotValue] = useState(null);
  const [plotItems, setPlotItems] = useState([]);

  // Date picker
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handleDateConfirm = (d) => {
    setDate(d);
    hideDatePicker();
  };

  const formatDate = (d) =>
    d.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  useEffect(() => {
    loadCategories();
    loadPlotItems();
  }, [activeTab]);

  const loadCategories = async () => {
    try {
      const data = activeTab === 'expense' 
        ? await getExpenseCategories() 
        : await getIncomeCategories();
      
      const items = data.data.map(cat => ({
        label: cat.name,
        value: cat.id
      }));
      
      setCategoryItems(items);
      if (items.length > 0) {
        setCategoryValue(items[0].value);
      }
    } catch (err) {
      console.log("Load categories error:", err);
    }
  };

  const loadPlotItems = async () => {
    try {
      const data = await getPlotsSummary(user.user_id);
      const list = [
        { label: "ไม่ระบุ", value: null },
        ...data.map((p) => ({
          label: p.plot_name,
          value: p.plot_id,
        }))
      ];
      setPlotItems(list);
    } catch (err) {
      console.log("Load plot items error:", err);
    }
  };

  const handleSave = async () => {
    try {
      if (!amount || parseFloat(amount) <= 0) {
        Alert.alert("ข้อมูลไม่ครบ", "กรุณากรอกจำนวนเงิน");
        return;
      }

      const payload = {
        user_id: user?.user_id,          
        plot_id: plotValue,
        category_id: categoryValue,
        amount: parseFloat(amount),
        note: notes,
        date: date.toISOString().split("T")[0],
      };

      await createTransaction(payload);
      Alert.alert("สำเร็จ", "บันทึกรายการเรียบร้อยแล้ว");
      navigation.goBack();
    } catch (err) {
      console.log("Save error:", err);
      Alert.alert("ผิดพลาด", "บันทึกรายการไม่สำเร็จ");
    }
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
            style={[styles.tabButton, activeTab === 'expense' && styles.tabActive]}
            onPress={() => setActiveTab('expense')}
          >
            <Text style={activeTab === 'expense' ? styles.tabActiveText : styles.tabText}>
              ค่าใช้จ่าย
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'income' && styles.tabActive]}
            onPress={() => setActiveTab('income')}
          >
            <Text style={activeTab === 'income' ? styles.tabActiveText : styles.tabText}>
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
            style={styles.dropdown}
            containerStyle={styles.dropdownContainer}
            onOpen={() => setPlotOpen(false)}
            zIndex={3000}
          />

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
            onOpen={() => setCategoryOpen(false)}
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

  // Tabs
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
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },

  tabActive: {
    backgroundColor: '#84a58b',
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

  // Form
  form: { width: '100%' },

  inputLabel: { marginTop: 10, marginBottom: 5, color: 'grey', fontSize: 14 },

  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
    fontSize: 16,
    marginBottom: 10
  },

  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
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

