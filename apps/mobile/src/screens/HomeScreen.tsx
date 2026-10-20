import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Volume2,
  Video,
  ChevronRight,
  HelpCircle,
  RotateCw,
  Gift,
  Send,
  CreditCard,
  Wallet,
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { WhatsAppFAB } from '../components/WhatsAppFAB';
import { COLORS, SHADOWS } from '../theme';

const { width } = Dimensions.get('window');

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const {
    user,
    t,
    refreshUserData,
    setRewardPromoVisible,
    setWarningModalVisible,
    triggerSecondaryVerification,
  } = useApp();

  const [refreshing, setRefreshing] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshUserData();
    setRefreshing(false);
  };

  const slides = [
    {
      id: 'slide_1',
      image: require('../../assets/banner_invite_reward.jpg'),
      title: '100+50 Reward',
      sub: 'Invite new users to finish 15 orders the same day Valid for 1 days; expires afterward',
      sub2: 'The invited person will also receive a reward of 50 for comp',
      btn: 'Invite Now',
      action: () => setRewardPromoVisible(true),
    },
    {
      id: 'slide_2',
      image: require('../../assets/banner_important_notice.jpg'),
      title: 'Important Notice',
      sub: 'You shall bear all losses arising from non-compliant operations, including but not limited to:',
      sub2: '• No points rewarded for Pay Out\n• Failed withdrawal for Pay In',
      btn: 'Go to Check',
      action: () => setWarningModalVisible(true),
    },
    {
      id: 'slide_3',
      image: require('../../assets/banner_payment_rewards.jpg'),
      title: 'Payment rewards',
      sub: 'Every successful purchase order will receive additional rewards and earn more.',
      sub2: 'Earn now with instant settlement',
      btn: 'Earn Now',
      action: () => navigation.navigate('Deposit'),
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Banner Carousel */}
        <View style={styles.carouselContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const slide = Math.round(e.nativeEvent.contentOffset.x / (width - 24));
              setActiveSlide(slide);
            }}
            scrollEventThrottle={16}
          >
            {slides.map((s) => (
              <View key={s.id} style={styles.slideCard}>
                <Image source={s.image} style={styles.slideImage} resizeMode="cover" />
                <View style={styles.slideOverlay}>
                  <Text style={styles.slideTitle}>{s.title}</Text>
                  <Text style={styles.slideSub} numberOfLines={2}>
                    {s.sub}
                  </Text>
                  <Text style={styles.slideSub2} numberOfLines={1}>
                    {s.sub2}
                  </Text>
                  <TouchableOpacity onPress={s.action} style={styles.slideBtn}>
                    <Text style={styles.slideBtnText}>{s.btn}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Carousel dots */}
          <View style={styles.dotsRow}>
            {slides.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, activeSlide === i && styles.dotActive]}
              />
            ))}
          </View>
        </View>

        {/* Megaphone Notice Bar */}
        <View style={styles.noticeBar}>
          <Volume2 size={16} color={COLORS.primary} style={{ marginRight: 8 }} />
          <Text style={styles.noticeText} numberOfLines={1}>
            transferred to your wallet, or contact our 24/7 customer service!
          </Text>
        </View>

        {/* USDT & INR Bonus Ratio Card */}
        <View style={styles.ratioCard}>
          <View style={styles.ratioColLeft}>
            <Text style={styles.ratioLabel}>USDT Ratio</Text>
            <Text style={styles.ratioValue}>1 USDT = 109 INR</Text>
            <Text style={styles.ratioBonus}>bonus ratio : 0</Text>
          </View>
          <View style={styles.ratioDivider} />
          <View style={styles.ratioColRight}>
            <Text style={styles.ratioLabel}>INR Bonus Ratio</Text>
            <Text style={styles.ratioLargeValue}>3.8%+3</Text>
          </View>
        </View>

        {/* Bind UPI Alert Banner (if not bound) */}
        {!user?.isUpiBound && (
          <View style={styles.bindAlertCard}>
            <Text style={styles.bindAlertText}>{t('notBoundUpi')}</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('WalletSelection')}
              style={styles.bindNowBtn}
            >
              <Text style={styles.bindNowBtnText}>{t('bindUpiNow')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Quick Stats Grid */}
        <View style={styles.statsCard}>
          <TouchableOpacity
            style={styles.howToUseRow}
            onPress={() => navigation.navigate('CustomerService')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Video size={16} color="#ef4444" style={{ marginRight: 6 }} />
              <Text style={styles.howToUseText}>{t('howToUseIpay')}</Text>
            </View>
            <ChevronRight size={16} color="#94a3b8" />
          </TouchableOpacity>

          <View style={styles.statsGrid}>
            <View style={styles.statCell}>
              <Text style={styles.statLabel}>{t('balance')}</Text>
              <View style={styles.statValRow}>
                <Text style={styles.statValBold}>{user?.balance || 10}</Text>
                <ChevronRight size={14} color="#cbd5e1" />
              </View>
            </View>

            <View style={styles.statCell}>
              <Text style={styles.statLabel}>{t('todayWithdrawal')}</Text>
              <View style={styles.statValRow}>
                <Text style={styles.statValBold}>{user?.todayWithdrawal || 0}</Text>
                <ChevronRight size={14} color="#cbd5e1" />
              </View>
            </View>

            <View style={styles.statCell}>
              <Text style={styles.statLabel}>{t('todayDeposit')}</Text>
              <View style={styles.statValRow}>
                <Text style={styles.statValBold}>{user?.todayDeposit || 0}</Text>
                <ChevronRight size={14} color="#cbd5e1" />
              </View>
            </View>

            <View style={styles.statCell}>
              <Text style={styles.statLabel}>{t('teamCommission')}</Text>
              <View style={styles.statValRow}>
                <Text style={styles.statValBold}>{user?.teamCommission || 0}</Text>
                <ChevronRight size={14} color="#cbd5e1" />
              </View>
            </View>

            <View style={styles.statCell}>
              <Text style={styles.statLabel}>{t('todayEarnings')}</Text>
              <View style={styles.statValRow}>
                <Text style={styles.statValBold}>{user?.todayEarnings || 0}</Text>
                <ChevronRight size={14} color="#cbd5e1" />
              </View>
            </View>

            <View style={styles.statCell}>
              <Text style={styles.statLabel}>{t('todayBonus')}</Text>
              <View style={styles.statValRow}>
                <Text style={styles.statValBold}>{user?.todayBonus || 0}</Text>
                <ChevronRight size={14} color="#cbd5e1" />
              </View>
            </View>
          </View>

          {/* Performance Quota */}
          <View style={styles.quotaRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.quotaLabel}>{t('performanceQuota')}</Text>
              <HelpCircle size={14} color="#94a3b8" style={{ marginLeft: 4 }} />
            </View>
            <View style={styles.quotaProgressContainer}>
              <View style={styles.quotaProgressBar} />
              <Text style={styles.quotaValueText}>
                {user?.performanceQuota || 0}/{user?.performanceQuotaMax || 300}.00
              </Text>
            </View>
          </View>
        </View>

        {/* Task Cards Horizontal Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tasksScroll}
        >
          {/* Card 1: Bind PhonePe */}
          <View style={styles.taskCard}>
            <View style={styles.hotBadge}>
              <Text style={styles.hotBadgeText}>HOT</Text>
            </View>
            <View style={[styles.taskIconBg, { backgroundColor: '#f3e8ff' }]}>
              <Wallet size={24} color={COLORS.phonePePurple} />
            </View>
            <Text style={styles.taskTitle}>{t('bindUpiTask')}</Text>
            <Text style={styles.taskSub}>Bind Phonepe UPI</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('WalletSelection')}
              style={styles.taskBtn}
            >
              <Text style={styles.taskBtnText}>{t('go')}</Text>
            </TouchableOpacity>
          </View>

          {/* Card 2: Payment Task */}
          <View style={styles.taskCard}>
            <View style={[styles.taskIconBg, { backgroundColor: '#fef3c7' }]}>
              <CreditCard size={24} color="#f59e0b" />
            </View>
            <Text style={styles.taskTitle}>{t('paymentTask')}</Text>
            <Text style={styles.taskSub}>Complete a payment and make a purchase</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Deposit')}
              style={styles.taskBtn}
            >
              <Text style={styles.taskBtnText}>{t('go')}</Text>
            </TouchableOpacity>
          </View>

          {/* Card 3: Contact Service */}
          <View style={styles.taskCard}>
            <View style={[styles.taskIconBg, { backgroundColor: '#dcfce7' }]}>
              <Send size={24} color="#16a34a" />
            </View>
            <Text style={styles.taskTitle}>{t('contactService')}</Text>
            <Text style={styles.taskSub}>Send a message to customer service</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('CustomerService')}
              style={styles.taskBtn}
            >
              <Text style={styles.taskBtnText}>{t('go')}</Text>
            </TouchableOpacity>
          </View>

          {/* Card 4: Join Telegram */}
          <View style={styles.taskCard}>
            <View style={[styles.taskIconBg, { backgroundColor: '#e0f2fe' }]}>
              <Send size={24} color="#0284c7" />
            </View>
            <Text style={styles.taskTitle}>{t('joinTelegram')}</Text>
            <Text style={styles.taskSub}>Subscribe to our telegram channel</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Bonus')}
              style={styles.taskBtn}
            >
              <Text style={styles.taskBtnText}>{t('go')}</Text>
            </TouchableOpacity>
          </View>

          {/* Card 5: Bind Other UPI */}
          <View style={styles.taskCard}>
            <View style={[styles.taskIconBg, { backgroundColor: '#ffedd5' }]}>
              <Wallet size={24} color="#ea580c" />
            </View>
            <Text style={styles.taskTitle}>{t('bindUpi25')}</Text>
            <Text style={styles.taskSub}>Bind Freecharge/Mobikwik</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('WalletSelection')}
              style={styles.taskBtn}
            >
              <Text style={styles.taskBtnText}>{t('go')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Rewards Milestone Bar */}
        <View style={styles.milestoneCard}>
          <View style={styles.milestoneHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Gift size={16} color={COLORS.primary} style={{ marginRight: 6 }} />
              <Text style={styles.milestoneTitle}>{t('reward')}:0</Text>
            </View>
            <View style={styles.timerContainer}>
              <Text style={styles.timerDigit}>14</Text>
              <Text style={styles.timerColon}>:</Text>
              <Text style={styles.timerDigit}>15</Text>
              <Text style={styles.timerColon}>:</Text>
              <Text style={styles.timerDigit}>56</Text>
            </View>
          </View>

          <View style={styles.coinsRow}>
            {['4K', '10K', '30K', '50K', '100K', '200K'].map((amt, idx) => (
              <View key={amt} style={styles.coinCol}>
                <View style={styles.coinBadge}>
                  <Text style={styles.coinCurrency}>₹</Text>
                  <Text style={styles.coinAmount}>{[10, 20, 30, 50, 80, 100][idx]}</Text>
                </View>
                <Text style={styles.coinMilestone}>{amt}</Text>
              </View>
            ))}
          </View>

          <View style={styles.quotaBottomRow}>
            <Text style={styles.quotaBottomText}>
              {t('quota')}: ₹{user?.balance || 0}
            </Text>
            <TouchableOpacity onPress={onRefresh}>
              <RotateCw size={14} color="#94a3b8" />
            </TouchableOpacity>
          </View>
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
    padding: 12,
    paddingBottom: 90,
  },
  carouselContainer: {
    marginBottom: 12,
  },
  slideCard: {
    width: width - 24,
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0f172a',
    ...SHADOWS.card,
  },
  slideImage: {
    width: '100%',
    height: '100%',
  },
  slideOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 16,
    justifyContent: 'center',
  },
  slideTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#facc15',
  },
  slideSub: {
    fontSize: 11,
    color: '#ffffff',
    marginTop: 4,
    maxWidth: '75%',
    lineHeight: 15,
  },
  slideSub2: {
    fontSize: 10,
    color: '#fef08a',
    marginTop: 2,
  },
  slideBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 14,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  slideBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#cbd5e1',
  },
  dotActive: {
    width: 16,
    backgroundColor: COLORS.primary,
  },
  noticeBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 12,
    ...SHADOWS.card,
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    color: '#475569',
  },
  ratioCard: {
    flexDirection: 'row',
    backgroundColor: '#ebfbf4',
    borderWidth: 1,
    borderColor: '#c6f0df',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  ratioColLeft: {
    flex: 1,
  },
  ratioColRight: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratioDivider: {
    width: 1,
    backgroundColor: '#c6f0df',
  },
  ratioLabel: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  ratioValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
    marginVertical: 2,
  },
  ratioBonus: {
    fontSize: 11,
    color: '#64748b',
  },
  ratioLargeValue: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.primary,
  },
  bindAlertCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    marginBottom: 12,
    ...SHADOWS.card,
  },
  bindAlertText: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 10,
    fontWeight: '500',
  },
  bindNowBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 36,
    borderRadius: 22,
    width: '100%',
    alignItems: 'center',
    ...SHADOWS.glow,
  },
  bindNowBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  statsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    ...SHADOWS.card,
  },
  howToUseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    marginBottom: 12,
  },
  howToUseText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statCell: {
    width: '50%',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  statLabel: {
    fontSize: 11.5,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 2,
  },
  statValRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 8,
  },
  statValBold: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  quotaRow: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quotaLabel: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  quotaProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quotaProgressBar: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    marginRight: 6,
  },
  quotaValueText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ef4444',
  },
  tasksScroll: {
    paddingVertical: 4,
    gap: 12,
    marginBottom: 12,
  },
  taskCard: {
    width: 140,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    position: 'relative',
    ...SHADOWS.card,
  },
  hotBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#ef4444',
    borderTopLeftRadius: 16,
    borderBottomRightRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  hotBadgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '900',
  },
  taskIconBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  taskTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
    lineHeight: 16,
  },
  taskSub: {
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
    marginVertical: 4,
    height: 26,
  },
  taskBtn: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    paddingVertical: 4,
    paddingHorizontal: 16,
    marginTop: 4,
  },
  taskBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  milestoneCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    ...SHADOWS.card,
  },
  milestoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  milestoneTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerDigit: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  timerColon: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8',
    marginHorizontal: 2,
  },
  coinsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  coinCol: {
    alignItems: 'center',
  },
  coinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef08a',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginBottom: 4,
  },
  coinCurrency: {
    fontSize: 10,
    fontWeight: '700',
    color: '#854d0e',
  },
  coinAmount: {
    fontSize: 11,
    fontWeight: '800',
    color: '#854d0e',
    marginLeft: 2,
  },
  coinMilestone: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
  },
  quotaBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  quotaBottomText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
});
