import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { ShieldCheck, Eye, EyeOff, X } from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { COLORS, SHADOWS } from '../../theme';

export const VerifySecondaryModal: React.FC = () => {
  const {
    isVerifySecondaryVisible,
    setVerifySecondaryVisible,
    secondaryVerificationSuccessCallback,
    showDialog,
    t,
  } = useApp();

  const [password, setPassword] = useState('2621'); // default test value
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isVerifySecondaryVisible) return null;

  const handleConfirm = async () => {
    if (!password) {
      showDialog('sad', 'Please enter verify password');
      return;
    }

    setIsSubmitting(true);
    try {
      // If user types King2141 (login password instead of secondary), simulate wrong attempt from video
      if (password === 'King2141') {
        showDialog(
          'sad',
          'Wrong secondary password. 3 attempt(s) remaining. Repeated errors lock operations.'
        );
        setIsSubmitting(false);
        return;
      }

      await api.verifySecondaryPassword(password);
      setVerifySecondaryVisible(false);
      if (secondaryVerificationSuccessCallback) {
        secondaryVerificationSuccessCallback();
      }
    } catch (err: any) {
      showDialog(
        'sad',
        err.message || 'Wrong secondary password. Repeated errors lock operations.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={isVerifySecondaryVisible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{t('verifyPassword')}</Text>
            <TouchableOpacity
              onPress={() => setVerifySecondaryVisible(false)}
              style={styles.closeBtn}
            >
              <X size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            <Text style={styles.label}>{t('verifyPassword')}</Text>
            <View style={styles.inputRow}>
              <ShieldCheck size={18} color="#94a3b8" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.input}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                placeholder={t('enterVerifyPassword')}
                placeholderTextColor="#cbd5e1"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} color="#94a3b8" /> : <Eye size={18} color="#94a3b8" />}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleConfirm}
              disabled={isSubmitting}
              style={styles.confirmBtn}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.confirmBtnText}>{t('confirm')}</Text>
              )}
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
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    backgroundColor: '#fafafa',
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
    height: '100%',
  },
  confirmBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    ...SHADOWS.glow,
  },
  confirmBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
