import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";

const API_URL = "http://localhost:3005/api/yield-history";

const AddYield = ({ navigation, route }) => {
  const plotId = route.params?.plotId;

  const [year, setYear] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = async () => {
    if (!year || !amount) {
      Alert.alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    try {
      await axios.post(API_URL, {
        plot_id: plotId,
        year,
        yield_kg: Number(amount), 
      });

      Alert.alert("เพิ่มผลผลิตสำเร็จ");
      navigation.goBack();
    } catch (err) {
  console.log("AddYield error:", err.response?.data || err.message);
  Alert.alert("เกิดข้อผิดพลาด", err.response?.data?.message || "ไม่สามารถบันทึกข้อมูลได้");
}
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require("../assets/images/back_icon.png")}
              style={styles.backIcon}
            />
          </TouchableOpacity>

          <Text style={styles.title}>เพิ่มผลผลิตย้อนหลัง</Text>

          <View style={{ width: 40 }} />
        </View>

        {/* FORM CARD */}
        <View style={styles.formCard}>
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
            placeholder="เช่น 1500"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        {/* BUTTON */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>บันทึก</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddYield;

// ---------------- STYLE ----------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7F2",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  backIcon: {
    width: 32,
    height: 32,
    tintColor: "#333",
    marginRight: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#84a58b",
    flex: 1,
    textAlign: "center",
    marginRight: 40,
  },

  formCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },

  label: {
    fontSize: 16,
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#f7f7f7",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#e6e6e6",
  },

  submitButton: {
    backgroundColor: "#84a58b",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  submitText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
