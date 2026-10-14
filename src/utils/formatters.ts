export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatCryptoAmount(amount: number, symbol: string): string {
  if (symbol === 'BTC') return `${amount.toFixed(6)} BTC`;
  if (symbol === 'ETH') return `${amount.toFixed(4)} ETH`;
  if (symbol === 'BNB') return `${amount.toFixed(4)} BNB`;
  return `${amount.toFixed(2)} ${symbol}`;
}

export function shortenAddress(address: string, chars: number = 6): string {
  if (!address || address.length < 12) return address || '';
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
}

export function formatCountdown(milliseconds: number): string {
  if (milliseconds <= 0) return '00:00:00';
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function formatDateTime(dateStr: string, isArabic: boolean = true): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    
    return d.toLocaleString(isArabic ? 'ar-EG' : 'en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    return dateStr;
  }
}
