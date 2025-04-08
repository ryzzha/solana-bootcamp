use anchor_lang::prelude::*;
use spl_token::state::Account as TokenAccount;
use spl_token::instruction::transfer;

declare_id!("YourProgramIDHere1111111111111111111111111111111");

#[program]
pub mod token_swap {
    use super::*;

    pub fn create_offer(ctx: Context<CreateOffer>, amount_a: u64) -> Result<()> {
        let offer = &mut ctx.accounts.offer;
        offer.maker = ctx.accounts.maker.key();
        offer.token_a_amount = amount_a;
        offer.token_b_amount = 0; // Токен_B поки що 0
        Ok(())
    }

    pub fn accept_offer(ctx: Context<AcceptOffer>, amount_b: u64) -> Result<()> {
        let offer = &mut ctx.accounts.offer;
        
        if offer.token_a_amount == 0 || amount_b == 0 {
            return Err(ErrorCode::InvalidOffer.into());
        }

        let maker_vault = &mut ctx.accounts.maker_vault;
        let taker_vault = &mut ctx.accounts.taker_vault;

        transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                spl_token::instruction::Transfer {
                    from: taker_vault.to_account_info(),
                    to: maker_vault.to_account_info(),
                    authority: ctx.accounts.taker.to_account_info(),
                },
            ),
            amount_b,
        )?;

        transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                spl_token::instruction::Transfer {
                    from: maker_vault.to_account_info(),
                    to: taker_vault.to_account_info(),
                    authority: ctx.accounts.maker.to_account_info(),
                },
            ),
            offer.token_a_amount,
        )?;

        offer.token_b_amount = amount_b;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateOffer<'info> {
    #[account(init, payer = maker, space = 8 + 32 + 8 + 8)] // Простір для пропозиції
    pub offer: Account<'info, Offer>,
    #[account(mut)]
    pub maker: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AcceptOffer<'info> {
    #[account(mut)]
    pub offer: Account<'info, Offer>,
    #[account(mut)]
    pub maker_vault: Account<'info, TokenAccount>,
    #[account(mut)]
    pub taker_vault: Account<'info, TokenAccount>,
    #[account(mut)]
    pub maker: Signer<'info>,
    #[account(mut)]
    pub taker: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct Offer {
    pub maker: Pubkey,       // Публічний ключ мейкера
    pub token_a_amount: u64, // Сума токенів_A, яку мейкер хоче обміняти
    pub token_b_amount: u64, // Сума токенів_B, яку мейкер хоче отримати
}

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid offer.")]
    InvalidOffer,
}
