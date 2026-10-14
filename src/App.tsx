/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { User, Wallet, Transaction, AppNotification } from './types/wallet';
import { WalletDatabase } from './services/walletDb';
import { Header } from './components/Header';
import { BalanceCard } from './components/BalanceCard';
import { AssetList } from './components/AssetList';
import { SendModal } from './components/SendModal';
import { ReceiveModal } from './components/ReceiveModal';
import { SwapModal } from './components/SwapModal';
import { FaucetModal } from './components/FaucetModal';
import { QrScannerModal } from './components/QrScannerModal';
import { WalletSwitcherModal } from './components/WalletSwitcherModal';
import { TransactionHistory } from './components/TransactionHistory';
import { LockedTransactionsView } from './components/LockedTransactionsView';
import { BrowserView } from './components/BrowserView';
import { SettingsView } from './components/SettingsView';
import { NotificationsModal } from './components/NotificationsModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { BottomNav, MainTabType } from './components/BottomNav';
import { Sparkles, Clock, Lock } from 'lucide-react';
import { formatCountdown } from './utils/formatters';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isArabic, setIsArabic] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<MainTabType>('wallet');

  // Modals
  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [showWalletSwitcher, setShowWalletSwitcher] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Address pre-filled from QR scanner
  const [scannedRecipient, setScannedRecipient] = useState<string>('');

  // Load and refresh state from database
  const refreshAppData = useCallback(() => {
    // 1. Run expiration check
    WalletDatabase.checkAndReleaseExpiredLocks();

    // 2. Fetch current user (defaults to Eslam Alqadasi or first user)
    let user = WalletDatabase.getCurrentUser();
    if (!user) {
      const defaultUser = WalletDatabase.getUserByUsername('Eslam Alqadasi') || WalletDatabase.getUsers()[0] || null;
      if (defaultUser) {
        WalletDatabase.setCurrentUser(defaultUser);
        user = defaultUser;
      }
    }
    setCurrentUser(user);

    if (user) {
      const userWallet = WalletDatabase.getWalletByUserId(user.userId);
      setWallet(userWallet || null);

      const userTxs = WalletDatabase.getUserTransactions(user.userId);
      setTransactions(userTxs);

      const userNotifs = WalletDatabase.getNotifications(user.userId);
      setNotifications(userNotifs);
    } else {
      setWallet(null);
      setTransactions([]);
      setNotifications([]);
    }
  }, []);

  // Initialize DB and load data
  useEffect(() => {
    WalletDatabase.initialize();
    refreshAppData();
  }, [refreshAppData]);

  // Periodic interval (every 1 second) to check lock countdowns and trigger unlocks
  useEffect(() => {
    const timer = setInterval(() => {
      const { releasedCount } = WalletDatabase.checkAndReleaseExpiredLocks();
      if (releasedCount > 0) {
        refreshAppData();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [refreshAppData]);

  // HTML dir and lang sync
  useEffect(() => {
    document.documentElement.setAttribute('dir', isArabic ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', isArabic ? 'ar' : 'en');
  }, [isArabic]);

  // Compute next lock remaining ms for BalanceCard badge
  const lockedTxs = transactions.filter(t => t.status === 'locked' && t.lockUntil);
  const nextLockRemainingMs = lockedTxs.length > 0
    ? Math.max(0, new Date(lockedTxs[0].lockUntil!).getTime() - Date.now())
    : 0;

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    setShowWalletSwitcher(true);
  };

  const handleSelectUser = (user: User) => {
    WalletDatabase.setCurrentUser(user);
    setCurrentUser(user);
    refreshAppData();
  };

  const handleLoginSuccess = (user: User) => {
    handleSelectUser(user);
    setShowAuthModal(false);
  };

  const handleQrScanResult = (address: string) => {
    setScannedRecipient(address);
    setShowQrScanner(false);
    setShowSendModal(true);
  };

  return (
    <div className="min-h-screen bg-[#070b13] text-slate-100 flex flex-col pb-20 sm:pb-8 selection:bg-blue-600/30">
      {/* Top Header */}
      <Header
        currentUser={currentUser}
        unreadNotificationsCount={unreadNotificationsCount}
        isArabic={isArabic}
        onToggleLanguage={() => setIsArabic(!isArabic)}
        onOpenNotifications={() => setShowNotificationsModal(true)}
        onOpenAdmin={() => setShowAdminDashboard(true)}
        onOpenWalletSwitcher={() => setShowWalletSwitcher(true)}
        onOpenQrScanner={() => setShowQrScanner(true)}
        onOpenSettings={() => setActiveTab('settings')}
        onOpenLogin={() => setShowAuthModal(true)}
      />

      {/* Main Container - Centered Mobile App Layout */}
      <main className="max-w-xl mx-auto w-full px-3 sm:px-4 pt-3 sm:pt-4 flex-1">
        {/* Tab 1: Primary Wallet View */}
        {activeTab === 'wallet' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Balance Card */}
            <BalanceCard
              wallet={wallet}
              isArabic={isArabic}
              nextLockRemainingMs={nextLockRemainingMs}
              onOpenSend={() => {
                setScannedRecipient('');
                setShowSendModal(true);
              }}
              onOpenReceive={() => setShowReceiveModal(true)}
              onOpenDeposit={() => setShowDepositModal(true)}
              onOpenSwap={() => setShowSwapModal(true)}
              onOpenLocked={() => setActiveTab('locked')}
            />

            {/* Time-Lock Live Notification Bar (if active locked transfers exist) */}
            {lockedTxs.length > 0 && (
              <div 
                onClick={() => setActiveTab('locked')}
                className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 cursor-pointer hover:bg-amber-500/15 transition-all group flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                    <Lock className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      {isArabic ? 'لديك مبالغ مقيدة مؤقتاً' : 'Active Time-Locks'}
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                        {lockedTxs.length}
                      </span>
                    </span>
                    <span className="text-[11px] text-amber-200/80 truncate">
                      ${wallet?.lockedDemoBalance.toFixed(2)} {isArabic ? 'قيد الانتظار للتحرير التلقائي' : 'pending auto-unlock'}
                    </span>
                  </div>
                </div>

                {nextLockRemainingMs > 0 && (
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 font-mono font-bold text-xs shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatCountdown(nextLockRemainingMs)}</span>
                  </div>
                )}
              </div>
            )}

            {/* Tokens Asset List */}
            <AssetList
              assets={wallet?.assets || []}
              isArabic={isArabic}
              onSelectAsset={(asset) => {
                setShowSendModal(true);
              }}
            />
          </div>
        )}

        {/* Tab 2: Transaction Activity & History */}
        {activeTab === 'history' && (
          <div className="animate-in fade-in duration-200">
            <TransactionHistory
              transactions={transactions}
              currentUserId={currentUser?.userId || ''}
              isArabic={isArabic}
              onClose={() => setActiveTab('wallet')}
            />
          </div>
        )}

        {/* Tab 3: Dedicated Time-Locked Screen */}
        {activeTab === 'locked' && (
          <div className="animate-in fade-in duration-200">
            <LockedTransactionsView
              transactions={transactions}
              isArabic={isArabic}
              onClose={() => setActiveTab('wallet')}
              onRefresh={refreshAppData}
            />
          </div>
        )}

        {/* Tab 4: Web3 DApps Browser */}
        {activeTab === 'browser' && (
          <div className="animate-in fade-in duration-200">
            <BrowserView isArabic={isArabic} />
          </div>
        )}

        {/* Tab 5: Settings */}
        {activeTab === 'settings' && (
          <div className="animate-in fade-in duration-200">
            <SettingsView
              currentUser={currentUser}
              wallet={wallet}
              isArabic={isArabic}
              onToggleLanguage={() => setIsArabic(!isArabic)}
              onOpenWalletSwitcher={() => setShowWalletSwitcher(true)}
              onOpenAdmin={() => setShowAdminDashboard(true)}
              onOpenReceive={() => setShowReceiveModal(true)}
              onLogout={() => setShowWalletSwitcher(true)}
            />
          </div>
        )}

        {/* Tab 6: Admin Panel (if owner) */}
        {activeTab === 'admin' && currentUser?.role === 'owner' && (
          <div className="animate-in fade-in duration-200">
            <AdminDashboard
              currentUser={currentUser}
              isArabic={isArabic}
              onClose={() => setActiveTab('wallet')}
              onRefresh={refreshAppData}
            />
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={(t) => setActiveTab(t)}
        isArabic={isArabic}
        isOwner={currentUser?.role === 'owner'}
        lockedCount={lockedTxs.length}
        unreadCount={unreadNotificationsCount}
      />

      {/* Modals */}
      {showSendModal && currentUser && (
        <SendModal
          currentUser={currentUser}
          wallet={wallet}
          isArabic={isArabic}
          onClose={() => setShowSendModal(false)}
          onSuccess={() => {
            setShowSendModal(false);
            refreshAppData();
          }}
        />
      )}

      {showReceiveModal && currentUser && (
        <ReceiveModal
          user={currentUser}
          wallet={wallet}
          lockedTransactions={lockedTxs}
          isArabic={isArabic}
          onClose={() => setShowReceiveModal(false)}
        />
      )}

      {showSwapModal && currentUser && (
        <SwapModal
          currentUser={currentUser}
          wallet={wallet}
          isArabic={isArabic}
          onClose={() => setShowSwapModal(false)}
          onSuccess={() => {
            refreshAppData();
          }}
        />
      )}

      {showDepositModal && currentUser && (
        <FaucetModal
          currentUser={currentUser}
          isArabic={isArabic}
          onClose={() => setShowDepositModal(false)}
          onSuccess={() => {
            setShowDepositModal(false);
            refreshAppData();
          }}
        />
      )}

      {showQrScanner && (
        <QrScannerModal
          isArabic={isArabic}
          onScanResult={handleQrScanResult}
          onClose={() => setShowQrScanner(false)}
        />
      )}

      {showWalletSwitcher && (
        <WalletSwitcherModal
          currentUser={currentUser}
          isArabic={isArabic}
          onSelectUser={handleSelectUser}
          onOpenAuth={() => setShowAuthModal(true)}
          onClose={() => setShowWalletSwitcher(false)}
        />
      )}

      {showNotificationsModal && currentUser && (
        <NotificationsModal
          userId={currentUser.userId}
          isArabic={isArabic}
          onClose={() => {
            setShowNotificationsModal(false);
            refreshAppData();
          }}
        />
      )}

      {showAdminDashboard && currentUser && currentUser.role === 'owner' && (
        <AdminDashboard
          currentUser={currentUser}
          isArabic={isArabic}
          onClose={() => setShowAdminDashboard(false)}
          onRefresh={refreshAppData}
        />
      )}

      {showAuthModal && (
        <AuthModal
          isArabic={isArabic}
          onSuccess={handleLoginSuccess}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </div>
  );
}
