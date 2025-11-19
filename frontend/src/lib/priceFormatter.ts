/**
 * Format price with XOF currency
 * @param price - Price value (number or string)
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted price string with XOF
 */
export const formatPrice = (price: any, decimals: number = 2): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numPrice)) {
    return '0,00 XOF';
  }
  
  return `${numPrice.toFixed(decimals).replace('.', ',')} XOF`;
};

/**
 * Convert price string or number to numeric value
 * @param value - Price value (number or string)
 * @returns Numeric price
 */
export const toNumber = (value: any): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value) || 0;
  return 0;
};

/**
 * Format price for display (just numeric part with commas)
 * @param price - Price value
 * @param decimals - Number of decimal places
 * @returns Formatted numeric string
 */
export const formatPriceNumeric = (price: any, decimals: number = 2): string => {
  const numPrice = toNumber(price);
  return numPrice.toFixed(decimals).replace('.', ',');
};
