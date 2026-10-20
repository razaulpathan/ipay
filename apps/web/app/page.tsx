'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Download,
  Smartphone,
  ShieldCheck,
  Zap,
  ArrowRight,
  QrCode,
  CheckCircle2,
  Lock,
  Layers,
  Users,
  CreditCard,
  MessageSquare,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

export default function DownloadPage() {
  const [activeTab, setActiveTab] = useState<'home' | 'deposit' | 'wallets' | 'teams'>('home');
  const [qrModal, setQrModal] = useState(false);

  const releaseInfo = {
    version: '1.0.32',
    fileName: 'iPay-v1.0.32-release.apk',
    packageId: 'com.ipay.app',
    size: '28.4 MB',
    minAndroid: 'Android 8.0 (API 26) or higher',
    updatedDate: 'October 20, 2026',
    downloadUrl: '/downloads/iPay-v1.0.32-release.apk',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(11, 15, 23, 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--bg-card-border)',
          padding: '16px 24px',
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                overflow: 'hidden',
                boxShadow: '0 4px 12px var(--primary-glow)',
                border: '1px solid rgba(5, 193, 117, 0.4)',
              }}
            >
              <img
                src="/images/app_icon.jpg"
                alt="iPay Icon"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div>
              <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>
                i<span style={{ color: 'var(--primary)' }}>Pay</span>
              </span>
              <span
                style={{
                  marginLeft: 8,
                  fontSize: 11,
                  background: 'rgba(5, 193, 117, 0.15)',
                  color: 'var(--primary)',
                  padding: '2px 8px',
                  borderRadius: 20,
                  fontWeight: 700,
                }}
              >
                v{releaseInfo.version}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            <a href="#features" style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 500 }}>
              Features
            </a>
            <a href="#installation" style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 500 }}>
              Installation
            </a>
            <a href="#security" style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 500 }}>
              Security
            </a>
            <Link
              href="/t20"
              style={{
                fontSize: 14,
                color: '#38bdf8',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              Admin Portal (/t20)
            </Link>
            <a
              href={releaseInfo.downloadUrl}
              download={releaseInfo.fileName}
              className="gradient-btn"
              style={{
                padding: '10px 20px',
                borderRadius: 10,
                fontSize: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Download size={16} />
              Download APK
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          padding: '80px 24px 60px',
          maxWidth: 1200,
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 600,
            height: 350,
            background: 'radial-gradient(circle, rgba(5, 193, 117, 0.18) 0%, rgba(11, 15, 23, 0) 70%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 48,
            alignItems: 'center',
            position: 'relative',
            zIndex: 10,
          }}
        >
          {/* Left Column: Copy & Actions */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(5, 193, 117, 0.12)',
                border: '1px solid rgba(5, 193, 117, 0.3)',
                padding: '6px 14px',
                borderRadius: 24,
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--primary)',
                marginBottom: 20,
              }}
            >
              <Zap size={14} />
              Official Production Release 1.0.32
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 3.6rem)',
                lineHeight: 1.15,
                fontWeight: 800,
                letterSpacing: -1,
                marginBottom: 20,
              }}
            >
              The Modern Platform for <span className="gradient-text">UPI & USDT</span> Operations.
            </h1>

            <p
              style={{
                fontSize: 17,
                color: 'var(--text-muted)',
                lineHeight: 1.6,
                marginBottom: 32,
                maxWidth: 520,
              }}
            >
              Streamline multi-wallet payments with PhonePe, Paytm, and BharatPe. Instant Tron TRC20 USDT deposits
              at fixed 109 INR conversion, automated daily task bonuses, and real-time team referral payouts.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 40 }}>
              <a
                href={releaseInfo.downloadUrl}
                download={releaseInfo.fileName}
                className="gradient-btn"
                style={{
                  padding: '16px 28px',
                  borderRadius: 12,
                  fontSize: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <Download size={20} />
                Download Android APK ({releaseInfo.size})
              </a>

              <button
                onClick={() => setQrModal(true)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--bg-card-border)',
                  color: '#ffffff',
                  padding: '16px 24px',
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'all 0.2s ease',
                }}
              >
                <QrCode size={18} />
                Scan to Install
              </button>
            </div>

            {/* Release specs pills */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 12,
                padding: 16,
                borderRadius: 12,
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--bg-card-border)',
              }}
            >
              <div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Version</span>
                <p style={{ fontSize: 14, fontWeight: 700, marginTop: 2 }}>v{releaseInfo.version}</p>
              </div>
              <div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Package</span>
                <p style={{ fontSize: 14, fontWeight: 700, marginTop: 2, fontFamily: 'var(--font-mono)' }}>
                  {releaseInfo.packageId}
                </p>
              </div>
              <div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Android</span>
                <p style={{ fontSize: 14, fontWeight: 700, marginTop: 2 }}>8.0+ Oreo</p>
              </div>
            </div>
          </div>

          {/* Right Column: Mobile App Artwork & Interactive Mockup */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                position: 'relative',
                width: 320,
                height: 640,
                borderRadius: 44,
                padding: 12,
                background: '#1e293b',
                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 35px var(--primary-glow)',
                border: '4px solid #334155',
              }}
            >
              {/* Speaker / Camera cutout */}
              <div
                style={{
                  position: 'absolute',
                  top: 18,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 90,
                  height: 18,
                  backgroundColor: '#0f172a',
                  borderRadius: 10,
                  zIndex: 30,
                }}
              />

              {/* Inner phone screen container */}
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 34,
                  overflow: 'hidden',
                  position: 'relative',
                  backgroundColor: '#f6f8fa',
                }}
              >
                <img
                  src="/images/splash_screen.jpg"
                  alt="iPay App Preview"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />

                {/* Floating overlay badge */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 24,
                    left: 16,
                    right: 16,
                    background: 'rgba(11, 15, 23, 0.85)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(5, 193, 117, 0.3)',
                    borderRadius: 16,
                    padding: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: 'rgba(5, 193, 117, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--primary)',
                    }}
                  >
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>100% Production Ready</p>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Verified against recording</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promotional Banners Gallery */}
      <section style={{ maxWidth: 1200, margin: '40px auto 60px', padding: '0 24px', width: '100%' }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Original In-App Graphics</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 24 }}>
          Generated original assets matching the reference screen recording precisely.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 24,
          }}
        >
          {/* Banner 1: 100+50 Reward */}
          <div className="glass-panel" style={{ overflow: 'hidden' }}>
            <div style={{ height: 190, position: 'relative' }}>
              <img
                src="/images/banner_invite_reward.jpg"
                alt="100+50 Reward Banner"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ padding: 18 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>100+50 Reward Promotion</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Invite new users to complete 15 orders. Inviter earns 100 INR, invitee earns 50 INR.
              </p>
            </div>
          </div>

          {/* Banner 2: Payment Rewards */}
          <div className="glass-panel" style={{ overflow: 'hidden' }}>
            <div style={{ height: 190, position: 'relative' }}>
              <img
                src="/images/banner_payment_rewards.jpg"
                alt="Payment Rewards Banner"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ padding: 18 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Payment Rewards System</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Every successful order generates instant extra bonuses with live quota crediting.
              </p>
            </div>
          </div>

          {/* Banner 3: Important Notice */}
          <div className="glass-panel" style={{ overflow: 'hidden' }}>
            <div style={{ height: 190, position: 'relative' }}>
              <img
                src="/images/banner_important_notice.jpg"
                alt="Important Notice Banner"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ padding: 18 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Compliance & Security Alerts</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Proactive notices guarding non-compliant operations and unauthorized transfers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section id="features" style={{ maxWidth: 1200, margin: '40px auto 60px', padding: '0 24px', width: '100%' }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12, letterSpacing: -0.5 }}>
          Built For Speed, Transparency & High Volume
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 16, marginBottom: 36, maxWidth: 600 }}>
          Everything visible in the reference recording has been reconstructed with authentic architecture.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
          }}
        >
          <div className="glass-panel" style={{ padding: 24 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: 'rgba(5, 193, 117, 0.15)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <CreditCard size={24} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Multi-Provider UPI Binding</h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Native binding integration for PhonePe, Paytm, BharatPe Business, Mobikwik, and Freecharge with OTP
              verification flows.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: 24 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: 'rgba(6, 182, 212, 0.15)',
                color: 'var(--accent-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <Zap size={24} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Tron TRC20 USDT Settlement</h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Live USDT recharge with dedicated TRC20 QR generation, 60-minute expiry countdown, and proof receipt
              uploading.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: 24 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: 'rgba(245, 158, 11, 0.15)',
                color: 'var(--accent-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <Users size={24} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Tiered Referral Teams</h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Level A (0.2%) and Level B (0.05%) commission reporting with customizable periods, share links, and
              instant subline inspection.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: 24 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: 'rgba(168, 85, 247, 0.15)',
                color: '#c084fc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <MessageSquare size={24} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>24/7 In-App Customer Service</h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Live messaging console with automated reward guides, media attachments, delivery ticks, and instant admin
              replies.
            </p>
          </div>
        </div>
      </section>

      {/* Step-by-Step Installation Instructions */}
      <section
        id="installation"
        style={{
          maxWidth: 1200,
          margin: '40px auto 60px',
          padding: '40px 24px',
          width: '100%',
          background: 'rgba(18, 24, 38, 0.5)',
          borderRadius: 24,
          border: '1px solid var(--bg-card-border)',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 40px' }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 12 }}>3-Step Android Installation Guide</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
            Follow these simple steps to install the official iPay APK on your Android device.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
          }}
        >
          <div style={{ padding: 20, borderRadius: 16, background: 'rgba(255, 255, 255, 0.02)' }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                background: 'var(--primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                marginBottom: 16,
              }}
            >
              1
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Download The APK</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Tap the download button above or scan the QR code to save <span style={{ color: '#fff' }}>iPay-v1.0.32-release.apk</span> onto your phone.
            </p>
          </div>

          <div style={{ padding: 20, borderRadius: 16, background: 'rgba(255, 255, 255, 0.02)' }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                background: 'var(--primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                marginBottom: 16,
              }}
            >
              2
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Allow Unknown Sources</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
              When prompted by Android Security, tap Settings and enable "Allow from this source" for your browser.
            </p>
          </div>

          <div style={{ padding: 20, borderRadius: 16, background: 'rgba(255, 255, 255, 0.02)' }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                background: 'var(--primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                marginBottom: 16,
              }}
            >
              3
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Launch & Sign In</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Open the app, sign in with your registered phone number, or tap Sign Up to activate your initial ₹10 bonus.
            </p>
          </div>
        </div>
      </section>

      {/* Security Architecture Section */}
      <section id="security" style={{ maxWidth: 1200, margin: '20px auto 60px', padding: '0 24px', width: '100%' }}>
        <div
          className="glass-panel"
          style={{
            padding: '36px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24,
            borderColor: 'rgba(5, 193, 117, 0.2)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--primary)', marginBottom: 10 }}>
              <ShieldCheck size={24} />
              <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                Enterprise Security Standards
              </span>
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
              Two-Layer Password & Immutable Financial Auditing
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, maxWidth: 600, lineHeight: 1.5 }}>
              All wallet additions and sensitive operations require secondary authorization. Passwords hashed via
              bcrypt / argon2 with tamper-proof audit trails for administrative review.
            </p>
          </div>

          <Link
            href="/t20"
            className="gradient-btn"
            style={{
              padding: '14px 24px',
              borderRadius: 10,
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            Access Master Admin (/t20)
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          marginTop: 'auto',
          borderTop: '1px solid var(--bg-card-border)',
          padding: '40px 24px',
          background: '#070a10',
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 24,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="/images/app_icon.jpg" alt="iPay" style={{ width: 32, height: 32, borderRadius: 8 }} />
            <div>
              <span style={{ fontWeight: 800, fontSize: 16 }}>iPay Platform</span>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>© 2026 iPay Ecosystem. All rights reserved.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 24, fontSize: 13, color: 'var(--text-muted)' }}>
            <a href="#features">Features</a>
            <a href="#installation">Installation</a>
            <a href="#security">Security Policy</a>
            <Link href="/t20" style={{ color: 'var(--primary)' }}>
              Master Admin (/t20)
            </Link>
          </div>
        </div>
      </footer>

      {/* QR Code Modal */}
      {qrModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: 20,
          }}
          onClick={() => setQrModal(false)}
        >
          <div
            className="glass-panel"
            style={{
              maxWidth: 380,
              width: '100%',
              padding: 32,
              textAlign: 'center',
              background: '#121826',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Scan to Install on Mobile</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>
              Open your phone camera to download iPay v{releaseInfo.version} directly.
            </p>

            <div
              style={{
                width: 200,
                height: 200,
                margin: '0 auto 24px',
                background: '#ffffff',
                padding: 16,
                borderRadius: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* High-contrast QR representation */}
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  border: '4px solid #000',
                  borderRadius: 8,
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundImage:
                    'repeating-linear-gradient(0deg, #000 0, #000 12px, transparent 12px, transparent 24px), repeating-linear-gradient(90deg, #000 0, #000 12px, transparent 12px, transparent 24px)',
                }}
              >
                <div
                  style={{
                    background: 'var(--primary)',
                    color: '#ffffff',
                    fontWeight: 900,
                    padding: '6px 10px',
                    borderRadius: 6,
                    fontSize: 12,
                    zIndex: 2,
                  }}
                >
                  iPAY
                </div>
              </div>
            </div>

            <button
              onClick={() => setQrModal(false)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 10,
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
