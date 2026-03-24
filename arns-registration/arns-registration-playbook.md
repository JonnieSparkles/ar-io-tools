# ArNS Domain Registration Playbook

A step-by-step guide to registering an ArNS domain using the ar.io SDK CLI.

---

## Prerequisites

- Node.js 18+
- An Arweave wallet JSON file
- ARIO tokens in that wallet

---

## 1. Install the SDK

**macOS / Linux:**
```bash
npm install -g @ar.io/sdk
```

**Windows (PowerShell)** — quote the package name to avoid the `@` splatting error:
```powershell
npm install -g "@ar.io/sdk"
```

Verify the CLI is available:

```bash
ar.io --help
```

### Windows: known bug

There is a known bug where the CLI silently does nothing on Windows due to a path separator mismatch in `cli.js`. A fix has been submitted — track it [here](https://github.com/ar-io/ar-io-sdk/pulls).

**Workaround:**

1. Install the SDK locally instead of globally:
```powershell
npm install "@ar.io/sdk"
```

2. Create a file called `ario.cjs` in your project root with this content:
```js
process.argv[1] = 'cli/cli.js';
require('./node_modules/@ar.io/sdk/lib/cjs/cli/cli.js');
```

> The file must be `.cjs` (not `.js`) if your project has `"type": "module"` in its `package.json`, otherwise Node will throw a `require is not defined` error.

3. Use `node ario.cjs` in place of `ar.io` for all commands.

---

## 2. Check availability (optional)

Before spending tokens, confirm the name is free.

**macOS / Linux:**
```bash
ar.io get-arns-record --name my-domain --mainnet
```

**Windows:**
```powershell
node ario.cjs get-arns-record --name my-domain --mainnet --cu-url https://cu.ardrive.io
```

If it returns a record, the name is taken. If it errors with not found, you're good to go.

---

## 3. Preview the cost (optional)

**macOS / Linux:**
```bash
ar.io get-token-cost --name my-domain --type lease --years 1 --mainnet
```

**Windows:**
```powershell
node ario.cjs get-token-cost --name my-domain --type lease --years 1 --mainnet --cu-url https://cu.ardrive.io
```

---

## 4. Register the name

**macOS / Linux:**
```bash
ar.io buy-record --name my-domain --type lease --years 1 --wallet-file ./wallet.json --mainnet
```

**Windows:**
```powershell
node ario.cjs buy-record --name my-domain --type lease --years 1 --wallet-file ./wallet.json --mainnet --cu-url https://cu.ardrive.io
```

For a permanent registration:

**macOS / Linux:**
```bash
ar.io buy-record --name my-domain --type permabuy --wallet-file ./wallet.json --mainnet
```

**Windows:**
```powershell
node ario.cjs buy-record --name my-domain --type permabuy --wallet-file ./wallet.json --mainnet --cu-url https://cu.ardrive.io
```

### All available flags

| Flag | Description |
|---|---|
| `--name` | The ArNS name to register |
| `--type` | `lease` or `permabuy` |
| `--years` | Lease duration (lease only) |
| `--wallet-file` | Path to your Arweave wallet JSON |
| `--process-id` | Assign to an existing ANT process (optional) |
| `--fund-from` | Where to draw funds: `balance`, `stakes`, or `any` |
| `--paid-by` | Address(es) to pay for the interaction |
| `--payment-url` | Custom Turbo payment service URL |
| `--referrer` | Referral tracking string |
| `-q, --quantity` | Quantity of ARIO to interact with |
| `--private-key` | Stringified private key (alternative to `--wallet-file`) |
| `-t, --token` | Wallet/action token type (default: `arweave`) |
| `--tags` | Additional tags, e.g. `--tags name1 value1 name2 value2` |
| `--skip-confirmation` | Skip confirmation prompts |
| `--ario-process-id` | Custom AR.IO process ID |
| `--cu-url` | Custom compute unit URL (see note below) |
| `--hyperbeam-url` | Custom Hyperbeam node URL |
| `--dev` / `--devnet` | Run against AR.IO devnet |
| `--testnet` | Run against AR.IO testnet |
| `--mainnet` | Run against AR.IO mainnet |
| `--debug` | Enable debug log output |

### Note on `--cu-url`

The SDK defaults to `https://cu.ardrive.io` as its compute unit. If you get a `Failed to evaluate dry-run` error, pass it explicitly:

```bash
ar.io get-arns-record --name my-domain --mainnet --cu-url https://cu.ardrive.io
```

---

## 5. Verify the registration

**macOS / Linux:**
```bash
ar.io get-arns-record --name my-domain --mainnet
```

**Windows:**
```powershell
node ario.cjs get-arns-record --name my-domain --mainnet --cu-url https://cu.ardrive.io
```

Expected output includes `processId`, `type`, `startTimestamp`, and `endTimestamp` (lease only).

---

## Quick Reference

**macOS / Linux:**
```bash
npm install -g @ar.io/sdk
ar.io get-arns-record --name my-domain --mainnet
ar.io get-token-cost --name my-domain --type lease --years 1 --mainnet
ar.io buy-record --name my-domain --type lease --years 1 --wallet-file ./wallet.json --mainnet
ar.io buy-record --name my-domain --type permabuy --wallet-file ./wallet.json --mainnet
ar.io get-arns-record --name my-domain --mainnet
```

**Windows (until bug fix is merged):**
```powershell
npm install "@ar.io/sdk"
# Create ario.cjs manually (see step 1)
node ario.cjs get-arns-record --name my-domain --mainnet --cu-url https://cu.ardrive.io
node ario.cjs get-token-cost --name my-domain --type lease --years 1 --mainnet --cu-url https://cu.ardrive.io
node ario.cjs buy-record --name my-domain --type lease --years 1 --wallet-file ./wallet.json --mainnet --cu-url https://cu.ardrive.io
node ario.cjs buy-record --name my-domain --type permabuy --wallet-file ./wallet.json --mainnet --cu-url https://cu.ardrive.io
node ario.cjs get-arns-record --name my-domain --mainnet --cu-url https://cu.ardrive.io
```