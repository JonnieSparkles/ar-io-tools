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

### License

This project is dedicated to the public domain under the **Creative Commons Zero v1.0 Universal (CC0 1.0) license**.  
You are free to copy, modify, distribute, and perform the work, even for commercial purposes, without asking permission.

For more details, see the [LICENSE](LICENSE) file.