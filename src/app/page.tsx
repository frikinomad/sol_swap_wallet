"use client";

import { useEffect } from "react";
import TokenManager from "./components/TokenManager";
import WalletManager from "./components/WalletManager";
import TransferSol from "./components/TransferSol";
import { PasswordContextProvider } from "./context/PasswordContext";
import WalletContextProvider from "./context/WalletContextProvider";
import useWallet from "./context/WalletContext";
import { PublicKey } from "@solana/web3.js";

export default function Home() {

  const { setPublicKey } = useWallet();

  useEffect(() => {
    const getPublicKey = localStorage.getItem("publicKey");
    
    if(getPublicKey){
      setPublicKey(new PublicKey(getPublicKey));
    }
  }, [])

  return (
    <WalletContextProvider>
      <PasswordContextProvider>
        <WalletManager />
        <TokenManager />
        <TransferSol />
      </PasswordContextProvider>
    </WalletContextProvider>
  );
}