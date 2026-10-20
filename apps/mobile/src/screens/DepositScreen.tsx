import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Wallet,
  Video,
  ArrowUpDown,
  ShoppingCart,
  Edit3,
  Repeat,
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { WhatsAppFAB } from '../components/WhatsAppFAB';
import { DEFAULT_QUOTA_PACKAGES, PRESET_USDT_AMOUNTS } from '../shared';
import { COLORS, SHADOWS } from '../theme';

export const DepositScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user, t, showDialog } = useApp();

  const [activeTab, setActiveTab] = useState<'INR' | 'USDT'>('INR');

  // INR Filters
  const [minFilter, setMinFilter] = useState('');
  const [maxFilter, setMaxFilter] = useState('');
  const [packages, setPackages] = useState(DEFAULT_QUOTA_PACKAGES);

  // USDT Form
  const [withdrawalAddress, setWithdrawalAddress] = useState('800'); // prefilled test from video
  const [selectedUsdtAmount, setSelectedUsdtAmount] = useState(10);
  const [customUsdtInput, setCustomUsdtInput] = useState('10');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const usdtRatio = 109;
  const currentUsdtAmount = Number(customUsdtInput) || selectedUsdtAmount;
  const calculatedInrAmount = currentUsdtAmount * usdtRatio;

  const handleSelectPreset = (amt: number) => {
    setSelectedUsdtAmount(amt);
    setCustomUsdtInput(amt.toString());
  };

  const handleBuyPackage = (pkg: any) => {
    showDialog('smile', `Order for ${pkg.rangeText} created!`);
  };

  const handleConfirmUsdtBuy = () => {
    if (!withdrawalAddress || withdrawalAddress.trim().length === 0) {
      showDialog('sad', 'Please enter the withdrawal wallet address.');
      return;
    }

    if (currentUsdtAmount < 10) {
      showDialog('sad', 'The recharge amount cannot be less than 10 USDT');
      return;
    }

    navigation.navigate('DepositUSDT', {
      amountUsdt: currentUsdtAmount,
      amountInr: calculatedInrAmount,
      withdrawalAddress: withdrawalAddress.trim(),
    });
  };

  return (
    <View style={styles.container}>
      {/* Top Segmented Tabs: INR & USDT */}
      <View style={styles.tabHeader}>
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

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* INR Tab Content */}
        {activeTab === 'INR' && (
          <View>
            {/* Mint Green Balance Card */}
            <View style={styles.balanceCard}>
              <View style={styles.balanceHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Wallet size={18} color={COLORS.primary} style={{ marginRight: 6 }} />
                  <Text style={styles.balanceTitle}>{t('balance')}</Text>
                </View>
                <Text style={styles.balanceAmount}>₹{user?.balance || 10}</Text>
              </View>

              <View style={styles.balanceSubGrid}>
                <View style={styles.balanceSubCol}>
                  <Text style={styles.balanceSubVal}>{user?.totalDeposit || 0}</Text>
                  <Text style={styles.balanceSubLbl}>{t('totalDeposit')}</Text>
                </View>
                <View style={styles.balanceSubCol}>
                  <Text style={styles.balanceSubVal}>{user?.todayDeposit || 0}</Text>
                  <Text style={styles.balanceSubLbl}>{t('todayDeposit')}</Text>
                </View>
                <View style={styles.balanceSubCol}>
                  <Text style={styles.balanceSubVal}>{user?.pendingDeposit || 0}</Text>
                  <Text style={styles.balanceSubLbl}>{t('pending')}</Text>
                </View>
              </View>
            </View>

            {/* How Buy Quota Link */}
            <TouchableOpacity
              onPress={() => navigation.navigate('CustomerService')}
              style={styles.howBuyRow}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Video size={16} color="#ef4444" style={{ marginRight: 6 }} />
                <Text style={styles.howBuyText}>{t('howBuyQuota')}</Text>
              </View>
              <Text style={{ color: '#94a3b8' }}>&gt;</Text>
            </TouchableOpacity>

            {/* Filter Bar */}
            <View style={styles.filterRow}>
              <View style={styles.filterInputs}>
                <TextInput
                  placeholder="Min"
                  value={minFilter}
                  onChangeText={setMinFilter}
                  style={styles.filterInput}
                  placeholderTextColor="#94a3b8"
                  keyboardType="numeric"
                />
                <Text style={styles.filterDash}>-</Text>
                <TextInput
                  placeholder="Max"
                  value={maxFilter}
                  onChangeText={setMaxFilter}
                  style={styles.filterInput}
                  placeholderTextColor="#94a3b8"
                  keyboardType="numeric"
                />
              </View>
              <TouchableOpacity style={styles.sortBtn}>
                <Text style={styles.sortBtnText}>{t('amount')}</Text>
                <ArrowUpDown size={14} color="#0f172a" style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            </View>

            {/* Packages List */}
            <View style={{ gap: 12 }}>
              {packages.map((pkg) => (
                <View key={pkg.id} style={styles.pkgCard}>
                  <View style={styles.pkgLeft}>
                    <Text style={styles.pkgTitle}>{pkg.rangeText}</Text>
                    <Text style={styles.pkgIncomeLabel}>Income:</Text>
                    <Text style={styles.pkgIncomeVal}>{pkg.incomeText}</Text>
                  </View>

                  <View style={styles.pkgRight}>
                    <Text style={styles.pkgCountBadge}>{pkg.stockCount}</Text>
                    <TouchableOpacity
                      onPress={() => handleBuyPackage(pkg)}
                      style={styles.pkgBuyBtn}
                    >
                      <ShoppingCart size={14} color="#ffffff" style={{ marginRight: 4 }} />
                      <Text style={styles.pkgBuyText}>{t('buy')}</Text>
                    </TouchableOpacity>
                    <Text style={styles.pkgQuotaText}>Quota +{pkg.quotaBonus.toFixed(2)}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* USDT Tab Content */}
        {activeTab === 'USDT' && (
          <View>
            {/* How Buy Quota Link */}
            <TouchableOpacity
              onPress={() => navigation.navigate('CustomerService')}
              style={styles.howBuyRow}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Video size={16} color="#ef4444" style={{ marginRight: 6 }} />
                <Text style={styles.howBuyText}>{t('howBuyQuota')}</Text>
              </View>
              <Text style={{ color: '#94a3b8' }}>&gt;</Text>
            </TouchableOpacity>

            {/* Withdrawal Address Input */}
            <View style={styles.usdtSection}>
              <Text style={styles.usdtSectionLabel}>{t('withdrawalAddress')}</Text>
              <View style={styles.addressInputRow}>
                <TextInput
                  style={styles.addressInput}
                  value={withdrawalAddress}
                  onChangeText={setWithdrawalAddress}
                  placeholder="Please enter withdrawal wallet address"
                  placeholderTextColor="#cbd5e1"
                />
                <Edit3 size={18} color="#94a3b8" />
              </View>
              <Text style={styles.redHintText}>{t('enterWithdrawalAddress')}</Text>
            </View>

            {/* Conversion Display Row */}
            <View style={styles.conversionRow}>
              <View style={styles.convBox}>
                <TextInput
                  style={styles.convInput}
                  keyboardType="numeric"
                  value={customUsdtInput}
                  onChangeText={(val) => {
                    setCustomUsdtInput(val);
                    setSelectedUsdtAmount(Number(val) || 0);
                  }}
                />
                <Text style={styles.convUnit}>USDT</Text>
              </View>

              <View style={styles.convArrow}>
                <Repeat size={18} color="#0f172a" />
              </View>

              <View style={styles.convBox}>
                <Text style={styles.convInrText}>{calculatedInrAmount}</Text>
                <Text style={styles.convUnit}>INR</Text>
              </View>
            </View>

            {/* Amount Presets Grid */}
            <View style={styles.presetsGrid}>
              {PRESET_USDT_AMOUNTS.map((amt) => {
                const isSelected = selectedUsdtAmount === amt;
                return (
                  <TouchableOpacity
                    key={amt}
                    onPress={() => handleSelectPreset(amt)}
                    style={[styles.presetChip, isSelected && styles.presetChipActive]}
                  >
                    <Text
                      style={[styles.presetChipText, isSelected && styles.presetChipTextActive]}
                    >
                      {amt}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.minAmountAlert}>The recharge amount cannot be less than 10 USDT</Text>

            {/* Conversion Details */}
            <View style={styles.usdtDetailsCard}>
              <Text style={styles.usdtDetailLine}>{t('usdtRatioLabel')}</Text>
              <Text style={styles.usdtDetailLine}>{t('extraBonus')}</Text>
              <Text style={styles.usdtDetailLine}>Total Bonus: {calculatedInrAmount} INR</Text>
            </View>

            {/* Arrival Tip */}
            <Text style={styles.arrivalTip}>{t('tipsRechargeArrival')}</Text>

            {/* Confirm Buy Button */}
            <TouchableOpacity
              onPress={handleConfirmUsdtBuy}
              disabled={isSubmitting}
              style={styles.confirmBuyBtn}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.confirmBuyBtnText}>{t('confirmBuy')}</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
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
  scrollContent: {
    padding: 14,
    paddingBottom: 90,
  },
  balanceCard: {
    backgroundColor: '#ebfbf4',
    borderWidth: 1,
    borderColor: '#c6f0df',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#c6f0df',
  },
  balanceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  balanceAmount: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  balanceSubGrid: {
    flexDirection: 'row',
    paddingTop: 12,
  },
  balanceSubCol: {
    flex: 1,
    alignItems: 'center',
  },
  balanceSubVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  balanceSubLbl: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  howBuyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    ...SHADOWS.card,
  },
  howBuyText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterInputs: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterInput: {
    width: 70,
    height: 36,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 18,
    textAlign: 'center',
    fontSize: 13,
    color: '#0f172a',
  },
  filterDash: {
    marginHorizontal: 8,
    color: '#94a3b8',
    fontWeight: '700',
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 18,
    paddingHorizontal: 12,
    height: 36,
  },
  sortBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },
  pkgCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    ...SHADOWS.card,
  },
  pkgLeft: {
    flex: 1,
  },
  pkgTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  pkgIncomeLabel: {
    fontSize: 11,
    color: '#64748b',
  },
  pkgIncomeVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 2,
  },
  pkgRight: {
    alignItems: 'flex-end',
  },
  pkgCountBadge: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.primary,
    marginBottom: 4,
  },
  pkgBuyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    marginBottom: 4,
  },
  pkgBuyText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  pkgQuotaText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0f172a',
  },
  usdtSection: {
    marginBottom: 16,
  },
  usdtSectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  addressInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    height: 48,
    ...SHADOWS.card,
  },
  addressInput: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
  },
  redHintText: {
    fontSize: 11,
    color: '#ef4444',
    marginTop: 6,
    fontStyle: 'italic',
  },
  conversionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  convBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    height: 48,
  },
  convInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  convInrText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  convUnit: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
  },
  convArrow: {
    paddingHorizontal: 10,
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  presetChip: {
    width: '22%',
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetChipActive: {
    backgroundColor: COLORS.primary,
  },
  presetChipText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  presetChipTextActive: {
    color: '#ffffff',
  },
  minAmountAlert: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '600',
    marginBottom: 14,
  },
  usdtDetailsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    ...SHADOWS.card,
  },
  usdtDetailLine: {
    fontSize: 13,
    color: '#334155',
    marginBottom: 4,
    fontWeight: '500',
  },
  arrivalTip: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
    marginBottom: 24,
  },
  confirmBuyBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.glow,
  },
  confirmBuyBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
