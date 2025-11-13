import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const transactionHistory = [
  { id: 1, type: 'income', date: '25 ต.ค. 68', amount: '+32,XXX', note: 'ขายผลผลิต' },
  { id: 2, type: 'expense', date: '12 ต.ค. 68', amount: '-9,XXX', note: 'ค่าปุ๋ย' },
  { id: 3, type: 'expense', date: '10 ต.ค. 68', amount: '-7,XXX', note: 'ค่าแรงงาน' },
];

const PlotDetailScreen = ({ navigation, route }) => {
  const { plotName } = route.params;

  const fabNavigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>{"<"}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{plotName}</Text>
          <View style={{width: 60}} />
        </View>

        <View style={styles.summaryContainer}>
          <View style={[styles.summaryCard, styles.incomeCard]}>
            <Text style={styles.summaryLabel}>รายได้</Text>
            <Text style={styles.summaryAmount}>32,XXX บาท</Text>
          </View>
          <TouchableOpacity 
            style={[styles.summaryCard, styles.expenseCard]}
            onPress={() => navigation.navigate('ExpenseDetail', { plotName: plotName })}
          >
            <Text style={styles.summaryLabel}>ค่าใช้จ่าย</Text>
            <Text style={styles.summaryAmount}>28,XXX บาท</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>ข้อมูลการปลูก</Text>
          <View style={styles.infoRow}>
            <Text>วันที่ปลูก</Text>
            <Text>10 ต.ค. 68</Text>
          </View>
          <View style={styles.infoRow}>
            <Text>วันที่เก็บเกี่ยว</Text>
            <Text>25 ต.ค. 68</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>ประวัติรายการ</Text>
          {transactionHistory.map((item) => (
            <View style={styles.historyItem} key={item.id}>
              <View>
                <Text style={styles.historyNote}>{item.note}</Text>
                <Text style={styles.historyDate}>{item.date}</Text>
              </View>
              <Text style={item.type === 'income' ? styles.historyIncome : styles.historyExpense}>
                {item.amount}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => fabNavigation.navigate('AddTransaction')} // <--- ใช้ fabNavigation
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
  incomeCard: { backgroundColor: '#c8e6c9' }, // สีเขียวอ่อน
  expenseCard: { backgroundColor: '#ffcdd2' }, // สีแดงอ่อน
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