import React, { useState } from 'react';
import { User, Wallet } from '../types/wallet';
import { shortenAddress } from '../utils/formatters';
import { 
  Key, 
  ShieldCheck, 
  Copy, 
  Check, 
  Globe, 
  Bell, 
  QrCode, 
  LogOut, 
  ChevronRight, 
  Eye, 
  EyeOff, 
  Lock,
  Sliders,
  DollarSign,
  UserCheck
} from 'lucide-react';
import { TrustWalletShield } from './TrustWalletShield';

interface SettingsViewProps {
  currentUser: User | null;
  wallet: Wallet | null;
  isArabic: boolean;
  onToggleLanguage: () => void;
  onOpenWalletSwitcher: () => void;
  onOpenAdmin: () => void;
  onOpenReceive: () => void;
  onLogout: () => void;
}

const SAMPLE_MNEMONIC = [
  'shield', 'crypto', 'fortune', 'trust', 'wallet', 'orbit',
  'matrix', 'silver', 'flame', 'harbor', 'summit', 'glory'
];

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentUser,
  wallet,
  isArabic,
  onToggleLanguage,
  onOpenWalletSwitcher,
  onOpenAdmin,
  onOpenReceive,
  onLogout
}) => {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);
  const [copiedSeed, setCopiedSeed] = useState(false);

  const handleCopyAddress = () => {
    if (currentUser?.demoAddress) {
      navigator.clipboard.writeText(currentUser.demoAddress);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  const handleCopySeed = () => {
    navigator.clipboard.writeText(SAMPLE_MNEMONIC.join(' '));
    setCopiedSeed(true);
    setTimeout(() => setCopiedSeed(false), 2000);
  };

  return (
    <div className="space-y-4 max-w-xl mx-auto pb-10">
      {/* Account Info Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-b from-slate-900 via-[#0e172a] to-[#0b111e] border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <TrustWalletShield size={42} />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">
                  {currentUser?.displayName || 'المحفظة الرئيسية'}
                </h2>
                {currentUser?.role === 'owner' && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
                    {isArabic ? 'المالك' : 'Owner'}
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-400 font-mono">
                @{currentUser?.username || 'user'}
              </span>
            </div>
          </div>

          <button
            onClick={onOpenWalletSwitcher}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <span>{isArabic ? 'المحافظ' : 'Wallets'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Address Card */}
        <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3">
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">
              {isArabic ? 'عنوان المحفظة (BEP20 / Multi-Chain)' : 'Wallet Address'}
            </span>
            <span className="text-xs font-mono text-slate-200 truncate select-all" dir="ltr">
              {currentUser?.demoAddress}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleCopyAddress}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title={isArabic ? 'نسخ' : 'Copy'}
            >
              {copiedAddress ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={onOpenReceive}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title={isArabic ? 'عرض QR' : 'View QR'}
            >
              <QrCode className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Security & Secret Phrase Card */}
      <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-3">
        <h3 className="text-xs font-bold text-slate-300 px-1 uppercase tracking-wider">
          {isArabic ? 'الأمان والنسخ الاحتياطي' : 'Security & Backup'}
        </h3>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-slate-200">
                {isArabic ? 'عبارة الاسترداد السرية (12 كلمة)' : 'Secret Recovery Phrase'}
              </span>
            </div>

            <button
              onClick={() => setShowSeedPhrase(!showSeedPhrase)}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
            >
              {showSeedPhrase ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showSeedPhrase ? (isArabic ? 'إخفاء' : 'Hide') : (isArabic ? 'عرض' : 'Show')}</span>
            </button>
          </div>

          {showSeedPhrase ? (
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-3 gap-2">
                {SAMPLE_MNEMONIC.map((word, i) => (
                  <div key={i} className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono text-xs">
                    <span className="text-[10px] text-slate-500 mr-1">{i + 1}.</span>
                    <span className="text-slate-200 font-semibold">{word}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleCopySeed}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                {copiedSeed ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSeed ? (isArabic ? 'تم نسخ العبارة السرية' : 'Phrase Copied') : (isArabic ? 'نسخ العبارة السرية' : 'Copy Recovery Phrase')}</span>
              </button>
            </div>
          ) : (
            <p className="text-[11px] text-slate-400">
              {isArabic 
                ? 'لا تشارك عبارة الاسترداد مع أي شخص أبداً. تتيح لك الوصول الكامل إلى أصولك.' 
                : 'Never share your recovery phrase with anyone. It gives full access to your assets.'}
            </p>
          )}
        </div>
      </div>

      {/* Preferences Section */}
      <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-2">
        <h3 className="text-xs font-bold text-slate-300 px-1 uppercase tracking-wider mb-2">
          {isArabic ? 'التفضيلات والإعدادات العامة' : 'Preferences'}
        </h3>

        {/* Language */}
        <div 
          onClick={onToggleLanguage}
          className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:bg-slate-850 transition-colors flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Globe className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-200">
              {isArabic ? 'اللغة / Language' : 'Language'}
            </span>
          </div>

          <span className="text-xs font-bold text-blue-400">
            {isArabic ? 'العربية' : 'English'}
          </span>
        </div>

        {/* Currency */}
        <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-200">
              {isArabic ? 'العملة الأساسية' : 'Base Currency'}
            </span>
          </div>

          <span className="text-xs font-bold text-emerald-400 font-mono">
            USD ($)
          </span>
        </div>

        {/* Owner Dashboard Shortcut */}
        {currentUser?.role === 'owner' && (
          <div 
            onClick={onOpenAdmin}
            className="p-3 rounded-2xl bg-blue-600/15 border border-blue-500/30 hover:bg-blue-600/25 transition-colors flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  {isArabic ? 'لوحة تحكم المالك الإدارية' : 'Owner Admin Dashboard'}
                </span>
                <span className="text-[10px] text-blue-300">
                  {isArabic ? 'إدارة المستخدمين والأرصدة والتدقيق' : 'User, balance & lock controls'}
                </span>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-blue-400" />
          </div>
        )}
      </div>

      {/* Logout / Switch Account */}
      <div className="pt-2">
        <button
          onClick={onLogout}
          className="w-full py-3.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 font-bold text-xs transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>{isArabic ? 'تسجيل الخروج أو تبديل الحساب' : 'Log out / Switch account'}</span>
        </button>
      </div>
    </div>
  );
};
