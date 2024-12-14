import CryptoJS from "crypto-js";

// Encrypt the password
export const encryptPassword = (password: string): string => {
  return CryptoJS.AES.encrypt(password, "encryptionKey").toString();
};

// Decrypt the password
export const decryptPassword = (encryptedPassword: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, "encryptionKey");
  return bytes.toString(CryptoJS.enc.Utf8);
};

// Encrypt private key using password
export const encryptPrivateKey = (privateKey: Uint8Array, password: string): string => {
  const keyString = Array.from(privateKey).join(",");
  return CryptoJS.AES.encrypt(keyString, password).toString();
};

// Decrypt private key using password
export const decryptPrivateKey = (encryptedKey: string, password: string): Uint8Array => {
  const bytes = CryptoJS.AES.decrypt(encryptedKey, password);
  const keyString = bytes.toString(CryptoJS.enc.Utf8);
  return new Uint8Array(keyString.split(",").map(Number));
};

// Store encrypted password locally
export const saveEncryptedPassword = (encryptedPassword: string) => {
  localStorage.setItem("encryptedWalletPassword", encryptedPassword);
};

// Retrieve stored encrypted password
export const loadEncryptedPassword = (): string | null => {
  return localStorage.getItem("encryptedWalletPassword");
};

// Save encrypted private key
export const saveEncryptedPrivateKey = (encryptedKey: string) => {
  localStorage.setItem("encryptedPrivateKey", encryptedKey);
};

// Load encrypted private key
export const loadEncryptedPrivateKey = (): string | null => {
  return localStorage.getItem("encryptedPrivateKey");
};
