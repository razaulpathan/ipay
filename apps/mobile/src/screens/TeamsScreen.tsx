import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Share,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Users,
  Copy,
  ChevronDown,
  CheckCircle2,
  FileSpreadsheet,
  Share2,
} from 'lucide-react-native';
import Svg, { Rect, Circle, Path } from 'react-native-svg';
import * as Clipboard from 'expo-clipboard';
import { useApp } from '../context/AppContext';
import { WhatsAppFAB } from '../components/WhatsAppFAB';
import { COLORS, SHADOWS } from '../theme';

export const TeamsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user, showDialog, t } = useApp();

  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Level A' | 'Level B'>('All');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);

  const shareLink = `https://share.ipaynow.net/?data=${user?.referralCode || 'dwkPTEzMzQyOSZjaGFuk'}`;

  const handleCopyLink = async () => {
    await Clipboard.setStringAsync(shareLink);
    showDialog('smile', 'Link copied successfully, share it now!', 'Copied');
  };

  const handleSocialShare = async (platform: string) => {
    try {
      await Share.share({
        message: `Join iPay with my referral link to receive exclusive bonuses: ${shareLink}`,
      });
    } catch (e) {}
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top 4 KPI Stat Cards in 2x2 Grid */}
        <View style={styles.kpiGrid}>
          {/* Card 1: Total Deposit */}
          <View style={[styles.kpiCard, { backgroundColor: '#fff1f2' }]}>
            <View style={styles.kpiHeader}>
              <Text style={styles.kpiLabel}>{t('totalDeposit')}</Text>
              <View style={[styles.kpiIconCircle, { backgroundColor: '#ffe4e6' }]}>
                <Text style={{ fontSize: 13, fontWeight: '800', color: '#f43f5e' }}>₹</Text>
              </View>
            </View>
            <Text style={styles.kpiValue}>₹{user?.totalDeposit || 0}</Text>
          </View>

          {/* Card 2: Team Commission */}
          <View style={[styles.kpiCard, { backgroundColor: '#f0f9ff' }]}>
            <View style={styles.kpiHeader}>
              <Text style={styles.kpiLabel}>{t('teamCommission')}</Text>
              <View style={[styles.kpiIconCircle, { backgroundColor: '#e0f2fe' }]}>
                <Users size={14} color="#0284c7" />
              </View>
            </View>
            <Text style={styles.kpiValue}>₹{user?.teamCommission || 0}</Text>
          </View>

          {/* Card 3: Total Success Order */}
          <View style={[styles.kpiCard, { backgroundColor: '#ecfdf5' }]}>
            <View style={styles.kpiHeader}>
              <Text style={styles.kpiLabel}>{t('totalSuccessOrder')}</Text>
              <View style={[styles.kpiIconCircle, { backgroundColor: '#d1fae5' }]}>
                <CheckCircle2 size={14} color={COLORS.primary} />
              </View>
            </View>
            <Text style={styles.kpiValue}>0</Text>
          </View>

          {/* Card 4: Total User */}
          <View style={[styles.kpiCard, { backgroundColor: '#fffbeb' }]}>
            <View style={styles.kpiHeader}>
              <Text style={styles.kpiLabel}>{t('totalUser')}</Text>
              <View style={[styles.kpiIconCircle, { backgroundColor: '#fef3c7' }]}>
                <Users size={14} color="#d97706" />
              </View>
            </View>
            <Text style={styles.kpiValue}>0</Text>
          </View>
        </View>

        {/* Team Data Breakdown Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>{t('teamData')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SublineList')}>
              <Text style={styles.greenLinkText}>{t('viewCommission')}</Text>
            </TouchableOpacity>
          </View>

          {/* Filter Dropdown */}
          <View style={{ marginBottom: 14 }}>
            <TouchableOpacity
              onPress={() => setFilterDropdownOpen(!filterDropdownOpen)}
              style={styles.dropdownBtn}
            >
              <Text style={styles.dropdownBtnText}>{selectedFilter}</Text>
              <ChevronDown size={14} color="#0f172a" />
            </TouchableOpacity>

            {filterDropdownOpen && (
              <View style={styles.dropdownMenu}>
                {(['All', 'Level A', 'Level B'] as const).map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    onPress={() => {
                      setSelectedFilter(opt);
                      setFilterDropdownOpen(false);
                    }}
                    style={styles.dropdownMenuItem}
                  >
                    <Text
                      style={[
                        styles.dropdownMenuText,
                        selectedFilter === opt && styles.dropdownMenuTextActive,
                      ]}
                    >
                      {opt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Table Header: Periods */}
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableHeaderCell, { width: 90, textAlign: 'left' }]}></Text>
            <Text style={styles.tableHeaderCell}>{t('today')}</Text>
            <Text style={styles.tableHeaderCell}>{t('yesterday')}</Text>
            <Text style={styles.tableHeaderCell}>{t('weekly')}</Text>
            <Text style={styles.tableHeaderCell}>{t('monthly')}</Text>
          </View>

          {/* Data Rows */}
          {[
            { label: 'Team Deposit', vals: ['0', '0', '0', '0'] },
            { label: 'Commission', vals: ['0', '0', '0', '0'] },
            { label: 'Success Order', vals: ['0', '0', '0', '0'] },
            { label: 'Active User', vals: ['0', '0', '0', '0'] },
            { label: 'New User', vals: ['0', '0', '0', '0'] },
          ].map((row, i) => (
            <View key={i} style={styles.dataRow}>
              <Text style={[styles.dataRowLabel, { width: 90 }]}>{row.label}</Text>
              {row.vals.map((v, idx) => (
                <Text key={idx} style={styles.dataRowVal}>
                  {v}
                </Text>
              ))}
            </View>
          ))}
        </View>

        {/* Share QR Code Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitleCenter}>{t('shareQrCode')}</Text>

          {/* QR Code Container with centered iPAY badge */}
          <View style={styles.qrContainer}>
            <Svg width={140} height={140} viewBox="0 0 140 140">
              <Rect width="140" height="140" fill="#ffffff" />
              {/* Corner markers */}
              <Rect x="10" y="10" width="34" height="34" fill="#0f172a" rx="4" />
              <Rect x="15" y="15" width="24" height="24" fill="#ffffff" rx="2" />
              <Rect x="20" y="20" width="14" height="14" fill="#0f172a" rx="2" />

              <Rect x="96" y="10" width="34" height="34" fill="#0f172a" rx="4" />
              <Rect x="101" y="15" width="24" height="24" fill="#ffffff" rx="2" />
              <Rect x="106" y="20" width="14" height="14" fill="#0f172a" rx="2" />

              <Rect x="10" y="96" width="34" height="34" fill="#0f172a" rx="4" />
              <Rect x="15" y="101" width="24" height="24" fill="#ffffff" rx="2" />
              <Rect x="20" y="106" width="14" height="14" fill="#0f172a" rx="2" />

              {/* Centered iPAY emblem */}
              <Circle cx="70" cy="70" r="16" fill="#05c175" />
              <Circle cx="70" cy="70" r="14" fill="#ffffff" />
            </Svg>
            <View style={styles.qrCenterBadge}>
              <Text style={styles.qrCenterBadgeText}>iPAY</Text>
            </View>
          </View>

          {/* Share Link Row with 1-tap Copy */}
          <View style={styles.shareLinkBox}>
            <Text style={styles.shareLinkText} numberOfLines={1}>
              {shareLink}
            </Text>
            <TouchableOpacity onPress={handleCopyLink} style={styles.copyBtn}>
              <Copy size={16} color="#0f172a" />
            </TouchableOpacity>
          </View>

          {/* Social Share Buttons (Telegram, WhatsApp, Facebook, Share) */}
          <View style={styles.socialRow}>
            {/* Telegram */}
            <TouchableOpacity
              onPress={() => handleSocialShare('Telegram')}
              style={[styles.socialCircle, { backgroundColor: '#229ed9' }]}
            >
              <Send size={18} color="#ffffff" />
            </TouchableOpacity>

            {/* WhatsApp */}
            <TouchableOpacity
              onPress={() => handleSocialShare('WhatsApp')}
              style={[styles.socialCircle, { backgroundColor: '#25d366' }]}
            >
              <Text style={{ fontSize: 16 }}>💬</Text>
            </TouchableOpacity>

            {/* Facebook */}
            <TouchableOpacity
              onPress={() => handleSocialShare('Facebook')}
              style={[styles.socialCircle, { backgroundColor: '#1877f2' }]}
            >
              <Text style={{ color: '#ffffff', fontWeight: '800', fontSize: 16 }}>f</Text>
            </TouchableOpacity>

            {/* Direct Share */}
            <TouchableOpacity
              onPress={() => handleSocialShare('Share')}
              style={[styles.socialCircle, { backgroundColor: '#f97316' }]}
            >
              <Share2 size={18} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* My Team Report Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>{t('myTeamReport')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SublineList')}>
              <Text style={styles.greenLinkText}>{t('sublineLink')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.reportHeaderRow}>
            <Text style={[styles.reportHeaderCell, { flex: 1.2 }]}>{t('tools')}</Text>
            <Text style={styles.reportHeaderCell}>{t('number')}</Text>
            <Text style={styles.reportHeaderCell}>{t('proportion')}</Text>
            <Text style={styles.reportHeaderCell}>{t('earn')}</Text>
          </View>

          <View style={styles.reportRow}>
            <Text style={[styles.reportRowCellBold, { flex: 1.2 }]}>Level A</Text>
            <Text style={styles.reportRowCell}>0</Text>
            <Text style={styles.reportRowCell}>0.2%</Text>
            <Text style={styles.reportRowCell}>0</Text>
          </View>

          <View style={styles.reportRow}>
            <Text style={[styles.reportRowCellBold, { flex: 1.2 }]}>Level B</Text>
            <Text style={styles.reportRowCell}>0</Text>
            <Text style={styles.reportRowCell}>0.05%</Text>
            <Text style={styles.reportRowCell}>0</Text>
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
    padding: 14,
    paddingBottom: 90,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 14,
  },
  kpiCard: {
    width: '48%',
    borderRadius: 16,
    padding: 14,
    ...SHADOWS.card,
  },
  kpiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  kpiLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#475569',
  },
  kpiIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    ...SHADOWS.card,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  sectionTitleCenter: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 14,
  },
  greenLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 34,
    width: 100,
  },
  dropdownBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 38,
    left: 0,
    width: 100,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    zIndex: 50,
    ...SHADOWS.card,
  },
  dropdownMenuItem: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  dropdownMenuText: {
    fontSize: 12,
    color: '#475569',
  },
  dropdownMenuTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    textAlign: 'center',
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  dataRowLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
  },
  dataRowVal: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
    position: 'relative',
  },
  qrCenterBadge: {
    position: 'absolute',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  qrCenterBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '900',
  },
  shareLinkBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
    marginBottom: 16,
  },
  shareLinkText: {
    flex: 1,
    fontSize: 11,
    color: '#475569',
    fontFamily: 'monospace',
    marginRight: 8,
  },
  copyBtn: {
    padding: 6,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 18,
    marginVertical: 4,
  },
  socialCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.card,
  },
  reportHeaderRow: {
    flexDirection: 'row',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  reportHeaderCell: {
    flex: 1,
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
    textAlign: 'center',
  },
  reportRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  reportRowCellBold: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  reportRowCell: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
  },
});
