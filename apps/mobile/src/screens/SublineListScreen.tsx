import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Search, FileText } from 'lucide-react-native';
import Svg, { Rect, Circle, Path } from 'react-native-svg';
import { useApp } from '../context/AppContext';
import { WhatsAppFAB } from '../components/WhatsAppFAB';
import { COLORS, SHADOWS } from '../theme';

export const SublineListScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t } = useApp();

  const [activeTab, setActiveTab] = useState<'A' | 'B'>('A');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Subline List</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tabs: Level A (0) & Level B (0) */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          onPress={() => setActiveTab('A')}
          style={[styles.tabBtn, activeTab === 'A' && styles.tabBtnActive]}
        >
          <Text style={[styles.tabBtnText, activeTab === 'A' && styles.tabBtnTextActive]}>
            Level A (0)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('B')}
          style={[styles.tabBtn, activeTab === 'B' && styles.tabBtnActive]}
        >
          <Text style={[styles.tabBtnText, activeTab === 'B' && styles.tabBtnTextActive]}>
            Level B (0)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchInputRow}>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="ID"
            placeholderTextColor="#94a3b8"
          />
          <Search size={18} color="#94a3b8" />
        </View>
      </View>

      {/* Total Count */}
      <Text style={styles.totalText}>Total : ₹0</Text>

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
  searchBarContainer: {
    padding: 14,
  },
  searchInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 22,
    paddingHorizontal: 16,
    height: 42,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    ...SHADOWS.card,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0f172a',
  },
  totalText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
    marginVertical: 12,
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
