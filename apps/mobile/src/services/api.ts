import {
  UserProfile,
  DEFAULT_QUOTA_PACKAGES,
  DEFAULT_WALLET_PROVIDERS,
  APP_CONFIG,
  QuotaPackage,
  WalletProviderConfig,
} from '../shared';

// Configurable backend URL: defaults to localhost:3000 or production Vercel URL
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3000/api/v1'; // 10.0.2.2 is Android emulator host loopback

class MobileApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || 'Server request failed');
      }

      return data;
    } catch (err: any) {
      console.warn(`[API] Network call to ${endpoint} failed:`, err.message);
      throw err;
    }
  }

  // Auth
  async login(phone: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, password }),
    });
  }

  async register(phone: string, password: string, referralCode?: string) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ phone, password, referralCode }),
    });
  }

  async getMe() {
    return this.request('/auth/me');
  }

  async verifySecondaryPassword(secondaryPassword: string) {
    return this.request('/auth/verify-secondary', {
      method: 'POST',
      body: JSON.stringify({ secondaryPassword }),
    });
  }

  async changePassword(newPassword: string, confirmNewPassword: string, otp: string) {
    return this.request('/auth/password', {
      method: 'POST',
      body: JSON.stringify({ newPassword, confirmNewPassword, otp }),
    });
  }

  async changeSecondaryPassword(
    oldSecondaryPassword: string,
    newSecondaryPassword: string,
    confirmSecondaryPassword: string
  ) {
    return this.request('/auth/secondary-password', {
      method: 'POST',
      body: JSON.stringify({
        oldSecondaryPassword,
        newSecondaryPassword,
        confirmSecondaryPassword,
      }),
    });
  }

  async sendOtp(phone: string, purpose?: string) {
    return this.request('/auth/otp', {
      method: 'POST',
      body: JSON.stringify({ phone, purpose }),
    });
  }

  // Account & Quota
  async getStats() {
    return this.request('/account/stats');
  }

  async getQuotaPackages() {
    return this.request('/deposit/packages');
  }

  async buyQuotaPackage(packageId: string, amount: number) {
    return this.request('/deposit/inr/buy', {
      method: 'POST',
      body: JSON.stringify({ packageId, amount }),
    });
  }

  async initiateUsdtDeposit(amountUsdt: number, withdrawalAddress: string) {
    return this.request('/deposit/usdt/initiate', {
      method: 'POST',
      body: JSON.stringify({ amountUsdt, withdrawalAddress }),
    });
  }

  async submitUsdtProof(orderNumber: string, txidOrHash: string, proofUrl?: string) {
    return this.request('/deposit/usdt/submit', {
      method: 'POST',
      body: JSON.stringify({ orderNumber, txidOrHash, proofUrl }),
    });
  }

  // Wallets
  async getAvailableWallets() {
    return this.request('/wallets/available');
  }

  async bindWallet(provider: string, method: string, phoneNumber: string, otp: string) {
    return this.request('/wallets/bind', {
      method: 'POST',
      body: JSON.stringify({ provider, method, phoneNumber, otp }),
    });
  }

  async getBoundWallets() {
    return this.request('/wallets/list');
  }

  // Teams & Rewards
  async getTeamReport() {
    return this.request('/teams/report');
  }

  async getSublines(level?: string) {
    return this.request(`/teams/sublines?level=${level || 'Level A'}`);
  }

  async getRewardTasks() {
    return this.request('/rewards/tasks');
  }

  // Records
  async getBills() {
    return this.request('/bills');
  }

  async getDepositOrders(type?: 'INR' | 'USDT') {
    return this.request(`/orders${type ? `?type=${type}` : ''}`);
  }

  async getWithdrawals() {
    return this.request('/withdrawals');
  }

  async createWithdrawal(amount: number, upiId?: string) {
    return this.request('/withdrawals', {
      method: 'POST',
      body: JSON.stringify({ amount, upiId }),
    });
  }

  // Customer Service
  async getSupportMessages() {
    return this.request('/support/messages');
  }

  async sendSupportMessage(text: string) {
    return this.request('/support/messages', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  // App Config
  async getAppConfig() {
    return this.request('/app/config');
  }
}

export const api = new MobileApiClient();
