import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import axios from "axios";

const API_URL = "http://localhost:3005/api";

export default function AddYieldScreen({ navigation, route }) {
  const { plotId } = route.params;
  const [year, setYear] = useState("");
  const [yieldKg, setYieldKg] = useState("");

  const handleSubmit = async () => {
    if (!year || !yieldKg) {
      Alert.alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    try {
      await axios.post(`${API_URL}/yield-history`, {
        plot_id: plotId,
        year: Number(year),
        yield_kg: Number(yieldKg),
      });

      Alert.alert("สำเร็จ", "บันทึกผลผลิตเรียบร้อยแล้ว");
      navigation.goBack();
    } catch (err) {
      console.log(err);
      Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถบันทึกได้");
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* หัวข้อ */}
        <Text style={styles.title}>เพิ่มผลผลิตย้อนหลัง</Text>

        {/* ฟอร์ม */}
        <View style={styles.card}>
          <Text style={styles.label}>ปี</Text>
          <TextInput
            style={styles.input}
            placeholder="เช่น 2024"
            keyboardType="numeric"
            value={year}
            onChangeText={setYear}
          />

          <Text style={styles.label}>ผลผลิต (กก.)</Text>
          <TextInput
            style={styles.input}
            placeholder="เช่น 3000"
            keyboardType="numeric"
            value={yieldKg}
            onChangeText={setYieldKg}
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>บันทึกผลผลิต</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F4F7F2",
  },
  scrollContent: {
    padding: 20,
  },

  // Title เหมือนหน้าอื่น
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#84a58b",
    marginBottom: 15,
    alignSelf: "center",
  },

  // การ์ดพื้นหลังเหมือนหน้าฟอร์มอื่นของคุณ
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#555",
  },

  input: {
    backgroundColor: "#f8f8f8",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#84a58b",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "600",
  },
});
