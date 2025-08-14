# AR.IO Tools

A collection of tools designed to work with the AR.IO SDK and the Arweave network. These tools make it easier to interact with the Arweave Name System (ArNS), process Arweave Name Tokens (ANTs), fetch Gateway details, and convert JSON data to CSV for easier analysis.

This repository includes:

1. **ARIO Distribution Dashboard**: A beautiful web dashboard showing real-time ARIO token distribution with charts and USD values.
2. **ArNS Details Fetcher**: A script to fetch and save details about Arweave Name System (ArNS) names.
3. **Gateway Details Fetcher**: A script to fetch and save details about AR.IO Gateways.
4. **JSON-to-CSV Converter**: A simple utility to convert JSON files to CSV format.
5. **Wallet Balance Checker**: A tool to check AR and ARIO token balances for a given wallet address.
6. **Wallet History Exporter**: A Node.js script to export complete transaction history from an Arweave wallet address to CSV format.

---

## Tool: ARIO Distribution Dashboard

### Description

The ARIO Distribution Dashboard is a beautiful, responsive web application that provides real-time visualization of AR.IO (ARIO) token distribution across different categories. It displays comprehensive analytics including token balances, USD conversions, and interactive charts.

### Features

- **Real-time Data**: Fetches live token distribution from AR.IO network APIs
- **Financial Metrics**: Shows current ARIO price, 24h price change, and USD conversions
- **Key Metrics Display**:
  - Current ARIO token price with 24h change indicator
  - Total Value Locked (TVL) - sum of protocol balance, operator stake, delegated, and withdrawn tokens
  - Circulating supply from the network
  - Total ARIO token count with breakdown
- **Interactive Charts**: 
  - Distribution overview (pie chart)
  - Balance comparison (bar chart)
- **Token Categories**:
  - Protocol Balance
  - Locked Tokens  
  - Operator Stake
  - Withdrawn Tokens
  - Delegated Tokens
  - Liquid Tokens
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Professional UI**: Modern glassmorphism design with AR.IO brand colors
- **Social Sharing**: Open Graph and Twitter Card support with favicon
- **Auto-refresh**: Updates data every 5 minutes automatically

### Usage

1. Open `ario-distribution/ario-distribution.html` in your web browser
2. For best results, serve over HTTP:
   ```bash
   python -m http.server 8080
   # Then visit: http://localhost:8080/ario-distribution/ario-distribution.html
   ```
3. Click the refresh button to manually update data
4. View real-time token distribution with USD values and interactive charts

### Technical Details

- **Data Sources**: AR.IO token supply API and CoinGecko price API
- **Fallback Support**: CORS proxy and sample data for local development
- **Framework**: Vanilla JavaScript with Chart.js for visualizations
- **Responsive**: Mobile-first design with multiple breakpoints
- **Performance**: Optimized for fast loading and smooth interactions

---

## Tool: ArNS Details Fetcher

### Description

The ArNS Details Fetcher script retrieves data about registered ArNS names, including:

- **Name**
- **Owner**
- **Start Time**
- **End Time**
- **Purchase Type** (Lease or Permanent)
- **@ Transaction ID**
- **Process ID**
- **Purchase Price**
- **Undername Limit**

The script fetches the most recent ArNS records (based on selected order) and saves them with complete details.

---

### Features

- Fetch recent ArNS names from the AR.IO network
- Retrieve detailed information for each name:
  - Owner address
  - @ transaction ID
  - Timestamps and duration
  - Purchase details
- Save results to a timestamped JSON file in the `output` directory
- Handle network timeouts and errors gracefully
- Automatically creates the `output` folder if it doesn't exist

---

## Tool: Gateway Details Fetcher

### Description

The Gateway Details Fetcher script retrieves data about AR.IO Gateways, with options for full or summary details:

**Summary Details Include:**
- Gateway Address
- FQDN (Fully Qualified Domain Name)
- Operator Stake
- Status
- Weights

**Full Details Additionally Include:**
- Observer Address
- Settings (including label, note, port, properties, protocol)
- Start Timestamp
- Stats (epoch information)
- Vaults

The script fetches all available gateway records and saves them with your choice of detail level.

---

### Features

- Interactive prompt to choose between full details or summary
- Fetch all gateway records from the AR.IO network
- Process and organize gateway data
- Save results to a timestamped JSON file in the `output` directory
- Handle network timeouts and errors gracefully
- Automatically creates the `output` folder if it doesn't exist

---

## Tool: JSON-to-CSV Converter

### Description

The JSON-to-CSV Converter is a utility script that converts JSON files into CSV format. It handles nested JSON structures by flattening them using underscore notation, making it particularly useful for processing complex data like gateway weights and settings.

### Features

- Converts any JSON array of objects to CSV
- Automatically flattens nested JSON structures (e.g., `weights_compositeWeight`)
- Prompts for input/output file locations
- Automatically saves output to the `output` directory
- Dynamically extracts all fields, including nested ones

### Usage

1. Run the script:
```bash
npm run json-to-csv
```

2. Follow the prompts:
   ```plaintext
   Enter the path to the input JSON file: ./output/gateway-details_1234567890.json
   Enter the name of the output CSV file (default: gateway-details_1234567890.csv):
   ```

