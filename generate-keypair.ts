import { Keypair } from "@solana/web3.js";

const keypair = Keypair.generate();

console.log(`The public key is: `, keypair.publicKey);
console.log(`The public key(base58) is: `, keypair.publicKey.toBase58());
console.log(`The public key(uint8array) is: `, keypair.publicKey.toBytes());
console.log(`The secret key is: `, keypair.secretKey);
console.log(`✅ Finished!`);
