import { describe, it, expect } from 'vitest';
import { getTeamColor, getTeamLogoUrl, getTeamFullName } from '../../utils/teamUtils';

describe('getTeamColor', () => {
  it('returns correct color for known teams', () => {
    expect(getTeamColor('TOR')).toBe('#003E7E');
    expect(getTeamColor('BOS')).toBe('#FFB81C');
  });
  it('returns fallback gray for unknown abbrev', () => {
    expect(getTeamColor('XYZ')).toBe('#6B7280');
  });
});

describe('getTeamLogoUrl', () => {
  it('returns light logo URL by default', () => {
    expect(getTeamLogoUrl('TOR')).toContain('TOR_light.svg');
  });
  it('returns dark logo URL when dark=true', () => {
    expect(getTeamLogoUrl('TOR', true)).toContain('TOR_dark.svg');
  });
  it('uses correct NHL CDN domain', () => {
    expect(getTeamLogoUrl('BOS')).toContain('assets.nhle.com');
  });
});

describe('getTeamFullName', () => {
  it('returns full name for known team', () => {
    expect(getTeamFullName('TOR')).toBe('Toronto Maple Leafs');
    expect(getTeamFullName('BOS')).toBe('Boston Bruins');
  });
  it('returns the abbrev for unknown team', () => {
    expect(getTeamFullName('XYZ')).toBe('XYZ');
  });
});
