import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

// ดึง service จริงของคุณ
import { getPlotById, getRoundsByPlot } from "../services/plot.service";
import { getTransactions } from "../services/transaction.service";

const PlotDetailScreen = ({ navigation, route }) => {
  const plotId = route?.params?.plotId;
  const plotName = route?.params?.plotName || "ข้อมูลแปลง";

  const [loading, setLoading] = useState(true);
  const [plot, setPlot] = useState(null);
  const [round, setRound] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const nav = useNavigation();

  // ฟังก์ชัน format วันอย่างปลอดภัย
  const safeDate = (d) => (d ? String(d).slice(0, 10) : "-");

  useFocusEffect(
  useCallback(() => {
    let isActive = true;

    const load = async () => {
      try {
        // 1) ดึงข้อมูลแปลง
        const plotRes = await getPlotById(plotId);
        if (!isActive) return;
        setPlot(plotRes);

        // 2) ดึงรอบทั้งหมด
        const rounds = await getRoundsByPlot(plotId);
        if (Array.isArray(rounds) && rounds.length > 0) {
          const latest = rounds[rounds.length - 1];
          setRound(latest);

          // 3) ดึง transactions ของรอบล่าสุด
          const tx = await getTransactions(latest.round_id);
          if (isActive) setTransactions(tx);
        }

        setLoading(false);
      } catch (err) {
        console.log("Load plot detail error:", err);
      }
    };

    load();

    return () => { isActive = false; };
  }, [plotId])
);


  if (loading || !plot) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <ActivityIndicator size="large" color="#84a58b" />
        <Text>กำลังโหลดข้อมูล...</Text>
      </View>
    );
  }

  // สรุปรายรับ-รายจ่ายจริงตามข้อมูลจาก backend
  const incomeTotal = transactions
    .filter(tx => tx.amount > 0)
    .reduce((s, tx) => s + tx.amount, 0);

  const expenseTotal = transactions
    .filter(tx => tx.amount < 0)
    .reduce((s, tx) => s + Math.abs(tx.amount), 0);

  const format = (num) => new Intl.NumberFormat("th-TH").format(num);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>{"<"}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{plotName}</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Summary */}
        <View style={styles.summaryContainer}>
          <View style={[styles.summaryCard, styles.incomeCard]}>
            <Text style={styles.summaryLabel}>รายได้</Text>
            <Text style={styles.summaryAmount}>{format(incomeTotal)} บาท</Text>
          </View>

          <TouchableOpacity
            style={[styles.summaryCard, styles.expenseCard]}
            onPress={() => navigation.navigate("ExpenseDetail", { plotId })}
          >
            <Text style={styles.summaryLabel}>ค่าใช้จ่าย</Text>
            <Text style={styles.summaryAmount}>{format(expenseTotal)} บาท</Text>
          </TouchableOpacity>
        </View>

        {/* Plot info */}
        {round && (
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>ข้อมูลการปลูก</Text>

            <View style={styles.infoRow}>
              <Text>วันที่ปลูก</Text>
              <Text>{safeDate(round.start_date)}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text>วันที่เก็บเกี่ยว</Text>
              <Text>{safeDate(round.end_date)}</Text>
            </View>
          </View>
        )}

        {/* Transactions */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>ประวัติรายการ</Text>

          {transactions.length === 0 ? (
            <Text style={{ textAlign: "center", color: "grey" }}>
              ยังไม่มีรายการ
            </Text>
          ) : (
            transactions.map((tx) => (
              <View style={styles.historyItem} key={tx.transaction_id}>
                <View>
                  <Text style={styles.historyNote}>{tx.note}</Text>
                  <Text style={styles.historyDate}>{safeDate(tx.date)}</Text>
                </View>

                <Text
                  style={
                    tx.amount > 0 ? styles.historyIncome : styles.historyExpense
                  }
                >
                  {tx.amount > 0 ? "+" : "-"}
                  {format(Math.abs(tx.amount))}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Floating Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => nav.navigate("AddTransaction", { plotId })}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7F2' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  backButton: { fontSize: 28, color: '#333', fontWeight: 'bold' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#84a58b' },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 15,
  },
  summaryCard: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    margin: 5,
  },
  incomeCard: { backgroundColor: '#c8e6c9' },
  expenseCard: { backgroundColor: '#ffcdd2' },
  summaryLabel: { fontSize: 16, color: '#333' },
  summaryAmount: { fontSize: 22, fontWeight: 'bold', marginTop: 5 },
  infoSection: {
    backgroundColor: 'white',
    padding: 20,
    margin: 15,
    borderRadius: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  historyNote: { fontSize: 16, fontWeight: 'bold' },
  historyDate: { fontSize: 14, color: 'grey' },
  historyIncome: { fontSize: 16, color: 'green', fontWeight: 'bold' },
  historyExpense: { fontSize: 16, color: 'red', fontWeight: 'bold' },
  fab: {
    position: 'absolute',
    right: 25,
    bottom: 25,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#84a58b',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  fabText: { fontSize: 30, color: 'white', lineHeight: 34 }
});

export default PlotDetailScreen;
