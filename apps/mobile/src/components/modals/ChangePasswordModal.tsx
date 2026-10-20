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
import { Lock, Eye, EyeOff, ShieldCheck, X } from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { COLORS, SHADOWS } from '../../theme';

export const ChangePasswordModal: React.FC = () => {
  const { isChangePasswordVisible, setChangePasswordVisible, user, showDialog } = useApp();

  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isChangePasswordVisible) return null;

  const handleSendOtp = async () => {
    try {
      await api.sendOtp(user?.phone || '9794678059', 'CHANGE_PASSWORD');
      showDialog('smile', 'Verification code sent');
      setOtpTimer(60);
      const interval = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (e) {
      showDialog('sad', 'Failed to send OTP');
    }
  };

  const handleSubmit = async () => {
    if (!newPassword || newPassword.length < 6) {
      showDialog('sad', 'Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      showDialog('sad', 'Passwords do not match');
      return;
    }
    if (!otp) {
      showDialog('sad', 'Please enter OTP');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.changePassword(newPassword, confirmNewPassword, otp);
      showDialog('smile', 'Password updated successfully');
      setChangePasswordVisible(false);
    } catch (err: any) {
      showDialog('sad', err.message || 'Failed to update password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={isChangePasswordVisible} transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Change Your Password</Text>
            <TouchableOpacity onPress={() => setChangePasswordVisible(false)} style={styles.closeBtn}>
              <X size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            {/* Phone */}
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.inputRowDisabled}>
              <Text style={styles.prefixText}>+91</Text>
              <Text style={styles.phoneText}>{user?.phone || '9794678059'}</Text>
            </View>

            {/* New Password */}
            <Text style={[styles.label, { marginTop: 14 }]}>New Password</Text>
            <View style={styles.inputRow}>
              <Lock size={18} color="#94a3b8" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.input}
                secureTextEntry={!showPass}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                placeholderTextColor="#cbd5e1"
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff size={18} color="#94a3b8" /> : <Eye size={18} color="#94a3b8" />}
              </TouchableOpacity>
            </View>

            {/* Confirm New Password */}
            <Text style={[styles.label, { marginTop: 14 }]}>Confirm New Password</Text>
            <View style={styles.inputRow}>
              <Lock size={18} color="#94a3b8" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.input}
                secureTextEntry={!showPass}
                value={confirmNewPassword}
                onChangeText={setConfirmNewPassword}
                placeholder="Enter new password"
                placeholderTextColor="#cbd5e1"
              />
            </View>

            {/* OTP */}
            <Text style={[styles.label, { marginTop: 14 }]}>OTP</Text>
            <View style={styles.inputRow}>
              <ShieldCheck size={18} color="#94a3b8" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.input}
                keyboardType="number-pad"
                value={otp}
                onChangeText={setOtp}
                placeholder="Enter OTP"
                placeholderTextColor="#cbd5e1"
              />
              <TouchableOpacity
                onPress={handleSendOtp}
                disabled={otpTimer > 0}
                style={styles.otpBtn}
              >
                <Text style={styles.otpBtnText}>
                  {otpTimer > 0 ? `${otpTimer}s` : 'OTP'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={handleSubmit} disabled={isSubmitting} style={styles.submitBtn}>
              {isSubmitting ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.submitBtnText}>Submit</Text>
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
  label: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
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
  inputRowDisabled: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    backgroundColor: '#f1f5f9',
  },
  prefixText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginRight: 8,
  },
  phoneText: {
    fontSize: 14,
    color: '#475569',
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
    height: '100%',
  },
  otpBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  otpBtnText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
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
});
