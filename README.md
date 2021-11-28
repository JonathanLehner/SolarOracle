# SolarOracle
## How it works?
### Monthly payment
The consumers need to make sure their escrow account has enough money for their monthly payment. The exact amount is determined by the Chainlink Oracle from our solar panel output monitoring API ("Using any API", https://docs.chain.link/docs/make-a-http-get-request/).

One thing to note is that in Ethereum it is not natively possible to schedule a function to run every month at the same time. As a workaround our company could call the "payout" function every month, or use https://github.com/ethereum-alarm-clock/ethereum-alarm-clock, or use https://docs.chain.link/docs/chainlink-keepers/introduction/!

We use ETH Kovan testnet but in the future we would like to use the Polygon mainnet due to lower transaction costs.

### Notes
website needs to include environment variable to build successfully on vercel/netlify
CI='' npm run build
https://github.com/vercel/vercel/discussions/5566
and don't forget to add the environment variables for the Moralis server