'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Users,
  CreditCard,
  ArrowDownCircle,
  ArrowUpCircle,
  Settings,
  FileText,
  LogOut,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  Lock,
  Eye,
  EyeOff,
  DollarSign,
  TrendingUp,
  Activity,
  Check,
  X,
} from 'lucide-react';

export default function MasterAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Login form state
  const [loginUsername, setLoginUsername] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('Admin@iPay2026!#');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Active module tab
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'deposits' | 'withdrawals' | 'wallets' | 'settings' | 'audit'>('overview');

  // Data states
  const [usersList, setUsersList] = useState<any[]>([]);
  const [depositsList, setDepositsList] = useState<any[]>([]);
  const [withdrawalsList, setWithdrawalsList] = useState<any[]>([]);
  const [walletsList, setWalletsList] = useState<any[]>([]);
  const [auditLogsList, setAuditLogsList] = useState<any[]>([]);
  const [appSettings, setAppSettings] = useState<any>({
    usdtRatio: 109,
    bonusRatio: '3.8%+3',
    trc20DepositAddress: 'TPFKUWVEYB772899N9UL',
    marqueeNotice: 'transferred to your wallet, or contact our 24/7 customer service!',
    importantNotice: 'You shall bear all losses arising from non-compliant operations, including but not limited to:\n• No points rewarded for Pay Out\n• Failed withdrawal for Pay In',
  });

  const [searchUserQuery, setSearchUserQuery] = useState('');
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<any>(null);
  const [balanceAdjustmentInput, setBalanceAdjustmentInput] = useState('');
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Check auth session
  useEffect(() => {
    checkAdminSession();
  }, []);

  const checkAdminSession = async () => {
    try {
      const res = await fetch('/api/v1/admin/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.admin) {
          setIsAuthenticated(true);
          setAdminUser(data.admin);
          loadAllAdminData();
        }
      }
    } catch (err) {
      console.error('Session check failed', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await fetch('/api/v1/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        setLoginError(data.error || 'Invalid credentials');
      } else {
        setIsAuthenticated(true);
        setAdminUser(data.admin);
        showToast('Authenticated as Master Administrator');
        loadAllAdminData();
      }
    } catch (err) {
      setLoginError('Failed to connect to server');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/v1/admin/auth/logout', { method: 'POST' });
    } catch (e) {}
    setIsAuthenticated(false);
    setAdminUser(null);
  };

  const loadAllAdminData = async () => {
    try {
      const [uRes, dRes, wRes, walRes, sRes, aRes] = await Promise.all([
        fetch('/api/v1/admin/users').then((r) => r.json()),
        fetch('/api/v1/admin/deposits').then((r) => r.json()),
        fetch('/api/v1/admin/withdrawals').then((r) => r.json()),
        fetch('/api/v1/admin/wallets').then((r) => r.json()),
        fetch('/api/v1/admin/settings').then((r) => r.json()),
        fetch('/api/v1/admin/audit-logs').then((r) => r.json()),
      ]);

      if (uRes.users) setUsersList(uRes.users);
      if (dRes.deposits) setDepositsList(dRes.deposits);
      if (wRes.withdrawals) setWithdrawalsList(wRes.withdrawals);
      if (walRes.wallets) setWalletsList(walRes.wallets);
      if (sRes.config) setAppSettings(sRes.config);
      if (aRes.logs) setAuditLogsList(aRes.logs);
    } catch (err) {
      console.error('Failed to load admin datasets', err);
    }
  };

  const handleReviewDeposit = async (orderNumber: string, action: 'APPROVE' | 'REJECT') => {
    try {
      const res = await fetch('/api/v1/admin/deposits', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber, action }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`Order ${orderNumber} marked as ${action}D`);
        loadAllAdminData();
      } else {
        showToast(data.error || 'Action failed', 'error');
      }
    } catch (err) {
      showToast('Network error', 'error');
    }
  };

  const handleReviewWithdrawal = async (orderNumber: string, action: 'APPROVE' | 'REJECT') => {
    try {
      const res = await fetch('/api/v1/admin/withdrawals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber, action }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`Withdrawal ${orderNumber} marked as ${action}D`);
        loadAllAdminData();
      } else {
        showToast(data.error || 'Action failed', 'error');
      }
    } catch (err) {
      showToast('Network error', 'error');
    }
  };

  const handleUpdateUser = async (userId: string, updates: any) => {
    try {
      const res = await fetch('/api/v1/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...updates }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast('User record updated');
        setSelectedUserForEdit(null);
        setBalanceAdjustmentInput('');
        loadAllAdminData();
      } else {
        showToast(data.error || 'Update failed', 'error');
      }
    } catch (err) {
      showToast('Network error', 'error');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appSettings),
      });
      const data = await res.json();
      if (res.ok) {
        showToast('System configuration saved successfully');
        loadAllAdminData();
      } else {
        showToast(data.error || 'Save failed', 'error');
      }
    } catch (err) {
      showToast('Network error', 'error');
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <RefreshCw size={28} className="animate-spin" style={{ color: 'var(--primary)' }} />
      </div>
    );
  }

  // Unauthenticated Login Screen
  if (!isAuthenticated) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
          background: 'radial-gradient(circle at top center, #13221b 0%, #0b0f17 70%)',
        }}
      >
        <div
          className="glass-panel"
          style={{
            maxWidth: 440,
            width: '100%',
            padding: 40,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px var(--primary-glow)',
            borderColor: 'rgba(5, 193, 117, 0.3)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 16,
                margin: '0 auto 16px',
                overflow: 'hidden',
                boxShadow: '0 6px 16px var(--primary-glow)',
                border: '1px solid rgba(5, 193, 117, 0.5)',
              }}
            >
              <img src="/images/app_icon.jpg" alt="iPay" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5 }}>Master Admin Portal</h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
              Route: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>/t20</span> • Authorized Personnel Only
            </p>
          </div>

          {loginError && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '12px 16px',
                borderRadius: 10,
                fontSize: 13,
                color: '#f87171',
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <AlertTriangle size={16} />
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>
                Username
              </label>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 10,
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--bg-card-border)',
                  color: '#ffffff',
                  fontSize: 14,
                }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>
                Master Password
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 10,
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--bg-card-border)',
                  color: '#ffffff',
                  fontSize: 14,
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="gradient-btn"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              {loginLoading ? (
                <RefreshCw size={18} className="animate-spin" />
              ) : (
                <>
                  <ShieldAlert size={18} />
                  Authorize Access
                </>
              )}
            </button>
          </form>

          <div style={{ marginTop: 28, textAlign: 'center', borderTop: '1px solid var(--bg-card-border)', paddingTop: 18 }}>
            <Link href="/" style={{ fontSize: 13, color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              ← Return to Download Page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filtered users for search
  const filteredUsers = usersList.filter(
    (u) =>
      u.userId.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
      u.phone.toLowerCase().includes(searchUserQuery.toLowerCase())
  );

  const pendingDepositsCount = depositsList.filter((d) => d.status === 'PENDING').length;
  const pendingWithdrawalsCount = withdrawalsList.filter((w) => w.status === 'PENDING').length;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#0b0f17' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: 24,
            right: 24,
            zIndex: 1000,
            padding: '12px 20px',
            borderRadius: 10,
            background: toastMessage.type === 'success' ? '#065f46' : '#991b1b',
            color: '#ffffff',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {toastMessage.type === 'success' ? <Check size={18} /> : <X size={18} />}
          {toastMessage.text}
        </div>
      )}

      {/* Admin Sidebar */}
      <aside
        style={{
          width: 260,
          background: '#0d131f',
          borderRight: '1px solid var(--bg-card-border)',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32, paddingLeft: 8 }}>
          <img src="/images/app_icon.jpg" alt="iPay" style={{ width: 36, height: 36, borderRadius: 8 }} />
          <div>
            <span style={{ fontWeight: 800, fontSize: 18 }}>iPay Admin</span>
            <p style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 700 }}>ROUTE /t20</p>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 14px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              color: activeTab === 'overview' ? '#ffffff' : 'var(--text-muted)',
              background: activeTab === 'overview' ? 'rgba(5, 193, 117, 0.15)' : 'transparent',
              border: activeTab === 'overview' ? '1px solid rgba(5, 193, 117, 0.3)' : '1px solid transparent',
              textAlign: 'left',
            }}
          >
            <Activity size={18} style={{ color: activeTab === 'overview' ? 'var(--primary)' : 'inherit' }} />
            Overview
          </button>

          <button
            onClick={() => setActiveTab('users')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 14px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              color: activeTab === 'users' ? '#ffffff' : 'var(--text-muted)',
              background: activeTab === 'users' ? 'rgba(5, 193, 117, 0.15)' : 'transparent',
              border: activeTab === 'users' ? '1px solid rgba(5, 193, 117, 0.3)' : '1px solid transparent',
              textAlign: 'left',
            }}
          >
            <Users size={18} style={{ color: activeTab === 'users' ? 'var(--primary)' : 'inherit' }} />
            Users Management ({usersList.length})
          </button>

          <button
            onClick={() => setActiveTab('deposits')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              color: activeTab === 'deposits' ? '#ffffff' : 'var(--text-muted)',
              background: activeTab === 'deposits' ? 'rgba(5, 193, 117, 0.15)' : 'transparent',
              border: activeTab === 'deposits' ? '1px solid rgba(5, 193, 117, 0.3)' : '1px solid transparent',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <ArrowDownCircle size={18} style={{ color: activeTab === 'deposits' ? 'var(--primary)' : 'inherit' }} />
              Deposits Review
            </div>
            {pendingDepositsCount > 0 && (
              <span
                style={{
                  background: '#f59e0b',
                  color: '#000',
                  fontSize: 11,
                  fontWeight: 800,
                  padding: '2px 6px',
                  borderRadius: 10,
                }}
              >
                {pendingDepositsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('withdrawals')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              color: activeTab === 'withdrawals' ? '#ffffff' : 'var(--text-muted)',
              background: activeTab === 'withdrawals' ? 'rgba(5, 193, 117, 0.15)' : 'transparent',
              border: activeTab === 'withdrawals' ? '1px solid rgba(5, 193, 117, 0.3)' : '1px solid transparent',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <ArrowUpCircle size={18} style={{ color: activeTab === 'withdrawals' ? 'var(--primary)' : 'inherit' }} />
              Withdrawals
            </div>
            {pendingWithdrawalsCount > 0 && (
              <span
                style={{
                  background: '#ef4444',
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 800,
                  padding: '2px 6px',
                  borderRadius: 10,
                }}
              >
                {pendingWithdrawalsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('wallets')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 14px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              color: activeTab === 'wallets' ? '#ffffff' : 'var(--text-muted)',
              background: activeTab === 'wallets' ? 'rgba(5, 193, 117, 0.15)' : 'transparent',
              border: activeTab === 'wallets' ? '1px solid rgba(5, 193, 117, 0.3)' : '1px solid transparent',
              textAlign: 'left',
            }}
          >
            <CreditCard size={18} style={{ color: activeTab === 'wallets' ? 'var(--primary)' : 'inherit' }} />
            Wallet Bindings ({walletsList.length})
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 14px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              color: activeTab === 'settings' ? '#ffffff' : 'var(--text-muted)',
              background: activeTab === 'settings' ? 'rgba(5, 193, 117, 0.15)' : 'transparent',
              border: activeTab === 'settings' ? '1px solid rgba(5, 193, 117, 0.3)' : '1px solid transparent',
              textAlign: 'left',
            }}
          >
            <Settings size={18} style={{ color: activeTab === 'settings' ? 'var(--primary)' : 'inherit' }} />
            System Settings
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 14px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              color: activeTab === 'audit' ? '#ffffff' : 'var(--text-muted)',
              background: activeTab === 'audit' ? 'rgba(5, 193, 117, 0.15)' : 'transparent',
              border: activeTab === 'audit' ? '1px solid rgba(5, 193, 117, 0.3)' : '1px solid transparent',
              textAlign: 'left',
            }}
          >
            <FileText size={18} style={{ color: activeTab === 'audit' ? 'var(--primary)' : 'inherit' }} />
            Audit Logs
          </button>
        </nav>

        <div style={{ borderTop: '1px solid var(--bg-card-border)', paddingTop: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>{adminUser?.username}</p>
              <p style={{ fontSize: 11, color: 'var(--primary)' }}>{adminUser?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#ef4444',
                padding: '6px 10px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
          <Link href="/" style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', textAlign: 'center' }}>
            ← View Download Site
          </Link>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, textTransform: 'capitalize' }}>{activeTab} Management</h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              Live real-time administration panel for iPay mobile operations
            </p>
          </div>

          <button
            onClick={loadAllAdminData}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--bg-card-border)',
              color: '#ffffff',
              padding: '8px 16px',
              borderRadius: 8,
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <RefreshCw size={14} />
            Refresh Data
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 20,
                marginBottom: 32,
              }}
            >
              <div className="glass-panel" style={{ padding: 20 }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Users</span>
                <p style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>{usersList.length}</p>
                <span style={{ fontSize: 12, color: 'var(--primary)' }}>Registered accounts</span>
              </div>

              <div className="glass-panel" style={{ padding: 20 }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Pending Deposits
                </span>
                <p style={{ fontSize: 28, fontWeight: 800, marginTop: 8, color: '#f59e0b' }}>
                  {pendingDepositsCount}
                </p>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Awaiting verification</span>
              </div>

              <div className="glass-panel" style={{ padding: 20 }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Pending Withdrawals
                </span>
                <p style={{ fontSize: 28, fontWeight: 800, marginTop: 8, color: '#ef4444' }}>
                  {pendingWithdrawalsCount}
                </p>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Requests in queue</span>
              </div>

              <div className="glass-panel" style={{ padding: 20 }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Live USDT Ratio
                </span>
                <p style={{ fontSize: 28, fontWeight: 800, marginTop: 8, color: 'var(--primary)' }}>
                  1 = ₹{appSettings.usdtRatio}
                </p>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Tron TRC20 fixed</span>
              </div>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div className="glass-panel" style={{ padding: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Pending Deposit Orders</h3>
                {pendingDepositsCount === 0 ? (
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No pending deposit orders.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {depositsList
                      .filter((d) => d.status === 'PENDING')
                      .slice(0, 5)
                      .map((d) => (
                        <div
                          key={d.orderNumber}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: 12,
                            borderRadius: 8,
                            background: 'rgba(255, 255, 255, 0.02)',
                          }}
                        >
                          <div>
                            <p style={{ fontSize: 13, fontWeight: 700 }}>
                              {d.orderNumber} • ₹{d.amountInr} ({d.type})
                            </p>
                            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>User: {d.userId}</p>
                          </div>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button
                              onClick={() => handleReviewDeposit(d.orderNumber, 'APPROVE')}
                              style={{
                                background: 'var(--primary)',
                                color: '#fff',
                                padding: '4px 10px',
                                borderRadius: 6,
                                fontSize: 11,
                                fontWeight: 700,
                              }}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReviewDeposit(d.orderNumber, 'REJECT')}
                              style={{
                                background: '#ef4444',
                                color: '#fff',
                                padding: '4px 10px',
                                borderRadius: 6,
                                fontSize: 11,
                                fontWeight: 700,
                              }}
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              <div className="glass-panel" style={{ padding: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Recent System Audits</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {auditLogsList.slice(0, 5).map((log, i) => (
                    <div
                      key={i}
                      style={{
                        padding: 10,
                        borderRadius: 8,
                        background: 'rgba(255, 255, 255, 0.02)',
                        fontSize: 12,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary)', fontWeight: 600 }}>
                        <span>{log.action}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{log.adminUsername}</span>
                      </div>
                      <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>{log.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Users Management */}
        {activeTab === 'users' && (
          <div>
            <div style={{ marginBottom: 20, display: 'flex', gap: 12 }}>
              <div
                style={{
                  position: 'relative',
                  flex: 1,
                  maxWidth: 400,
                }}
              >
                <Search
                  size={16}
                  style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                />
                <input
                  type="text"
                  placeholder="Search user by ID or Phone..."
                  value={searchUserQuery}
                  onChange={(e) => setSearchUserQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 38px',
                    borderRadius: 8,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--bg-card-border)',
                    color: '#ffffff',
                    fontSize: 14,
                  }}
                />
              </div>
            </div>

            <div className="glass-panel" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--bg-card-border)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: 14 }}>User ID</th>
                    <th style={{ padding: 14 }}>Phone</th>
                    <th style={{ padding: 14 }}>Balance</th>
                    <th style={{ padding: 14 }}>Total Deposit</th>
                    <th style={{ padding: 14 }}>UPI Bound</th>
                    <th style={{ padding: 14 }}>Secondary Lock</th>
                    <th style={{ padding: 14 }}>Status</th>
                    <th style={{ padding: 14, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.userId} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: 14, fontWeight: 700 }}>{u.userId}</td>
                      <td style={{ padding: 14 }}>{u.phone}</td>
                      <td style={{ padding: 14, color: 'var(--primary)', fontWeight: 700 }}>₹{u.balance}</td>
                      <td style={{ padding: 14 }}>₹{u.totalDeposit || 0}</td>
                      <td style={{ padding: 14 }}>
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: 12,
                            fontSize: 11,
                            fontWeight: 700,
                            background: u.isUpiBound ? 'rgba(5, 193, 117, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: u.isUpiBound ? 'var(--primary)' : '#ef4444',
                          }}
                        >
                          {u.isUpiBound ? 'YES' : 'NO'}
                        </span>
                      </td>
                      <td style={{ padding: 14 }}>
                        {u.isSecondaryLocked ? (
                          <span style={{ color: '#ef4444', fontWeight: 700 }}>LOCKED</span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>OK ({u.failedSecondaryAttempts || 0} err)</span>
                        )}
                      </td>
                      <td style={{ padding: 14 }}>
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: 12,
                            fontSize: 11,
                            fontWeight: 700,
                            background:
                              u.status === 'ACTIVE'
                                ? 'rgba(5, 193, 117, 0.15)'
                                : u.status === 'FROZEN'
                                ? 'rgba(245, 158, 11, 0.15)'
                                : 'rgba(239, 68, 68, 0.15)',
                            color:
                              u.status === 'ACTIVE'
                                ? 'var(--primary)'
                                : u.status === 'FROZEN'
                                ? '#f59e0b'
                                : '#ef4444',
                          }}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td style={{ padding: 14, textAlign: 'right' }}>
                        <button
                          onClick={() => setSelectedUserForEdit(u)}
                          style={{
                            background: 'rgba(255, 255, 255, 0.08)',
                            color: '#ffffff',
                            padding: '6px 12px',
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Manage User Modal */}
            {selectedUserForEdit && (
              <div
                style={{
                  position: 'fixed',
                  inset: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.75)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 200,
                  padding: 20,
                }}
              >
                <div
                  className="glass-panel"
                  style={{
                    maxWidth: 480,
                    width: '100%',
                    padding: 28,
                    background: '#121826',
                  }}
                >
                  <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
                    Manage User #{selectedUserForEdit.userId}
                  </h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
                    Phone: {selectedUserForEdit.phone} • Current Balance: ₹{selectedUserForEdit.balance}
                  </p>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
                      Account Status
                    </label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {(['ACTIVE', 'FROZEN', 'BANNED'] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => handleUpdateUser(selectedUserForEdit.userId, { status: st })}
                          style={{
                            flex: 1,
                            padding: '8px',
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 700,
                            background: selectedUserForEdit.status === st ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
                            color: selectedUserForEdit.status === st ? '#fff' : 'var(--text-muted)',
                          }}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
                      Balance Adjustment (+Credit or -Debit INR)
                    </label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        type="number"
                        placeholder="e.g. +100 or -50"
                        value={balanceAdjustmentInput}
                        onChange={(e) => setBalanceAdjustmentInput(e.target.value)}
                        style={{
                          flex: 1,
                          padding: '10px 14px',
                          borderRadius: 8,
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid var(--bg-card-border)',
                          color: '#ffffff',
                          fontSize: 14,
                        }}
                      />
                      <button
                        onClick={() =>
                          handleUpdateUser(selectedUserForEdit.userId, {
                            balanceAdjustment: balanceAdjustmentInput,
                          })
                        }
                        style={{
                          background: 'var(--primary)',
                          color: '#fff',
                          padding: '0 16px',
                          borderRadius: 8,
                          fontSize: 13,
                          fontWeight: 700,
                        }}
                      >
                        Apply
                      </button>
                    </div>
                  </div>

                  {selectedUserForEdit.isSecondaryLocked && (
                    <div style={{ marginBottom: 20 }}>
                      <button
                        onClick={() => handleUpdateUser(selectedUserForEdit.userId, { unlockSecondary: true })}
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: 8,
                          background: 'rgba(245, 158, 11, 0.2)',
                          color: '#f59e0b',
                          border: '1px solid rgba(245, 158, 11, 0.4)',
                          fontSize: 13,
                          fontWeight: 700,
                        }}
                      >
                        Reset Secondary Password Lockout
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => setSelectedUserForEdit(null)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: 8,
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: '#ffffff',
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Deposits Review */}
        {activeTab === 'deposits' && (
          <div className="glass-panel" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--bg-card-border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: 14 }}>Order No</th>
                  <th style={{ padding: 14 }}>User ID</th>
                  <th style={{ padding: 14 }}>Type</th>
                  <th style={{ padding: 14 }}>Amount</th>
                  <th style={{ padding: 14 }}>INR Credit</th>
                  <th style={{ padding: 14 }}>Txid / Hash</th>
                  <th style={{ padding: 14 }}>Status</th>
                  <th style={{ padding: 14, textAlign: 'right' }}>Review Action</th>
                </tr>
              </thead>
              <tbody>
                {depositsList.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
                      No deposit records found.
                    </td>
                  </tr>
                ) : (
                  depositsList.map((d) => (
                    <tr key={d.orderNumber} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: 14, fontWeight: 700 }}>{d.orderNumber}</td>
                      <td style={{ padding: 14 }}>{d.userId}</td>
                      <td style={{ padding: 14 }}>
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: 12,
                            fontSize: 11,
                            fontWeight: 700,
                            background: d.type === 'USDT' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(5, 193, 117, 0.15)',
                            color: d.type === 'USDT' ? 'var(--accent-cyan)' : 'var(--primary)',
                          }}
                        >
                          {d.type}
                        </span>
                      </td>
                      <td style={{ padding: 14 }}>{d.amount} {d.type}</td>
                      <td style={{ padding: 14, fontWeight: 700, color: 'var(--primary)' }}>₹{d.amountInr}</td>
                      <td style={{ padding: 14, fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                        {d.txidOrHash || <span style={{ color: 'var(--text-muted)' }}>Not submitted</span>}
                      </td>
                      <td style={{ padding: 14 }}>
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: 12,
                            fontSize: 11,
                            fontWeight: 700,
                            background:
                              d.status === 'SUCCESS'
                                ? 'rgba(5, 193, 117, 0.15)'
                                : d.status === 'PENDING'
                                ? 'rgba(245, 158, 11, 0.15)'
                                : 'rgba(239, 68, 68, 0.15)',
                            color:
                              d.status === 'SUCCESS'
                                ? 'var(--primary)'
                                : d.status === 'PENDING'
                                ? '#f59e0b'
                                : '#ef4444',
                          }}
                        >
                          {d.status}
                        </span>
                      </td>
                      <td style={{ padding: 14, textAlign: 'right' }}>
                        {d.status === 'PENDING' ? (
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                            <button
                              onClick={() => handleReviewDeposit(d.orderNumber, 'APPROVE')}
                              style={{
                                background: 'var(--primary)',
                                color: '#fff',
                                padding: '6px 12px',
                                borderRadius: 6,
                                fontSize: 12,
                                fontWeight: 700,
                              }}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReviewDeposit(d.orderNumber, 'REJECT')}
                              style={{
                                background: '#ef4444',
                                color: '#fff',
                                padding: '6px 12px',
                                borderRadius: 6,
                                fontSize: 12,
                                fontWeight: 700,
                              }}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Processed</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 4: Withdrawals Review */}
        {activeTab === 'withdrawals' && (
          <div className="glass-panel" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--bg-card-border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: 14 }}>Order No</th>
                  <th style={{ padding: 14 }}>User ID</th>
                  <th style={{ padding: 14 }}>Amount</th>
                  <th style={{ padding: 14 }}>UPI Target</th>
                  <th style={{ padding: 14 }}>Status</th>
                  <th style={{ padding: 14, textAlign: 'right' }}>Review Action</th>
                </tr>
              </thead>
              <tbody>
                {withdrawalsList.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
                      No withdrawal requests found.
                    </td>
                  </tr>
                ) : (
                  withdrawalsList.map((w) => (
                    <tr key={w.orderNumber} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: 14, fontWeight: 700 }}>{w.orderNumber}</td>
                      <td style={{ padding: 14 }}>{w.userId}</td>
                      <td style={{ padding: 14, fontWeight: 700, color: '#ef4444' }}>₹{w.amount}</td>
                      <td style={{ padding: 14 }}>{w.upiId || 'PhonePe / Paytm'}</td>
                      <td style={{ padding: 14 }}>
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: 12,
                            fontSize: 11,
                            fontWeight: 700,
                            background:
                              w.status === 'SUCCESS'
                                ? 'rgba(5, 193, 117, 0.15)'
                                : w.status === 'PENDING'
                                ? 'rgba(245, 158, 11, 0.15)'
                                : 'rgba(239, 68, 68, 0.15)',
                            color:
                              w.status === 'SUCCESS'
                                ? 'var(--primary)'
                                : w.status === 'PENDING'
                                ? '#f59e0b'
                                : '#ef4444',
                          }}
                        >
                          {w.status}
                        </span>
                      </td>
                      <td style={{ padding: 14, textAlign: 'right' }}>
                        {w.status === 'PENDING' ? (
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                            <button
                              onClick={() => handleReviewWithdrawal(w.orderNumber, 'APPROVE')}
                              style={{
                                background: 'var(--primary)',
                                color: '#fff',
                                padding: '6px 12px',
                                borderRadius: 6,
                                fontSize: 12,
                                fontWeight: 700,
                              }}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReviewWithdrawal(w.orderNumber, 'REJECT')}
                              style={{
                                background: '#ef4444',
                                color: '#fff',
                                padding: '6px 12px',
                                borderRadius: 6,
                                fontSize: 12,
                                fontWeight: 700,
                              }}
                            >
                              Reject & Refund
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Processed</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 5: Wallet Bindings */}
        {activeTab === 'wallets' && (
          <div className="glass-panel" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--bg-card-border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: 14 }}>User ID</th>
                  <th style={{ padding: 14 }}>Provider</th>
                  <th style={{ padding: 14 }}>Method</th>
                  <th style={{ padding: 14 }}>Phone Number</th>
                  <th style={{ padding: 14 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {walletsList.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
                      No wallet bindings yet.
                    </td>
                  </tr>
                ) : (
                  walletsList.map((wal, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: 14, fontWeight: 700 }}>{wal.userId}</td>
                      <td style={{ padding: 14 }}>{wal.providerName}</td>
                      <td style={{ padding: 14 }}>
                        <span style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '2px 8px', borderRadius: 4 }}>
                          {wal.method}
                        </span>
                      </td>
                      <td style={{ padding: 14 }}>{wal.phoneNumber}</td>
                      <td style={{ padding: 14 }}>
                        <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{wal.status}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 6: System Settings */}
        {activeTab === 'settings' && (
          <div className="glass-panel" style={{ maxWidth: 640, padding: 32 }}>
            <form onSubmit={handleSaveSettings}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>
                  Tron TRC20 USDT Deposit Address
                </label>
                <input
                  type="text"
                  value={appSettings.trc20DepositAddress || ''}
                  onChange={(e) => setAppSettings({ ...appSettings, trc20DepositAddress: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 10,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--bg-card-border)',
                    color: '#ffffff',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 14,
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>
                    USDT Ratio (1 USDT = ? INR)
                  </label>
                  <input
                    type="number"
                    value={appSettings.usdtRatio || 109}
                    onChange={(e) => setAppSettings({ ...appSettings, usdtRatio: Number(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 10,
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--bg-card-border)',
                      color: '#ffffff',
                      fontSize: 14,
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>
                    INR Bonus Ratio String
                  </label>
                  <input
                    type="text"
                    value={appSettings.bonusRatio || '3.8%+3'}
                    onChange={(e) => setAppSettings({ ...appSettings, bonusRatio: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 10,
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--bg-card-border)',
                      color: '#ffffff',
                      fontSize: 14,
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>
                  Marquee Notification Text
                </label>
                <input
                  type="text"
                  value={appSettings.marqueeNotice || ''}
                  onChange={(e) => setAppSettings({ ...appSettings, marqueeNotice: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 10,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--bg-card-border)',
                    color: '#ffffff',
                    fontSize: 14,
                  }}
                />
              </div>

              <div style={{ marginBottom: 28 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>
                  Important Notice (Compliance Warning)
                </label>
                <textarea
                  rows={4}
                  value={appSettings.importantNotice || ''}
                  onChange={(e) => setAppSettings({ ...appSettings, importantNotice: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 10,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--bg-card-border)',
                    color: '#ffffff',
                    fontSize: 14,
                    lineHeight: 1.5,
                  }}
                />
              </div>

              <button
                type="submit"
                className="gradient-btn"
                style={{
                  padding: '14px 28px',
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 700,
                }}
              >
                Save Configuration
              </button>
            </form>
          </div>
        )}

        {/* Tab 7: Audit Logs */}
        {activeTab === 'audit' && (
          <div className="glass-panel" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--bg-card-border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: 14 }}>Timestamp</th>
                  <th style={{ padding: 14 }}>Administrator</th>
                  <th style={{ padding: 14 }}>Action</th>
                  <th style={{ padding: 14 }}>Target ID</th>
                  <th style={{ padding: 14 }}>Details</th>
                  <th style={{ padding: 14 }}>IP Address</th>
                </tr>
              </thead>
              <tbody>
                {auditLogsList.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
                      No audit records.
                    </td>
                  </tr>
                ) : (
                  auditLogsList.map((l, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: 14, color: 'var(--text-muted)' }}>
                        {new Date(l.createdAt).toLocaleString()}
                      </td>
                      <td style={{ padding: 14, fontWeight: 700 }}>{l.adminUsername}</td>
                      <td style={{ padding: 14, color: 'var(--primary)', fontWeight: 700 }}>{l.action}</td>
                      <td style={{ padding: 14, fontFamily: 'var(--font-mono)' }}>{l.targetId || '-'}</td>
                      <td style={{ padding: 14 }}>{l.details}</td>
                      <td style={{ padding: 14, color: 'var(--text-muted)' }}>{l.ipAddress || '127.0.0.1'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
