# AR.IO Tools

A collection of tools designed to work with the AR.IO SDK and the Arweave network. These tools make it easier to interact with the Arweave Name System (ArNS), process Arweave Name Tokens (ANTs), and convert JSON data to CSV for easier analysis.

This repository includes:

1. **ArNS Details Fetcher**: A script to fetch and save details about Arweave Name System (ArNS) names.
2. **JSON-to-CSV Converter**: A simple utility to convert JSON files to CSV format.

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

The script allows flexible processing modes, enabling you to fetch details for a single name, a limited number of names, or all registered names.

---

### Features

- Fetch ArNS names from the AR.IO network.
- Modes for flexible data fetching:
  - **Specific Name**: Fetch details for a single, specified name.
  - **First Name**: Fetch details for the first name in the list.
  - **Limited Number of Names**: Fetch details for the first `N` names.
  - **All Names**: Fetch details for all available names.
- Save results to a timestamped JSON file in the `output` directory.
- Automatically creates the `output` folder if it doesn’t exist.
- Tracks dependencies in `package.json` for easy setup and reproducibility.

---

## Tool: JSON-to-CSV Converter

### Description

The JSON-to-CSV Converter is a utility script that converts JSON files into CSV format. It dynamically adapts to the structure of the JSON, making it easy to use for a variety of JSON datasets.

---

### Features

- Converts any JSON array of objects to CSV.
- Prompts for the input JSON file location and optionally for the output CSV file name.
- Automatically saves the output CSV file in the `output` directory.
- Dynamically extracts headers from JSON keys—no need to predefine them.

---

### Requirements

- **Node.js**: Version 14 or higher.
- **NPM**: Installed alongside Node.js.

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

   This command uses the `package.json` file to install all required libraries automatically.

---

### Usage: ArNS Details Fetcher

1. Update the `CONFIG` object in `arns-details.js` to set the desired processing mode:
   ```javascript
   const CONFIG = {
       mode: 'all', // Options: 'specific', 'single', 'limit', 'all'
       specificName: 'example-name1', // For 'specific' mode
       limit: 5, // For 'limit' mode (number of names to process)
   };
   ```

2. Run the script:
   ```bash
   npm start
   ```

   The output will be saved in the `output` directory with a timestamped JSON filename.

---

### Usage: JSON-to-CSV Converter

1. Run the script:
   ```bash
   npm run json-to-csv
   ```

2. Follow the prompts:
   - **Input JSON File**: Enter the path to your JSON file.
   - **Output CSV File**: Enter the name of the output file or press Enter to use the default name.

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

### Troubleshooting

1. **Node.js Installation**:
   - Download and install it from [Node.js Official Website](https://nodejs.org).

2. **Dependency Installation**:
   - Run `npm install` to ensure all dependencies are installed.

3. **Missing Input File**:
   - Ensure the input file exists at the specified path.

4. **JSON Format Issues**:
   - Make sure the JSON file is an array of objects. Nested objects may need to be flattened beforehand.

---

### License

This project is dedicated to the public domain under the **Creative Commons Zero v1.0 Universal (CC0 1.0) license**.  
You are free to copy, modify, distribute, and perform the work, even for commercial purposes, without asking permission.

For more details, see the [LICENSE](LICENSE) file.