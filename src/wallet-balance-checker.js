import Arweave from 'arweave';
import { ARIO } from '@ar.io/sdk';
import { dryrun } from '@permaweb/aoconnect';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Arweave
const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
});

// Create readline interface for prompting
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function for prompts
function promptUser(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

// Constants
const AO_PROCESS_ID = '0syT13r0s0tgPmIed95bJnuSqaD29HQNN8D3ElLSrsc';
const MARIO_TO_ARIO = 1000;
const ARMSTRONG_TO_AO = 1000000000000;

async function checkWalletBalance() {
  try {
    console.log('=== AR.IO Wallet Balance Checker ===\n');
    
    // Prompt for wallet address
    const address = await promptUser('Enter Arweave wallet address: ');
    
    // Basic validation for Arweave address format
    if (!/^[a-zA-Z0-9_-]{43}$/.test(address)) {
      console.error('Error: Please enter a valid Arweave address (43 characters)');
      rl.close();
      return;
    }

    console.log('\nFetching balances for wallet:', address);
    console.log('This may take a moment...\n');

    // Fetch AR balance
    const winstonBalance = await arweave.wallets.getBalance(address);
    const arBalance = arweave.ar.winstonToAr(winstonBalance);
    
    // Fetch ARIO balance
    const ario = ARIO.init();
    const marioBalance = await ario.getBalance({ address });
    const arioBalance = (parseFloat(marioBalance || '0') / MARIO_TO_ARIO).toString();

    // Create result object
    const result = {
      walletAddress: address,
      timestamp: new Date().toISOString(),
      balances: {
        ar: {
          value: parseFloat(arBalance),
          unit: 'AR'
        },
        ario: {
          value: parseFloat(arioBalance),
          unit: 'ARIO',
          raw: {
            value: parseFloat(marioBalance || '0'),
            unit: 'mARIO'
          }
        }
      }
    };

    // Check AO balance automatically
    try {
      console.log('Checking AO token balance...');
      
      const response = await dryrun({
        process: AO_PROCESS_ID,
        tags: [
          { name: 'Action', value: 'Balances' }
        ]
      });

      let aoBalance = 'Not available';
      let rawAoBalance = 'Not available';
      if (response && response.Messages && response.Messages.length > 0) {
        const lastMessage = response.Messages[response.Messages.length - 1];
        if (lastMessage.Data) {
          try {
            const balances = JSON.parse(lastMessage.Data);
            if (balances[address]) {
              rawAoBalance = balances[address];
              aoBalance = (parseFloat(rawAoBalance) / ARMSTRONG_TO_AO).toFixed(6);
            }
          } catch (error) {
            console.log('Could not parse AO balance response:', error.message);
          }
        }
      }

      result.balances.ao = {
        value: aoBalance !== 'Not available' ? parseFloat(aoBalance) : aoBalance,
        unit: 'AO',
        raw: {
          value: rawAoBalance !== 'Not available' ? parseFloat(rawAoBalance) : rawAoBalance,
          unit: 'armstrongs'
        },
        processId: AO_PROCESS_ID
      };

    } catch (error) {
      console.error('Error fetching AO balance:', error.message);
      result.balances.ao = {
        error: error.message,
        unit: 'AO'
      };
    }

    // Display results
    console.log('\n=== Balance Results ===');
    console.log(`Wallet: ${address}`);
    console.log(`AR Balance: ${arBalance} AR`);
    console.log(`ARIO Balance: ${arioBalance} ARIO (${marioBalance} mARIO)`);
    if (result.balances.ao.error) {
      console.log(`AO Balance: Error - ${result.balances.ao.error}`);
    } else {
      console.log(`AO Balance: ${result.balances.ao.value} AO (${result.balances.ao.raw.value} armstrongs)`);
    }

    // Save results to file
    const outputDir = path.join(process.cwd(), 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const outputFilename = `wallet-balance_${timestamp}.json`;
    const outputPath = path.join(outputDir, outputFilename);

    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
    console.log(`\nResults saved to: ${outputPath}`);

  } catch (error) {
    console.error('Error checking wallet balance:', error.message);
  } finally {
    rl.close();
  }
}

// Run the function if executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  checkWalletBalance();
}

export {
  checkWalletBalance
};