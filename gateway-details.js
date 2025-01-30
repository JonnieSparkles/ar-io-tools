import { ARIO, ANT } from '@ar.io/sdk';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

// Create readline interface for prompting
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function promptUser() {
    return new Promise((resolve) => {
        rl.question('Do you want FULL DETAILS or SUMMARY? (F/S): ', (answer) => {
            const response = answer.trim().toUpperCase();
            resolve(response === 'F' ? 'FULL' : 'SUMMARY');
            rl.close();
        });
    });
}

async function processGateway(gateway, outputType) {
    if (outputType === 'SUMMARY') {
        return {
            gatewayAddress: gateway.gatewayAddress,
            fqdn: gateway.settings.fqdn,
            operatorStake: gateway.operatorStake,
            status: gateway.status,
            weights: gateway.weights
        };
    }
    
    // Return full details
    return {
        gatewayAddress: gateway.gatewayAddress,
        observerAddress: gateway.observerAddress,
        operatorStake: gateway.operatorStake,
        settings: gateway.settings,
        startTimestamp: gateway.startTimestamp,
        stats: gateway.stats,
        status: gateway.status,
        vaults: gateway.vaults,
        weights: gateway.weights
    };
}

async function main() {
    try {
        const outputType = await promptUser();
        console.log(`\nProcessing with ${outputType} details...`);

        console.log('Fetching Gateway records...');
        const gateways = await ARIO.init().getGateways({
            limit: 10000,
            sortBy: 'operatorStake',
            sortOrder: 'desc',
        });

        console.log(`Fetched ${gateways.items.length} gateways.`);
        console.log('Processing gateway records...');
        
        const results = [];

        for (const [index, gateway] of gateways.items.entries()) {
            try {
                console.log(`Processing gateway ${index + 1}/${gateways.items.length}: ${gateway.settings.fqdn}`);
                
                const processedGateway = await processGateway(gateway, outputType);
                results.push(processedGateway);

                console.log(`Successfully processed gateway: ${gateway.settings.fqdn}`);
            } catch (err) {
                console.error(`Failed to process gateway ${gateway.gatewayAddress}:`, err.message);
                results.push({
                    gatewayAddress: gateway.gatewayAddress,
                    error: err.message
                });
            }

            if ((index + 1) % 100 === 0) {
                console.log(`Processed ${index + 1}/${gateways.items.length} gateways so far...`);
            }
        }

        console.log('Finished processing all gateways.');

        // Ensure output directory exists
        const outputDir = path.join(process.cwd(), 'output');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Write results to a file
        const timestamp = Date.now();
        const outputFile = path.join(outputDir, `gateway-details_${timestamp}.json`);
        fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));

        console.log(`Results saved to: ${outputFile}`);
    } catch (error) {
        console.error('Error fetching Gateway records:', error);
    }
}

main();
