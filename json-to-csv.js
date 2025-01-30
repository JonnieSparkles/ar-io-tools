import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { parse } from 'json2csv'; // Install: npm install json2csv

// Function to flatten nested objects
function flattenObject(obj, prefix = '') {
    return Object.keys(obj).reduce((acc, key) => {
        const pre = prefix.length ? `${prefix}_` : '';
        
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            Object.assign(acc, flattenObject(obj[key], `${pre}${key}`));
        } else {
            acc[`${pre}${key}`] = obj[key];
        }
        
        return acc;
    }, {});
}

// Function to prompt the user for input
function promptUser(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => rl.question(question, (answer) => {
        rl.close();
        resolve(answer.trim());
    }));
}

// Function to convert JSON to CSV
async function convertJSONToCSV() {
    try {
        // Prompt for input file location
        const inputFilePath = await promptUser('Enter the path to the input JSON file: ');
        if (!fs.existsSync(inputFilePath)) {
            console.error(`Error: Input file not found at ${inputFilePath}`);
            return;
        }

        // Read JSON file
        const jsonData = JSON.parse(fs.readFileSync(inputFilePath, 'utf-8'));

        if (!Array.isArray(jsonData)) {
            console.error('Error: JSON data is not an array. Ensure the input JSON contains an array of objects.');
            return;
        }

        // Flatten each object in the array
        const flattenedData = jsonData.map(item => flattenObject(item));

        // Extract the default output file name from the input file
        const inputFileName = path.basename(inputFilePath, path.extname(inputFilePath));
        const defaultOutputFileName = `${inputFileName}.csv`;

        // Prompt for output file name
        const outputFileName = await promptUser(
            `Enter the name of the output CSV file (default: ${defaultOutputFileName}): `
        ) || defaultOutputFileName;

        // Define output directory and file path
        const outputDir = path.join(process.cwd(), 'output');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        const outputFilePath = path.join(outputDir, outputFileName);

        // Convert flattened JSON to CSV
        const fields = Array.from(new Set(flattenedData.flatMap(obj => Object.keys(obj)))); // Get all unique fields
        const opts = { fields };
        const csv = parse(flattenedData, opts);

        // Write CSV file
        fs.writeFileSync(outputFilePath, csv);
        console.log(`CSV file created: ${outputFilePath}`);
    } catch (error) {
        console.error('Error converting JSON to CSV:', error.message);
    }
}

// Run the script
convertJSONToCSV();
