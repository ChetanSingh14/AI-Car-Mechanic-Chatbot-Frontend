import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getClientToken, getApiBaseUrl, PROXY_API_PATH, BACKEND_TARGET_URL } from '../src/services/api';
import { formatFileSize, validateMediaFile, normalizeMediaUrl, formatDate } from '../src/lib/utils';

describe('AutoTech Frontend Service & Utility Tests', () => {
  beforeEach(() => {
    // Reset simulated browser localStorage & window
    const store: Record<string, string> = {};
    const mockStorage = {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, val: string) => { store[key] = val; },
      removeItem: (key: string) => { delete store[key]; },
      clear: () => { Object.keys(store).forEach(k => delete store[k]); }
    };
    vi.stubGlobal('localStorage', mockStorage);
    vi.stubGlobal('window', {
      localStorage: mockStorage,
      location: { protocol: 'http:' }
    });
  });

  describe('Client Privacy & Session Isolation (X-Client-Token)', () => {
    it('generates a secure UUID-based client token when none exists', () => {
      const token = getClientToken();
      expect(token).toBeDefined();
      expect(token.startsWith('clt_')).toBe(true);
      expect(token.length).toBeGreaterThan(20);
    });

    it('persists and reuses the existing client token from localStorage', () => {
      localStorage.setItem('autotech_client_token', 'clt_custom_alice_12345');
      const token = getClientToken();
      expect(token).toBe('clt_custom_alice_12345');
    });
  });

  describe('Mixed Content & Dynamic API Base URL Resolution', () => {
    it('returns same-origin proxy path on HTTPS to prevent mixed-content blocks', () => {
      vi.stubGlobal('window', {
        location: { protocol: 'https:' }
      });
      const url = getApiBaseUrl();
      if (BACKEND_TARGET_URL.startsWith('http://')) {
        expect(url).toBe(PROXY_API_PATH);
      } else {
        expect(url).toBe(BACKEND_TARGET_URL);
      }
    });

    it('uses direct BACKEND_TARGET_URL on HTTP', () => {
      vi.stubGlobal('window', {
        location: { protocol: 'http:' }
      });
      const url = getApiBaseUrl();
      expect(url).toBe(BACKEND_TARGET_URL);
    });
  });

  describe('Diagnostic Media Validation (4 MB Guardrail)', () => {
    it('accepts files within the 4 MB limit', () => {
      const validFile = new File(['small diagnostic photo'], 'spark_plug.jpg', { type: 'image/jpeg' });
      const result = validateMediaFile(validFile);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('rejects files exceeding the 4 MB size limit', () => {
      const fiveMbBuffer = new Uint8Array(5 * 1024 * 1024);
      const largeFile = new File([fiveMbBuffer], 'exhaust_video.mp4', { type: 'video/mp4' });
      const result = validateMediaFile(largeFile);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('exceeds 4MB limit');
    });
  });

  describe('Data Formatting & Media Normalization Utilities', () => {
    it('formats file sizes accurately into human-readable strings', () => {
      expect(formatFileSize(0)).toBe('0 B');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1024 * 1024 * 2.5)).toBe('2.5 MB');
    });

    it('normalizes HTTP media URLs to relative same-origin paths', () => {
      const fullUrl = 'http://13.234.4.236/media/uploads/2026/10/01/brake.png';
      expect(normalizeMediaUrl(fullUrl)).toBe('/media/uploads/2026/10/01/brake.png');
    });

    it('safely handles empty or invalid dates without throwing', () => {
      expect(formatDate(undefined)).toBe('');
      expect(formatDate('invalid-date-string')).toBe('');
      expect(formatDate('2026-10-01T12:00:00Z')).toContain('Oct');
    });
  });
});
