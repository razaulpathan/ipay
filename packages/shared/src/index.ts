// Shared Types, Enums, Constants, and Localizations for iPay

export type LanguageCode = 'en' | 'hi';

export interface UserProfile {
  id: string;
  userId: string; // e.g. "113429"
  phone: string; // e.g. "9794678059"
  phoneMasked: string; // e.g. "97*****8059"
  balance: number; // in INR
  totalEarnings: number;
  totalBonus: number;
  totalDeposit: number;
  totalWithdrawal: number;
  todayDeposit: number;
  todayWithdrawal: number;
  todayEarnings: number;
  todayBonus: number;
  teamCommission: number;
  performanceQuota: number;
  performanceQuotaMax: number;
  pendingDeposit: number;
  lockingDeposit: number;
  pendingWithdrawal: number;
  lockingWithdrawal: number;
  isUpiBound: boolean;
  referralCode: string;
  invitedBy?: string;
  createdAt: string;
}

export type WalletProviderType =
  | 'phonepe'
  | 'paytm'
  | 'paytm_business'
  | 'bharatpe_business'
  | 'mobikwik'
  | 'freecharge'
  | 'google_pay_business'
  | 'amazon_pay';

export type WalletBindingMethod = 'APP' | 'OTP';

export interface WalletProviderConfig {
  id: WalletProviderType;
  name: string;
  subtitle?: string;
  iconName: string;
  isRecommend?: boolean;
  supportsPayIn: boolean;
  supportsPayOut: boolean;
  availableMethods: WalletBindingMethod[];
}

export interface WalletBinding {
  id: string;
  userId: string;
  provider: WalletProviderType;
  providerName: string;
  method: WalletBindingMethod;
  phoneNumber: string;
  accountIdentifier?: string;
  status: 'ACTIVE' | 'PENDING' | 'FAILED';
  boundAt: string;
}

export interface QuotaPackage {
  id: string;
  rangeText: string; // e.g. "100-301 INR"
  minAmount: number;
  maxAmount: number;
  incomeText: string; // e.g. "₹3.80(3.8%)+3.00(Activity)"
  stockCount: number; // e.g. 119
  quotaBonus: number; // e.g. 106.80
  ratePercent: number; // 3.8
  activityBonus: number; // 3.00
}

export type OrderStatus = 'PENDING' | 'SUCCESS' | 'CANCELLED' | 'REJECTED';

export interface DepositOrder {
  id: string;
  orderNumber: string;
  userId: string;
  type: 'INR' | 'USDT';
  amount: number; // in INR or USDT
  amountInr: number;
  packageId?: string;
  usdtRatio?: number;
  txidOrHash?: string;
  proofImageUrl?: string;
  walletAddress?: string;
  status: OrderStatus;
  createdAt: string;
  completedAt?: string;
}

export interface WithdrawalOrder {
  id: string;
  orderNumber: string;
  userId: string;
  amount: number;
  upiId?: string;
  walletProvider?: WalletProviderType;
  status: OrderStatus;
  failureReason?: string;
  createdAt: string;
}

export interface BillRecord {
  id: string;
  userId: string;
  type: string; // e.g. "Bonus_Join telegram", "Deposit", "Withdrawal", "Commission"
  amount: number;
  isPositive: boolean;
  balanceAfter: number;
  createdAt: string; // e.g. "23:13:58 19/10/2026"
}

export interface RewardTask {
  id: string;
  title: string; // e.g. "BIND UPI TASK (1 INR)"
  rewardAmount: number; // e.g. 1
  subtitle: string; // e.g. "Bind Phonepe UPI"
  buttonText: string; // e.g. "Go To Bind"
  icon: string;
  isHot?: boolean;
  status: 'AVAILABLE' | 'COMPLETED' | 'IN_PROGRESS';
  category: 'UPI' | 'TELEGRAM' | 'PAYMENT' | 'SERVICE' | 'INVITE';
}

export interface TeamMemberReport {
  level: 'Level A' | 'Level B';
  number: number;
  proportion: string; // "0.2%" or "0.05%"
  earn: number;
}

export interface TeamStats {
  totalDeposit: number;
  teamCommission: number;
  totalSuccessOrder: number;
  totalUser: number;
  periods: {
    today: PeriodStat;
    yesterday: PeriodStat;
    weekly: PeriodStat;
    monthly: PeriodStat;
  };
  reports: TeamMemberReport[];
}

export interface PeriodStat {
  teamDeposit: number;
  commission: number;
  successOrder: number;
  activeUser: number;
  newUser: number;
}

