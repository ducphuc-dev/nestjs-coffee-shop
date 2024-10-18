const fs = require('fs');
const crypto = require('crypto');
const readline = require('readline');
const path = require('path');

// Create readline interface to prompt for key and iv
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to ask for input
const askQuestion = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

(async () => {
  try {
    const keyHex = await askQuestion('Please enter the encryption key (hex): ');
    const ivHex = await askQuestion('Please enter the initialization vector (iv) (hex): ');

    const algorithm = 'aes-256-cbc';
    const key = Buffer.from(keyHex, 'hex'); // Convert key from hex
    const iv = Buffer.from(ivHex, 'hex'); // Convert iv from hex

    const inputFile = path.resolve(__dirname, 'development.env.enc');
    const outputFile = path.resolve(__dirname, 'development.env');
    console.log(`Decode ENV from ${inputFile} to ${outputFile}`);

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    const input = fs.createReadStream(inputFile);
    const output = fs.createWriteStream(outputFile);

    input
      .pipe(decipher)
      .pipe(output)
      .on('finish', () => {
        console.log(`Decrypted ${inputFile} to ${outputFile}`);
        rl.close(); // Close the readline interface
      });
  } catch (error) {
    console.error('Error during decryption:', error);
    rl.close(); // Close the readline interface in case of error
  }
})();
