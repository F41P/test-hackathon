import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
} from "react-native";
import axios from "axios";

const API_URL = "http://localhost:3005/api";

export default function PredictedYieldCard({
  yieldKg,
  plotName,
  plotId,
  onUpdated,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [history, setHistory] = useState([]);

  // state สำหรับคำนวณเปรียบเทียบ
  const [lastYearYield, setLastYearYield] = useState(null);
  const [compareText, setCompareText] = useState("ยังไม่มีข้อมูลปีก่อน");

  // inline edit
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  // โหลดประวัติย้อนหลัง
  const loadHistory = async () => {
    try {
      const res = await axios.get(`${API_URL}/yield-history/${plotId}`);
      const h = res.data.history || [];

      setHistory(h);

      if (h.length > 0) {
        const latest = h[h.length - 1];
        setLastYearYield(latest.yield_kg);
      } else {
        setLastYearYield(null);
      }
    } catch (err) {
      console.log("loadHistory error", err);
    }
  };

  // โหลดทันทีเมื่อเปลี่ยน plotId
  useEffect(() => {
    if (plotId) loadHistory();
  }, [plotId]);

  const openModal = async () => {
    await loadHistory();
    setModalVisible(true);
  };

  // อัปเดต compareText realtime
  useEffect(() => {
    if (lastYearYield == null || yieldKg == null) {
      setCompareText("ยังไม่มีข้อมูลปีก่อน");
      return;
    }

    const diff = yieldKg - lastYearYield;
    const percent = ((diff / lastYearYield) * 100).toFixed(1);

    if (diff > 0)
      setCompareText(`↑ เพิ่มขึ้น ${diff} กก. (+${percent}%) จากปีก่อน`);
    else if (diff < 0)
      setCompareText(`↓ ลดลง ${Math.abs(diff)} กก. (${percent}%) จากปีก่อน`);
    else setCompareText("เท่ากับปีก่อน");
  }, [yieldKg, lastYearYield, history]);

  // ลบรายการ
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/yield-history/${id}`);
      await loadHistory();
      if (onUpdated) onUpdated();
    } catch (err) {
      console.log("Delete error:", err);
    }
  };

  // บันทึก inline edit
  const handleInlineUpdate = async (id) => {
    try {
      await axios.put(`${API_URL}/yield-history/${id}`, {
        yield_kg: Number(editValue),
      });

      setEditingId(null);
      setEditValue("");

      await loadHistory();
      if (onUpdated) onUpdated();
    } catch (err) {
      console.log("Update error:", err);
    }
  };

  if (!yieldKg) return null;

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.title}>ผลผลิตคาดการณ์</Text>

        <TouchableOpacity onPress={openModal}>
          <Text style={styles.infoButton}>ⓘ</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.plotName}>แปลง: {plotName}</Text>

      <Text style={styles.value}>{yieldKg.toLocaleString()} กก.</Text>

      <Text style={styles.compareText}>{compareText}</Text>

      <Text style={styles.sub}>
        ตัวเลขนี้ช่วยให้วางแผนรายได้ล่วงหน้า เช่นการขายผลผลิตล่วงหน้า
      </Text>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalWrap}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>ผลผลิตย้อนหลัง</Text>

            {history.length === 0 ? (
              <Text style={{ color: "grey" }}>ยังไม่มีข้อมูล</Text>
            ) : (
              history.map((item) => (
                <View key={item.id} style={styles.historyRow}>
                  {editingId === item.id ? (
                    <>
                      <Text style={styles.historyText}>ปี {item.year}:</Text>

                      <TextInput
                        style={styles.inlineInput}
                        keyboardType="numeric"
                        value={editValue}
                        onChangeText={setEditValue}
                      />

                      <Text style={styles.historyText}>กก.</Text>

                      <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity
                          style={styles.saveButtonSmall}
                          onPress={() => handleInlineUpdate(item.id)}
                        >
                          <Text style={styles.saveButtonTextSmall}>บันทึก</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.cancelButtonSmall}
                          onPress={() => {
                            setEditingId(null);
                            setEditValue("");
                          }}
                        >
                          <Text style={styles.cancelButtonTextSmall}>
                            ยกเลิก
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  ) : (
                    <>
                      <Text style={styles.historyText}>
                        ปี {item.year}: {item.yield_kg} กก.
                      </Text>

                      {/* ⭐ กลุ่มปุ่มชิดขวา */}
                      <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity
                          style={styles.editButton}
                          onPress={() => {
                            setEditingId(item.id);
                            setEditValue(String(item.yield_kg));
                          }}
                        >
                          <Text style={styles.editButtonText}>แก้ไข</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => handleDelete(item.id)}
                        >
                          <Text style={styles.deleteButtonText}>ลบ</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </View>
              ))
            )}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeText}>ปิด</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Text style={styles.sub}>* อ้างอิงจากข้อมูลย้อนหลัง</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    marginHorizontal: 15,
    marginVertical: 10,
    padding: 20,
    borderRadius: 12,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  title: { fontSize: 16, fontWeight: "bold" },
  plotName: { fontSize: 14, marginTop: 8, color: "#666" },
  value: { fontSize: 32, fontWeight: "bold", color: "#4b8b4b", marginTop: 5 },
  compareText: { fontSize: 14, color: "#555", marginTop: 5 },
  sub: { color: "#999", marginTop: 5 },
  infoButton: { fontSize: 22, color: "#84a58b" },

  modalWrap: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 20,
  },
  modalCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },

  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  historyText: { fontSize: 16 },

  editButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#84a58b",
    borderRadius: 6,
    marginLeft: 10,
  },
  editButtonText: { color: "white", fontWeight: "bold" },

  deleteButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#ff6b6b",
    borderRadius: 6,
    marginLeft: 6,
  },
  deleteButtonText: { color: "white", fontWeight: "bold" },

  inlineInput: {
    width: 70,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 5,
    marginHorizontal: 8,
    textAlign: "center",
    fontSize: 16,
  },

  saveButtonSmall: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 6,
  },
  saveButtonTextSmall: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },

  cancelButtonSmall: {
    backgroundColor: "#999",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 6,
  },
  cancelButtonTextSmall: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },

  closeButton: { marginTop: 20, alignSelf: "center" },
  closeText: { color: "#84a58b", fontSize: 16 },
});
