/**
 * Frontend/src/utils/holidayThemes.js
 * 
 * Reusable visual design presets for ScaleLink Alliance holiday campaigns.
 * Strictly adheres to corporate deep-blue branding with restrained, professional seasonal accents.
 */

export const HOLIDAY_THEMES = {
  black_friday: {
    id: 'black_friday',
    label: 'Black Friday',
    bannerBg: 'bg-gradient-to-r from-slate-950 via-[#0B132B] to-slate-950',
    bannerText: 'text-white',
    badgeBg: 'bg-amber-400 text-slate-950 font-black',
    accentBorder: 'border-amber-400/30',
    cardBorder: 'border-amber-500/20 hover:border-amber-500/40',
    heroBg: 'bg-gradient-to-b from-slate-950 via-[#0f172a] to-slate-900',
    headlineColor: 'text-white',
    highlightText: 'text-amber-400',
    primaryBtn: 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold shadow-lg shadow-amber-400/20',
    secondaryBtn: 'border border-slate-600 hover:bg-slate-800 text-white',
    savingsBadge: 'bg-amber-400/10 text-amber-300 border border-amber-400/30',
    iconColor: 'text-amber-400'
  },
  christmas: {
    id: 'christmas',
    label: 'Christmas',
    bannerBg: 'bg-gradient-to-r from-[#0F1E36] via-[#162A4D] to-[#0F1E36]',
    bannerText: 'text-white',
    badgeBg: 'bg-amber-400 text-[#0F1E36] font-black',
    accentBorder: 'border-amber-300/30',
    cardBorder: 'border-amber-400/20 hover:border-amber-400/50',
    heroBg: 'bg-gradient-to-b from-[#0F1E36] via-[#18264A] to-[#0F1E36]',
    headlineColor: 'text-white',
    highlightText: 'text-amber-300',
    primaryBtn: 'bg-amber-400 hover:bg-amber-300 text-[#0F1E36] font-extrabold shadow-lg shadow-amber-400/20',
    secondaryBtn: 'border border-slate-500/50 hover:bg-white/10 text-white',
    savingsBadge: 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/30',
    iconColor: 'text-amber-300'
  },
  new_year: {
    id: 'new_year',
    label: 'New Year',
    bannerBg: 'bg-gradient-to-r from-slate-900 via-[#1E293B] to-slate-900',
    bannerText: 'text-white',
    badgeBg: 'bg-gradient-to-r from-amber-300 to-yellow-400 text-slate-900 font-black',
    accentBorder: 'border-slate-400/30',
    cardBorder: 'border-slate-400/20 hover:border-amber-400/40',
    heroBg: 'bg-gradient-to-b from-[#0B132B] via-[#1E293B] to-[#0B132B]',
    headlineColor: 'text-white',
    highlightText: 'text-amber-300',
    primaryBtn: 'bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-extrabold shadow-lg',
    secondaryBtn: 'border border-slate-600 hover:bg-slate-800 text-white',
    savingsBadge: 'bg-amber-400/10 text-amber-300 border border-amber-400/30',
    iconColor: 'text-amber-400'
  },
  easter: {
    id: 'easter',
    label: 'Easter',
    bannerBg: 'bg-gradient-to-r from-[#1E2E54] via-[#243B6B] to-[#1E2E54]',
    bannerText: 'text-white',
    badgeBg: 'bg-sky-200 text-[#1E2E54] font-black',
    accentBorder: 'border-sky-300/30',
    cardBorder: 'border-sky-300/20 hover:border-sky-400/40',
    heroBg: 'bg-gradient-to-b from-[#18264A] via-[#1E2E54] to-[#18264A]',
    headlineColor: 'text-white',
    highlightText: 'text-sky-300',
    primaryBtn: 'bg-sky-400 hover:bg-sky-300 text-slate-950 font-extrabold shadow-lg shadow-sky-400/20',
    secondaryBtn: 'border border-slate-500 hover:bg-white/10 text-white',
    savingsBadge: 'bg-sky-400/15 text-sky-200 border border-sky-400/30',
    iconColor: 'text-sky-300'
  },
  independence_day: {
    id: 'independence_day',
    label: 'Independence Day',
    bannerBg: 'bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A]',
    bannerText: 'text-white',
    badgeBg: 'bg-rose-600 text-white font-black',
    accentBorder: 'border-rose-500/30',
    cardBorder: 'border-rose-400/20 hover:border-rose-500/40',
    heroBg: 'bg-gradient-to-b from-[#0F172A] via-[#18264A] to-[#0F172A]',
    headlineColor: 'text-white',
    highlightText: 'text-rose-400',
    primaryBtn: 'bg-rose-600 hover:bg-rose-500 text-white font-extrabold shadow-lg shadow-rose-600/20',
    secondaryBtn: 'border border-slate-600 hover:bg-slate-800 text-white',
    savingsBadge: 'bg-rose-500/15 text-rose-300 border border-rose-400/30',
    iconColor: 'text-rose-400'
  },
  general_holiday: {
    id: 'general_holiday',
    label: 'General Holiday',
    bannerBg: 'bg-gradient-to-r from-[#101c38] via-[#18264A] to-[#101c38]',
    bannerText: 'text-white',
    badgeBg: 'bg-amber-400 text-slate-900 font-black',
    accentBorder: 'border-amber-400/30',
    cardBorder: 'border-amber-400/20 hover:border-amber-400/40',
    heroBg: 'bg-gradient-to-b from-[#0f172a] via-[#18264A] to-[#0f172a]',
    headlineColor: 'text-white',
    highlightText: 'text-amber-400',
    primaryBtn: 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold shadow-lg shadow-amber-400/20',
    secondaryBtn: 'border border-slate-500 hover:bg-white/10 text-white',
    savingsBadge: 'bg-amber-400/10 text-amber-300 border border-amber-400/30',
    iconColor: 'text-amber-400'
  }
};

export const getThemeConfig = (themeKey) => {
  return HOLIDAY_THEMES[themeKey] || HOLIDAY_THEMES.general_holiday;
};

