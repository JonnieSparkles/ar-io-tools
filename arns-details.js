import { ARIO, ANT, AOProcess } from '@ar.io/sdk';
import { connect } from '@permaweb/aoconnect';
import fs from 'fs';
import path from 'path';

// Initialize ARIO
const ario = ARIO.init({
    process: new AOProcess({
        processId: "agYcCFJtrMG6cqMuZfskIkFTGvUPddICmtQSBIoPdiA",
        ao: connect({
            CU_URL: 'https://vilenarios.com/ao/cu', // Replace with your CU URL
            GATEWAY_URL: 'https://vilenarios.com/', // Replace with your Gateway URL
        }),
    }),
});

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

        if (!Array.isArray(records.items)) {
            console.error('Error: Fetched records.items is not an array.');
            return;
        }

        console.log('Starting to process records to fetch owners...');
        const results = [];

        for (const [index, record] of records.items.entries()) {
            try {
                console.log(`Processing record ${index + 1}/${records.items.length}: ${record.name}`);

                const ant = ANT.init({ processId: record.processId });

                // Fetch owner with a timeout
                const owner = await withTimeout(ant.getOwner(), 5000); // 5-second timeout

                results.push({
                    ...record,
                    owner,
                });
                console.log(`Successfully fetched owner for ${record.name}: ${owner}`);
            } catch (err) {
                console.error(`Failed to fetch owner for processId ${record.processId}:`, err.message);
                results.push({
                    ...record,
                    owner: err.message, // Log the error in the record's owner field
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
