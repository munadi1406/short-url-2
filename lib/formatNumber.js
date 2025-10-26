
export function formatNumber(value) {
    if (value === null || value === undefined || isNaN(value)) return "0";
  
    const absValue = Math.abs(value);
    let formatted = value.toString();
  
    if (absValue >= 1_000_000_000) {
      formatted = (value / 1_000_000_000).toFixed(1) + "B";
    } else if (absValue >= 1_000_000) {
      formatted = (value / 1_000_000).toFixed(1) + "M";
    } else if (absValue >= 1_000) {
      formatted = (value / 1_000).toFixed(1) + "K";
    }
  
    // Hilangkan .0 di akhir jika tidak perlu (contoh: 1.0K → 1K)
    formatted = formatted.replace(/\.0([KMB])$/, "$1");
  
    return formatted;
  }
  