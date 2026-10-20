import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  User,
  Eye,
  EyeOff,
  Copy,
  RotateCw,
  Plus,
  Gift,
  ArrowDownCircle,
  ArrowUpCircle,
  FileText,
  Lock,
  Shield,
  Globe,
  Send,
  LogOut,
  Rocket,
  ChevronRight,
  ShoppingBag,
  CreditCard,
  ShoppingCart,
  Wallet,
} from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { useApp } from '../context/AppContext';
import { WhatsAppFAB } from '../components/WhatsAppFAB';
import { COLORS, SHADOWS } from '../theme';

export const AssetsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const {
    user,
    t,
    language,
    logout,
    refreshUserData,
    showDialog,
    setLanguageModalVisible,
    setChangePasswordVisible,
    setVersionModalVisible,
    triggerWarningModal,
  } = useApp();

  const [phoneMasked, setPhoneMasked] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshUserData();
    setRefreshing(false);
  };

  const handleCopyId = async () => {
    await Clipboard.setStringAsync(user?.userId || '113429');
    showDialog('smile', 'ID copied to clipboard');
  };

  const handleWithdrawalPress = () => {
    // Exact video flow at 04:12: when withdrawal pressed, shows abnormal warning dialog
    triggerWarningModal(
      '1. This order is abnormal.\n\n2. Please verify your UPI status and contact customer service promptly.\n\n⚠️ Note:\nFailure to respond in a timely manner will result in automatic order failure. Funds will not be credited, and any losses incurred shall be borne by yourself.'
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* User Profile Bar */}
        <View style={styles.userBar}>
          <View style={styles.userBarLeft}>
            <View style={styles.avatarCircle}>
              <User size={22} color="#94a3b8" />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.phoneText}>
                {phoneMasked ? user?.phoneMasked || '97*****8059' : user?.phone || '9794678059'}
              </Text>
              <TouchableOpacity
                onPress={() => setPhoneMasked(!phoneMasked)}
                style={{ marginLeft: 6, padding: 2 }}
              >
                {phoneMasked ? <EyeOff size={16} color="#94a3b8" /> : <Eye size={16} color="#94a3b8" />}
              </TouchableOpacity>
            </View>
          </View>

          {/* User ID with 1-tap Copy */}
          <TouchableOpacity onPress={handleCopyId} style={styles.idBox}>
            <Text style={styles.idText}>ID: {user?.userId || '113429'}</Text>
            <Copy size={13} color="#64748b" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>

        {/* Mint Green Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceTopRow}>
            <View>
              <Text style={styles.balanceLabel}>BALANCE</Text>
              <Text style={styles.balanceAmount}>₹{user?.balance || 10}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <TouchableOpacity onPress={onRefresh} style={styles.refreshIconBtn}>
                <RotateCw size={18} color="#0f172a" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('Deposit')}
                style={styles.addBalanceBtn}
              >
                <Plus size={14} color={COLORS.primary} style={{ marginRight: 2 }} />
                <Text style={styles.addBalanceText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 4 Financial Metrics in 2x2 Grid */}
        <View style={styles.metricsGrid}>
          {/* Card 1: Total Earnings */}
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>{t('totalEarnings')}</Text>
              <Wallet size={16} color="#0f172a" />
            </View>
            <Text style={styles.metricValue}>₹{user?.totalEarnings || 0}</Text>
          </View>

          {/* Card 2: Total Bonus */}
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>{t('totalBonus')}</Text>
              <Gift size={16} color="#ef4444" />
            </View>
            <Text style={styles.metricValue}>₹{user?.totalBonus || 10}</Text>
          </View>

          {/* Card 3: Total Deposit */}
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>{t('totalDeposit')}</Text>
              <ShoppingCart size={16} color={COLORS.primary} />
            </View>
            <Text style={styles.metricValue}>₹{user?.totalDeposit || 0}</Text>
            <View style={styles.badgesLine}>
              <View style={styles.pendingBadge}>
                <Text style={styles.badgeText}>0 {t('pending')}</Text>
              </View>
              <View style={styles.lockingBadge}>
                <Text style={styles.badgeText}>0 {t('locking')}</Text>
              </View>
            </View>
          </View>

          {/* Card 4: Total Withdrawal */}
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>{t('totalWithdrawalText')}</Text>
              <ShoppingBag size={16} color="#0284c7" />
            </View>
            <Text style={styles.metricValue}>₹{user?.totalWithdrawal || 0}</Text>
            <View style={styles.badgesLine}>
              <View style={styles.pendingBadge}>
                <Text style={styles.badgeText}>0 {t('pending')}</Text>
              </View>
              <View style={styles.lockingBadge}>
                <Text style={styles.badgeText}>0 {t('locking')}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Common Functions Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>{t('commonFunctions')}</Text>
          <View style={styles.commonGrid}>
            {/* Bonus */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Bonus')}
              style={styles.commonItem}
            >
              <View style={[styles.commonIconCircle, { backgroundColor: '#ecfdf5' }]}>
                <Gift size={22} color={COLORS.primary} />
                <View style={styles.commonNotificationBadge}>
                  <Text style={styles.badgeNum}>4</Text>
                </View>
              </View>
              <Text style={styles.commonItemText}>{t('bonus')}</Text>
            </TouchableOpacity>

            {/* Deposit */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Deposit')}
              style={styles.commonItem}
            >
              <View style={[styles.commonIconCircle, { backgroundColor: '#e0f2fe' }]}>
                <CreditCard size={22} color="#0284c7" />
              </View>
              <Text style={styles.commonItemText}>{t('deposit')}</Text>
            </TouchableOpacity>

            {/* Withdrawal */}
            <TouchableOpacity
              onPress={handleWithdrawalPress}
              style={styles.commonItem}
            >
              <View style={[styles.commonIconCircle, { backgroundColor: '#fef3c7' }]}>
                <Wallet size={22} color="#d97706" />
              </View>
              <Text style={styles.commonItemText}>{t('withdrawal')}</Text>
            </TouchableOpacity>

            {/* Bill History */}
            <TouchableOpacity
              onPress={() => navigation.navigate('BillHistory')}
              style={styles.commonItem}
            >
              <View style={[styles.commonIconCircle, { backgroundColor: '#f1f5f9' }]}>
                <FileText size={22} color="#475569" />
              </View>
              <Text style={styles.commonItemText}>{t('billHistory')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Items List */}
        <View style={styles.menuCard}>
          {/* Sublines (0) */}
          <TouchableOpacity
            onPress={() => navigation.navigate('SublineList')}
            style={styles.menuRow}
          >
            <View style={styles.menuLeft}>
              <View style={styles.menuIconBg}>
                <Users size={18} color="#475569" />
              </View>
              <Text style={styles.menuTitle}>{t('sublines')} (0)</Text>
            </View>
            <ChevronRight size={18} color="#cbd5e1" />
          </TouchableOpacity>

          {/* Telegram */}
          <TouchableOpacity
            onPress={() => showDialog('smile', 'Opening Telegram Channel...')}
            style={styles.menuRow}
          >
            <View style={styles.menuLeft}>
              <View style={styles.menuIconBg}>
                <Send size={18} color="#229ed9" />
              </View>
              <Text style={styles.menuTitle}>{t('telegram')}</Text>
            </View>
            <ChevronRight size={18} color="#cbd5e1" />
          </TouchableOpacity>

          {/* Language */}
          <TouchableOpacity
            onPress={() => setLanguageModalVisible(true)}
            style={styles.menuRow}
          >
            <View style={styles.menuLeft}>
              <View style={styles.menuIconBg}>
                <Globe size={18} color="#16a34a" />
              </View>
              <Text style={styles.menuTitle}>{t('language')}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.menuValueText}>
                {language === 'hi' ? 'हिन्दी' : 'English'}
              </Text>
              <ChevronRight size={18} color="#cbd5e1" />
            </View>
          </TouchableOpacity>

          {/* Password */}
          <TouchableOpacity
            onPress={() => setChangePasswordVisible(true)}
            style={styles.menuRow}
          >
            <View style={styles.menuLeft}>
              <View style={styles.menuIconBg}>
                <Lock size={18} color="#d97706" />
              </View>
              <Text style={styles.menuTitle}>{t('password')}</Text>
            </View>
            <ChevronRight size={18} color="#cbd5e1" />
          </TouchableOpacity>

          {/* Secondary Password */}
          <TouchableOpacity
            onPress={() =>
              showDialog('smile', 'Secondary password is set to default (2621)')
            }
            style={styles.menuRow}
          >
            <View style={styles.menuLeft}>
              <View style={styles.menuIconBg}>
                <Shield size={18} color="#0284c7" />
              </View>
              <Text style={styles.menuTitle}>{t('secondaryPassword')}</Text>
            </View>
            <ChevronRight size={18} color="#cbd5e1" />
          </TouchableOpacity>

          {/* Logout */}
          <TouchableOpacity onPress={logout} style={styles.menuRow}>
            <View style={styles.menuLeft}>
              <View style={styles.menuIconBg}>
                <LogOut size={18} color="#ef4444" />
              </View>
              <Text style={[styles.menuTitle, { color: '#ef4444' }]}>{t('logout')}</Text>
            </View>
            <ChevronRight size={18} color="#cbd5e1" />
          </TouchableOpacity>

          {/* Version */}
          <TouchableOpacity
            onPress={() => setVersionModalVisible(true)}
            style={[styles.menuRow, { borderBottomWidth: 0 }]}
          >
            <View style={styles.menuLeft}>
              <View style={styles.menuIconBg}>
                <Rocket size={18} color="#8b5cf6" />
              </View>
              <Text style={styles.menuTitle}>{t('version')}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.menuValueText}>1.0.32</Text>
              <ChevronRight size={18} color="#cbd5e1" />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

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
  scrollContent: {
    padding: 14,
    paddingBottom: 90,
  },
  userBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  userBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  phoneText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  idBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  idText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
  },
  balanceCard: {
    backgroundColor: '#ebfbf4',
    borderWidth: 1,
    borderColor: '#c6f0df',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  balanceTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    letterSpacing: 0.5,
  },
  balanceAmount: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0f172a',
    marginTop: 2,
  },
  refreshIconBtn: {
    padding: 8,
  },
  addBalanceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    ...SHADOWS.card,
  },
  addBalanceText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 14,
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    ...SHADOWS.card,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  badgesLine: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  pendingBadge: {
    backgroundColor: '#fef2f2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  lockingBadge: {
    backgroundColor: '#fef2f2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#ef4444',
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    ...SHADOWS.card,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 14,
  },
  commonGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  commonItem: {
    alignItems: 'center',
  },
  commonIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 6,
  },
  commonNotificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#ef4444',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeNum: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
  },
  commonItemText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#334155',
  },
  menuCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    ...SHADOWS.card,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconBg: {
    marginRight: 12,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  menuValueText: {
    fontSize: 13,
    color: '#94a3b8',
    marginRight: 4,
  },
});
