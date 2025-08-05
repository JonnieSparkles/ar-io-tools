const https = require('https');
const fs = require('fs');
const csvWriter = require('csv-write-stream');

const walletAddress = '_izWq_r55uJyHnWi-GZJUnU6BZBf3UHBnwWt26ReLzM'; // replace with your Arweave wallet address
// const blockMin = 0; // set the minimum block height in the query range
// const blockMax = 1205702; // set the maximum block height in the query range

const options = {
  hostname: 'arweave.net',
  port: 443,
  path: '/graphql',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

const timestamp = Math.floor(Date.now() / 1000);
const outputFilename = `transaction_history_${timestamp}.csv`;
const outputPath = `.exports/${outputFilename}`;

// Ensure .exports directory exists
if (!fs.existsSync('.exports')) {
  fs.mkdirSync('.exports', { recursive: true });
}

const writer = csvWriter();
writer.pipe(fs.createWriteStream(outputPath));
writer.write({
  id: 'Transaction ID',
  owner: 'Owner',
  recipient: 'Recipient',
  fee_winston: 'Fee (Winston)',
  fee_ar: 'Fee (AR)',
  quantity_winston: 'Quantity (Winston)',
  quantity_ar: 'Quantity (AR)',
  direction: 'Direction',
  block_height: 'Block Height',
});

const maxRetries = 5;
const initialRetryMs = 500;
async function executeAndRetryIfNecessary(executeMe, tries = maxRetries) {
  if(tries-- <= 0){
    throw new Error("Ran out of retries!");
  }

  try {
    return await executeMe();
  } catch(err) {
    const retryWaitMs = initialRetryMs * 2 ** (maxRetries - tries - 1);
    console.log(`Error while executing function! Retrying after ${retryWaitMs}ms...`, err);
    
    // Wait for the specified time, then retry recursively
    await new Promise(resolve => setTimeout(resolve, retryWaitMs));
    return await executeAndRetryIfNecessary(executeMe, tries);
  }
}

function fetchTransactions(query) {
    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';
  
        res.on('data', (chunk) => {
          data += chunk;
        });
  
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(data);
            resolve(parsedData);
          } catch (error) {
            reject(error);
          }
        });
      });
  
      req.on('error', (error) => {
        reject(error);
      });
  
      req.write(query);
      req.end();
    });
  }

  async function fetchAllTransactions() {
    let transactionsSet = new Set();
    let ownersAfterCursor = null;
    let recipientsAfterCursor = null;
    let ownersHasNextPage = true;
    let recipientsHasNextPage = true;
  
    while (ownersHasNextPage || recipientsHasNextPage) {
      // Query for transactions where the wallet address is in the "owners" field
      const ownersQuery = JSON.stringify({
        query: `
          query ($walletAddress: [String!], $afterCursor: String) {
            transactions(
              owners: $walletAddress
              after: $afterCursor
              bundledIn: null
            ) {
              pageInfo {
                hasNextPage
              }
              edges {
                node {
                  id
                  owner {
                    address
                  }
                  recipient
                  fee {
                    winston
                    ar
                  }
                  quantity {
                    winston
                    ar
                  }
                  block {
                    height
                  }
                }
                cursor
              }
            }
          }
        `,
        variables: {
          walletAddress: [walletAddress],
          afterCursor: ownersAfterCursor,
        },
      });
  
      // Query for transactions where the wallet address is in the "recipients" field
      const recipientsQuery = JSON.stringify({
        query: `
          query ($walletAddress: [String!], $afterCursor: String) {
            transactions(
              recipients: $walletAddress
              after: $afterCursor
              bundledIn: null
            ) {
              pageInfo {
                hasNextPage
              }
              edges {
                node {
                  id
                  owner {
                    address
                  }
                  recipient
                  fee {
                    winston
                    ar
                  }
                  quantity {
                    winston
                    ar
                  }
                  block {
                    height
                  }
                }
                cursor
              }
            }
          }
        `,
        variables: {
          walletAddress: [walletAddress],
          afterCursor: recipientsAfterCursor,
        },
      });
  
      try {
        const fetchedOwnerTransactions = await executeAndRetryIfNecessary(async () => { return await fetchTransactions(ownersQuery) });
        const fetchedRecipientTransactions = await executeAndRetryIfNecessary(async () => { return await fetchTransactions(recipientsQuery) });
        const ownerPageInfo = fetchedOwnerTransactions?.data.transactions.pageInfo;
        const recipientPageInfo = fetchedRecipientTransactions?.data.transactions.pageInfo;
  
        const newOwnerTransactions = fetchedOwnerTransactions.data?.transactions?.edges?.map((edge) => edge.node) || [];
        const newRecipientTransactions = fetchedRecipientTransactions.data?.transactions?.edges?.map((edge) => edge.node) || [];
  
        newOwnerTransactions.forEach(transaction => transactionsSet.add(JSON.stringify(transaction)));
        newRecipientTransactions.forEach(transaction => transactionsSet.add(JSON.stringify(transaction)));
  
        ownersHasNextPage = ownerPageInfo?.hasNextPage;
        recipientsHasNextPage = recipientPageInfo?.hasNextPage;
  
        ownersAfterCursor = fetchedOwnerTransactions.data.transactions.edges.length > 0 ? fetchedOwnerTransactions.data.transactions.edges.slice(-1)[0].cursor : null;
        recipientsAfterCursor = fetchedRecipientTransactions.data.transactions.edges.length > 0 ? fetchedRecipientTransactions.data.transactions.edges.slice(-1)[0].cursor : null;

      } catch (error) {
        console.error('An error occurred while fetching transactions:', error);
        break;
      }
    }
  
    // Convert the set of unique transaction strings back to an array of transaction objects
    const transactions = Array.from(transactionsSet).map(transactionStr => JSON.parse(transactionStr));
  
    return transactions;
  }

async function runScript() {
  try {
    const transactions = await fetchAllTransactions();

    for (const transaction of transactions) {
      // Skip transactions with missing critical data
      if (!transaction.id || !transaction.owner?.address || !transaction.recipient) {
        console.log(`Skipping transaction with missing data: ${transaction.id || 'unknown'}`);
        continue;
      }

      const direction = transaction.recipient === walletAddress ? 'In' : 'Out';

      const fee_winston = direction === 'Out' ? -(transaction.fee?.winston || 0) : 0;
      const fee_ar = direction === 'Out' ? -(transaction.fee?.ar || 0) : 0;

      const quantity_winston = direction === 'Out' ? -(transaction.quantity?.winston || 0) : (transaction.quantity?.winston || 0);
      const quantity_ar = direction === 'Out' ? -(transaction.quantity?.ar || 0) : (transaction.quantity?.ar || 0);

      writer.write({
        id: transaction.id,
        owner: transaction.owner.address,
        recipient: transaction.recipient,
        fee_winston,
        fee_ar,
        quantity_winston,
        quantity_ar,
        direction,
        block_height: transaction.block?.height || 'Pending',
      });
    }

    writer.end();
    console.log(`***Transaction history exported to ${outputPath}***`);
  } catch (error) {
    console.error(error);
  }
}

runScript();