export interface SublineUser {
  id: string;
  userId: string;
  phoneMasked: string;
  level: 'Level A' | 'Level B';
  totalDeposit: number;
  totalCommission: number;
  joinedAt: string;
}

export interface SupportMessage {
  id: string;
  sender: 'USER' | 'AGENT' | 'SYSTEM';
  text: string;
  timestamp: string;
  dateStr: string;
  status?: 'SENT' | 'DELIVERED' | 'READ';
}

export interface BannerItem {
  id: string;
  title: string;
  subtitle?: string;
  actionText: string;
  imageUrl: string;
  linkRoute?: string;
}

export interface AppConfig {
  appName: string;
  version: string;
  usdtRatio: number; // e.g. 109
  bonusRatio: string; // e.g. "3.8%+3"
  marqueeNotice: string;
  importantNotice: string;
  trc20DepositAddress: string;
  telegramChannelUrl: string;
  whatsappContactNumber: string;
  shareBaseUrl: string;
}

// Default Constants
export const APP_CONFIG: AppConfig = {
  appName: 'iPay',
  version: '1.0.32',
  usdtRatio: 109,
  bonusRatio: '3.8%+3',
  marqueeNotice: 'transferred to your wallet, or contact our 24/7 customer service!',
  importantNotice:
    'You shall bear all losses arising from non-compliant operations, including but not limited to:\n• No points rewarded for Pay Out\n• Failed withdrawal for Pay In',
  trc20DepositAddress: 'TPFKUWVEYB772899N9UL',
  telegramChannelUrl: 'https://t.me/ipay_official_support',
  whatsappContactNumber: '+919794678059',
  shareBaseUrl: 'https://share.ipaynow.net/?data=dwkPTEzMzQyOSZjaGFuk',
};

export const DEFAULT_WALLET_PROVIDERS: WalletProviderConfig[] = [
  {
    id: 'phonepe',
    name: 'PhonePe',
    iconName: 'phonepe',
    isRecommend: true,
    supportsPayIn: true,
    supportsPayOut: true,
    availableMethods: ['APP'],
  },
  {
    id: 'paytm',
    name: 'Paytm',
    iconName: 'paytm',
    isRecommend: true,
    supportsPayIn: true,
    supportsPayOut: true,
    availableMethods: ['OTP', 'APP'],
    subtitle: 'If it fails, please try another one.',
  },
  {
    id: 'paytm_business',
    name: 'Paytm Business',
    iconName: 'paytm_business',
    supportsPayIn: true,
    supportsPayOut: true,
    availableMethods: [],
  },
  {
    id: 'bharatpe_business',
    name: 'BharatPe Business',
    iconName: 'bharatpe_business',
    supportsPayIn: true,
    supportsPayOut: true,
    availableMethods: ['OTP'],
  },
  {
    id: 'mobikwik',
    name: 'Mobikwik',
    iconName: 'mobikwik',
    supportsPayIn: true,
    supportsPayOut: true,
    availableMethods: [],
  },
  {
    id: 'freecharge',
    name: 'Freecharge',
    iconName: 'freecharge',
    supportsPayIn: true,
    supportsPayOut: true,
    availableMethods: [],
  },
  {
    id: 'google_pay_business',
    name: 'Google Pay Business',
    iconName: 'google_pay_business',
    supportsPayIn: true,
    supportsPayOut: true,
    availableMethods: [],
  },
  {
    id: 'amazon_pay',
    name: 'Amazon Pay',
    iconName: 'amazon_pay',
    supportsPayIn: true,
    supportsPayOut: true,
    availableMethods: [],
  },
];

export const DEFAULT_QUOTA_PACKAGES: QuotaPackage[] = [
  {
    id: 'quota-1',
    rangeText: '100-301 INR',
    minAmount: 100,
    maxAmount: 301,
    incomeText: '₹3.80(3.8%)+3.00(Activity)',
    stockCount: 119,
    quotaBonus: 106.8,
    ratePercent: 3.8,
    activityBonus: 3.0,
  },
  {
    id: 'quota-2',
    rangeText: '301-501 INR',
    minAmount: 301,
    maxAmount: 501,
    incomeText: '₹11.44(3.8%)+3.00(Activity)',
    stockCount: 7,
    quotaBonus: 315.44,
    ratePercent: 3.8,
    activityBonus: 3.0,
  },
  {
    id: 'quota-3',
    rangeText: '501-1001 INR',
    minAmount: 501,
    maxAmount: 1001,
    incomeText: '₹19.04(3.8%)+3.00(Activity)',
    stockCount: 15,
    quotaBonus: 520.04,
    ratePercent: 3.8,
    activityBonus: 3.0,
  },
  {
    id: 'quota-4',
    rangeText: '1001-2001 INR',
    minAmount: 1001,
    maxAmount: 2001,
    incomeText: '₹38.04(3.8%)+3.00(Activity)',
    stockCount: 133,
    quotaBonus: 1039.04,
    ratePercent: 3.8,
    activityBonus: 3.0,
  },
];

