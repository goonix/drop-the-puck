import { format, addDays, subDays, parseISO, isToday } from 'date-fns';

export function formatDateForApi(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function todayString(): string {
  return formatDateForApi(new Date());
}

export function prevDate(dateStr: string): string {
  return formatDateForApi(subDays(parseISO(dateStr), 1));
}

export function nextDate(dateStr: string): string {
  return formatDateForApi(addDays(parseISO(dateStr), 1));
}

export function formatDisplayDate(dateStr: string): string {
  const date = parseISO(dateStr);
  if (isToday(date)) return 'Today';
  return format(date, 'EEE, MMM d');
}

export function formatGameTime(utcString: string): string {
  try {
    const date = new Date(utcString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    });
  } catch {
    return '';
  }
}
