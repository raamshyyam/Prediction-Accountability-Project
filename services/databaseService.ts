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

// Claims operations
export const saveClaim = async (claim: Claim): Promise<boolean> => {
  if (!isFirebaseConfigured()) return false;
  try {
    await set(ref(database, `${CLAIMS_PATH}/${claim.id}`), claim);
    return true;
  } catch (error) {
    console.warn('Failed to save claim to Firebase:', error);
    return false;
  }
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
    await update(ref(database, `${CLAIMS_PATH}/${claim.id}`), claim);
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
    await set(ref(database, `${CLAIMANTS_PATH}/${claimant.id}`), claimant);
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
    await update(ref(database, `${CLAIMANTS_PATH}/${claimant.id}`), claimant);
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
    await set(ref(database, CLAIMS_PATH), claimsObj);
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
    await set(ref(database, CLAIMANTS_PATH), claimantsObj);
    return true;
  } catch (error) {
    console.warn('Failed to sync all claimants to Firebase:', error);
    return false;
  }
};
