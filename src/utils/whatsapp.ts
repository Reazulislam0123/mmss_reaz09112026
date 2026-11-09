import { IMemberStatement } from "../lib/calculations";
import { formatTaka, toBengaliNumeral } from "./formatters";

/**
 * Builds a 1-click WhatsApp billing summary message formatted for Bangladeshi mess members
 */
export function buildWhatsAppSettlementMessage(
  statement: IMemberStatement,
  houseName: string,
  month: string,
  mealRate: number
): string {
  const isRefund = statement.netBalance >= 0;
  const statusEmoji = isRefund ? "✅" : "⚠️";
  const statusTitle = isRefund ? "মেস থেকে পাবে (Refund)" : "মেসে বকেয়া (Due)";

  const text = `
🏠 *${houseName}*
📅 *হিসাবের মাস:* ${month}
👤 *সদস্যের নাম:* ${statement.fullName} (রুম: ${statement.roomNo})
────────────────────────
🍽️ *মিল বিবরণ:*
• মোট মিল: ${toBengaliNumeral(statement.totalMeals)} টি
• মিল রেট: ${formatTaka(mealRate, true)}
• মিল বাবদ খরচ: ${formatTaka(statement.mealCost, true)}

⚡ *অন্যান্য খরচ:*
• ফিক্সড/ইউটিলিটি বিল: ${formatTaka(statement.sharedUtilityCost, true)}
• রুম/সিট ভাড়া: ${formatTaka(statement.customRent, true)}
• অন্যান্য সমন্বয়: ${formatTaka(statement.individualAdjustment, true)}
• *সর্বমোট খরচ:* ${formatTaka(statement.totalExpense, true)}

💰 *জমা ও বাজার পরিশোধ:*
• মোট জমা: ${formatTaka(statement.totalDeposits, true)}
• নিজের পকেট থেকে বাজার: ${formatTaka(statement.directBazaarPaid, true)}
• *মোট পরিশোধ:* ${formatTaka(statement.totalDeposits + statement.directBazaarPaid, true)}
────────────────────────
${statusEmoji} *চূড়ান্ত অবস্থা (${statusTitle}):*
👉 *${formatTaka(Math.abs(statement.netBalance), true)}*
────────────────────────
_Smart MMS (মেস ম্যানেজার) দ্বারা তৈরি_
`.trim();

  return text;
}

/**
 * Generates the full WhatsApp URL with encoded message
 */
export function getWhatsAppShareUrl(
  phone: string | undefined,
  statement: IMemberStatement,
  houseName: string,
  month: string,
  mealRate: number
): string {
  const text = buildWhatsAppSettlementMessage(statement, houseName, month, mealRate);
  const cleanPhone = phone ? phone.replace(/[^0-9]/g, "") : "";
  const phoneParam = cleanPhone.startsWith("88") ? cleanPhone : cleanPhone.length === 11 ? `88${cleanPhone}` : cleanPhone;
  
  if (phoneParam) {
    return `https://wa.me/${phoneParam}?text=${encodeURIComponent(text)}`;
  }
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

