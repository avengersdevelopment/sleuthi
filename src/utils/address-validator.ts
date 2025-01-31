import { PublicKey } from "@solana/web3.js";

/**
 * Validate Solana wallet address
 * @param address The wallet address to validate
 * @returns Boolean indicating if the address is a valid Solana address
 */
export const validateSolanaAddress = (address: string) => {
  try {
    const pubkey = new PublicKey(address);
    if (!PublicKey.isOnCurve(pubkey)) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

export const validateWalletAddress = (address: string) => {
  return validateSolanaAddress(address);
};
