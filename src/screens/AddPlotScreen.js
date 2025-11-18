import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DropDownPicker from "react-native-dropdown-picker";

import axios from "axios";
import { usePlots } from "../context/PlotContext";
import { useAuth } from "../context/AuthContext";

const API_URL =
  Platform.OS === "android" ? "http://10.0.2.2:3005" : "http://localhost:3005";

const AddPlotScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { addPlot } = usePlots();

  const [plotName, setPlotName] = useState("");
  const [areaSize, setAreaSize] = useState("");

  const [plantList, setPlantList] = useState([]);
  const [plantId, setPlantId] = useState(null);
  const [newPlantName, setNewPlantName] = useState("");

  const [open, setOpen] = useState(false);

  // 📌 วันที่ปลูก - วันที่เก็บเกี่ยว
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);

  const [isStartPickerVisible, setStartPickerVisible] = useState(false);
  const [isEndPickerVisible, setEndPickerVisible] = useState(false);

  // -----------------------------
  // Load Plants
  // -----------------------------
  useEffect(() => {
    loadPlants();
  }, []);

  const loadPlants = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/plants`, {
        params: { user_id: user.user_id },
      });

      const items = res.data.map((p) => ({
        label: p.plant_name,
        value: p.plant_id,
      }));

      items.push({ label: "+ เพิ่มพืชใหม่", value: 0 });
      setPlantList(items);
    } catch (err) {
      console.log("Load plants error:", err);
    }
  };

  const formatDate = (d) => {
    if (!d) return "เลือกวันที่ (ไม่บังคับ)";
    return d.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // -----------------------------
  // Save Plot
  // -----------------------------
  const handleSavePlot = async () => {
  try {
    let finalPlantId = plantId;

    // ถ้าเลือก "+ เพิ่มพืชใหม่"
    if (plantId === 0 && newPlantName.trim() !== "") {
      const newPlant = await axios.post(`${API_URL}/api/plants`, {
        user_id: user.user_id,
        plant_name: newPlantName.trim(),
      });

      finalPlantId = newPlant.data.plant_id; // ได้ plant_id ใหม่
    }

    const payload = {
      user_id: user.user_id,
      plot_name: plotName,
      area_size: areaSize || 0,
      plant_id: finalPlantId,
    };

    await addPlot(payload);
    navigation.goBack();

  } catch (err) {
    console.log("Add plot error:", err);
  }
};


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>{"<"}</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>เพิ่มแปลงใหม่</Text>
            <Text style={styles.subtitle}>บันทึกข้อมูลการเพาะปลูก</Text>
          </View>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.inputLabel}>เลือกพืชที่ปลูก</Text>

          <DropDownPicker
            open={open}
            value={plantId}
            items={plantList}
            setOpen={setOpen}
            setValue={setPlantId}
            setItems={setPlantList}
            placeholder="เลือกพืช"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
          />

          {/* ถ้าเลือก + เพิ่มพืชใหม่ */}
          {plantId === 0 && (
            <>
              <Text style={styles.inputLabel}>ชื่อพืชใหม่</Text>
              <TextInput
                style={styles.input}
                placeholder="เช่น มะม่วง, ทุเรียน"
                value={newPlantName}
                onChangeText={setNewPlantName}
              />
            </>
          )}

          <Text style={styles.inputLabel}>ชื่อแปลง</Text>
          <TextInput
            style={styles.input}
            placeholder="เช่น แปลงที่ 1"
            value={plotName}
            onChangeText={setPlotName}
          />

          <Text style={styles.inputLabel}>ขนาดพื้นที่ (ไร่)</Text>
          <TextInput
            style={styles.input}
            placeholder="เช่น 5"
            keyboardType="numeric"
            value={areaSize}
            onChangeText={setAreaSize}
          />

          {/* วันที่ปลูก */}
          <Text style={styles.inputLabel}>วันที่ปลูก</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setStartPickerVisible(true)}
          >
            <Text style={styles.dateText}>{formatDate(startDate)}</Text>
          </TouchableOpacity>

          {/* วันที่เก็บเกี่ยว */}
          <Text style={styles.inputLabel}>วันที่เก็บเกี่ยว</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setEndPickerVisible(true)}
          >
            <Text style={styles.dateText}>{formatDate(endDate)}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSavePlot}>
          <Text style={styles.buttonText}>บันทึกแปลง</Text>
        </TouchableOpacity>
      </View>

      {/* Date Pickers */}
      <DateTimePickerModal
        isVisible={isStartPickerVisible}
        mode="date"
        onConfirm={(d) => {
          setStartDate(d);
          setStartPickerVisible(false);
        }}
        onCancel={() => setStartPickerVisible(false)}
      />

      <DateTimePickerModal
        isVisible={isEndPickerVisible}
        mode="date"
        onConfirm={(d) => {
          setEndDate(d);
          setEndPickerVisible(false);
        }}
        onCancel={() => setEndPickerVisible(false)}
      />
    </SafeAreaView>
  );
};

export default AddPlotScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  innerContainer: { flex: 1, padding: 20 },

  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  backButton: { fontSize: 28, fontWeight: "bold", marginRight: 15 },
  title: { fontSize: 24, fontWeight: "bold", color: "#84a58b" },
  subtitle: { fontSize: 16, color: "grey" },

  form: { width: "100%" },

  inputLabel: { marginTop: 15, marginBottom: 5, color: "grey" },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
    fontSize: 16,
  },

  dropdown: {
    borderColor: "#ddd",
    backgroundColor: "#f5f5f5",
  },
  dropdownContainer: {
    borderColor: "#ddd",
  },

  dateInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
    justifyContent: "center",
  },
  dateText: {
    fontSize: 16,
  },

  button: {
    backgroundColor: "#84a58b",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: "auto",
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});
