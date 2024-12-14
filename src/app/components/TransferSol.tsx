import React, {useEffect, useState} from 'react';
import useWallet from '../context/WalletContext';
import { Connection, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'

const TransferSol = () => {

    const [receiverKey, setReceiverKey] = useState("");
    const {publicKey, setPublicKey, sendTransaction} = useWallet();

    useEffect(() => {
        const getPublicKey = localStorage.getItem("publicKey");
        
        if(getPublicKey){
          setPublicKey(new PublicKey(getPublicKey));
        }
      }, [])

    const handleSolTransfer = async (e: any) => {
        e.preventDefault();
        
        // Ensure recipient public key is valid
        const recipientPubKey = new PublicKey(receiverKey);

        // Construct the transaction
        if(publicKey){
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: recipientPubKey,
                    lamports: 0.01 * 10 ** 9, // Convert SOL to lamports (1 SOL = 10^9 lamports)
                })
            );
            const tx = await sendTransaction(transaction);
            console.log(tx.signature);
        }
    };

    return (
        <>
            <input
                className="p-2 border rounded w-full max-w-xs"
                type="publicKey"
                placeholder="Enter Public Key to whom you want to send"
                value={receiverKey}
                onChange={(e) => setReceiverKey(e.target.value)}
            />
            <button
                onClick={handleSolTransfer}
                className='className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"'
            >
                Transfer SOL
            </button>
        </>
    )

};

export default TransferSol;