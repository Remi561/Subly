import axios from 'axios'
export async function generatedSettledAmt(from, to, amount, rates) {
    const toRate = rates[to.toUpperCase()];
    const fromRate = rates[from.toUpperCase()]

    if (fromRate === toRate) {
        return {exchangeRate: 1 ,settledAmt:Math.round(amount*100) }
    }
  
  if (!fromRate || !toRate) {
      throw new Error('Unsupported currency')
    }

    const convertedRate = toRate / fromRate
    const convertedAmount = convertedRate * amount
    return {exchangeRate: convertedRate,settledAmt:Math.round(convertedAmount * 100)}
}

// src/utils/getNextBillingDate.js

const getLastDayOfMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
};
  
export const getNextBillingDate = (billingCycle) => {
      const currentDate = Date.now()
    const date = new Date(currentDate);
  
    if (Number.isNaN(date.getTime())) {
      throw new Error("Invalid date");
    }

    if (billingCycle === "WEEKLY") {
      date.setDate(date.getDate() + 7);
      return date;
    }
  
    if (billingCycle === "YEARLY") {
      const originalDay = date.getDate();
      const targetYear = date.getFullYear() + 1;
      const targetMonth = date.getMonth();
      const lastDay = getLastDayOfMonth(targetYear, targetMonth);
  
      date.setFullYear(targetYear);
      date.setDate(Math.min(originalDay, lastDay));
  
      return date;
    }
  
    if (billingCycle === "MONTHLY") {
      const originalDay = date.getDate();
  
      const targetMonth = date.getMonth() + 1;
      const targetYear = date.getFullYear() + Math.floor(targetMonth / 12);
      const normalizedMonth = targetMonth % 12;
  
      const lastDay = getLastDayOfMonth(targetYear, normalizedMonth);
  
      return new Date(
        targetYear,
        normalizedMonth,
        Math.min(originalDay, lastDay),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds()
      );
    }
  
    throw new Error("Invalid billing cycle");
};

function getFallbackLogo(name) {
  const encodedName = encodeURIComponent(name);

  return `https://ui-avatars.com/api/?name=${encodedName}&background=4f46e5&color=fff`;
}
  
async function getDomain(name) {
  const refineName = name.trim().toLowerCase()
  try {
    const respone = await axios.get(`https://autocomplete.clearbit.com/v1/companies/suggest?query=${refineName}`)
    if (respone.status !== 200) {
      return null
    }
    const data = respone.data

    if (!Array.isArray(data) || data.length <= 0) {
      return null
    }

    const exactMatch = data.find(company => company.name.toLowerCase() === refineName)
    if (exactMatch?.domain) {
      return exactMatch.domain
    }
    return data[0]?.domain || null
   } catch (err) {
    console.error(err)
    throw new Error('something went wrong')
  }
  
}

export async function getLogo(name) {
  const fallBack = getFallbackLogo(name)
  try {
    const domain = await getDomain(name)
    
    if (!domain) return fallBack
    
    return `https://icon.horse/icon/${domain}`;
   } catch (err) {
    console.error(err)
    throw new Error('something went wrong')
  }
}