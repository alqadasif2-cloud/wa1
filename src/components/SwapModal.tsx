import React, { useState } from 'react';
import { User, Wallet, CryptoAsset } from '../types/wallet';
import { formatCurrency } from '../utils/formatters';
import { X, ArrowDownUp, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

interface SwapModalProps {
  currentUser: User;
  wallet: Wallet | null;
  isArabic: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const SwapModal: React.FC<SwapModalProps> = ({
  currentUser,
  wallet,
  isArabic,
  onClose,
  onSuccess
}) => {
  const [fromToken, setFromToken] = useState('USDT');
  const [toToken, setToToken] = useState('BNB');
  const [fromAmount, setFromAmount] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const tokens = wallet?.assets || [];
  const fromAsset = tokens.find(t => t.symbol === fromToken);
  const toAsset = tokens.find(t => t.symbol === toToken);

  const calculateToAmount = () => {
    const amt = parseFloat(fromAmount);
    if (isNaN(amt) || amt <= 0 || !fromAsset || !toAsset) return '0.00';
    const usdVal = amt * fromAsset.usdPrice;
    const result = usdVal / toAsset.usdPrice;
    return result.toFixed(5);
  };

  const handleSwapTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
  };

  const handleExecuteSwap = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const amt = parseFloat(fromAmount);
    if (isNaN(amt) || amt <= 0) {
      setErrorMsg(isArabic ? 'يرجى إدخال كمية صحيحة' : 'Enter a valid amount');
      return;
    }

    if (fromAsset && amt > fromAsset.balance) {
      setErrorMsg(isArabic ? 'الرصيد المتاح غير كافٍ للتبديل' : 'Insufficient balance');
      return;
    }

    setIsSwapping(true);
    setTimeout(() => {
      setIsSwapping(false);
      setSuccessMsg(isArabic ? 'تم التبديل بنجاح بمعدل الصرف اللحظي!' : 'Swap executed successfully!');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 900);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-[#0b111e] border border-slate-800 p-6 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <ArrowDownUp className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-white">
              {isArabic ? 'تبديل العملات (Swap)' : 'Swap Tokens'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleExecuteSwap} className="space-y-4">
          {/* Pay Block */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>{isArabic ? 'أنت تدفع' : 'You Pay'}</span>
              <span>
                {isArabic ? 'الرصيد: ' : 'Balance: '}
                <span className="text-slate-200 font-bold font-mono">
                  {fromAsset?.balance.toFixed(4) ?? '0.00'} {fromToken}
                </span>
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <input
                type="number"
                step="any"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                placeholder="0.00"
                className="w-full text-2xl font-black bg-transparent text-white outline-none font-mono"
              />

              <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white">
                <span>{fromToken}</span>
              </div>
            </div>
          </div>

          {/* Swap direction button */}
          <div className="flex justify-center -my-2 relative z-10">
            <button
              type="button"
              onClick={handleSwapTokens}
              className="p-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all hover:rotate-180"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Receive Block */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>{isArabic ? 'أنت تستلم (تقديري)' : 'You Receive (Estimated)'}</span>
              <span>
                {isArabic ? 'الرصيد: ' : 'Balance: '}
                <span className="text-slate-200 font-bold font-mono">
                  {toAsset?.balance.toFixed(4) ?? '0.00'} {toToken}
                </span>
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-2xl font-black text-emerald-400 font-mono">
                {calculateToAmount()}
              </span>

              <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white">
                <span>{toToken}</span>
              </div>
            </div>
          </div>

          {/* Rate & Network Fee */}
          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>{isArabic ? 'سعر الصرف' : 'Rate'}</span>
              <span className="font-mono text-slate-300">
                1 {fromToken} ≈ {fromAsset && toAsset ? (fromAsset.usdPrice / toAsset.usdPrice).toFixed(6) : '0'} {toToken}
              </span>
            </div>
            <div className="flex justify-between">
              <span>{isArabic ? 'رسوم الشبكة' : 'Network Fee'}</span>
              <span className="text-emerald-400 font-mono font-bold">$0.00 (Gasless)</span>
            </div>
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSwapping}
            className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all active:scale-98 disabled:opacity-50"
          >
            {isSwapping ? (isArabic ? 'جاري تنفيذ المبادلة...' : 'Executing Swap...') : (isArabic ? 'تأكيد التبديل' : 'Confirm Swap')}
          </button>
        </form>
      </div>
    </div>
  );
};
