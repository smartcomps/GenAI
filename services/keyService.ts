// services/keyService.ts

export interface KeyData {
  id: string; // The key itself
  uses: number; // The total number of generations allowed
  isPro: boolean; // Whether the key grants Pro access
}

// Generate 20 distinct keys. 15 standard, 5 pro.
// For simplicity, these are hardcoded. In a real app, they would come from a secure backend.
const KEYS: KeyData[] = [
  // Pro Keys (50 uses)
  { id: 'PRO-A1B2-C3D4-E5F6', uses: 50, isPro: true },
  { id: 'PRO-G7H8-I9J0-K1L2', uses: 50, isPro: true },
  { id: 'PRO-M3N4-O5P6-Q7R8', uses: 50, isPro: true },
  { id: 'PRO-S9T0-U1V2-W3X4', uses: 50, isPro: true },
  { id: 'PRO-Y5Z6-A7B8-C9D0', uses: 50, isPro: true },
  // Standard Keys (10 uses)
  { id: 'STD-1122-3344-5566', uses: 10, isPro: false },
  { id: 'STD-7788-9900-1122', uses: 10, isPro: false },
  { id: 'STD-3344-5566-7788', uses: 10, isPro: false },
  { id: 'STD-9900-1122-3344', uses: 10, isPro: false },
  { id: 'STD-5566-7788-9900', uses: 10, isPro: false },
  { id: 'STD-ABCD-EFGH-IJKL', uses: 10, isPro: false },
  { id: 'STD-MNOP-QRST-UVWX', uses: 10, isPro: false },
  { id: 'STD-YZAB-CDEF-GHIJ', uses: 10, isPro: false },
  { id: 'STD-KLMN-OPQR-STUV', uses: 10, isPro: false },
  { id: 'STD-WXYZ-ABCD-EFGH', uses: 10, isPro: false },
  { id: 'STD-IJKL-MNOP-QRST', uses: 10, isPro: false },
  { id: 'STD-UVWX-YZAB-CDEF', uses: 10, isPro: false },
  { id: 'STD-GHIJ-KLMN-OPQR', uses: 10, isPro: false },
  { id: 'STD-STUV-WXYZ-ABCD', uses: 10, isPro: false },
  { id: 'STD-EFGH-IJKL-MNOP', uses: 10, isPro: false },
];

/**
 * Validates a key against the list of available keys.
 * @param key The key string to validate.
 * @returns The KeyData object if the key is valid, otherwise null.
 */
export function validateKey(key: string): KeyData | null {
  const foundKey = KEYS.find(k => k.id === key.trim().toUpperCase());
  return foundKey || null;
}
