import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { X } from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import { COLORS, SHADOWS } from '../../theme';

export const WarningModal: React.FC = () => {
  const { isWarningModalVisible, setWarningModalVisible, warningModalMessage, t } = useApp();

  if (!isWarningModalVisible) return null;

  return (
    <Modal visible={isWarningModalVisible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Warning</Text>
            <TouchableOpacity onPress={() => setWarningModalVisible(false)} style={styles.closeBtn}>
              <X size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            <Text style={styles.pointText}>1. This order is abnormal.</Text>
            <Text style={styles.pointText}>
              2. Please verify your UPI status and contact customer service promptly.
            </Text>

            <View style={styles.alertBox}>
              <Text style={styles.alertHeader}>⚠️ Note:</Text>
              <Text style={styles.alertContent}>
                Failure to respond in a timely manner will result in automatic order failure. Funds will
                not be credited, and any losses incurred shall be borne by yourself.
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setWarningModalVisible(false)}
              style={styles.okBtn}
            >
              <Text style={styles.okBtnText}>{t('ok')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    overflow: 'hidden',
    ...SHADOWS.modal,
  },
  header: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 4,
  },
  body: {
    padding: 24,
  },
  pointText: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '600',
    marginBottom: 12,
    lineHeight: 20,
  },
  alertBox: {
    backgroundColor: '#fef2f2',
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 24,
  },
  alertHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ef4444',
    marginBottom: 4,
  },
  alertContent: {
    fontSize: 12,
    color: '#991b1b',
    lineHeight: 18,
  },
  okBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.glow,
  },
  okBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
