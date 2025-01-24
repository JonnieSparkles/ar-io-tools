import { fetchAllArNSRecords, ANT } from '@ar.io/sdk';
import fs from 'fs/promises';
import path from 'path';

const CONFIG = {
    mode: 'limit', // Options: 'specific', 'single', 'limit', 'all'
    specificName: 'jonniesparkles',
    limit: 10,
};

const GATEWAY_URL = 'https://ar-io.net';

async function fetchArnsDetails() {
    try {
        // Fetch all registered ArNS records
        const records = await fetchAllArNSRecords({ gatewayUrl: GATEWAY_URL });
        console.log('Raw response from fetchAllArNSRecords:', records);

        if (!records || typeof records !== 'object') {
            console.error('Error: fetchAllArNSRecords did not return an object.');
            return;
        }

        // Convert the object to an array of records
        const recordsArray = Object.entries(records).map(([name, details]) => ({
            name,
            ...details,
        }));

        console.log(`Fetched ${recordsArray.length} records`);

        const names = recordsArray.map(record => record.name);

        // Determine which names to process
        let selectedNames = [];
        if (CONFIG.mode === 'specific') {
            if (names.includes(CONFIG.specificName)) {
                selectedNames = [CONFIG.specificName];
            } else {
                console.error(`Specific name '${CONFIG.specificName}' not found.`);
                return;
            }
        } else if (CONFIG.mode === 'single') {
            selectedNames = names.slice(0, 1); // Select the first name
        } else if (CONFIG.mode === 'limit') {
            selectedNames = names.slice(0, CONFIG.limit);
        } else if (CONFIG.mode === 'all') {
            selectedNames = names;
        } else {
            console.error(`Invalid mode: ${CONFIG.mode}`);
            return;
        }

        console.log(`Processing ${selectedNames.length} name(s)...`);

        const results = [];
        for (const name of selectedNames) {
            const record = recordsArray.find(r => r.name === name);
            if (!record) continue;

            try {
                // Initialize ANT and fetch owner
                const ant = ANT.init({ processId: record.processId });
                const owner = await ant.getOwner();

                results.push({
                    name: record.name,
                    owner: owner || 'Unknown',
                    startTime: record.startTimestamp || 'Unknown', // Unix timestamp
                    purchaseType: record.type || 'Unknown',
                    processId: record.processId || 'Unknown',
                });
            } catch (err) {
                console.error(`Error fetching owner for processId ${record.processId}:`, err.message);
                results.push({
                    name: record.name,
                    owner: 'Error fetching owner',
                    startTime: record.startTimestamp || 'Unknown',
                    purchaseType: record.type || 'Unknown',
                    processId: record.processId || 'Unknown',
                });
            }
        }

        if (results.length === 0) {
            console.error('No results to save. Exiting.');
            return;
        }

        console.log('Results to save:', results);

        const outputFolder = path.join(process.cwd(), 'output');
        await fs.mkdir(outputFolder, { recursive: true });

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').slice(0, 19);
        const outputFile = path.join(outputFolder, `arns_details-${timestamp}.json`);
        await fs.writeFile(outputFile, JSON.stringify(results, null, 2));

        console.log(`Results saved to: ${outputFile}`);
    } catch (error) {
        console.error('Error fetching ArNS details:', error);
    }
}

fetchArnsDetails();