3. The script will:
   - Read your JSON file
   - Flatten any nested structures
   - Convert to CSV format
   - Save the result in the `output` directory

### Example Output: JSON-to-CSV Converter

#### Input JSON:
```json
[
    {
        "gatewayAddress": "QGWqtJdLLgm2ehFWiiPzMaoFLD50CnGuzZIPEdoDRGQ",
        "fqdn": "ar-io.dev",
        "status": "joined",
        "weights": {
            "compositeWeight": 0.97688888893556,
            "gatewayRewardRatioWeight": 1,
            "tenureWeight": 0.19444444444444
        }
    }
]
```

#### Output CSV:
```csv
gatewayAddress,fqdn,status,weights_compositeWeight,weights_gatewayRewardRatioWeight,weights_tenureWeight
QGWqtJdLLgm2ehFWiiPzMaoFLD50CnGuzZIPEdoDRGQ,ar-io.dev,joined,0.97688888893556,1,0.19444444444444
```

---

## Tool: Solana to Arweave Address Normalizer

### Description

The Solana to Arweave Address Normalizer is a web-based tool that converts Solana addresses to their normalized Arweave format. This is useful for cross-chain operations and when working with addresses that need to be compatible with both Solana and Arweave networks.

### Features

- Converts Solana base58 addresses to Arweave-compatible base64url format
- Uses SHA-256 hashing for address normalization
- Simple web interface for easy conversion
- Handles error cases and invalid inputs
- No server-side processing required - runs entirely in the browser

### Usage

1. Open `normalize-it.html` in a web browser
2. Enter a Solana address in the input field
3. Click "Convert" to get the normalized Arweave address
4. The result will be displayed below with word-break enabled for long addresses

### Technical Details

The tool performs the following steps:
1. Decodes the Solana address from base58 format
2. Applies SHA-256 hashing to the decoded bytes
3. Encodes the result in base64url format
4. Handles leading zeros and edge cases appropriately

---

### Requirements

- **Node.js**: Version 18 or higher
- **NPM**: Installed alongside Node.js

---

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ar-io-tools.git
   cd ar-io-tools
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

---

### Usage: ArNS Details Fetcher

Run the script:
```bash
npm start
```

The script will:
- Fetch the 10 most recent ArNS records
- Retrieve owner and @ transaction ID for each record
- Save results to a timestamped JSON file in the `output` directory
- Handle timeouts and errors gracefully

---

### Usage: Gateway Details Fetcher

Run the script:
```bash
npm run gateway-details
```

The script will:
1. Prompt you to choose output type:
   ```plaintext
   Do you want FULL DETAILS or SUMMARY? (F/S):
   ```
2. Fetch all gateway records
3. Process according to your choice
4. Save results to a timestamped JSON file in the `output` directory

---

### Troubleshooting

1. **Node.js Installation**:
   - Download and install it from [Node.js Official Website](https://nodejs.org)

2. **Dependency Installation**:
   - Run `npm install` to ensure all dependencies are installed

3. **Missing Input File**:
   - Ensure the input file exists at the specified path

4. **JSON Format Issues**:
   - Make sure the JSON file is an array of objects. Nested objects may need to be flattened beforehand

---


## Tool: Wallet Balance Checker (Web App)

### Description

The Wallet Balance Checker is now a web-based tool (`wallet-balance-checker/wallet-balance-checker.html`) that allows you to check balances for multiple wallet addresses at once, including:

- **AR Token Balance**: Native Arweave token balance
- **ARIO Token Balance**: AR.IO network token balance
- **AO Token Balance**: AO Computer token balance

You can enter Arweave addresses or Ethereum (0x...) addresses. ETH addresses will show "N/A" for AR, but can hold ARIO and AO balances.

---

### Features

- User-friendly web interface (no CLI required)
- Check balances for multiple addresses at once (comma or newline separated)
- Supports Arweave and Ethereum (0x...) addresses
- Fetches AR, ARIO, and AO balances (selectable)
- Displays totals and live USD conversion (using CoinGecko)
- Shows current token prices for reference
- Export results to CSV (with timestamped filename)
- Handles network errors and unavailable APIs gracefully

---

### Usage: Wallet Balance Checker Web App

1. Open `wallet-balance-checker/wallet-balance-checker.html` in your web browser.
   - For best results, serve the file over HTTP (e.g., with `python -m http.server` or `npx serve .`) and visit `http://localhost:8000/wallet-balance-checker/wallet-balance-checker.html`.
2. Paste or type wallet addresses (one per line or comma-separated).
3. Select which balances to check (AR, ARIO, AO).
4. Click **Check Balances**.
5. View results, totals, and USD values. Export to CSV if desired.

---

#### Example Output

| Wallet Address | AR Balance | ARIO Balance | AO Balance |
|---------------|------------|--------------|------------|
| ...           | ...        | ...          | ...        |

Totals and USD values are shown below the table, along with current token prices.

---

### License

This project is dedicated to the public domain under the **Creative Commons Zero v1.0 Universal (CC0 1.0) license**.  
You are free to copy, modify, distribute, and perform the work, even for commercial purposes, without asking permission.

For more details, see the [LICENSE](LICENSE) file.

---