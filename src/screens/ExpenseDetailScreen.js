import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getRoundsByPlot } from '../services/plot.service';
import { getTransactions } from '../services/transaction.service';

const ExpenseDetailScreen = ({ navigation, route }) => {
  const { plotId, plotName } = route.params;
  const [loading, setLoading] = useState(true);
  const [expenseData, setExpenseData] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    loadExpenseData();
  }, [plotId]);

  const loadExpenseData = async () => {
    try {
      const rounds = await getRoundsByPlot(plotId);
      if (!rounds || rounds.length === 0) {
        setLoading(false);
        return;
      }

      const latestRound = rounds[rounds.length - 1];
      const transactions = await getTransactions(latestRound.round_id);
      
      const expenses = transactions.filter(tx => tx.amount < 0);
      const total = expenses.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
      
      const categoryMap = {};
      expenses.forEach(tx => {
        const catName = tx.transaction_category?.name || 'อื่นๆ';
        if (!categoryMap[catName]) {
          categoryMap[catName] = 0;
        }
        categoryMap[catName] += Math.abs(tx.amount);
      });

      const formatted = Object.entries(categoryMap).map(([name, amount], index) => ({
        id: index + 1,
        name,
        amount,
        percentage: total > 0 ? ((amount / total) * 100).toFixed(0) + '%' : '0%'
      }));

      formatted.sort((a, b) => b.amount - a.amount);

      setExpenseData(formatted);
      setTotalExpense(total);
      setLoading(false);
    } catch (err) {
      console.log("Load expense error:", err);
      setLoading(false);
    }
  };

  const formatNumber = (num) => new Intl.NumberFormat('th-TH').format(num);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F4F7F2' }}>
        <ActivityIndicator size="large" color="#84a58b" />
        <Text>กำลังโหลดข้อมูล...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* --- Header ที่สร้างเอง --- */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>{"<"}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{plotName}</Text>
          <View style={{width: 40}} />
        </View>

        <View style={styles.summaryContainer}>
          <View style={[styles.summaryCard, styles.expenseCard]}>
            <Text style={styles.summaryLabel}>ค่าใช้จ่าย</Text>
            <Text style={styles.summaryAmount}>{formatNumber(totalExpense)} บาท</Text>
          </View>
        </View>

        <View style={styles.chartContainer}>
          <View style={styles.chartPlaceholder} />
        </View>

        <View style={styles.listContainer}>
          {expenseData.length === 0 ? (
            <Text style={{ textAlign: 'center', color: 'grey', marginTop: 20 }}>
              ยังไม่มีรายการค่าใช้จ่าย
            </Text>
          ) : (
            expenseData.map((item) => (
              <View style={styles.listItem} key={item.id}>
                <View style={styles.itemLeft}>
                  <Text style={styles.itemPercentage}>{item.percentage}</Text>
                  <Text style={styles.itemName}>{item.name}</Text>
                </View>
                <Text style={styles.itemAmount}>{formatNumber(item.amount)} บาท</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Stylesheet (อิงจากในรูป)
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
    paddingHorizontal: 20,
  },
  summaryCard: {
    padding: 15,
    borderRadius: 12,
  },
  expenseCard: { backgroundColor: '#ffcdd2' }, // สีแดงอ่อน
  summaryLabel: { fontSize: 16, color: '#333' },
  summaryAmount: { fontSize: 22, fontWeight: 'bold', marginTop: 5 },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  chartPlaceholder: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'lightgrey',
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemPercentage: {
    fontSize: 14,
    color: 'grey',
    width: 50,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ExpenseDetailScreen;