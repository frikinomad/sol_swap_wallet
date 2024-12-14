"use client";

import { useEffect, useState } from "react";
import { Connection, PublicKey, Keypair, LAMPORTS_PER_SOL, Transaction } from "@solana/web3.js";
import useWallet from "../context/WalletContext";
// import usePassword from "../context/PasswordContext";

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

const TokenManager = () => {
  const [tokens, setTokens] = useState<{ mint: string; balance: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const {publicKey, setPublicKey } = useWallet();

  useEffect(() => {
    const getPublicKey = localStorage.getItem("publicKey");
      
      if(getPublicKey){
        console.log(getPublicKey, "s");
        setPublicKey(new PublicKey(getPublicKey));
      }
  }, [])

  useEffect(() => {
    const fetchTokens = async () => {
      
      if (!publicKey) {
        console.error('Public key is not available');
        return; // Exit the function if publicKey is null
      }
      try {
        setLoading(true);

        // Fetch native SOL balance
        const balance = await connection.getBalance(publicKey);        
        
        const solBalance = {
          mint: "SOLANA", // native SOL mint address
          balance: (balance / LAMPORTS_PER_SOL).toFixed(2)
        };

        // Fetch SPL token balances
        let splTokenBalances: { mint: any; balance: any; }[] = [];
        try{
            const tokenAccounts = await connection.getParsedTokenAccountsByOwner(new PublicKey(publicKey), { programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") });
            console.log("tokenAccounts", tokenAccounts);
            
            splTokenBalances = tokenAccounts.value.map(({ account }) => {
              const { mint, tokenAmount } = account.data.parsed.info;
              return {
                mint,
                balance: tokenAmount.uiAmountString
              };
            });
        }catch(error){
            console.log("No Token accounts found");
            console.log(error);
            
        }
        setTokens([solBalance, ...splTokenBalances]);

      } catch (error) {
        console.error("Error fetching token balances:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, [publicKey]);

  if(!publicKey){
    return(
      <>
        <h3> Please add a wallet </h3>
      </>
    )
  }

  return (
    <div className="overflow-y-auto max-h-80 bg-gray-100 p-4 rounded-lg shadow-lg">
        {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
            ) : (
            <>
            <p><span style={{ color: "black" }}>{publicKey.toString()}</span></p>
            <ul>
            {tokens.map((token, index) => (
                <li
                key={index}
                className="flex justify-between items-center p-2 border-b last:border-0"
                >
                <span className="text-gray-700 font-medium">{token.mint}</span>
                <span className="text-gray-900 font-semibold">
                    {token.balance}{" "}
                    {token.mint === "So11111111111111111111111111111111111111112"
                    ? "SOL"
                    : "tokens"}
                </span>
                </li>
            ))}
            </ul>
            </>
        )}
        </div>
  );
};

export default TokenManager;
