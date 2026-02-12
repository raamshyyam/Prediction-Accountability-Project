import { ref, set, get, child, update, remove } from 'firebase/database';
import { database } from './firebaseConfig';
import { Claim, Claimant } from '../types';

const CLAIMS_PATH = 'pap/claims';
const CLAIMANTS_PATH = 'pap/claimants';

// Check if Firebase is properly configured
const isFirebaseConfigured = () => {
  try {
    return database !== null && database !== undefined;
  } catch {
    return false;
  }
};

export const isCloudSyncConfigured = (): boolean => isFirebaseConfigured();

// Safe ref creation that doesn't throw
const safeRef = (path: string) => {
  if (!database) return null;
  try {
    export const getClaims = async (): Promise<Claim[]> => {
      if (!isFirebaseConfigured()) return [];
      try {
        const snapshot = await get(child(ref(database), CLAIMS_PATH));
        if (snapshot.exists()) {
          const claimsObj = snapshot.val();
          return Object.values(claimsObj) as Claim[];
        }
        return [];
      } catch (error) {
        return ref(database, path);
      } catch (error) {
        console.error('Error creating Firebase ref:', error);
        return null;
      }
    };

    // Placeholder for sanitizeForFirebase - assuming it's defined elsewhere or will be added
    // This function should remove any properties that Firebase Realtime Database does not support,
    // such as undefined values, or objects with unsupported types.
    const sanitizeForFirebase = <T>(data: T): T => {
      // Example implementation: remove undefined values
      if (typeof data !== 'object' || data === null) {
        return data;
      }

      if (Array.isArray(data)) {
        return data.map(item => sanitizeForFirebase(item)) as T;
      }

      const sanitizedData: { [key: string]: any } = {};
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const value = (data as any)[key];
          if (value !== undefined) {
            sanitizedData[key] = sanitizeForFirebase(value);
          }
        }
      }
      return sanitizedData as T;
    };


    export const getClaims = async (): Promise<Claim[]> => {
      if (!isFirebaseConfigured()) return [];
      try {
        const snapshot = await get(child(ref(database), CLAIMS_PATH));
        if (snapshot.exists()) {
          const claimsObj = snapshot.val();
          return Object.values(claimsObj) as Claim[];
        }
        return [];
      } catch (error) {
        console.warn('Failed to fetch claims from Firebase:', error);
        return [];
      }
    };

    export const updateClaim = async (claim: Claim): Promise<boolean> => {
      if (!isFirebaseConfigured()) return false;
      try {
        const sanitized = sanitizeForFirebase(claim);
        await update(ref(database, `${CLAIMS_PATH}/${claim.id}`), sanitized);
        return true;
      } catch (error) {
        console.warn('Failed to update claim in Firebase:', error);
        return false;
      }
    };

    export const deleteClaim = async (claimId: string): Promise<boolean> => {
      if (!isFirebaseConfigured()) return false;
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
      if (!isFirebaseConfigured()) return false;
      try {
        const sanitized = sanitizeForFirebase(claimant);
        await set(ref(database, `${CLAIMANTS_PATH}/${claimant.id}`), sanitized);
        return true;
      } catch (error) {
        console.warn('Failed to save claimant to Firebase:', error);
        return false;
      }
    };

    export const getClaimants = async (): Promise<Claimant[]> => {
      if (!isFirebaseConfigured()) return [];
      try {
        const snapshot = await get(child(ref(database), CLAIMANTS_PATH));
        if (snapshot.exists()) {
          const claimantsObj = snapshot.val();
          return Object.values(claimantsObj) as Claimant[];
        }
        return [];
      } catch (error) {
        console.warn('Failed to fetch claimants from Firebase:', error);
        return [];
      }
    };

    export const updateClaimant = async (claimant: Claimant): Promise<boolean> => {
      if (!isFirebaseConfigured()) return false;
      try {
        const sanitized = sanitizeForFirebase(claimant);
        await update(ref(database, `${CLAIMANTS_PATH}/${claimant.id}`), sanitized);
        return true;
      } catch (error) {
        console.warn('Failed to update claimant in Firebase:', error);
        return false;
      }
    };

    // Sync all claims at once (for bulk operations)
    export const syncAllClaims = async (claims: Claim[]): Promise<boolean> => {
      if (!isFirebaseConfigured()) return false;
      try {
        const claimsObj: { [key: string]: Claim } = {};
        claims.forEach(claim => {
          claimsObj[claim.id] = claim;
        });
        const sanitized = sanitizeForFirebase(claimsObj);
        await set(ref(database, CLAIMS_PATH), sanitized);
        return true;
      } catch (error) {
        console.warn('Failed to sync all claims to Firebase:', error);
        return false;
      }
    };

    // Sync all claimants at once (for bulk operations)
    export const syncAllClaimants = async (claimants: Claimant[]): Promise<boolean> => {
      if (!isFirebaseConfigured()) return false;
      try {
        const claimantsObj: { [key: string]: Claimant } = {};
        claimants.forEach(claimant => {
          claimantsObj[claimant.id] = claimant;
        });
        const sanitized = sanitizeForFirebase(claimantsObj);
        await set(ref(database, CLAIMANTS_PATH), sanitized);
        return true;
      } catch (error) {
        console.warn('Failed to sync all claimants to Firebase:', error);
        return false;
      }
    };
