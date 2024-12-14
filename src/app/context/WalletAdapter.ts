import { PublicKey } from "@solana/web3.js";
import React from "react";

// walletProvider.ts
export class MyWalletAdapter {
    public publicKey: PublicKey | null = null;

    constructor() {
        // Check if wallet already has a public key
        const savedPublicKey = localStorage.getItem("publicKey");
        if (savedPublicKey) {
            this.publicKey = new PublicKey(savedPublicKey);
        }
    }

    async connect() {
        // Logic to authenticate and fetch the public key
        const publicKeyString = localStorage.getItem("publicKey");
        if (!publicKeyString) throw new Error("Wallet not initialized");
        this.publicKey = new PublicKey(publicKeyString);
        return this.publicKey;
    }

    async disconnect() {
        // Logic to disconnect the wallet
        this.publicKey = null;
    }

    
}
