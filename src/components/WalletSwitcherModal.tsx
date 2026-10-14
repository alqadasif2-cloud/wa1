import React from 'react';
import { User, Wallet } from '../types/wallet';
import { WalletDatabase } from '../services/walletDb';
import { formatCurrency, shortenAddress } from '../utils/formatters';
import { Check, Plus, ShieldCheck, User as UserIcon, X, ChevronRight, LogIn } from 'lucide-react';
import { TrustWalletShield } from './TrustWalletShield';

interface WalletSwitcherModalProps {
  currentUser: User | null;
  isArabic: boolean;
  onSelectUser: (user: User) => void;
  onOpenAuth: () => void;
  onClose: () => void;
}

export const WalletSwitcherModal: React.FC<WalletSwitcherModalProps> = ({
  currentUser,
  isArabic,
  onSelectUser,
  onOpenAuth,
  onClose
}) => {
  const users = WalletDatabase.getUsers();
  const wallets = WalletDatabase.getWallets();

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-[#0b111e] border border-slate-800 p-5 sm:p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
        {/* Handle bar on mobile */}
        <div className="w-12 h-1 rounded-full bg-slate-700 mx-auto mb-4 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <TrustWalletShield size={24} />
            <h2 className="text-base font-bold text-white">
              {isArabic ? 'إدارة المحافظ والحسابات' : 'Wallets & Accounts'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-400 mb-4">
          {isArabic 
            ? 'حدد المحفظة النشطة لعرض الرصيد والمعاملات الخاصة بها:' 
            : 'Select an active wallet to view its balance and transactions:'}
        </p>

        {/* Users / Wallets List */}
        <div className="space-y-2.5 mb-5">
          {users.map((user) => {
            const isCurrent = currentUser?.userId === user.userId;
            const wallet = wallets.find(w => w.ownerUserId === user.userId);
            const balance = wallet?.totalDemoBalance ?? 0;

            return (
              <div
                key={user.userId}
                onClick={() => {
                  onSelectUser(user);
                  onClose();
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isCurrent
                    ? 'bg-blue-600/15 border-blue-500/50 shadow-md shadow-blue-900/20'
                    : 'bg-slate-900/70 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                    user.role === 'owner'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    {user.role === 'owner' ? <ShieldCheck className="w-5 h-5 text-amber-400" /> : <UserIcon className="w-5 h-5 text-blue-400" />}
                  </div>

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-white truncate">
                        {user.displayName}
                      </span>
                      {user.role === 'owner' && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-bold">
                          {isArabic ? 'المالك' : 'Owner'}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono" dir="ltr">
                      {shortenAddress(user.demoAddress)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-100 font-mono-numbers block">
                      {formatCurrency(balance)}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-medium">
                      BEP20
                    </span>
                  </div>

                  {isCurrent && (
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action: Add new wallet or log in with another account */}
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <button
            onClick={() => {
              onClose();
              onOpenAuth();
            }}
            className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4 text-blue-400" />
            <span>{isArabic ? 'تسجيل الدخول بمحفظة أخرى / إنشاء حساب' : 'Log in with another wallet / Sign up'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
