import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Wallet, Plus, ShieldCheck, CheckCircle2 } from 'lucide-react-native';
import Svg, { Rect, Path } from 'react-native-svg';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { WhatsAppFAB } from '../components/WhatsAppFAB';
import { COLORS, SHADOWS } from '../theme';

export const ToolsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t, user } = useApp();

  const [activeTab, setActiveTab] = useState<'payin' | 'payout'>('payin');
  const [boundWallets, setBoundWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWallets();
  }, [user]);

  const fetchWallets = async () => {
    try {
      setLoading(true);
      const res = await api.getBoundWallets();
      if (res.wallets) setBoundWallets(res.wallets);
    } catch (e) {
      // offline fallback
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Segmented Tabs: Payin (Withdraw) & Payout (Deposit) */}
      <View style={styles.tabHeader}>
        <TouchableOpacity
          onPress={() => setActiveTab('payin')}
          style={[styles.tabBtn, activeTab === 'payin' && styles.tabBtnActive]}
        >
          <Text style={[styles.tabBtnText, activeTab === 'payin' && styles.tabBtnTextActive]}>
            {t('payinWithdraw')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('payout')}
          style={[styles.tabBtn, activeTab === 'payout' && styles.tabBtnActive]}
        >
          <Text style={[styles.tabBtnText, activeTab === 'payout' && styles.tabBtnTextActive]}>
            {t('payoutDeposit')}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchWallets} />}
      >
        {boundWallets.length === 0 ? (
          /* Empty state matching video precisely */
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBox}>
              <Svg width={90} height={90} viewBox="0 0 24 24" fill="none">
                <Rect
                  x="2"
                  y="4"
                  width="20"
                  height="16"
                  rx="3"
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                />
                <Path
                  d="M16 12 C 16 10.9, 16.9 10, 18 10 H 22 V 14 H 18 C 16.9 14, 16 13.1, 16 12 Z"
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                  fill="#ffffff"
                />
                <Path
                  d="M18.5 12 H 19"
                  stroke="#94a3b8"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </Svg>
            </View>
            <Text style={styles.emptyTitle}>{t('noWalletsAdded')}</Text>
            <Text style={styles.emptySub}>{t('addWalletToStart')}</Text>
          </View>
        ) : (
          /* List of bound wallets */
          <View style={{ gap: 12 }}>
            {boundWallets.map((w, idx) => (
              <View key={idx} style={styles.walletCard}>
                <View style={styles.walletCardLeft}>
                  <View style={styles.walletIconCircle}>
                    <Wallet size={20} color={COLORS.primary} />
                  </View>
                  <View>
                    <Text style={styles.walletCardName}>{w.providerName}</Text>
                    <Text style={styles.walletCardPhone}>{w.phoneNumber}</Text>
                  </View>
                </View>
                <View style={styles.activePill}>
                  <CheckCircle2 size={12} color={COLORS.primary} style={{ marginRight: 4 }} />
                  <Text style={styles.activePillText}>Active</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Floating "+Add" button on bottom right */}
      <TouchableOpacity
        onPress={() => navigation.navigate('WalletSelection')}
        style={styles.addBtn}
      >
        <Plus size={18} color="#ffffff" style={{ marginRight: 4 }} />
        <Text style={styles.addBtnText}>Add</Text>
      </TouchableOpacity>

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
  tabHeader: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingHorizontal: 20,
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
    fontSize: 15,
    fontWeight: '700',
    color: '#94a3b8',
  },
  tabBtnTextActive: {
    color: COLORS.primary,
  },
  content: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 90,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyIconBox: {
    marginBottom: 16,
    opacity: 0.8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 13,
    color: '#94a3b8',
  },
  walletCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    ...SHADOWS.card,
  },
  walletCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  walletCardName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  walletCardPhone: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  addBtn: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 24,
    ...SHADOWS.glow,
  },
  addBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
