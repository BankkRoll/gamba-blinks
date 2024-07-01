# Gamba Blinks

### On-Chain Degeneracy

Gamba Blinks leverages the Actions and Blinks protocols to share interactive Solana transactions through URLs. When shared, these URLs can unfurl into full experiences, like a preview, within clients that support Blinks, such as Twitter.

Gamba Blinks is fully on-chain and provably fair, with all interactions and transactions being transparent and verifiable. Integration with Blinks allows seamless sharing of Solana transactions through URLs.

![image](https://github.com/BankkRoll/gamba-blinks/assets/106103625/9ac42177-e9b1-487e-9cc4-3e852cef5741)

### On-Chain Game Account Requirement

Before using Gamba Blinks, users need to create an on-chain game account. This is required for the first interaction. Subsequent plays will use the user’s wallet but interact with their game account in the program.

1. **First-Time Setup:**
- When a user plays for the first time, the system will automatically create a game account for them.
- Users will need to confirm the transaction to initialize their game account.

2. **Playing After Account Initialization:**
- Once the game account is created, users can play using their wallet.
- All plays will be linked to their game account for seamless and transparent interaction.

### Example

- To play Gamba with an amount of `0.01`, use the following link:

```
https://gamba-blinks.vercel.app/api/blinks/play-gamba?amount=0.01
```

Users can change the `amount` parameter in the URL to specify different amounts for their interactions. The `amount` parameter determines the value used in the API request. Here’s how you can modify it:

Simply replace `0.01` with your desired amount. For example, to set the amount to `0.05`, update the link as follows:

```
https://gamba-blinks.vercel.app/api/blinks/play-gamba?amount=0.05
```
