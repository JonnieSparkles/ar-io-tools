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

You can pass the wallet address as the first CLI argument (recommended):

```bash
node arweave-wallet-export.js YOUR_ARWEAVE_WALLET_ADDRESS
```

If you don’t pass an argument, the script uses the built-in default wallet address near the top of `arweave-wallet-export.js`.

You can also update the gateway URL if needed (defaults to `arweave.net`).

## Usage

Run the script:

```bash
node arweave-wallet-export.js YOUR_ARWEAVE_WALLET_ADDRESS
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