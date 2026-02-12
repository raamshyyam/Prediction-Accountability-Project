import { ref, set, get, child, update, remove } from 'firebase/database';
import { database } from './firebaseConfig';
import { Claim, Claimant } from '../types';

const CLAIMS_PATH = 'pap/claims';
const CLAIMANTS_PATH = 'pap/claimants';

const isFirebaseConfigured = () => {
  try {
    return database !== null && database !== undefined;
  } catch {
    return false;
  }
};

const getDatabaseUrl = (): string => {
  try {
    const fromVite = (import.meta as any)?.env?.VITE_FIREBASE_DATABASE_URL;
    if (typeof fromVite === 'string' && fromVite.trim()) return fromVite.trim().replace(/\/+$/, '');
  } catch {
    // ignored
  }

  try {
    const fromWindow = (window as any)?.__ENV__?.VITE_FIREBASE_DATABASE_URL;
    if (typeof fromWindow === 'string' && fromWindow.trim()) return fromWindow.trim().replace(/\/+$/, '');
  } catch {
    // ignored
  }

  return '';
};

const sanitizeForFirebase = <T>(data: T): T => {
  if (typeof data !== 'object' || data === null) return data;
  if (Array.isArray(data)) return data.map((item) => sanitizeForFirebase(item)) as T;

  const sanitizedData: { [key: string]: any } = {};
  for (const key in data as any) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = (data as any)[key];
      if (value !== undefined) sanitizedData[key] = sanitizeForFirebase(value);
    }
  }
  return sanitizedData as T;
};

const readPathViaRest = async <T>(path: string): Promise<T[]> => {
  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl) return [];

  try {
    const res = await fetch(`${databaseUrl}/${path}.json`);
    if (!res.ok) return [];
    const data = await res.json();

    if (Array.isArray(data)) return data.filter(Boolean) as T[];
    if (data && typeof data === 'object') return Object.values(data) as T[];
    return [];
  } catch {
    return [];
  }
};

