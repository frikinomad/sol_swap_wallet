"use client";

import React, {useState} from 'react';

import {WalletContext} from './WalletContext';
import { Connection, Keypair, PublicKey, Transaction } from '@solana/web3.js';
import { getPrivateKey } from '../utils/wallet';

const WalletContextProvider = ({children}: any) => {
    const [publicKey, setPublicKey] = useState<PublicKey | null>(null); // Initial state is null

    // Connection to the Solana cluster
    const connection = new Connection("https://api.devnet.solana.com", "confirmed");

    // Implement sendTransaction (handleTransactionRequest logic)
    const sendTransaction = async (transaction: Transaction) => {
        try {
        if (!publicKey) {
            throw new Error("No public key found in wallet context.");
        }

        // Simulate retrieving private key for signing (replace with your logic)
        // const privateKey = new Uint8Array([...]); // TODO: Replace with actual private key
        const privateKey = getPrivateKey("password");
        console.log("privateKey", privateKey);
        console.log("publicKey", publicKey);
        
        const wallet = Keypair.fromSecretKey(privateKey);

        // Add the wallet's public key as a signer
        transaction.feePayer = publicKey;

        // Fetch a recent blockhash
        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;

        // Sign the transaction
        transaction.sign(wallet);

        // Serialize the signed transaction
        const signedTransaction = transaction.serialize();

        // Send the transaction
        const signature = await connection.sendRawTransaction(signedTransaction);

        // Confirm the transaction
        await connection.confirmTransaction(signature, "confirmed");

        return { success: true, signature };
        } catch (error: any) {
        console.error("Transaction failed:", error);
        return { success: false, error: error.message };
        }
    };

    return(
        <WalletContext.Provider value={{publicKey, setPublicKey, sendTransaction}}>
            {children}
        </WalletContext.Provider>
    )
}

export default WalletContextProvider;