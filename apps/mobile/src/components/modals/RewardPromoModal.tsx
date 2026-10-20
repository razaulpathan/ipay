import React from 'react';
import { View, Text, Modal, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { X } from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import { COLORS, SHADOWS } from '../../theme';

export const RewardPromoModal: React.FC = () => {
  const { isRewardPromoVisible, setRewardPromoVisible, t } = useApp();

  if (!isRewardPromoVisible) return null;

  return (
    <Modal visible={isRewardPromoVisible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.container}>
          {/* Main Card */}
          <View style={styles.card}>
            {/* Banner Artwork */}
            <View style={styles.bannerContainer}>
              <Image
                source={require('../../assets/banner_invite_reward.jpg')}
                style={styles.bannerImage}
                resizeMode="cover"
              />
              <View style={styles.bannerOverlay}>
                <Text style={styles.promoBadge}>{t('rewardInviteTitle')}</Text>
                <Text style={styles.promoSub}>{t('rewardInviteSub')}</Text>
                <Text style={styles.promoSub2}>{t('rewardInviteSub2')}</Text>

                <TouchableOpacity
                  onPress={() => setRewardPromoVisible(false)}
                  style={styles.inviteNowBtn}
                >
                  <Text style={styles.inviteNowText}>{t('inviteNow')}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Terms List */}
            <ScrollView style={styles.termsList} contentContainerStyle={{ padding: 18 }}>
              <View style={styles.termItem}>
                <View style={styles.greenDot} />
                <Text style={styles.termText}>
                  Invite new users to register via invitation Link or code.
                </Text>
              </View>

              <View style={styles.termItem}>
                <View style={styles.greenDot} />
                <Text style={styles.termText}>
                  New users must complete 15 orders on the same day within the validity period.
                </Text>
              </View>

              <View style={styles.termItem}>
                <View style={styles.greenDot} />
                <Text style={styles.termText}>
                  Meeting the above criteria constitutes a valid invitation; Inviter gets 100 reward, Invitee gets 50 reward.
                </Text>
              </View>

              <View style={styles.termItem}>
                <View style={styles.greenDot} />
                <Text style={styles.termText}>
                  New users must be converted into valid invitees within 1 days.
                </Text>
              </View>

              <View style={styles.termItem}>
                <View style={styles.greenDot} />
                <Text style={styles.termText}>
                  Invitations that are not completed within 1 days will expire, and no reward will be given.
                </Text>
              </View>
            </ScrollView>
          </View>

          {/* Close Circular Button Below Modal */}
          <TouchableOpacity
            onPress={() => setRewardPromoVisible(false)}
            style={styles.floatingCloseBtn}
          >
            <X size={24} color="#0f172a" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    overflow: 'hidden',
    width: '100%',
    maxHeight: 520,
    ...SHADOWS.modal,
  },
  bannerContainer: {
    height: 220,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  promoBadge: {
    fontSize: 22,
    fontWeight: '900',
    color: '#facc15',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
  },
  promoSub: {
    fontSize: 11,
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '600',
  },
  promoSub2: {
    fontSize: 10,
    color: '#fef08a',
    textAlign: 'center',
    marginTop: 4,
  },
  inviteNowBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 22,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 12,
    ...SHADOWS.glow,
  },
  inviteNowText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  termsList: {
    backgroundColor: '#ffffff',
  },
  termItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  greenDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginTop: 5,
    marginRight: 8,
  },
  termText: {
    flex: 1,
    fontSize: 11.5,
    color: '#475569',
    lineHeight: 16,
  },
  floatingCloseBtn: {
    marginTop: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.card,
  },
});
