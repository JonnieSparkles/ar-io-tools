# AR.IO Tools

A collection of tools designed to work with the AR.IO SDK and the Arweave network. These tools make it easier to interact with the Arweave Name System (ArNS), process Arweave Name Tokens (ANTs), fetch Gateway details, and convert JSON data to CSV for easier analysis.

This repository includes:

1. **ArNS Details Fetcher**: A script to fetch and save details about Arweave Name System (ArNS) names.
2. **Gateway Details Fetcher**: A script to fetch and save details about AR.IO Gateways.
3. **JSON-to-CSV Converter**: A simple utility to convert JSON files to CSV format.

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

The script fetches the 10 most recent ArNS records and saves them with complete details.

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

The JSON-to-CSV Converter is a utility script that converts JSON files into CSV format. It dynamically adapts to the structure of the JSON, making it easy to use for a variety of JSON datasets.

---

### Features

- Converts any JSON array of objects to CSV
- Prompts for the input JSON file location and optionally for the output CSV file name
- Automatically saves the output CSV file in the `output` directory
- Dynamically extracts headers from JSON keys—no need to predefine them

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

### Usage: JSON-to-CSV Converter

1. Run the script:
   ```bash
   npm run json-to-csv
   ```

2. Follow the prompts:
   - **Input JSON File**: Enter the path to your JSON file
   - **Output CSV File**: Enter the name of the output file or press Enter to use the default name

   Example prompts:
   ```plaintext
   Enter the path to the input JSON file: ./example.json
   Enter the name of the output CSV file (default: example.csv): custom-output.csv
   ```

3. The output CSV file will be saved in the `output` directory.

---

### Example Output: JSON-to-CSV Converter

#### Input JSON (`example.json`):
```json
[
    {
        "name": "fusionfi",
        "startTimestamp": 1737688760619,
        "endTimestamp": 1769224760619,
        "processId": "T0bTJrxmAIfZwrVtWXl97OlAeRjR-cyzobOq0-A_Jho",
        "type": "lease",
        "purchasePrice": 1652121190,
        "undernameLimit": 10,
        "owner": "arweave-wallet-address-1"
    }
]
```

#### Output CSV (`output/example.csv`):
```csv
name,startTimestamp,endTimestamp,processId,type,purchasePrice,undernameLimit,owner
fusionfi,1737688760619,1769224760619,T0bTJrxmAIfZwrVtWXl97OlAeRjR-cyzobOq0-A_Jho,lease,1652121190,10,arweave-wallet-address-1
```

---

### Example Output: Gateway Details Fetcher

#### Summary Output Format:
```json
{
  "gatewayAddress": "QGWqtJdLLgm2ehFWiiPzMaoFLD50CnGuzZIPEdoDRGQ",
  "fqdn": "ar-io.dev",
  "operatorStake": 250000000000,
  "status": "joined",
  "weights": {
    "compositeWeight": 0.97688888893556,
    "gatewayRewardRatioWeight": 1,
    "tenureWeight": 0.19444444444444,
    "observerRewardRatioWeight": 1,
    "normalizedCompositeWeight": 0.19247316211083,
    "stakeWeight": 5.02400000024
  }
}
```

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

### License

This project is dedicated to the public domain under the **Creative Commons Zero v1.0 Universal (CC0 1.0) license**.  
You are free to copy, modify, distribute, and perform the work, even for commercial purposes, without asking permission.

For more details, see the [LICENSE](LICENSE) file.