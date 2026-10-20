import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Calendar, ChevronDown } from 'lucide-react-native';
import Svg, { Rect, Circle, Path } from 'react-native-svg';
import { useApp } from '../context/AppContext';
import { WhatsAppFAB } from '../components/WhatsAppFAB';
import { COLORS } from '../theme';

export const OrderHistoryScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t } = useApp();

  const [activeTab, setActiveTab] = useState<'INR' | 'USDT'>('USDT');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Segmented Tabs: INR & USDT */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          onPress={() => setActiveTab('INR')}
          style={[styles.tabBtn, activeTab === 'INR' && styles.tabBtnActive]}
        >
          <Text style={[styles.tabBtnText, activeTab === 'INR' && styles.tabBtnTextActive]}>
            INR
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('USDT')}
          style={[styles.tabBtn, activeTab === 'USDT' && styles.tabBtnActive]}
        >
          <Text style={[styles.tabBtnText, activeTab === 'USDT' && styles.tabBtnTextActive]}>
            USDT
          </Text>
        </TouchableOpacity>
      </View>

      {/* Date & Filter */}
      <View style={styles.filterBar}>
        <View style={styles.datePickerBtn}>
          <Text style={styles.datePickerText}>14/10/2026 - 20/10/2026</Text>
          <Calendar size={14} color="#64748b" style={{ marginLeft: 6 }} />
        </View>

        <TouchableOpacity style={styles.statusDropdownBtn}>
          <Text style={styles.statusDropdownText}>All</Text>
          <ChevronDown size={14} color="#64748b" style={{ marginLeft: 4 }} />
        </TouchableOpacity>
      </View>

      {/* Empty State */}
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconBox}>
          <Svg width={80} height={80} viewBox="0 0 24 24" fill="none">
            <Rect x="4" y="2" width="16" height="20" rx="3" stroke="#cbd5e1" strokeWidth="1.5" />
            <Path d="M8 7 H16" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
            <Path d="M8 11 H13" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
            <Circle cx="15" cy="15" r="3.5" stroke="#05c175" strokeWidth="1.5" />
            <Path d="M17.5 17.5 L20 20" stroke="#05c175" strokeWidth="1.5" strokeLinecap="round" />
          </Svg>
        </View>
        <Text style={styles.emptyText}>{t('noRecords')}</Text>
      </View>

      {/* Floating WhatsApp Action Button */}
      <WhatsAppFAB />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgMain,
  },
  header: {
    height: 56,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: {
    borderBottomColor: COLORS.primary,
  },
  tabBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94a3b8',
  },
  tabBtnTextActive: {
    color: COLORS.primary,
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  datePickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  datePickerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  statusDropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusDropdownText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
  },
  emptyIconBox: {
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '600',
  },
});
