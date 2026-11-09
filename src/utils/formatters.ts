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

const BENGALI_MONTHS = [
  "জানুয়ারি",
  "ফেব্রুয়ারি",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্টেম্বর",
  "অক্টোবর",
  "নভেম্বর",
  "ডিসেম্বর",
];

const BENGALI_MONTHS_SHORT = [
  "জানু",
  "ফেব",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্টে",
  "অক্টো",
  "নভে",
  "ডিসে",
];

const BENGALI_DAYS_SHORT = [
  "রবি",
  "সোম",
  "মঙ্গল",
  "বুধ",
  "বৃহঃ",
  "শুক্র",
  "শনি",
];

/**
 * Returns formatted Bengali Month name e.g. "নভেম্বর ২০২৬" or "নভে '২৬"
 */
export function formatMonthBengali(monthStr: string, short: boolean = false): string {
  if (!monthStr) return "";
  const [yearStr, mStr] = monthStr.split("-");
  const monthIdx = parseInt(mStr, 10) - 1;
  if (monthIdx < 0 || monthIdx > 11) return monthStr;

  const monthName = short ? BENGALI_MONTHS_SHORT[monthIdx] : BENGALI_MONTHS[monthIdx];
  const yearBengali = toBengaliNumeral(short ? yearStr.slice(-2) : yearStr);

  return short ? `${monthName} '${yearBengali}` : `${monthName} ${yearBengali}`;
}

/**
 * Returns Bengali day of week for a YYYY-MM-DD string e.g. "সোম", "মঙ্গল"
 */
export function getDayOfWeekBengali(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  const dayIdx = d.getDay();
  return BENGALI_DAYS_SHORT[dayIdx] || "";
}

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

