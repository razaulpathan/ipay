import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Check } from 'lucide-react-native';
import Svg, { Rect, Circle, Path } from 'react-native-svg';
import { useApp } from '../context/AppContext';
import { WhatsAppFAB } from '../components/WhatsAppFAB';
import { DEFAULT_WALLET_PROVIDERS, WalletProviderConfig } from '../shared';
import { COLORS, SHADOWS } from '../theme';

export const WalletSelectionScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { showDialog, triggerSecondaryVerification, t } = useApp();

  const [selectedProviderId, setSelectedProviderId] = useState<string>('bharatpe_business');
  const [selectedMethod, setSelectedMethod] = useState<'OTP' | 'APP' | null>('OTP');

  const handleSelectProvider = (provider: WalletProviderConfig) => {
    setSelectedProviderId(provider.id);
    if (provider.availableMethods.length > 0) {
      setSelectedMethod(provider.availableMethods[0]);
    } else {
      setSelectedMethod(null);
    }
  };

  const handleAddWallet = () => {
    const provider = DEFAULT_WALLET_PROVIDERS.find((p) => p.id === selectedProviderId);
    if (!provider) {
      showDialog('sad', 'Please choose how to add.');
      return;
    }

    // Exact check: if provider has sub-options (like OTP/APP) and none chosen
    if (provider.availableMethods.length > 0 && !selectedMethod) {
      showDialog('sad', 'Please choose how to add.');
      return;
    }

    // Trigger secondary password verification modal
    triggerSecondaryVerification(() => {
      navigation.navigate('WalletBinding', {
        providerId: provider.id,
        providerName: provider.name,
        method: selectedMethod || 'APP',
      });
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('wallet')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={{ gap: 14 }}>
          {DEFAULT_WALLET_PROVIDERS.map((provider) => {
            const isSelected = selectedProviderId === provider.id;

            return (
              <View
                key={provider.id}
                style={[styles.providerCard, isSelected && styles.providerCardActive]}
              >
                {/* Red RECOMMEND Ribbon */}
                {provider.isRecommend && (
                  <View style={styles.recommendRibbon}>
                    <Text style={styles.recommendText}>{t('recommend')}</Text>
                  </View>
                )}

                {/* Card Top Row */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleSelectProvider(provider)}
                  style={styles.cardMainRow}
                >
                  <View style={styles.providerLeft}>
                    {/* Provider Brand Icon */}
                    <View style={styles.brandIconBox}>
                      {provider.id === 'phonepe' && (
                        <View style={[styles.brandCircle, { backgroundColor: '#5f259f' }]}>
                          <Text style={styles.brandLetter}>पे</Text>
                        </View>
                      )}
                      {provider.id === 'paytm' && (
                        <View style={[styles.brandCircle, { backgroundColor: '#00baf2' }]}>
                          <Text style={[styles.brandLetter, { fontSize: 11 }]}>Paytm</Text>
                        </View>
                      )}
                      {provider.id === 'paytm_business' && (
                        <View style={[styles.brandCircle, { backgroundColor: '#002970' }]}>
                          <Text style={[styles.brandLetter, { fontSize: 9 }]}>Business</Text>
                        </View>
                      )}
                      {provider.id === 'bharatpe_business' && (
                        <View style={[styles.brandCircle, { backgroundColor: '#002970' }]}>
                          <Text style={styles.brandLetter}>=</Text>
                        </View>
                      )}
                      {provider.id === 'mobikwik' && (
                        <View style={[styles.brandCircle, { backgroundColor: '#1367d8' }]}>
                          <Text style={styles.brandLetter}>M</Text>
                        </View>
                      )}
                      {provider.id === 'freecharge' && (
                        <View style={[styles.brandCircle, { backgroundColor: '#f35b25' }]}>
                          <Text style={styles.brandLetter}>⚡</Text>
                        </View>
                      )}
                      {provider.id === 'google_pay_business' && (
                        <View style={[styles.brandCircle, { backgroundColor: '#4285f4' }]}>
                          <Text style={styles.brandLetter}>G</Text>
                        </View>
                      )}
                      {provider.id === 'amazon_pay' && (
                        <View style={[styles.brandCircle, { backgroundColor: '#232f3e' }]}>
                          <Text style={[styles.brandLetter, { fontSize: 10 }]}>pay</Text>
                        </View>
                      )}
                    </View>

                    <View>
                      <Text style={styles.providerName}>{provider.name}</Text>
                      {/* Badges: Pay In / Pay Out */}
                      <View style={styles.badgesRow}>
                        <View style={styles.badgeGreen}>
                          <Text style={styles.badgeGreenText}>Pay In</Text>
                        </View>
                        <View style={styles.badgeGray}>
                          <Text style={styles.badgeGrayText}>Pay Out</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Radio selector circle */}
                  <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>

                {/* Sub-options (OTP / APP) if selected */}
                {isSelected && provider.availableMethods.length > 0 && (
                  <View style={styles.subMethodsRow}>
                    {provider.availableMethods.map((m) => {
                      const isMethodActive = selectedMethod === m;
                      return (
                        <TouchableOpacity
                          key={m}
                          onPress={() => setSelectedMethod(m)}
                          style={styles.methodOption}
                        >
                          <View
                            style={[
                              styles.smallRadioOuter,
                              isMethodActive && styles.smallRadioActive,
                            ]}
                          >
                            {isMethodActive && <View style={styles.smallRadioInner} />}
                          </View>
                          <Text
                            style={[
                              styles.methodText,
                              isMethodActive && styles.methodTextActive,
                            ]}
                          >
                            {m}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}

                {/* Red warning subtitle if exists */}
                {isSelected && provider.subtitle && (
                  <Text style={styles.providerSubtitle}>{provider.subtitle}</Text>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Add Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={handleAddWallet} style={styles.addBtn}>
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

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
    paddingBottom: 100,
  },
  providerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'transparent',
    ...SHADOWS.card,
  },
  providerCardActive: {
    borderColor: COLORS.primaryBorder,
  },
  recommendRibbon: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#ef4444',
    borderTopLeftRadius: 14,
    borderBottomRightRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 10,
  },
  recommendText: {
    color: '#ffffff',
    fontSize: 8,
    fontWeight: '900',
  },
  cardMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  providerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandIconBox: {
    marginRight: 12,
  },
  brandCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandLetter: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  providerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 6,
  },
  badgeGreen: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeGreenText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
  },
  badgeGray: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeGrayText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94a3b8',
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: COLORS.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  subMethodsRow: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f8fafc',
    paddingLeft: 56,
  },
  methodOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallRadioOuter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  smallRadioActive: {
    borderColor: COLORS.primary,
  },
  smallRadioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  methodText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },
  methodTextActive: {
    color: '#0f172a',
    fontWeight: '700',
  },
  providerSubtitle: {
    fontSize: 11,
    color: '#ef4444',
    marginTop: 8,
    paddingLeft: 56,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  addBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.glow,
  },
  addBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
