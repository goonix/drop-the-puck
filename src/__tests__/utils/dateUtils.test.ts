import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  formatDateForApi,
  prevDate,
  nextDate,
  formatDisplayDate,
  todayString,
} from '../../utils/dateUtils';

describe('formatDateForApi', () => {
  it('formats a date as YYYY-MM-DD', () => {
    expect(formatDateForApi(new Date('2025-10-08T12:00:00Z'))).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('prevDate', () => {
  it('returns the day before', () => {
    expect(prevDate('2025-10-08')).toBe('2025-10-07');
  });
  it('crosses month boundary', () => {
    expect(prevDate('2025-11-01')).toBe('2025-10-31');
  });
});

describe('nextDate', () => {
  it('returns the day after', () => {
    expect(nextDate('2025-10-08')).toBe('2025-10-09');
  });
  it('crosses year boundary', () => {
    expect(nextDate('2025-12-31')).toBe('2026-01-01');
  });
});

describe('formatDisplayDate', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-10-08T12:00:00'));
  });
  afterEach(() => vi.useRealTimers());

  it('returns "Today" for today', () => {
    expect(formatDisplayDate('2025-10-08')).toBe('Today');
  });
  it('returns formatted date for other days', () => {
    expect(formatDisplayDate('2025-10-07')).toMatch(/Tue, Oct 7/);
  });
});

describe('todayString', () => {
  it('returns a valid YYYY-MM-DD string', () => {
    expect(todayString()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
