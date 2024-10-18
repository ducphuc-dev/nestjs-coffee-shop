const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32); // Generate a random key
const iv = crypto.randomBytes(16); // Generate a random initialization vector

const inputFile = path.resolve(__dirname, 'development.env');
const outputFile = path.resolve(__dirname, 'development.env.enc');

console.log(`Encode ENV from ${inputFile} to ${outputFile}`);

const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
const input = fs.createReadStream(inputFile);
const output = fs.createWriteStream(outputFile);

input.pipe(cipher).pipe(output);

// Store the key and iv securely (you'll need them for decryption)
console.log('Encryption key:', key.toString('hex'));
console.log('Initialization vector:', iv.toString('hex'));
