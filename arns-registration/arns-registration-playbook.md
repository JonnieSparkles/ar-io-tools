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

### Windows: use `ar.io.ps1` instead of `ar.io`

On Windows, PowerShell won't execute the plain `ar.io` shell script that npm generates. Use `ar.io.ps1` instead — it's installed alongside it automatically and works identically.

```powershell
ar.io.ps1 --help
```

This applies to all commands below. On macOS/Linux use `ar.io`, on Windows use `ar.io.ps1`.

---

## 2. Check availability (optional)

Before spending tokens, confirm the name is free.

**macOS / Linux:**
```bash
ar.io get-arns-record --name my-domain --mainnet
```

**Windows:**
```powershell
ar.io.ps1 get-arns-record --name my-domain --mainnet --cu-url https://cu.ardrive.io
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
ar.io.ps1 get-token-cost --name my-domain --type lease --years 1 --mainnet --cu-url https://cu.ardrive.io
```

---

## 4. Register the name

**macOS / Linux:**
```bash
ar.io buy-record --name my-domain --type lease --years 1 --wallet-file ./wallet.json --mainnet
```

**Windows:**
```powershell
ar.io.ps1 buy-record --name my-domain --type lease --years 1 --wallet-file ./wallet.json --mainnet --cu-url https://cu.ardrive.io
```

For a permanent registration:

**macOS / Linux:**
```bash
ar.io buy-record --name my-domain --type permabuy --wallet-file ./wallet.json --mainnet
```

**Windows:**
```powershell
ar.io.ps1 buy-record --name my-domain --type permabuy --wallet-file ./wallet.json --mainnet --cu-url https://cu.ardrive.io
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

If you get a `Failed to evaluate dry-run` error, pass the compute unit URL explicitly:

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
ar.io.ps1 get-arns-record --name my-domain --mainnet --cu-url https://cu.ardrive.io
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

**Windows:**
```powershell
npm install -g "@ar.io/sdk"
ar.io.ps1 get-arns-record --name my-domain --mainnet --cu-url https://cu.ardrive.io
ar.io.ps1 get-token-cost --name my-domain --type lease --years 1 --mainnet --cu-url https://cu.ardrive.io
ar.io.ps1 buy-record --name my-domain --type lease --years 1 --wallet-file ./wallet.json --mainnet --cu-url https://cu.ardrive.io
ar.io.ps1 buy-record --name my-domain --type permabuy --wallet-file ./wallet.json --mainnet --cu-url https://cu.ardrive.io
ar.io.ps1 get-arns-record --name my-domain --mainnet --cu-url https://cu.ardrive.io
```