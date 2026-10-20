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
import { Smartphone, Lock, Eye, EyeOff, X, Check } from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import { COLORS, SHADOWS } from '../../theme';

interface SignInModalProps {
  visible: boolean;
  onClose: () => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({ visible, onClose }) => {
  const { login, t, showDialog } = useApp();
  const [phone, setPhone] = useState('9794678059');
  const [password, setPassword] = useState('King2141');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  const handleSubmit = async () => {
    if (!phone || !password) {
      showDialog('sad', 'Account or password error');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(phone, password);
      onClose();
    } catch (err) {
      // Error is handled inside login() showing the exact sad dialog
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {/* Header Bar */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {isSignUpMode ? 'Sign up for an account' : t('signInTitle')}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            {/* Phone Input */}
            <Text style={styles.inputLabel}>{t('phoneNumber')}</Text>
            <View style={styles.inputRow}>
              <Smartphone size={18} color="#94a3b8" style={{ marginRight: 8 }} />
              <Text style={styles.countryCode}>+91</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                placeholder={t('enterYourPhoneNumber')}
                placeholderTextColor="#cbd5e1"
              />
            </View>

            {/* Password Input */}
            <Text style={[styles.inputLabel, { marginTop: 16 }]}>{t('password')}</Text>
            <View style={styles.inputRow}>
              <Lock size={18} color="#94a3b8" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.textInput}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                placeholder="Please enter your password"
                placeholderTextColor="#cbd5e1"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} color="#94a3b8" /> : <Eye size={18} color="#94a3b8" />}
              </TouchableOpacity>
            </View>

            {/* Remember Password Checkbox */}
            <TouchableOpacity
              onPress={() => setRememberMe(!rememberMe)}
              style={styles.checkboxRow}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                {rememberMe && <Check size={14} color="#ffffff" strokeWidth={3} />}
              </View>
              <Text style={styles.checkboxLabel}>{t('rememberPassword')}</Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isSubmitting}
              style={styles.submitBtn}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.submitBtnText}>
                  {isSignUpMode ? t('signUp') : t('login')}
                </Text>
              )}
            </TouchableOpacity>

            {/* Links */}
            <View style={{ alignItems: 'center', marginTop: 16 }}>
              <TouchableOpacity style={{ marginBottom: 12 }}>
                <Text style={styles.linkText}>{t('forgetPassword')}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setIsSignUpMode(!isSignUpMode)}>
                <Text style={{ fontSize: 13, color: '#475569' }}>
                  {isSignUpMode ? 'Already have an account? ' : `${t('dontHaveAccount')} `}
                  <Text style={[styles.linkText, { fontWeight: '700', textDecorationLine: 'underline' }]}>
                    {isSignUpMode ? t('login') : t('signUp')}
                  </Text>
                </Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
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
    padding: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
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
  countryCode: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
    height: '100%',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkboxActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkboxLabel: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    ...SHADOWS.glow,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  linkText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '600',
  },
});
