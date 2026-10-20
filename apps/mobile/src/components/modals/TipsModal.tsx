import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { X } from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import { COLORS, SHADOWS } from '../../theme';

export const TipsModal: React.FC = () => {
  const { isTipsModalVisible, setTipsModalVisible, tipsModalCallback, t } = useApp();

  if (!isTipsModalVisible) return null;

  const handleConfirm = () => {
    setTipsModalVisible(false);
    if (tipsModalCallback) {
      tipsModalCallback();
    }
  };

  return (
    <Modal visible={isTipsModalVisible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Tips</Text>
            <TouchableOpacity onPress={() => setTipsModalVisible(false)} style={styles.closeBtn}>
              <X size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            <Text style={styles.content}>
              {t('tipsExitOrder')}
            </Text>

            <View style={styles.btnRow}>
              <TouchableOpacity
                onPress={() => setTipsModalVisible(false)}
                style={styles.cancelBtn}
              >
                <Text style={styles.cancelBtnText}>{t('cancel')}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleConfirm} style={styles.okBtn}>
                <Text style={styles.okBtnText}>{t('ok')}</Text>
              </TouchableOpacity>
            </View>
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
  content: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 22,
    marginBottom: 24,
    textAlign: 'center',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '700',
  },
  okBtn: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.glow,
  },
  okBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
