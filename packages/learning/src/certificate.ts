import type { CertificateData } from './types';

/** Generate a unique verification code */
export function generateVerificationCode(prefix = 'SNAP'): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = randomHex(8);
  return `${prefix}-${timestamp}-${random}`;
}

/** Format certificate data for display */
export function formatCertificateData(
  pathTitle: string,
  earnerName: string,
  issuedAt: Date,
  verificationCode: string,
): CertificateData {
  return {
    pathTitle,
    earnerName,
    issuedAt,
    verificationCode,
    formattedDate: formatDate(issuedAt),
  };
}

/** Build a full verification URL */
export function buildVerificationUrl(baseUrl: string, code: string): string {
  const normalized = baseUrl.replace(/\/+$/, '');
  return `${normalized}/certificates/${code}`;
}

// --- Helpers ---

function randomHex(length: number): string {
  const chars = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
