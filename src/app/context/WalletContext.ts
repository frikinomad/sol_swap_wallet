"use client";

import { PublicKey, Transaction } from '@solana/web3.js';
import React, { useContext, useState } from 'react';

// Define the shape of the WalletContext
interface WalletContextType {
    publicKey: PublicKey | null;
    setPublicKey: (key: PublicKey | null) => void;
    sendTransaction: (transaction: Transaction) => Promise<{ success: boolean; signature?: string; error?: string }>;
}
  
// Create the context with a default value
export const WalletContext = React.createContext<WalletContextType>({
  publicKey: null, // Initial publicKey is null
  setPublicKey: () => {},
  sendTransaction: function (transaction: Transaction): Promise<{ success: boolean; signature?: string; error?: string; }> {
    throw new Error('Function not implemented.');
  }
});


export default function useWallet() {
    return useContext(WalletContext);
}