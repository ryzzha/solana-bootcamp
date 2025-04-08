import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TokenSwap } from "../target/types/token_swap";
import { assert } from "chai";

describe("token-swap", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.TokenSwap as Program<TokenSwap>;

  const makerKeypair = anchor.web3.Keypair.generate();
  const takerKeypair = anchor.web3.Keypair.generate();
  const makerVault = anchor.web3.Keypair.generate();
  const takerVault = anchor.web3.Keypair.generate();

  it("Creates an offer", async () => {
    await program.methods
      .createOffer(new anchor.BN(100))
      .accounts({
        offer: makerVault.publicKey,
        maker: makerKeypair.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([makerKeypair])
      .rpc();

    const offer = await program.account.offer.fetch(makerVault.publicKey);
    assert.equal(offer.token_a_amount.toNumber(), 100);
  });

  it("Taker accepts the offer", async () => {
    await program.methods
      .acceptOffer(new anchor.BN(100))
      .accounts({
        offer: makerVault.publicKey,
        makerVault: makerVault.publicKey,
        takerVault: takerVault.publicKey,
        maker: makerKeypair.publicKey,
        taker: takerKeypair.publicKey,
        tokenProgram: anchor.web3.TokenProgram.programId,
      })
      .signers([takerKeypair])
      .rpc();

    const offer = await program.account.offer.fetch(makerVault.publicKey);
    assert.equal(offer.token_b_amount.toNumber(), 100);
  });
});
