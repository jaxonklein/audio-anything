import { getCookie, setCookie } from './cookies';

// Beta invite codes (in production, these would be in database)
const VALID_INVITE_CODES = [
  'BETA-FOUNDER', // Unlimited use
  'BETA-A1B2C3D4',
  'BETA-E5F6G7H8',
  'BETA-I9J0K1L2',
  // ... more codes from docs/ops/beta-invite-codes.txt
];

const USED_INVITE_CODES_KEY = 'used_invite_codes';

export function checkBetaAccess(): boolean {
  // Check if user has beta access cookie
  const hasBetaAccess = getCookie('beta_access') === 'true';
  return hasBetaAccess;
}

export function grantBetaAccess(inviteCode: string): boolean {
  // Validate invite code
  if (!VALID_INVITE_CODES.includes(inviteCode)) {
    return false;
  }

  // Check if code has been used (except BETA-FOUNDER which is unlimited)
  if (inviteCode !== 'BETA-FOUNDER') {
    const usedCodes = getUsedInviteCodes();
    if (usedCodes.includes(inviteCode)) {
      return false; // Code already used
    }
    // Mark code as used
    markInviteCodeAsUsed(inviteCode);
  }

  // Grant beta access (cookie lasts 30 days)
  setCookie('beta_access', 'true', 30);
  setCookie('invite_code', inviteCode, 30);

  return true;
}

function getUsedInviteCodes(): string[] {
  const data = getCookie(USED_INVITE_CODES_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function markInviteCodeAsUsed(code: string) {
  const usedCodes = getUsedInviteCodes();
  usedCodes.push(code);
  setCookie(USED_INVITE_CODES_KEY, JSON.stringify(usedCodes), 365);
}

export function getBetaInviteCode(): string | null {
  return getCookie('invite_code');
}
