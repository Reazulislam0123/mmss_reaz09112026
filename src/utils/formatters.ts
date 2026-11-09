/**
 * Bengali and English number and currency formatting utilities
 */

const BENGALI_DIGITS: { [key: string]: string } = {
  "0": "০",
  "1": "১",
  "2": "২",
  "3": "৩",
  "4": "৪",
  "5": "৫",
  "6": "৬",
  "7": "৭",
  "8": "৮",
  "9": "৯",
  ".": ".",
};

/**
 * Converts English digits (0-9) to Bengali numerals (০-৯)
 */
export function toBengaliNumeral(val: number | string | undefined | null): string {
  if (val === undefined || val === null) return "০";
  return String(val)
    .split("")
    .map((char) => BENGALI_DIGITS[char] || char)
    .join("");
}

/**
 * Formats a monetary amount in Bangladeshi Taka (৳)
 * @param amount Number to format
 * @param useBengaliDigits If true, outputs Bengali digits e.g. ৳ ১,২৫০.৫০
 */
export function formatTaka(amount: number | undefined | null, useBengaliDigits: boolean = false): string {
  const num = Number(amount) || 0;
  const formatted = num.toLocaleString("en-IN", {
    minimumFractionDigits: num % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });

  if (useBengaliDigits) {
    return `৳ ${toBengaliNumeral(formatted)}`;
  }
  return `৳ ${formatted}`;
}

/**
 * Formats a date string (YYYY-MM-DD) into Bengali readable format
 */
export function formatDateBengali(dateStr: string): string {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  const year = toBengaliNumeral(parts[0]);
  const month = toBengaliNumeral(parts[1]);
  const day = toBengaliNumeral(parts[2]);
  return `${day}/${month}/${year}`;
}

/**
 * Returns current month in "YYYY-MM" format
 */
export function getCurrentMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

/**
 * Returns current date in "YYYY-MM-DD" format
 */
export function getCurrentDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

