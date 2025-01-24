import { ARIO, ANT } from '@ar.io/sdk';
import fs from 'fs';
import path from 'path';

// Initialize ARIO
const ario = ARIO.init();

// Helper: Add timeout to a promise
async function withTimeout(promise, timeoutMs) {
    return Promise.race([
        promise,
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Operation timed out')), timeoutMs)
        ),
    ]);
}

async function main() {
    try {
        console.log('Fetching ArNS records...');
        const records = await ario.getArNSRecords({
            limit: 10,
            sortBy: 'startTimestamp',
            sortOrder: 'desc',
        });

        console.log(`Fetched ${records.items.length} records.`);

        console.log('Starting to process records to fetch owners and @ transaction IDs...');
        const results = [];

        for (const [index, record] of records.items.entries()) {
            try {
                console.log(`Processing record ${index + 1}/${records.items.length}: ${record.name}`);
        
                const ant = ANT.init({ processId: record.processId });
        
                // Fetch owner with a timeout
                const owner = await withTimeout(ant.getOwner(), 5000); // 5-second timeout
        
                // Fetch records for the ANT
                const antRecords = await withTimeout(ant.getRecords(), 5000); // 5-second timeout
                const atTransactionId = antRecords['@']?.transactionId || 'Not available';
        
                // Add explicitly ordered fields to results
                results.push({
                    name: record.name,
                    owner, // Dynamically fetched owner
                    atTransactionId, // Dynamically fetched @ transactionId
                    startTimestamp: record.startTimestamp,
                    endTimestamp: record.endTimestamp,
                    processId: record.processId,
                    type: record.type,
                    purchasePrice: record.purchasePrice,
                    undernameLimit: record.undernameLimit,
                });
        
                console.log(
                    `Successfully fetched owner and @ transaction ID for ${record.name}: ${owner}, @: ${atTransactionId}`
                );
            } catch (err) {
                console.error(`Failed to process record for processId ${record.processId}:`, err.message);
                results.push({
                    name: record.name,
                    owner: err.message, // Log the error
                    type: record.type,
                    atTransactionId: 'Error fetching @ transactionId', // Handle missing @ transactionId
                    startTimestamp: record.startTimestamp,
                    endTimestamp: record.endTimestamp,
                    purchasePrice: record.purchasePrice,
                    undernameLimit: record.undernameLimit,
                    processId: record.processId,
                });
            }
        
            if ((index + 1) % 100 === 0) {
                console.log(`Processed ${index + 1}/${records.items.length} records so far...`);
            }
        }        

        console.log('Finished processing all records.');

        // Ensure output directory exists
        const outputDir = path.join(process.cwd(), 'output');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Write results to a file
        const outputFile = path.join(outputDir, `${Date.now()}.json`);
        fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));

        console.log(`Results saved to: ${outputFile}`);
    } catch (error) {
        console.error('Error fetching ArNS records:', error);
    }
}

main();
