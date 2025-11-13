import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DropDownPicker from 'react-native-dropdown-picker';
import { usePlots } from '../context/PlotContext';

const expenseCategories = [
  {label: 'ค่าปุ๋ย', value: 'ค่าปุ๋ย'},
  {label: 'ค่าแรงงาน', value: 'ค่าแรงงาน'},
  {label: 'ค่าเครื่องจักร', value: 'ค่าเครื่องจักร'},
  {label: 'ค่ายาฆ่าแมลง', value: 'ค่ายาฆ่าแมลง'},
  {label: 'ค่าเมล็ดพันธุ์', value: 'ค่าเมล็ดพันธุ์'},
];
const incomeCategories = [
  {label: 'ขายผลผลิต', value: 'ขายผลผลิต'},
  {label: 'ขายแปรรูป', value: 'ขายแปรรูป'},
  {label: 'อื่นๆ', value: 'อื่นๆ'},
];

const AddTransactionScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('expense'); 
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryValue, setCategoryValue] = useState(expenseCategories[0].value);
  const [categoryItems, setCategoryItems] = useState(expenseCategories);
  
  const { plots } = usePlots(); 
  const plotItemsList = [
    { label: 'ไม่ระบุ', value: 'ไม่ระบุ' },
    ...plots.map(plot => ({
      label: plot.name,
      value: plot.id,
    }))
  ];

  const [plotOpen, setPlotOpen] = useState(false);
  const [plotValue, setPlotValue] = useState('ไม่ระบุ');
  const [plotItems, setPlotItems] = useState(plotItemsList);
  
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handleDateConfirm = (selectedDate) => {
    setDate(selectedDate);
    hideDatePicker();
  };
  const formatDate = (date) => {
    return date.toLocaleString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const onCategoryOpen = () => {
    setPlotOpen(false); 
  };
  const onPlotOpen = () => {
    setCategoryOpen(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.innerContainer}
        keyboardShouldPersistTaps="handled"
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
            style={[styles.tabButton, activeTab === 'expense' ? styles.tabActiveExpense : {}]}
            onPress={() => {
              setActiveTab('expense');
              setCategoryItems(expenseCategories); 
              setCategoryValue(expenseCategories[0].value); 
            }}
          >
            <Text style={activeTab === 'expense' ? styles.tabActiveText : styles.tabText}>ค่าใช้จ่าย</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'income' ? styles.tabActiveIncome : {}]}
            onPress={() => {
              setActiveTab('income');
              setCategoryItems(incomeCategories); 
              setCategoryValue(incomeCategories[0].value); 
            }}
          >
            <Text style={activeTab === 'income' ? styles.tabActiveText : styles.tabText}>รายได้</Text>
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
            zIndex={2000} 
            zIndexInverse={1000}
            nestedScrollEnabled={true}
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
            onOpen={onPlotOpen} 
            zIndex={1000} 
            zIndexInverse={2000}
            nestedScrollEnabled={true}
          />

          <Text style={styles.inputLabel}>หมายเหตุ (ถ้ามี)</Text>
          <TextInput
            style={styles.input}
            placeholder="บันทึกรายละเอียดเพิ่มเติม..."
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        <TouchableOpacity style={styles.button}>
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
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  tabActiveExpense: { 
    backgroundColor: '#84a58b',
    borderColor: '#84a58b',
  },
  tabActiveIncome: { 
    backgroundColor: '#84a58b',
    borderColor: '#84a58b',
  },
  tabActiveText: { color: 'white', fontWeight: 'bold' },
  tabText: { color: 'grey', fontWeight: 'bold' },
  form: { 
    width: '100%', 
  }, 
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
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});

export default AddTransactionScreen;