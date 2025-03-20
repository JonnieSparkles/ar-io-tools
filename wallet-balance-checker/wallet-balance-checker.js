import Arweave from 'arweave';
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
const ARIO_PROCESS_ID = 'qNvAoz0TgcH7DMg8BCVn8jF32QH5L6T29VjHxhHqqGE';
const ARMSTRONG_TO_AO = 1000000000000;  // 1 AO = 1e12 armstrongs
const MARIO_TO_ARIO = 1000000;          // 1 ARIO = 1e6 mARIO

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
    
    // Create result object with AR balance
    const result = {
      walletAddress: address,
      timestamp: new Date().toISOString(),
      balances: {
        ar: {
          value: parseFloat(arBalance),
          unit: 'AR'
        }
      }
    };

    // Function to check AO-based token balances
    async function checkAoTokenBalance(processId, tokenName, conversionRate, unit = 'armstrongs') {
      try {
        console.log(`\nChecking ${tokenName} token balance...`);
        
        const response = await dryrun({
          process: processId,
          tags: [
            { name: 'Action', value: 'Balances' }
          ]
        });

        if (!response?.Messages?.length) {
          console.log(`No messages received for ${tokenName}`);
          return {
            value: 'Not available',
            unit: tokenName,
            raw: {
              value: 'Not available',
              unit: unit
            },
            processId: processId
          };
        }

        const lastMessage = response.Messages[response.Messages.length - 1];
        
        try {
          if (processId === ARIO_PROCESS_ID) {
            const arioResponse = await dryrun({
              process: processId,
              tags: [
                { name: 'Action', value: 'Balance' },
                { name: 'Address', value: address }
              ]
            });
            
            if (arioResponse?.Messages?.length) {
              const arioMessage = arioResponse.Messages[arioResponse.Messages.length - 1];
              if (arioMessage.Data && typeof arioMessage.Data === 'number') {
                const rawBalance = arioMessage.Data;
                const tokenBalance = (parseFloat(rawBalance) / conversionRate).toFixed(6);
                return {
                  value: parseFloat(tokenBalance),
                  unit: tokenName,
                  raw: {
                    value: parseFloat(rawBalance),
                    unit: unit
                  },
                  processId: processId
                };
              }
            }
          } else {
            let balances = typeof lastMessage.Data === 'string' 
              ? JSON.parse(lastMessage.Data)
              : lastMessage.Data;

            if (balances[address]) {
              const rawBalance = balances[address];
              const tokenBalance = (parseFloat(rawBalance) / conversionRate).toFixed(6);
              return {
                value: parseFloat(tokenBalance),
                unit: tokenName,
                raw: {
                  value: parseFloat(rawBalance),
                  unit: unit
                },
                processId: processId
              };
            }
          }
        } catch (error) {
          console.log(`${tokenName} parse error:`, error.message);
        }

        return {
          value: 'Not available',
          unit: tokenName,
          raw: {
            value: 'Not available',
            unit: unit
          },
          processId: processId
        };

      } catch (error) {
        console.error(`Error fetching ${tokenName} balance:`, error);
        return {
          error: error.message,
          unit: tokenName
        };
      }
    }

    // Check both AO and ARIO balances
    result.balances.ao = await checkAoTokenBalance(AO_PROCESS_ID, 'AO', ARMSTRONG_TO_AO, 'armstrongs');
    result.balances.ario = await checkAoTokenBalance(ARIO_PROCESS_ID, 'ARIO', MARIO_TO_ARIO, 'mARIO');

    // Display results
    console.log('\n=== Balance Results ===');
    console.log(`Wallet: ${address}`);
    console.log(`AR Balance: ${arBalance} AR`);
    
    // Display AO balance
    if (result.balances.ao.error) {
      console.log(`AO Balance: Error - ${result.balances.ao.error}`);
    } else {
      console.log(`AO Balance: ${result.balances.ao.value} AO (${result.balances.ao.raw.value} armstrongs)`);
    }

    // Display ARIO balance
    if (result.balances.ario.error) {
      console.log(`ARIO Balance: Error - ${result.balances.ario.error}`);
    } else {
      console.log(`ARIO Balance: ${result.balances.ario.value} ARIO (${result.balances.ario.raw.value} armstrongs)`);
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