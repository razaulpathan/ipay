import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Gift, RotateCw } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { WhatsAppFAB } from '../components/WhatsAppFAB';
import { COLORS, SHADOWS } from '../theme';

export const BonusScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user, t, setRewardPromoVisible, showDialog } = useApp();

  const [tasks, setTasks] = useState([
    {
      id: 'task_upi_1',
      title: 'BIND UPI (₹1)',
      subtitle: 'Bind Phonepe UPI',
      actionText: 'Go To Bind',
      isCompleted: false,
      action: () => navigation.navigate('WalletSelection'),
    },
    {
      id: 'task_telegram',
      title: 'JOIN TELEGRAM CHANNEL (₹10)',
      subtitle: 'Subscribe to our telegram channel',
      actionText: 'Completed',
      isCompleted: true, // Marked completed in recording
      action: () => showDialog('smile', 'Already completed and reward claimed!'),
    },
    {
      id: 'task_payment_30',
      title: 'PAYMENT GIFT (₹30)',
      subtitle: 'Complete a payment and make a purchase',
      actionText: 'Participate Now',
      isCompleted: false,
      action: () => navigation.navigate('Deposit'),
    },
    {
      id: 'task_service_15',
      title: 'CONTACT SERVICE (₹15)',
      subtitle: 'Send a message to customer service',
      actionText: 'Send Now',
      isCompleted: false,
      action: () => navigation.navigate('CustomerService'),
    },
    {
      id: 'task_upi_25',
      title: 'BIND UPI (₹25)',
      subtitle: 'Bind Freecharge/Mobikwik or other UPI',
      actionText: 'Go To Bind',
      isCompleted: false,
      action: () => navigation.navigate('WalletSelection'),
    },
  ]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('bonus')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top Reward Milestones Card */}
        <View style={styles.milestoneCard}>
          <View style={styles.milestoneHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Gift size={16} color={COLORS.primary} style={{ marginRight: 6 }} />
              <Text style={styles.milestoneTitle}>{t('reward')}:0</Text>
            </View>
            <View style={styles.timerContainer}>
              <Text style={styles.timerDigit}>14</Text>
              <Text style={styles.timerColon}>:</Text>
              <Text style={styles.timerDigit}>13</Text>
              <Text style={styles.timerColon}>:</Text>
              <Text style={styles.timerDigit}>48</Text>
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
            <TouchableOpacity onPress={() => showDialog('smile', 'Quota refreshed')}>
              <RotateCw size={14} color="#94a3b8" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 100+50 Reward Banner Card */}
        <View style={styles.bannerCard}>
          <Image
            source={require('../../assets/banner_invite_reward.jpg')}
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerTitle}>100+50 Reward</Text>
            <Text style={styles.bannerSub} numberOfLines={2}>
              Invite new users to finish 15 orders the same day Valid for 1 days; expires afterward
            </Text>
            <Text style={styles.bannerSub2}>
              The invited person will also receive a reward of 50 for comp
            </Text>
            <TouchableOpacity
              onPress={() => setRewardPromoVisible(true)}
              style={styles.bannerBtn}
            >
              <Text style={styles.bannerBtnText}>{t('inviteNow')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bonus Tasks List */}
        <View style={{ gap: 14 }}>
          {tasks.map((task) => (
            <View key={task.id} style={styles.taskCard}>
              <View style={styles.taskCardHeader}>
                <Text style={styles.taskCardTitle}>{task.title}</Text>
                {task.isCompleted ? (
                  <View style={styles.completedBadge}>
                    <Text style={styles.completedBadgeText}>Completed</Text>
                  </View>
                ) : (
                  <TouchableOpacity onPress={task.action} style={styles.actionBtn}>
                    <Text style={styles.actionBtnText}>{task.actionText}</Text>
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.taskCardSub}>{task.subtitle}</Text>
            </View>
          ))}
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
  scrollContent: {
    padding: 14,
    paddingBottom: 90,
  },
  milestoneCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
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
  bannerCard: {
    height: 180,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0f172a',
    marginBottom: 14,
    ...SHADOWS.card,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    padding: 16,
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#facc15',
  },
  bannerSub: {
    fontSize: 11,
    color: '#ffffff',
    marginTop: 4,
    maxWidth: '75%',
    lineHeight: 15,
  },
  bannerSub2: {
    fontSize: 10,
    color: '#fef08a',
    marginTop: 2,
  },
  bannerBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 14,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  bannerBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  taskCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    ...SHADOWS.card,
  },
  taskCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  taskCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  taskCardSub: {
    fontSize: 12,
    color: '#64748b',
  },
  completedBadge: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  actionBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  actionBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
});
