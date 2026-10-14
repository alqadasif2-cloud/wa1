import React, { useState } from 'react';
import { Transaction } from '../types/wallet';
import { formatCurrency, shortenAddress, formatDateTime, formatCountdown } from '../utils/formatters';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  RotateCcw, 
  ShieldCheck, 
  Clock, 
  X, 
  ExternalLink, 
  FileText, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  Copy,
  Check
} from 'lucide-react';

interface TransactionHistoryProps {
  transactions: Transaction[];
  currentUserId: string;
  isArabic: boolean;
  onClose?: () => void;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  currentUserId,
  isArabic,
  onClose
}) => {
  const [filter, setFilter] = useState<'all' | 'receive' | 'send' | 'locked' | 'refund'>('all');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [copiedAddr, setCopiedAddr] = useState(false);

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'all') return true;
    if (filter === 'receive') return tx.transactionType === 'receive' || (tx.receiverUserId === currentUserId && tx.transactionType !== 'refund');
    if (filter === 'send') return tx.transactionType === 'send';
    if (filter === 'locked') return tx.status === 'locked';
    if (filter === 'refund') return tx.transactionType === 'refund' || tx.status === 'refunded';
    return true;
  });

  const hasHistoricalRecords = transactions.some(t => t.isHistorical);

  const getTxVisuals = (tx: Transaction) => {
    const isIncoming = tx.receiverUserId === currentUserId;
    if (tx.transactionType === 'refund' || tx.status === 'refunded') {
      return {
        icon: <RotateCcw className="w-4 h-4 text-amber-400" />,
        badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        title: isArabic ? 'استرجاع' : 'Refund',
        amountPrefix: '-',
        amountClass: 'text-amber-400'
      };
    }
    if (tx.status === 'locked') {
      return {
        icon: <Clock className="w-4 h-4 text-amber-400 animate-pulse" />,
        badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        title: isArabic ? 'مبلغ مقيد مؤقتاً' : 'Time-Locked',
        amountPrefix: '+',
        amountClass: 'text-amber-300'
      };
    }
    if (tx.transactionType === 'admin_adjustment') {
      return {
        icon: <ShieldCheck className="w-4 h-4 text-purple-400" />,
        badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        title: isArabic ? 'تعديل إداري موثق' : 'Admin Adjustment',
        amountPrefix: tx.receiverUserId === currentUserId ? '+' : '-',
        amountClass: 'text-purple-400'
      };
    }
    if (isIncoming) {
      return {
        icon: <ArrowDownLeft className="w-4 h-4 text-emerald-400" />,
        badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        title: isArabic ? 'استلام' : 'Received',
        amountPrefix: '+',
        amountClass: 'text-emerald-400'
      };
    }
    return {
      icon: <ArrowUpRight className="w-4 h-4 text-blue-400" />,
      badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      title: isArabic ? 'إرسال' : 'Sent',
      amountPrefix: '-',
      amountClass: 'text-slate-200'
    };
  };

  return (
    <div className="rounded-3xl bg-slate-900/60 border border-slate-800/80 p-4 sm:p-5">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-400" />
            <h2 className="text-sm font-bold text-slate-100">
              {isArabic ? 'سجل المعاملات والتحويلات' : 'Transaction History'}
            </h2>
          </div>
          {onClose && (
            <button onClick={onClose} className="sm:hidden p-1 text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'all', labelAr: 'الكل', labelEn: 'All' },
            { id: 'receive', labelAr: 'استلام', labelEn: 'Received' },
            { id: 'send', labelAr: 'إرسال', labelEn: 'Sent' },
            { id: 'locked', labelAr: 'مقيدة', labelEn: 'Locked' },
            { id: 'refund', labelAr: 'استرجاع', labelEn: 'Refunds' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                filter === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {isArabic ? tab.labelAr : tab.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filteredTransactions.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-500">
          {isArabic ? 'لا توجد معاملات مسجلة في هذا القسم حالياً.' : 'No transactions found in this section.'}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTransactions.map((tx) => {
            const visuals = getTxVisuals(tx);

            return (
              <div
                key={tx.transactionId}
                onClick={() => setSelectedTx(tx)}
                className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800/60 border border-slate-800/80 hover:border-slate-700/80 flex items-center justify-between gap-3 cursor-pointer transition-all active:scale-[0.99] group"
              >
                {/* Left: Icon + Type & Counterparty */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                    {visuals.icon}
                  </div>

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-xs text-white group-hover:text-blue-400 transition-colors">
                        {visuals.title}
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-400 truncate">
                      {tx.receiverUserId === currentUserId
                        ? `${isArabic ? 'من:' : 'From:'} ${tx.senderUsername}`
                        : `${isArabic ? 'إلى:' : 'To:'} ${tx.destinationAddress ? shortenAddress(tx.destinationAddress, 6) : tx.receiverUsername}`}
                    </span>

                    <span className="text-[10px] text-slate-400 font-mono-numbers">
                      {tx.formattedTimeAr || formatDateTime(tx.createdAt, isArabic)}
                    </span>
                  </div>
                </div>

                {/* Right: Amount & Status Badge */}
                <div className="flex flex-col items-end shrink-0">
                  <span className={`text-sm font-bold font-mono-numbers ${visuals.amountClass}`}>
                    {visuals.amountPrefix}{formatCurrency(tx.amount)}
                  </span>

                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md border font-medium mt-0.5 ${visuals.badgeBg}`}>
                    {isArabic ? (tx.statusTextAr || tx.status) : tx.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Transaction Detail Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-[#0d1424] border border-slate-800 p-6 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">
                {isArabic ? 'تفاصيل المعاملة' : 'Transaction Details'}
              </h3>
              <button
                onClick={() => setSelectedTx(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="mt-4 space-y-3.5">
              {/* Amount Showcase */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                <span className="text-xs text-slate-400 block mb-1">
                  {isArabic ? 'المبلغ الإجمالي' : 'Total Amount'}
                </span>
                <span className="text-2xl font-extrabold text-white font-mono-numbers">
                  {formatCurrency(selectedTx.amount)}
                </span>
                <div className="mt-2 flex items-center justify-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
                    {selectedTx.network || 'BEP20'}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                    {isArabic ? (selectedTx.statusTextAr || selectedTx.status) : selectedTx.status}
                  </span>
                </div>
              </div>

              {/* Data Rows */}
              <div className="space-y-2.5 text-xs">
                {/* Tx ID */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60">
                  <span className="text-slate-400">{isArabic ? 'معرف المعاملة:' : 'Transaction ID:'}</span>
                  <span className="font-mono text-slate-200 select-all font-semibold">
                    {selectedTx.transactionId}
                  </span>
                </div>

                {/* Sender */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60">
                  <span className="text-slate-400">{isArabic ? 'المرسل:' : 'Sender:'}</span>
                  <span className="text-slate-200 font-medium">
                    {selectedTx.senderUsername}
                  </span>
                </div>

                {/* Sender Address */}
                {selectedTx.senderAddress && (
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60">
                    <span className="text-slate-400">{isArabic ? 'عنوان المرسل:' : 'Sender Address:'}</span>
                    <span className="font-mono text-slate-300 select-all text-[11px]" dir="ltr">
                      {shortenAddress(selectedTx.senderAddress, 8)}
                    </span>
                  </div>
                )}

                {/* Recipient */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60">
                  <span className="text-slate-400">{isArabic ? 'المستلم:' : 'Recipient:'}</span>
                  <span className="text-slate-200 font-medium">
                    {selectedTx.receiverUsername}
                  </span>
                </div>

                {/* Recipient Address or Destination */}
                <div className="flex flex-col gap-1 p-2.5 rounded-xl bg-slate-900/60">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">{isArabic ? 'عنوان الوجهة المدخل:' : 'Destination Address:'}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const targetAddr = selectedTx.destinationAddress || selectedTx.receiverAddress || '';
                        navigator.clipboard.writeText(targetAddr);
                        setCopiedAddr(true);
                        setTimeout(() => setCopiedAddr(false), 2000);
                      }}
                      className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {copiedAddr ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">{isArabic ? 'تم النسخ' : 'Copied'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>{isArabic ? 'نسخ' : 'Copy'}</span>
                        </>
                      )}
                    </button>
                  </div>
                  <span className="font-mono text-slate-200 select-all text-[11px] break-all" dir="ltr">
                    {selectedTx.destinationAddress || selectedTx.receiverAddress}
                  </span>
                </div>

                {/* Network Tx Hash - Empty as instructed */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60">
                  <span className="text-slate-400">{isArabic ? 'معرف المعاملة على الشبكة:' : 'Network Hash:'}</span>
                  <span className="text-slate-500 italic text-[11px]">
                    {selectedTx.networkTxHash || (isArabic ? 'غير مسجل' : 'Not recorded')}
                  </span>
                </div>

                {/* Date & Time */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60">
                  <span className="text-slate-400">{isArabic ? 'التاريخ والوقت:' : 'Date & Time:'}</span>
                  <span className="font-mono text-slate-200">
                    {selectedTx.formattedTimeAr || formatDateTime(selectedTx.createdAt, isArabic)}
                  </span>
                </div>

                {/* Lock Status */}
                {selectedTx.lockUntil && (
                  <div className="flex items-center justify-between p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <span className="text-amber-300">{isArabic ? 'انتهاء التقييد:' : 'Lock Expiry:'}</span>
                    <span className="font-mono text-amber-300 font-bold">
                      {formatDateTime(selectedTx.lockUntil, isArabic)}
                    </span>
                  </div>
                )}

                {/* Refund details if applicable */}
                {selectedTx.refundReason && (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                    <span className="text-amber-400 font-semibold block">
                      {isArabic ? 'سبب الاسترجاع:' : 'Refund Reason:'}
                    </span>
                    <p className="text-amber-200/90 text-xs">{selectedTx.refundReason}</p>
                    {selectedTx.originalTransactionId && (
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {isArabic ? 'العملية الأصلية:' : 'Original Tx:'} {selectedTx.originalTransactionId}
                      </span>
                    )}
                  </div>
                )}

                {/* Notes */}
                {selectedTx.notes && (
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-400 block mb-1">{isArabic ? 'ملاحظات:' : 'Notes:'}</span>
                    <p className="text-slate-300 text-xs">{selectedTx.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Close Button */}
            <div className="mt-5">
              <button
                onClick={() => setSelectedTx(null)}
                className="w-full py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
              >
                {isArabic ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
