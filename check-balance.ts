import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  clusterApiUrl,
} from "@solana/web3.js";
import { airdropIfRequired } from "@solana-developers/helpers";
import * as dotenv from 'dotenv';
dotenv.config();

const connection = new Connection(clusterApiUrl("devnet"));
console.log(`⚡️ Connected to devnet`);
 
const publicKey = new PublicKey("6LMo1h4q7u3d7Z9vEW7VX34n37uXCRuQTeuwkG6DDyMd");
const balanceInLamports = await connection.getBalance(publicKey);

const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL;

console.log(
  `💰 The balance for the wallet at address ${publicKey} is: ${balanceInSOL}`
);
  
  await airdropIfRequired(
    connection,
    publicKey,
    1 * LAMPORTS_PER_SOL,
    0.5 * LAMPORTS_PER_SOL
  );
  
