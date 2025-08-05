# Arweave Wallet Transaction Export

A Node.js script to export complete transaction history from an Arweave wallet address to CSV format.

## Features

- 📊 Exports complete transaction history (both incoming and outgoing)
- 🔄 Handles pagination automatically using GraphQL cursors
- 🛡️ Implements retry logic with exponential backoff
- 📝 Outputs detailed CSV with transaction metadata

## Prerequisites

- Node.js (v14 or higher)
- npm

## Installation

1. Navigate to the project directory
2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

Update the wallet address in `arweave-wallet-export.js`:

```javascript
// Line 5: Replace with your Arweave wallet address
const walletAddress = 'YOUR_ARWEAVE_WALLET_ADDRESS_HERE';
```

You can also update the gateway URL if needed (defaults to `arweave.net`).

## Usage

Run the script:

```bash
node arweave-wallet-export.js
```

The script will export data to `.exports/transaction_history_[timestamp].csv`.

## Output Format

The CSV includes:
- Transaction ID
- Owner (sender address)
- Recipient (recipient address)
- Fee (Winston and AR)
- Quantity (Winston and AR)
- Direction (In/Out)
- Block Height

## Dependencies

- `csv-write-stream`: For writing CSV files
- Built-in Node.js modules: `https`, `fs`

## License

ISC License