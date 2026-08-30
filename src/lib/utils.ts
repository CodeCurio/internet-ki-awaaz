import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Consistent IST Date conversion
function toISTDate(dateInput: string | number | Date): Date {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return new Date();
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  const istOffset = 5.5 * 3600000;
  return new Date(utc + istOffset);
}

export function formatHindiDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  const date = toISTDate(dateStr);
  
  const hindiDays = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
  const hindiMonths = [
    'जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
    'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
  ];

  const dayName = hindiDays[date.getDay()];
  const day = date.getDate();
  const monthName = hindiMonths[date.getMonth()];
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const period = hours >= 12 ? 'अपराह्न' : 'पूर्वाह्न';
  hours = hours % 12 || 12;

  return `${dayName}, ${day} ${monthName} ${year} | ${period} ${hours}:${minutes}`;
}

export function formatRelativeHindiTime(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  
  const now = new Date();
  const diffMs = Math.max(0, now.getTime() - date.getTime());
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return 'अभी-अभी';
  if (diffMinutes < 60) return `${diffMinutes} मिनट पहले`;
  if (diffHours < 24) return `${diffHours} घंटे पहले`;
  if (diffDays === 1) return 'कल';
  if (diffDays < 30) return `${diffDays} दिन पहले`;

  return formatHindiDate(dateStr);
}

export function formatHindiTimeClock(date: Date = new Date()): { dayDate: string; timeString: string } {
  const ist = toISTDate(date);
  const hindiDays = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
  const hindiMonths = [
    'जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
    'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
  ];

  const dayName = hindiDays[ist.getDay()];
  const day = ist.getDate();
  const monthName = hindiMonths[ist.getMonth()];
  const year = ist.getFullYear();

  let hours = ist.getHours();
  const minutes = ist.getMinutes().toString().padStart(2, '0');
  const period = hours >= 12 ? 'अपराह्न' : 'पूर्वाह्न';
  hours = hours % 12 || 12;

  return {
    dayDate: `${dayName}, ${day} ${monthName} ${year}`,
    timeString: `${period} ${hours}:${minutes}`,
  };
}

export function truncateGlyphs(text: string, maxGlyphs: number): string {
  const glyphs = Array.from(text);
  if (glyphs.length <= maxGlyphs) return text;
  return glyphs.slice(0, maxGlyphs).join('') + '…';
}

export function slugifyText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0900-\u097F]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
