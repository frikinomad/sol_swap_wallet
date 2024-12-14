"use client";

import { useEffect, useState } from "react";
import { createWallet, getPrivateKey, importWalletFromMnemonic } from "../utils/wallet";
import {
  encryptPrivateKey,
  encryptPassword,
  saveEncryptedPrivateKey,
  saveEncryptedPassword,
  loadEncryptedPassword,
  decryptPassword,
  loadEncryptedPrivateKey,
  decryptPrivateKey
} from "../utils/encryption";
import useWallet from "../context/WalletContext";
import { PublicKey } from "@solana/web3.js";

const WalletManager = () => {
  const [stage, setStage] = useState<"choose" | "create" | "import" | "setPassword">("choose");
  const [mnemonic, setMnemonic] = useState("");
  const [wallet, setWallet] = useState<{ publicKey: string;} | null>(null);
  const [password, setPassword] = useState("password");
  const {publicKey, setPublicKey } = useWallet();

  useEffect(() => {
    const getPublicKey = localStorage.getItem("publicKey");
    
    if(getPublicKey){
      setPublicKey(new PublicKey(getPublicKey));
    }
  }, [])

  const handleCreateWallet = () => {
    const newWallet = createWallet("password", setPublicKey);
    console.log(newWallet.mnemonic);
    console.log(newWallet.publicKey);
    console.log(publicKey);
    
    // TODO: setting here cause skipping password step
    const encryptedPassword = encryptPassword("password");
    saveEncryptedPassword(encryptedPassword);
    setWallet(newWallet);
    setStage("setPassword");
  };

  const handleImportWallet = () => {
    try {
      const importedWallet = importWalletFromMnemonic(mnemonic, "password", setPublicKey);

      // TODO: setting here cause skipping password step
      const encryptedPassword = encryptPassword("password");
      saveEncryptedPassword(encryptedPassword);
      setWallet(importedWallet);
      setStage("setPassword");
    } catch (error) {
      console.error(error);
      alert("Invalid mnemonic");
    }
  };

  const handleSetPassword = () => {
    if (!password || !wallet) {
      alert("Password is required");
      return;
    }

    const privateKey = getPrivateKey("password");

    const encryptedPrivateKey = encryptPrivateKey(privateKey, "password");
    const encryptedPassword = encryptPassword("password");
    saveEncryptedPrivateKey(encryptedPrivateKey);
    saveEncryptedPassword(encryptedPassword);
    alert("Password set and private key encrypted!");
    setStage("choose");
  };

  const handleViewPrivateKey = () => {
    const encryptedPassword = loadEncryptedPassword();
    if (!encryptedPassword) {
      alert("No password set.");
      return;
    }

    const savedPassword = prompt("Enter your password to view the private key:");
    if (!savedPassword) {
      alert("Password is required.");
      return;
    }

    const decryptedPassword = decryptPassword(encryptedPassword);
    if (decryptedPassword !== savedPassword) {
      alert("Incorrect password.");
      return;
    }

    const encryptedKey = loadEncryptedPrivateKey();
    if (!encryptedKey) {
      alert("No private key found.");
      return;
    }

    // const privateKey = decryptPrivateKey(encryptedKey, savedPassword);
    const privateKey = decryptPrivateKey(encryptedKey, "password");
    alert(`Your private key: ${Array.from(privateKey).join(",")}`);
  };

  return (
    <div className="p-4">
      {stage === "choose" && (
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-center">Welcome to Solana Wallet</h1>
          <div className="flex flex-col items-center space-y-2">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => setStage("create")}
            >
              Create New Wallet
            </button>
            <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={() => setStage("import")}
            >
              Import Existing Wallet
            </button>
          </div>
        </div>
      )}

      {stage === "create" && (
        <div className="flex flex-col items-center space-y-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleCreateWallet}
          >
            Generate Wallet
          </button>
        </div>
      )}

      {stage === "import" && (
        <div className="flex flex-col items-center space-y-4">
          <textarea
            className="p-2 border rounded w-full max-w-xs"
            placeholder="Enter mnemonic"
            value={mnemonic}
            onChange={(e) => setMnemonic(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={handleImportWallet}
          >
            Import Wallet
          </button>
        </div>
      )}

      {stage === "setPassword" && (
        <div className="flex flex-col items-center space-y-4">
          <input
            className="p-2 border rounded w-full max-w-xs"
            type="password"
            placeholder="Set a password to encrypt your wallet"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={handleSetPassword}
          >
            Set Password
          </button>
        </div>
      )}

      {wallet && (
        <div className="flex flex-col items-center space-y-4">
          <p className="text-lg"><strong>Public Key:</strong> {wallet.publicKey}</p>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => setStage("choose")}
          >
            Back to Main
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleViewPrivateKey}
          >
            View Private Key
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletManager;
