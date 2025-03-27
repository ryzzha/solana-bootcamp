import { Keypair } from "@solana/web3.js";
import * as dotenv from 'dotenv';
dotenv.config();

const secretKey = process.env.SECRET_KEY;

if (secretKey === undefined) {
    console.log("Add SECRET_KEY to .env!");
    process.exit(1);
}

console.log("secret key from env")
console.log(secretKey)

const secretKeyAsArray = Uint8Array.from(JSON.parse(secretKey));

console.log("secret key as uint8array")
console.log(secretKeyAsArray)

const keypair = Keypair.fromSecretKey(secretKeyAsArray);

console.log("publicKey")
console.log(keypair.publicKey)
console.log("publicKey base58")
console.log(keypair.publicKey.toBase58())

if(keypair.publicKey.toBase58() === "6LMo1h4q7u3d7Z9vEW7VX34n37uXCRuQTeuwkG6DDyMd") {
    console.log("key is equal:)")
}

// 6LMo1h4q7u3d7Z9vEW7VX34n37uXCRuQTeuwkG6DDyMd
// 0x23B067aB65C16Eb9e0917F475E7883Fbd4f18f7f