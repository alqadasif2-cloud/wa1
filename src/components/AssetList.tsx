import React, { useState } from 'react';
import { CryptoAsset } from '../types/wallet';
import { formatCurrency, formatCryptoAmount } from '../utils/formatters';
import { TrendingUp, TrendingDown, SlidersHorizontal, Plus, Sparkles } from 'lucide-react';

interface AssetListProps {
  assets: CryptoAsset[];
  isArabic: boolean;
  onSelectAsset?: (asset: CryptoAsset) => void;
}

export const AssetList: React.FC<AssetListProps> = ({ assets, isArabic, onSelectAsset }) => {
  const [activeTab, setActiveTab] = useState<'crypto' | 'nfts'>('crypto');

  // Realistic token icons matching official Trust Wallet coin badges
  const renderTokenIcon = (symbol: string) => {
    switch (symbol) {
      case 'USDT':
        return (
          <div className="w-10 h-10 rounded-full bg-[#26A17B] flex items-center justify-center font-black text-white text-base shadow-md shadow-emerald-950/40 shrink-0">
            ₮
          </div>
        );
      case 'BNB':
        return (
          <div className="w-10 h-10 rounded-full bg-[#F3BA2F] flex items-center justify-center font-black text-slate-950 text-xs shadow-md shadow-amber-950/40 shrink-0">
            BNB
          </div>
        );
      case 'ETH':
        return (
          <div className="w-10 h-10 rounded-full bg-[#627EEA] flex items-center justify-center font-black text-white text-sm shadow-md shadow-indigo-950/40 shrink-0">
            Ξ
          </div>
        );
      case 'BTC':
        return (
          <div className="w-10 h-10 rounded-full bg-[#F7931A] flex items-center justify-center font-black text-white text-base shadow-md shadow-orange-950/40 shrink-0">
            ₿
          </div>
        );
      case 'SOL':
        return (
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#9945FF] to-[#14F195] flex items-center justify-center font-black text-white text-xs shadow-md shrink-0">
            SOL
          </div>
        );
      case 'TRX':
        return (
          <div className="w-10 h-10 rounded-full bg-[#EF0027] flex items-center justify-center font-black text-white text-xs shadow-md shrink-0">
            TRX
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-black text-white text-xs shadow-md shrink-0">
            {symbol.substring(0, 3)}
          </div>
        );
    }
  };

  return (
    <div className="rounded-3xl bg-slate-900/60 border border-slate-800/80 p-4 sm:p-5">
      {/* Trust Wallet Tabs: Crypto vs NFTs */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab('crypto')}
            className={`text-xs sm:text-sm font-bold pb-1 transition-colors relative cursor-pointer ${
              activeTab === 'crypto'
                ? 'text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>{isArabic ? 'العملات الرقمية' : 'Crypto'}</span>
            {activeTab === 'crypto' && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('nfts')}
            className={`text-xs sm:text-sm font-bold pb-1 transition-colors relative cursor-pointer ${
              activeTab === 'nfts'
                ? 'text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>{isArabic ? 'الرموز غير القابلة للاستبدال' : 'NFTs'}</span>
            {activeTab === 'nfts' && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-500 rounded-full" />
            )}
          </button>
        </div>

        <button 
          className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          title={isArabic ? 'إدارة العملات' : 'Manage Tokens'}
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {activeTab === 'crypto' ? (
        <div className="divide-y divide-slate-800/50">
          {assets.map((asset) => {
            const isPositive = asset.change24h >= 0;

            return (
              <div
                key={asset.symbol}
                onClick={() => onSelectAsset && onSelectAsset(asset)}
                className="py-3 px-2 flex items-center justify-between hover:bg-slate-800/50 rounded-2xl transition-colors cursor-pointer group"
              >
                {/* Left: Icon, Name & Network */}
                <div className="flex items-center gap-3 min-w-0">
                  {renderTokenIcon(asset.symbol)}
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-white group-hover:text-blue-400 transition-colors">
                        {asset.symbol}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-medium">
                        {asset.network}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 truncate max-w-[130px] sm:max-w-[180px]">
                      {isArabic ? asset.nameAr : asset.name}
                    </span>
                  </div>
                </div>

                {/* Right: Balances & USD value */}
                <div className="flex flex-col items-end shrink-0">
                  <span className="text-sm font-bold text-slate-100 font-mono-numbers">
                    {formatCryptoAmount(asset.balance, asset.symbol)}
                  </span>
                  
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-slate-400 font-mono-numbers">
                      {formatCurrency(asset.usdValue)}
                    </span>
                    
                    <span className={`inline-flex items-center gap-0.5 font-semibold text-[11px] font-mono ${
                      isPositive ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {isPositive ? '+' : ''}{asset.change24h.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Manage crypto tokens button at bottom */}
          <div className="pt-3 text-center">
            <button
              onClick={() => onSelectAsset && assets[0] && onSelectAsset(assets[0])}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 py-1.5 px-3 rounded-xl hover:bg-blue-500/10 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isArabic ? 'إدارة العملات الرقمية' : 'Manage Crypto'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="py-12 text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-slate-800/80 mx-auto flex items-center justify-center text-slate-500">
            <Sparkles className="w-6 h-6" />
          </div>
          <h4 className="text-xs font-bold text-slate-300">
            {isArabic ? 'لا توجد رموز NFTs حتى الآن' : 'No NFTs yet'}
          </h4>
          <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
            {isArabic 
              ? 'يمكنك استقبال أصولك الرقمية ومجموعات الـ NFT الخاصة بك عبر عنوان المحفظة.' 
              : 'You can receive and view your digital collectibles via your wallet address.'}
          </p>
        </div>
      )}
    </div>
  );
};