const writePathViaRest = async <T>(path: string, recordMap: Record<string, T>): Promise<boolean> => {
  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl) return false;

  try {
    const res = await fetch(`${databaseUrl}/${path}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recordMap)
    });
    return res.ok;
  } catch {
    return false;
  }
};

export const isCloudSyncConfigured = (): boolean => {
  return isFirebaseConfigured() || getDatabaseUrl() !== '';
};

// Claims operations
export const saveClaim = async (claim: Claim): Promise<boolean> => {
  const sanitized = sanitizeForFirebase(claim);

  if (!isFirebaseConfigured()) {
    const existing = await getClaims();
    const claimsObj: Record<string, Claim> = {};
    existing.forEach((item) => {
      claimsObj[item.id] = item;
    });
    claimsObj[claim.id] = sanitized;
    return writePathViaRest<Claim>(CLAIMS_PATH, claimsObj);
  }

  try {
    await set(ref(database, `${CLAIMS_PATH}/${claim.id}`), sanitized);
    return true;
  } catch (error) {
    console.warn('Failed to save claim to Firebase:', error);
    return false;
  }
};

export const getClaims = async (): Promise<Claim[]> => {
  if (!isFirebaseConfigured()) {
    return readPathViaRest<Claim>(CLAIMS_PATH);
  }

  try {
    const snapshot = await get(child(ref(database), CLAIMS_PATH));
    if (snapshot.exists()) {
      const claimsObj = snapshot.val();
      return Object.values(claimsObj) as Claim[];
    }
    return readPathViaRest<Claim>(CLAIMS_PATH);
  } catch (error) {
    console.warn('Failed to fetch claims from Firebase:', error);
    return readPathViaRest<Claim>(CLAIMS_PATH);
  }
};

export const updateClaim = async (claim: Claim): Promise<boolean> => {
  const sanitized = sanitizeForFirebase(claim);

  if (!isFirebaseConfigured()) {
    const existing = await getClaims();
    const claimsObj: Record<string, Claim> = {};
    existing.forEach((item) => {
      claimsObj[item.id] = item;
    });
    claimsObj[claim.id] = sanitized;
    return writePathViaRest<Claim>(CLAIMS_PATH, claimsObj);
  }

  try {
    await update(ref(database, `${CLAIMS_PATH}/${claim.id}`), sanitized);
    return true;
  } catch (error) {
    console.warn('Failed to update claim in Firebase:', error);
    return false;
  }
};

export const deleteClaim = async (claimId: string): Promise<boolean> => {
  if (!isFirebaseConfigured()) {
    const existing = await getClaims();
    const claimsObj: Record<string, Claim> = {};
    existing.filter((item) => item.id !== claimId).forEach((item) => {
      claimsObj[item.id] = item;
    });
    return writePathViaRest<Claim>(CLAIMS_PATH, claimsObj);
  }

  try {
    await remove(ref(database, `${CLAIMS_PATH}/${claimId}`));
    return true;
  } catch (error) {
    console.warn('Failed to delete claim from Firebase:', error);
    return false;
  }
};

// Claimants operations
export const saveClaimant = async (claimant: Claimant): Promise<boolean> => {
  const sanitized = sanitizeForFirebase(claimant);

  if (!isFirebaseConfigured()) {
    const existing = await getClaimants();
    const claimantsObj: Record<string, Claimant> = {};
    existing.forEach((item) => {
      claimantsObj[item.id] = item;
    });
    claimantsObj[claimant.id] = sanitized;
    return writePathViaRest<Claimant>(CLAIMANTS_PATH, claimantsObj);
  }

  try {
    await set(ref(database, `${CLAIMANTS_PATH}/${claimant.id}`), sanitized);
    return true;
  } catch (error) {
    console.warn('Failed to save claimant to Firebase:', error);
    return false;
  }
};

export const getClaimants = async (): Promise<Claimant[]> => {
  if (!isFirebaseConfigured()) {
    return readPathViaRest<Claimant>(CLAIMANTS_PATH);
  }

  try {
    const snapshot = await get(child(ref(database), CLAIMANTS_PATH));
    if (snapshot.exists()) {
      const claimantsObj = snapshot.val();
      return Object.values(claimantsObj) as Claimant[];
    }
    return readPathViaRest<Claimant>(CLAIMANTS_PATH);
  } catch (error) {
    console.warn('Failed to fetch claimants from Firebase:', error);
    return readPathViaRest<Claimant>(CLAIMANTS_PATH);
  }
};

export const updateClaimant = async (claimant: Claimant): Promise<boolean> => {
  const sanitized = sanitizeForFirebase(claimant);

  if (!isFirebaseConfigured()) {
    const existing = await getClaimants();
    const claimantsObj: Record<string, Claimant> = {};
    existing.forEach((item) => {
      claimantsObj[item.id] = item;
    });
    claimantsObj[claimant.id] = sanitized;
    return writePathViaRest<Claimant>(CLAIMANTS_PATH, claimantsObj);
  }

  try {
    await update(ref(database, `${CLAIMANTS_PATH}/${claimant.id}`), sanitized);
    return true;
  } catch (error) {
    console.warn('Failed to update claimant in Firebase:', error);
    return false;
  }
};

// Sync all claims at once (for bulk operations)
export const syncAllClaims = async (claims: Claim[]): Promise<boolean> => {
  const claimsObj: { [key: string]: Claim } = {};
  claims.forEach((claim) => {
    claimsObj[claim.id] = claim;
  });

  const sanitized = sanitizeForFirebase(claimsObj);

  if (!isFirebaseConfigured()) {
    return writePathViaRest<Claim>(CLAIMS_PATH, sanitized);
  }

  try {
    await set(ref(database, CLAIMS_PATH), sanitized);
    return true;
  } catch (error) {
    console.warn('Failed to sync all claims to Firebase:', error);
    return writePathViaRest<Claim>(CLAIMS_PATH, sanitized);
  }
};

// Sync all claimants at once (for bulk operations)
export const syncAllClaimants = async (claimants: Claimant[]): Promise<boolean> => {
  const claimantsObj: { [key: string]: Claimant } = {};
  claimants.forEach((claimant) => {
    claimantsObj[claimant.id] = claimant;
  });

  const sanitized = sanitizeForFirebase(claimantsObj);

  if (!isFirebaseConfigured()) {
    return writePathViaRest<Claimant>(CLAIMANTS_PATH, sanitized);
  }

  try {
    await set(ref(database, CLAIMANTS_PATH), sanitized);
    return true;
  } catch (error) {
    console.warn('Failed to sync all claimants to Firebase:', error);
    return writePathViaRest<Claimant>(CLAIMANTS_PATH, sanitized);
  }
};
