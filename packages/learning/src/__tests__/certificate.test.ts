import { describe, it, expect } from 'vitest';
import {
  generateVerificationCode,
  formatCertificateData,
  buildVerificationUrl,
} from '../certificate';

describe('generateVerificationCode', () => {
  it('should start with CPUB prefix by default', () => {
    const code = generateVerificationCode();
    expect(code).toMatch(/^CPUB-/);
  });

  it('should use custom prefix', () => {
    const code = generateVerificationCode('TEST');
    expect(code).toMatch(/^TEST-/);
  });

  it('should have three parts separated by hyphens', () => {
    const code = generateVerificationCode();
    // Format: PREFIX-TIMESTAMP-RANDOM
    const parts = code.split('-');
    expect(parts.length).toBe(3);
  });

  it('should generate unique codes', () => {
    const codes = new Set<string>();
    for (let i = 0; i < 50; i++) {
      codes.add(generateVerificationCode());
    }
    expect(codes.size).toBe(50);
  });

  it('should have 8-char hex random part', () => {
    const code = generateVerificationCode();
    const randomPart = code.split('-')[2];
    expect(randomPart).toMatch(/^[0-9a-f]{8}$/);
  });
});

describe('formatCertificateData', () => {
  it('should format certificate data correctly', () => {
    const date = new Date('2025-06-15T12:00:00Z');
    const data = formatCertificateData('Web Dev 101', 'Jane Doe', date, 'SNAP-ABC-12345678');

    expect(data.pathTitle).toBe('Web Dev 101');
    expect(data.earnerName).toBe('Jane Doe');
    expect(data.issuedAt).toBe(date);
    expect(data.verificationCode).toBe('SNAP-ABC-12345678');
    expect(data.formattedDate).toContain('2025');
    expect(data.formattedDate).toContain('June');
    expect(data.formattedDate).toContain('15');
  });
});

describe('buildVerificationUrl', () => {
  it('should build correct URL', () => {
    const url = buildVerificationUrl('https://example.com', 'SNAP-ABC-12345678');
    expect(url).toBe('https://example.com/certificates/SNAP-ABC-12345678');
  });

  it('should handle trailing slash on base URL', () => {
    const url = buildVerificationUrl('https://example.com/', 'SNAP-ABC-12345678');
    expect(url).toBe('https://example.com/certificates/SNAP-ABC-12345678');
  });
});
