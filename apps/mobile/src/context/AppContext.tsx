import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, LanguageCode, TRANSLATIONS, APP_CONFIG, AppConfig } from '../shared';
import { api } from '../services/api';

interface AppContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  appConfig: AppConfig;
  login: (phone: string, pass: string) => Promise<void>;
  logout: () => void;
  refreshUserData: () => Promise<void>;

  // Modals visibility state
  isSignInVisible: boolean;
  setSignInVisible: (v: boolean) => void;
  isRewardPromoVisible: boolean;
  setRewardPromoVisible: (v: boolean) => void;
  isImportantNoticeVisible: boolean;
  setImportantNoticeVisible: (v: boolean) => void;
  isVerifySecondaryVisible: boolean;
  setVerifySecondaryVisible: (v: boolean) => void;
  secondaryVerificationSuccessCallback: (() => void) | null;
  triggerSecondaryVerification: (onSuccess: () => void) => void;
  isLanguageModalVisible: boolean;
  setLanguageModalVisible: (v: boolean) => void;
  isChangePasswordVisible: boolean;
  setChangePasswordVisible: (v: boolean) => void;
  isVersionModalVisible: boolean;
  setVersionModalVisible: (v: boolean) => void;
  isWarningModalVisible: boolean;
  setWarningModalVisible: (v: boolean) => void;
  warningModalMessage: string;
  triggerWarningModal: (msg?: string) => void;
  isTipsModalVisible: boolean;
  setTipsModalVisible: (v: boolean) => void;
  tipsModalCallback: (() => void) | null;
  triggerTipsModal: (onConfirm: () => void) => void;

  // Global Dialogs & Sad/Smile Popups matching recording
  dialogState: {
    visible: boolean;
    type: 'sad' | 'smile' | 'loading' | 'info';
    text: string;
    subText?: string;
  } | null;
  showDialog: (type: 'sad' | 'smile' | 'loading' | 'info', text: string, subText?: string) => void;
  hideDialog: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial fallback user matching the recording
const INITIAL_DEMO_USER: UserProfile = {
  id: 'usr_1',
  userId: '113429',
  phone: '9794678059',
  phoneMasked: '97*****8059',
  balance: 10,
  totalEarnings: 0,
  totalBonus: 10,
  totalDeposit: 0,
  totalWithdrawal: 0,
  todayDeposit: 0,
  todayWithdrawal: 0,
  todayEarnings: 0,
  todayBonus: 0,
  teamCommission: 0,
  performanceQuota: 0,
  performanceQuotaMax: 300,
  pendingDeposit: 0,
  lockingDeposit: 0,
  pendingWithdrawal: 0,
  lockingWithdrawal: 0,
  isUpiBound: false,
  referralCode: 'dwkPTEzMzQyOSZjaGFuk',
  createdAt: '2026-10-19T10:00:00Z',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(INITIAL_DEMO_USER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // Logged in state
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [appConfig, setAppConfig] = useState<AppConfig>(APP_CONFIG);

  // Modals
  const [isSignInVisible, setSignInVisible] = useState(false);
  const [isRewardPromoVisible, setRewardPromoVisible] = useState(false);
  const [isImportantNoticeVisible, setImportantNoticeVisible] = useState(false);
  const [isVerifySecondaryVisible, setVerifySecondaryVisible] = useState(false);
  const [secondaryVerificationSuccessCallback, setSecondaryVerificationSuccessCallback] = useState<
    (() => void) | null
  >(null);
  const [isLanguageModalVisible, setLanguageModalVisible] = useState(false);
  const [isChangePasswordVisible, setChangePasswordVisible] = useState(false);
  const [isVersionModalVisible, setVersionModalVisible] = useState(false);
  const [isWarningModalVisible, setWarningModalVisible] = useState(false);
  const [warningModalMessage, setWarningModalMessage] = useState('');
  const [isTipsModalVisible, setTipsModalVisible] = useState(false);
  const [tipsModalCallback, setTipsModalCallback] = useState<(() => void) | null>(null);

  const [dialogState, setDialogState] = useState<{
    visible: boolean;
    type: 'sad' | 'smile' | 'loading' | 'info';
    text: string;
    subText?: string;
  } | null>(null);

  const showDialog = (type: 'sad' | 'smile' | 'loading' | 'info', text: string, subText?: string) => {
    setDialogState({ visible: true, type, text, subText });
    if (type !== 'loading') {
      setTimeout(() => {
        setDialogState(null);
      }, 2400);
    }
  };

  const hideDialog = () => {
    setDialogState(null);
  };

  const t = (key: string): string => {
    const dict = TRANSLATIONS[language] as Record<string, string>;
    return dict[key] || TRANSLATIONS['en'][key as keyof typeof TRANSLATIONS.en] || key;
  };

  const triggerSecondaryVerification = (onSuccess: () => void) => {
    setSecondaryVerificationSuccessCallback(() => onSuccess);
    setVerifySecondaryVisible(true);
  };

  const triggerWarningModal = (msg?: string) => {
    if (msg) setWarningModalMessage(msg);
    setWarningModalVisible(true);
  };

  const triggerTipsModal = (onConfirm: () => void) => {
    setTipsModalCallback(() => onConfirm);
    setTipsModalVisible(true);
  };

  const refreshUserData = async () => {
    try {
      const res = await api.getMe();
      if (res.user) {
        setUser(res.user);
      }
    } catch (e) {
      // Keep existing state
    }
  };

  const login = async (phone: string, pass: string) => {
    showDialog('loading', '');
    try {
      const res = await api.login(phone, pass);
      api.setToken(res.token);
      setUser(res.user);
      setIsAuthenticated(true);
      hideDialog();
      setSignInVisible(false);
      // Show 100+50 reward promo modal on first login as in video
      setTimeout(() => {
        setRewardPromoVisible(true);
      }, 400);
    } catch (err: any) {
      hideDialog();
      // Exact error modal from video: "Account or password error" with sad face
      setTimeout(() => {
        showDialog('sad', 'Account or password error');
      }, 150);
      throw err;
    }
  };

  const logout = () => {
    api.setToken(null);
    setIsAuthenticated(false);
    setUser(null);
    setSignInVisible(true);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        language,
        setLanguage,
        t,
        appConfig,
        login,
        logout,
        refreshUserData,
        isSignInVisible,
        setSignInVisible,
        isRewardPromoVisible,
        setRewardPromoVisible,
        isImportantNoticeVisible,
        setImportantNoticeVisible,
        isVerifySecondaryVisible,
        setVerifySecondaryVisible,
        secondaryVerificationSuccessCallback,
        triggerSecondaryVerification,
        isLanguageModalVisible,
        setLanguageModalVisible,
        isChangePasswordVisible,
        setChangePasswordVisible,
        isVersionModalVisible,
        setVersionModalVisible,
        isWarningModalVisible,
        setWarningModalVisible,
        warningModalMessage,
        triggerWarningModal,
        isTipsModalVisible,
        setTipsModalVisible,
        tipsModalCallback,
        triggerTipsModal,
        dialogState,
        showDialog,
        hideDialog,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