export const PRESET_USDT_AMOUNTS = [10, 50, 100, 250, 500, 750, 1200, 2000];

// Localization dictionary for English and Hindi matching reference app exactly
export const TRANSLATIONS = {
  en: {
    home: 'Home',
    deposit: 'Deposit',
    tools: 'Tools',
    teams: 'Teams',
    assets: 'Assets',
    signInTitle: 'Sign in to your account',
    phoneNumber: 'Phone Number',
    password: 'Password',
    rememberPassword: 'Remember password',
    login: 'Login',
    forgetPassword: 'Forget Password?',
    dontHaveAccount: "Don't have an account?",
    signUp: 'Sign Up',
    accountOrPasswordError: 'Account or password error',
    rewardInviteTitle: '100+50 Reward',
    rewardInviteSub:
      'Invite new users to finish 15 orders the same day Valid for 1 days; expires afterward',
    rewardInviteSub2:
      'The invited person will also receive a reward of 50 for comp',
    inviteNow: 'Invite Now',
    notBoundUpi: "You're not bound to UPI!",
    bindUpiNow: 'Bind UPI Now',
    howToUseIpay: 'How to use iPay',
    balance: 'Balance',
    todayWithdrawal: 'Today Withdrawal',
    todayDeposit: 'Today Deposit',
    teamCommission: 'Team Commission',
    todayEarnings: 'Today Earnings',
    todayBonus: 'Today Bonus',
    performanceQuota: 'Performance Quota',
    bindUpiTask: 'Bind UPI Task (1 INR)',
    paymentTask: 'Payment Task (30 INR)',
    contactService: 'Contact Service (15 INR)',
    joinTelegram: 'Join Telegram (10 INR)',
    bindUpi25: 'Bind UPI Task (25 INR)',
    go: 'Go',
    reward: 'Reward',
    quota: 'Quota',
    inr: 'INR',
    usdt: 'USDT',
    howBuyQuota: 'How Buy Quota?',
    min: 'Min',
    max: 'Max',
    amount: 'Amount',
    buy: 'Buy',
    withdrawalAddress: 'Withdrawal Address',
    enterWithdrawalAddress: '*Please enter the withdrawal wallet address.',
    usdtRatioLabel: 'USDT Ratio: 1 USDT = 109 INR',
    extraBonus: 'Extra: Bonus: 0 INR',
    totalBonusLabel: 'Total Bonus: 1090 INR',
    tipsRechargeArrival:
      'Tips:After the recharge is completed, please wait 3-5 minutes for the deposit to arrive.',
    confirmBuy: 'Confirm Buy',
    payinWithdraw: 'Payin (Withdraw)',
    payoutDeposit: 'Payout (Deposit)',
    noWalletsAdded: 'No wallets added',
    addWalletToStart: 'Add a wallet to start',
    add: '+Add',
    wallet: 'Wallet',
    recommend: 'RECOMMEND',
    pleaseChooseHowToAdd: 'Please choose how to add.',
    verifyPassword: 'Verify Password',
    enterVerifyPassword: 'Enter Verify Password',
    confirm: 'Confirm',
    wrongSecondaryPassword:
      'Wrong secondary password. 3 attempt(s) remaining. Repeated errors lock operations.',
    enterYourPhoneNumber: 'Enter your phone number',
    enterOtp: 'Enter OTP',
    otp: 'OTP',
    submit: 'Submit',
    verificationCodeSent: 'Verification code sent',
    totalDeposit: 'Total Deposit',
    totalSuccessOrder: 'Total Success Order',
    totalUser: 'Total User',
    teamData: 'Team Data',
    viewCommission: 'View Commission >>',
    today: 'Today',
    yesterday: 'Yesterday',
    weekly: 'Weekly',
    monthly: 'Monthly',
    successOrder: 'Success Order',
    activeUser: 'Active User',
    newUser: 'New User',
    shareQrCode: 'Share QR Code',
    myTeamReport: 'My Team Report',
    sublineLink: 'Subline >>',
    levelA: 'Level A',
    levelB: 'Level B',
    number: 'Number',
    proportion: 'Proportion',
    earn: 'Earn',
    linkCopiedSuccessfully: 'Link copied successfully, share it now!',
    copied: 'Copied',
    totalEarnings: 'Total Earnings',
    totalBonus: 'Total Bonus',
    totalWithdrawalText: 'Total Withdrawal',
    pending: 'Pending',
    locking: 'Locking',
    commonFunctions: 'Common Functions',
    bonus: 'Bonus',
    withdrawal: 'Withdrawal',
    billHistory: 'Bill History',
    sublines: 'Sublines',
    telegram: 'Telegram',
    language: 'Language',
    secondaryPassword: 'Secondary Password',
    logout: 'Logout',
    version: 'Version',
    alreadyLatestVersion: 'Already Latest version',
    noRecords: 'No records',
    tipsExitOrder:
      'You have not entered the hash yet. Exiting will be treated as abandoning the order.',
    cancel: 'Cancel',
    ok: 'OK',
    warningAbnormal:
      '1.This order is abnormal.\n\n2.Please verify your UPI status and contact customer service promptly.\n\n⚠️ Note:\nFailure to respond in a timely manner will result in automatic order failure. Funds will not be credited, and any losses incurred shall be borne by yourself.',
    customerService: 'Customer Service',
    typeMessage: 'Type a message...',
    send: 'Send',
    uploadProof: 'Upload Proof',
    uploadSuccess: 'Upload Success',
    enterTxidHash: '*Please enter Txid or Hash(Must) :',
    sampleGraph: 'Sample graph',
    depositUsdt: 'Deposit USDT',
    sendOnlyUsdt: 'Send only USDT to this deposit address.',
    networkTron: 'Network : Tron(TRC20)',
    youWillGet: 'You will get :',
    estimatedBonus: 'Estimated Bonus :',
  },
  hi: {
    home: 'होम',
    deposit: 'डिपॉजिट',
    tools: 'टूल्स',
    teams: 'टीम',
    assets: 'एसेट्स',
    signInTitle: 'अपने खाते में साइन इन करें',
    phoneNumber: 'फ़ोन नंबर',
    password: 'पासवर्ड',
    rememberPassword: 'पासवर्ड याद रखें',
    login: 'लॉग इन करें',
    forgetPassword: 'पासवर्ड भूल गए?',
    dontHaveAccount: 'खाता नहीं है?',
    signUp: 'साइन अप करें',
    accountOrPasswordError: 'खाता या पासवर्ड त्रुटि',
    rewardInviteTitle: '100+50 रिवॉर्ड',
    rewardInviteSub:
      'एक ही दिन में 15 ऑर्डर पूरा करने के लिए नए उपयोगकर्ताओं को आमंत्रित करें। 1 दिन वैध।',
    rewardInviteSub2: 'आमंत्रित व्यक्ति को 50 का इनाम भी मिलेगा',
    inviteNow: 'अभी आमंत्रित करें',
    notBoundUpi: 'आप यूपीआई से जुड़े नहीं हैं!',
    bindUpiNow: 'अभी यूपीआई जोड़ें',
    howToUseIpay: 'iPay का उपयोग कैसे करें',
    balance: 'बैलेंस',
    todayWithdrawal: 'आज की निकासी',
    todayDeposit: 'आज का डिपॉजिट',
    teamCommission: 'टीम कमीशन',
    todayEarnings: 'आज की कमाई',
    todayBonus: 'आज का बोनस',
    performanceQuota: 'प्रदर्शन कोटा',
    bindUpiTask: 'यूपीआई बाइंड कार्य (1 INR)',
    paymentTask: 'भुगतान कार्य (30 INR)',
    contactService: 'ग्राहक सेवा (15 INR)',
    joinTelegram: 'टेलीग्राम से जुड़ें (10 INR)',
    bindUpi25: 'यूपीआई बाइंड कार्य (25 INR)',
    go: 'जाएं',
    reward: 'रिवॉर्ड',
    quota: 'कोटा',
    inr: 'INR',
    usdt: 'USDT',
    howBuyQuota: 'कोटा कैसे खरीदें?',
    min: 'न्यूनतम',
    max: 'अधिकतम',
    amount: 'राशि',
    buy: 'खरीदें',
    withdrawalAddress: 'निकासी पता',
    enterWithdrawalAddress: '*कृपया निकासी वॉलेट पता दर्ज करें।',
    usdtRatioLabel: 'USDT अनुपात: 1 USDT = 109 INR',
    extraBonus: 'अतिरिक्त: बोनस: 0 INR',
    totalBonusLabel: 'कुल बोनस: 1090 INR',
    tipsRechargeArrival:
      'सुझाव: रिचार्ज पूरा होने के बाद कृपया डिपॉजिट आने के लिए 3-5 मिनट प्रतीक्षा करें।',
    confirmBuy: 'खरीद की पुष्टि करें',
    payinWithdraw: 'पे-इन (निकासी)',
    payoutDeposit: 'पे-आउट (डिपॉजिट)',
    noWalletsAdded: 'कोई वॉलेट नहीं जोड़ा गया',
    addWalletToStart: 'शुरू करने के लिए एक वॉलेट जोड़ें',
    add: '+जोड़ें',
    wallet: 'वॉलेट',
    recommend: 'अनुशंसित',
    pleaseChooseHowToAdd: 'कृपया जोड़ने का तरीका चुनें।',
    verifyPassword: 'पासवर्ड सत्यापित करें',
    enterVerifyPassword: 'सत्यापन पासवर्ड दर्ज करें',
    confirm: 'पुष्टि करें',
    wrongSecondaryPassword:
      'गलत द्वितीयक पासवर्ड। 3 प्रयास शेष हैं। बार-बार त्रुटि होने पर ऑपरेशन लॉक हो जाएगा।',
    enterYourPhoneNumber: 'अपना फोन नंबर दर्ज करें',
    enterOtp: 'ओटीपी दर्ज करें',
    otp: 'ओटीपी',
    submit: 'जमा करें',
    verificationCodeSent: 'सत्यापन कोड भेजा गया',
    totalDeposit: 'कुल डिपॉजिट',
    totalSuccessOrder: 'कुल सफल ऑर्डर',
    totalUser: 'कुल उपयोगकर्ता',
    teamData: 'टीम डेटा',
    viewCommission: 'कमीशन देखें >>',
    today: 'आज',
    yesterday: 'कल',
    weekly: 'साप्ताहिक',
    monthly: 'मासिक',
    successOrder: 'सफल ऑर्डर',
    activeUser: 'सक्रिय उपयोगकर्ता',
    newUser: 'नया उपयोगकर्ता',
    shareQrCode: 'क्यूआर कोड साझा करें',
    myTeamReport: 'मेरी टीम रिपोर्ट',
    sublineLink: 'सबलाइन >>',
    levelA: 'लेवल A',
    levelB: 'लेवल B',
    number: 'संख्या',
    proportion: 'अनुपात',
    earn: 'कमाई',
    linkCopiedSuccessfully: 'लिंक सफलतापूर्वक कॉपी किया गया, इसे साझा करें!',
    copied: 'कॉपी किया गया',
    totalEarnings: 'कुल कमाई',
    totalBonus: 'कुल बोनस',
    totalWithdrawalText: 'कुल निकासी',
    pending: 'लंबित',
    locking: 'लॉकिंग',
    commonFunctions: 'सामान्य फंक्शन',
    bonus: 'बोनस',
    withdrawal: 'विथड्रॉ',
    billHistory: 'बिल रिकॉर्ड',
    sublines: 'सबलाइन्स',
    telegram: 'टेलीग्राम',
    language: 'भाषा',
    secondaryPassword: 'द्वितीयक पासवर्ड',
    logout: 'लॉगआउट',
    version: 'वर्जन',
    alreadyLatestVersion: 'पहले से ही नवीनतम संस्करण',
    noRecords: 'कोई रिकॉर्ड नहीं',
    tipsExitOrder:
      'आपने अभी तक हैश दर्ज नहीं किया है। बाहर निकलने पर ऑर्डर रद्द माना जाएगा।',
    cancel: 'रद्द करें',
    ok: 'ठीक है',
    warningAbnormal:
      '1. यह ऑर्डर असामान्य है।\n\n2. कृपया अपने यूपीआई की स्थिति सत्यापित करें और तुरंत ग्राहक सेवा से संपर्क करें।\n\n⚠️ सूचना:\nसमय पर उत्तर न देने पर ऑर्डर स्वचालित रूप से विफल हो जाएगा।',
    customerService: 'ग्राहक सेवा',
    typeMessage: 'संदेश लिखें...',
    send: 'भेजें',
    uploadProof: 'प्रमाण अपलोड करें',
    uploadSuccess: 'अपलोड सफल',
    enterTxidHash: '*कृपया Txid या हैश दर्ज करें (अनिवार्य) :',
    sampleGraph: 'नमूना ग्राफ',
    depositUsdt: 'डिपॉजिट USDT',
    sendOnlyUsdt: 'केवल USDT इस डिपॉजिट पते पर भेजें।',
    networkTron: 'नेटवर्क : Tron(TRC20)',
    youWillGet: 'आपको मिलेगा :',
    estimatedBonus: 'अनुमानित बोनस :',
  },
};
