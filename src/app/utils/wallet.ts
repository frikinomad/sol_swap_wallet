"use client";

import { PublicKey } from "@solana/web3.js";
import * as bip39 from "bip39";
import * as web3 from '@solana/web3.js';
import * as ed25519 from 'ed25519-hd-key';
import { derivePath } from "ed25519-hd-key";
import CryptoJS from "crypto-js";

// Encrypt and save private key
export const savePrivateKey = (privateKey: Uint8Array, password: string) => {
  const keyString = Array.from(privateKey).join(",");
  const encrypted = CryptoJS.AES.encrypt(keyString, password).toString();
  localStorage.setItem("encryptedPrivateKey", encrypted);
};

// Retrieve and decrypt private key
export const getPrivateKey = (password: string): Uint8Array => {
  const encrypted = localStorage.getItem("encryptedPrivateKey");
  if (!encrypted) {
    console.log("Private key not present");
    return new Uint8Array(0);
  }
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, password);
    const keyString = bytes.toString(CryptoJS.enc.Utf8);
    if (!keyString) {
      console.warn("Decryption failed. Returning empty key.");
      return new Uint8Array(0); // Return an empty Uint8Array on decryption failure
    }
    return new Uint8Array(keyString.split(",").map(Number));
  } catch (error) {
    console.error("Failed to decrypt private key:", error);
    return new Uint8Array(0); // Return an empty Uint8Array
  }
};

// Create a new wallet
export const createWallet = (password: string, setPublicKey: (key: PublicKey | null) => void): { publicKey: string; mnemonic: string } => {

  const mnemonic = bip39.generateMnemonic();
  
  // Convert mnemonic to seed
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  
  // Derive keypair from seed
  const derivedSeed = ed25519.derivePath("m/44'/501'/0'/0'", seed.toString('hex'));
  const keypair = web3.Keypair.fromSeed(derivedSeed.key);

  savePrivateKey(keypair.secretKey, password);
  localStorage.setItem("publicKey", keypair.publicKey.toString());

  // Update context
  setPublicKey(keypair.publicKey);
  
  return {
    publicKey: keypair.publicKey.toBase58(),
    mnemonic: mnemonic
  };
};


// Import a wallet using a mnemonic
export const importWalletFromMnemonic = (
  mnemonic: string,
  password: string,
  setPublicKey: (key: PublicKey | null) => void
): { publicKey: string; secretKey: Uint8Array } => {
  
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error('Invalid mnemonic phrase');
  }
  
  // Convert mnemonic to seed
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  
  // Derive keypair from seed
  const derivedSeed = ed25519.derivePath("m/44'/501'/0'/0'", seed.toString('hex'));
  const keypair = web3.Keypair.fromSeed(derivedSeed.key);

  savePrivateKey(keypair.secretKey, password);
  localStorage.setItem("publicKey", keypair.publicKey.toString());

  // Update context
  setPublicKey(keypair.publicKey);
  console.log(keypair.publicKey.toString());  
  
  return {
    publicKey: keypair.publicKey.toBase58(),
    secretKey: Buffer.from(keypair.secretKey),
  };

};

// Unlock wallet: Load public key from localStorage
export const unlockWallet = (): PublicKey | null => {
  const storedKey = localStorage.getItem("publicKey");
  return storedKey ? new PublicKey(storedKey) : null;
};

// Derive secret key from mnemonic
export const deriveSecretKeyFromMnemonic = (mnemonic: string): Uint8Array => {
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const derived = derivePath("m/44'/501'/0'/0'", seed.toString("hex"));
  return derived.key;
};

// Convert secret key to mnemonic
export const secretKeyToMnemonic = (secretKey: Uint8Array): string => {
  const entropy = secretKey.slice(0, 16);
  return bip39.entropyToMnemonic(Buffer.from(entropy).toString("hex"));
};
