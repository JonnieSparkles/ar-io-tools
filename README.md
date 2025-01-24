# ArNS Details Fetcher

This script uses the AR.IO SDK to fetch details about Arweave Name System (ArNS) names. It retrieves the name, owner, start time, and purchase type for registered ArNS names. The script supports flexible processing modes, allowing you to target specific names or fetch data incrementally before running it on all names.

## Features

- Fetch all ArNS names from the AR.IO network or a subset based on the selected mode:
  - **Specific Name**: Fetch details for a single, specified name.
  - **First Name**: Fetch details for the first name in the list.
  - **Limited Number of Names**: Fetch details for the first `N` names.
  - **All Names**: Fetch details for all available names.
- Retrieve and process details for each name:
  - **Name**
  - **Owner**
  - **Start Time**
  - **Purchase Type** (Lease or Permanent)
- Save results to a timestamped JSON file in the `output` directory.
- Automatically creates the `output` folder if it doesn’t exist.

---

## Requirements

- **Node.js**: Version 14 or higher.
- **NPM**: Installed alongside Node.js.

---

## Setup

1. Clone the repository or copy the script into your project folder.
2. Install the required dependency:
   ```bash
   npm install @ar-io/sdk
   ```

---

## Configuration

The script includes a `CONFIG` object for controlling its behavior. You can edit the configuration to set the processing mode:

```javascript
const CONFIG = {
    mode: 'all', // Options: 'specific', 'single', 'limit', 'all'
    specificName: 'example-name1', // For 'specific' mode
    limit: 5, // For 'limit' mode (number of names to process)
};
```

### Modes

- **Specific Name (`specific`)**:
  - Fetches details for a specific name defined in `specificName`.
  - Example:
    ```javascript
    mode: 'specific';
    specificName: 'example-name1';
    ```

- **First Name (`single`)**:
  - Fetches details for the first name in the list.
  - Example:
    ```javascript
    mode: 'single';
    ```

- **Limited Names (`limit`)**:
  - Fetches details for the first `N` names, where `N` is set in `limit`.
  - Example:
    ```javascript
    mode: 'limit';
    limit: 10; // Adjust as needed
    ```

- **All Names (`all`)**:
  - Fetches details for all available names.
  - Example:
    ```javascript
    mode: 'all';
    ```

---

## Usage

1. Update the `CONFIG` object in the script to select the desired mode and settings.
2. Run the script:
   ```bash
   node script.js
   ```
3. The output will be saved in the `output` directory with a filename in the format:
   ```
   arns_details-YYYY-MM-DD_HH-MM-SS.json
   ```

   Example:
   ```
   output/arns_details-2025-01-24_14-30-00.json
   ```

---

## Example Output

The generated JSON file will look like this:

```json
[
  {
    "name": "example-name1",
    "owner": "arweave-wallet-address1",
    "startTime": "2025-01-01T12:00:00Z",
    "purchaseType": "permanent"
  },
  {
    "name": "another-name2",
    "owner": "arweave-wallet-address2",
    "startTime": "2025-01-05T14:30:00Z",
    "purchaseType": "lease"
  },
  {
    "name": "missing-name",
    "error": "ANT process ID not found"
  }
]
```

---

## Directory Structure

```plaintext
project-directory/
├── script.js
├── output/
│   ├── arns_details-2025-01-24_14-30-00.json
│   └── arns_details-2025-01-24_15-45-00.json
```

---

## Troubleshooting

1. **Node.js Installation**:
   - If Node.js is not installed, download and install it from [Node.js Official Website](https://nodejs.org).

2. **Dependency Installation**:
   - Ensure `@ar-io/sdk` is installed in your project directory:
     ```bash
     npm install @ar-io/sdk
     ```

3. **Error Handling**:
   - If a specific name is not found (in `specific` mode), the script will log an error and skip processing.

---

## License

This project is dedicated to the public domain under the **Creative Commons Zero v1.0 Universal (CC0 1.0) license**.  
You are free to copy, modify, distribute, and perform the work, even for commercial purposes, without asking permission.

For more details, see the [LICENSE](LICENSE) file.
