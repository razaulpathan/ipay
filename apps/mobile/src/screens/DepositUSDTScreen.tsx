import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, Copy, Clock, Image as ImageIcon, Check } from 'lucide-react-native';
import Svg, { Rect, Path, Circle } from 'react-native-svg';
import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { WhatsAppFAB } from '../components/WhatsAppFAB';
import { COLORS, SHADOWS } from '../theme';

export const DepositUSDTScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { showDialog, triggerTipsModal, t } = useApp();

  const amountUsdt = route.params?.amountUsdt || 10;
  const amountInr = route.params?.amountInr || 1090;
  const userWithdrawalAddress = route.params?.withdrawalAddress || '800';

  const depositAddressTRC20 = 'TPFKUWVEYB772899N9UL';
  const maskedDepositAddress = 'TPFKUWVEYB****N9UL';

  // 60-minute countdown
  const [secondsLeft, setSecondsLeft] = useState(3598); // 00:59:58
  const [txidInput, setTxidInput] = useState('');
  const [uploadedProof, setUploadedProof] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    const hours = Math.floor(m / 60);
    const mins = m % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${s
      .toString()
      .padStart(2, '0')}`;
  };

  const handleCopyAddress = async () => {
    await Clipboard.setStringAsync(depositAddressTRC20);
    showDialog('smile', 'Wallet address copied!');
  };

  const handleUploadProof = async () => {
    try {
      setIsUploading(true);
      // Simulate receipt photo picker / upload
      setTimeout(() => {
        setIsUploading(false);
        setUploadedProof('receipt_sample.jpg');
        showDialog('smile', 'Upload success');
      }, 1200);
    } catch (e) {
      setIsUploading(false);
      showDialog('sad', 'Failed to upload proof');
    }
  };

  const handleSubmit = async () => {
    if (!txidInput || txidInput.trim().length === 0) {
      showDialog('sad', 'Please enter Txid or Hash(Must)');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.submitUsdtProof(`USDT${Date.now()}`, txidInput.trim(), uploadedProof || undefined);
      showDialog('smile', 'Order submitted! Pending review.');
      setTimeout(() => {
        navigation.navigate('OrderHistory');
      }, 1500);
    } catch (err: any) {
      showDialog('sad', err.message || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackPress = () => {
    if (!txidInput) {
      triggerTipsModal(() => {
        navigation.goBack();
      });
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backBtn}>
          <ChevronLeft size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('depositUsdt')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Countdown Timer */}
        <View style={styles.timerRow}>
          <Clock size={16} color="#ef4444" style={{ marginRight: 6 }} />
          <Text style={styles.timerText}>{formatCountdown(secondsLeft)}</Text>
        </View>

        {/* QR Code Container with centered Tether logo */}
        <View style={styles.qrContainer}>
          <View style={styles.qrCodeBox}>
            <Svg width={180} height={180} viewBox="0 0 180 180">
              {/* Outer boundary */}
              <Rect x="10" y="10" width="160" height="160" fill="#ffffff" />
              {/* Corner position markers */}
              <Rect x="20" y="20" width="40" height="40" fill="#0f172a" rx="4" />
              <Rect x="26" y="26" width="28" height="28" fill="#ffffff" rx="2" />
              <Rect x="32" y="32" width="16" height="16" fill="#0f172a" rx="2" />

              <Rect x="120" y="20" width="40" height="40" fill="#0f172a" rx="4" />
              <Rect x="126" y="26" width="28" height="28" fill="#ffffff" rx="2" />
              <Rect x="132" y="32" width="16" height="16" fill="#0f172a" rx="2" />

              <Rect x="20" y="120" width="40" height="40" fill="#0f172a" rx="4" />
              <Rect x="26" y="126" width="28" height="28" fill="#ffffff" rx="2" />
              <Rect x="32" y="132" width="16" height="16" fill="#0f172a" rx="2" />

              {/* Data matrix dots */}
              <Rect x="70" y="25" width="12" height="12" fill="#0f172a" />
              <Rect x="95" y="25" width="12" height="12" fill="#0f172a" />
              <Rect x="70" y="50" width="12" height="12" fill="#0f172a" />
              <Rect x="95" y="50" width="12" height="12" fill="#0f172a" />
              <Rect x="70" y="120" width="12" height="12" fill="#0f172a" />
              <Rect x="95" y="120" width="12" height="12" fill="#0f172a" />
              <Rect x="70" y="145" width="12" height="12" fill="#0f172a" />
              <Rect x="95" y="145" width="12" height="12" fill="#0f172a" />
              <Rect x="130" y="75" width="12" height="12" fill="#0f172a" />
              <Rect x="130" y="100" width="12" height="12" fill="#0f172a" />
              <Rect x="25" y="75" width="12" height="12" fill="#0f172a" />
              <Rect x="25" y="100" width="12" height="12" fill="#0f172a" />

              {/* Centered Tether TRC20 Logo Emblem */}
              <Circle cx="90" cy="90" r="22" fill="#ffffff" />
              <Circle cx="90" cy="90" r="18" fill="#26a17b" />
              <Path
                d="M84 82 H96 V85 H91.5 V98 H88.5 V85 H84 V82 Z"
                fill="#ffffff"
              />
            </Svg>
          </View>

          <Text style={styles.usdtAmountTitle}>{amountUsdt} USDT</Text>
          <Text style={styles.usdtNotice}>{t('sendOnlyUsdt')}</Text>

          {/* TRC20 Wallet Address Copy Bar */}
          <View style={styles.addressBox}>
            <View>
              <Text style={styles.addressLabel}>Wallet Address (TRC20)</Text>
              <Text style={styles.addressValue}>{maskedDepositAddress}</Text>
            </View>
            <TouchableOpacity onPress={handleCopyAddress} style={styles.copyBtn}>
              <Copy size={18} color="#0f172a" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Transaction Calculation Details */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailKey}>{t('youWillGet')}</Text>
            <Text style={styles.detailValBold}>{amountInr} INR</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailKey}>{t('networkTron')}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailKey}>{t('estimatedBonus')}</Text>
            <Text style={styles.detailVal}>0.00(0%)INR</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailKey}>Wallet Address :</Text>
            <Text style={styles.detailVal}>{userWithdrawalAddress}</Text>
          </View>
        </View>

        {/* Txid or Hash Input */}
        <View style={styles.inputSection}>
          <View style={styles.inputLabelRow}>
            <Text style={styles.requiredInputLabel}>{t('enterTxidHash')}</Text>
            <TouchableOpacity>
              <Text style={styles.sampleGraphText}>{t('sampleGraph')}</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.txidInput}
            value={txidInput}
            onChangeText={setTxidInput}
            placeholder="Please enter Txid or Hash(Must)"
            placeholderTextColor="#cbd5e1"
          />

          {/* Upload Proof Button */}
          <TouchableOpacity
            onPress={handleUploadProof}
            disabled={isUploading}
            style={styles.uploadProofBtn}
          >
            {isUploading ? (
              <ActivityIndicator color={COLORS.primary} />
            ) : uploadedProof ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Check size={16} color={COLORS.primary} style={{ marginRight: 6 }} />
                <Text style={styles.uploadProofText}>Proof Uploaded</Text>
              </View>
            ) : (
              <Text style={styles.uploadProofText}>{t('uploadProof')}</Text>
            )}
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
              <Text style={styles.submitBtnText}>{t('submit')}</Text>
            )}
          </TouchableOpacity>
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
    padding: 16,
    paddingBottom: 90,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  timerText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ef4444',
  },
  qrContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    ...SHADOWS.card,
  },
  qrCodeBox: {
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  usdtAmountTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  usdtNotice: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 16,
  },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  addressLabel: {
    fontSize: 11,
    color: '#64748b',
  },
  addressValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 2,
    fontFamily: 'monospace',
  },
  copyBtn: {
    padding: 8,
  },
  detailsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...SHADOWS.card,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  detailKey: {
    fontSize: 13,
    color: '#64748b',
  },
  detailVal: {
    fontSize: 13,
    color: '#0f172a',
    fontWeight: '600',
  },
  detailValBold: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '800',
  },
  inputSection: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...SHADOWS.card,
  },
  inputLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  requiredInputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ef4444',
  },
  sampleGraphText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  txidInput: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 13,
    color: '#0f172a',
    marginBottom: 16,
  },
  uploadProofBtn: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: COLORS.primary,
    borderRadius: 14,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0fdf4',
    marginBottom: 16,
  },
  uploadProofText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.glow,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
