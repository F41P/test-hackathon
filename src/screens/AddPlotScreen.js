import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const AddPlotScreen = ({ navigation }) => {
  const [cropName, setCropName] = useState('');
  const [plotName, setPlotName] = useState('');
  const [areaSize, setAreaSize] = useState('');
  
  const [plantDate, setPlantDate] = useState(new Date()); 
  const [harvestDate, setHarvestDate] = useState(null); 

  const [isPlantDatePickerVisible, setPlantDatePickerVisibility] = useState(false);
  const [isHarvestDatePickerVisible, setHarvestDatePickerVisibility] = useState(false);

  const showPlantDatePicker = () => {
    setPlantDatePickerVisibility(true);
  };
  const hidePlantDatePicker = () => {
    setPlantDatePickerVisibility(false);
  };
  const handlePlantDateConfirm = (date) => {
    setPlantDate(date);
    hidePlantDatePicker();
  };

  const showHarvestDatePicker = () => {
    setHarvestDatePickerVisibility(true);
  };
  const hideHarvestDatePicker = () => {
    setHarvestDatePickerVisibility(false);
  };
  const handleHarvestDateConfirm = (date) => {
    setHarvestDate(date);
    hideHarvestDatePicker();
  };

  const formatDate = (date) => {
    if (!date) return 'เลือกวันที่ (ไม่บังคับ)';
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>{"<"}</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>เพิ่มแปลงใหม่</Text>
            <Text style={styles.subtitle}>บันทึกรายรับ-รายจ่าย</Text>
          </View>
        </View>
        
        <View style={styles.form}>
          <Text style={styles.inputLabel}>ชื่อพืชที่ปลูก</Text>
          <TextInput
            style={styles.input}
            placeholder="เช่น ข้าว, ข้าวโพด"
            value={cropName}
            onChangeText={setCropName}
          />

          <Text style={styles.inputLabel}>ชื่อแปลง/ตำแหน่ง</Text>
          <TextInput
            style={styles.input}
            placeholder="เช่น ทุ่งใหญ่, หลังบ้าน"
            value={plotName}
            onChangeText={setPlotName}
          />

          <Text style={styles.inputLabel}>ขนาดพื้นที่</Text>
          <TextInput
            style={styles.input}
            placeholder="เช่น 12 ไร่, 5 ไร่"
            value={areaSize}
            onChangeText={setAreaSize}
          />

          <Text style={styles.inputLabel}>วันที่ปลูก</Text>
          <TouchableOpacity 
            style={styles.dateInput} 
            onPress={showPlantDatePicker} 
          >
            <Text style={styles.dateText}>{formatDate(plantDate)}</Text>
            <Text></Text>
          </TouchableOpacity>

          <Text style={styles.inputLabel}>วันที่เก็บเกี่ยว</Text>
          <TouchableOpacity 
            style={styles.dateInput} 
            onPress={showHarvestDatePicker}
          >
            <Text style={styles.dateText}>{formatDate(harvestDate)}</Text>
            <Text></Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => { /* TODO: บันทึกข้อมูล (ยิง API) */ }}
        >
          <Text style={styles.buttonText}>บันทึก</Text>
        </TouchableOpacity>
      </View>

      <DateTimePickerModal
        isVisible={isPlantDatePickerVisible}
        mode="date"
        onConfirm={handlePlantDateConfirm}
        onCancel={hidePlantDatePicker}
      />
      <DateTimePickerModal
        isVisible={isHarvestDatePickerVisible}
        mode="date"
        onConfirm={handleHarvestDateConfirm}
        onCancel={hideHarvestDatePicker}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  innerContainer: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    fontSize: 28,
    color: '#333',
    marginRight: 15,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#84a58b', 
  },
  subtitle: {
    fontSize: 16,
    color: 'grey',
  },
  form: {
    width: '100%',
  },
  inputLabel: {
    marginTop: 15,
    marginBottom: 5,
    color: 'grey',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    width: '100%',
    paddingHorizontal: 15,
    height: 55,
    fontSize: 16,
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
  },
  dateText: {
    fontSize: 16,
  },
  button: {
    backgroundColor: '#84a58b', 
    padding: 15,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});


export default AddPlotScreen;