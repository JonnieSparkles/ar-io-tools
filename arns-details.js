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
        
                // Add fields in specific order
                results.push({
                    name: record.name,                     // Identity
                    processId: record.processId,           // Reference
                    type: record.type,                     // Type info
                    startTimestamp: record.startTimestamp, // Time info
                    endTimestamp: record.endTimestamp,     // Time info
                    owner,                                 // Ownership
                    atTransactionId,                       // Transaction
                    purchasePrice: record.purchasePrice,   // Financial
                    undernameLimit: record.undernameLimit, // Limits
                });
        
                console.log(
                    `Successfully fetched owner and @ transaction ID for ${record.name}: ${owner}, @: ${atTransactionId}`
                );
            } catch (err) {
                console.error(`Failed to process record for processId ${record.processId}:`, err.message);
                results.push({
                    name: record.name,
                    processId: record.processId,
                    type: record.type,
                    startTimestamp: record.startTimestamp,
                    endTimestamp: record.endTimestamp,
                    owner: err.message, // Log the error
                    atTransactionId: 'Error fetching @ transactionId',
                    purchasePrice: record.purchasePrice,
                    undernameLimit: record.undernameLimit,
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
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19); // Format: YYYY-MM-DDTHH-mm-ss
        const outputFile = path.join(outputDir, `arns-details_${timestamp}.json`);
        fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));

        console.log(`Results saved to: ${outputFile}`);
    } catch (error) {
        console.error('Error fetching ArNS records:', error);
    }
}

main();
