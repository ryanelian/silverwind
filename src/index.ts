#!/usr/bin/env node

import { scan } from './scan';
import * as path from 'path';
import * as fs from 'fs';

// Extract input folder path from command-line arguments
const input = process.argv[2];

// Check if input folder path is provided
if (!input) {
    console.error('Please provide the input folder path.');
    process.exit(1);
}

const inputFolderPath = path.join(process.cwd(), input);

function folderExists(folderPath: string): boolean {
    try {
        // Check if the folder exists
        fs.statSync(folderPath);
        return true;
    } catch (err) {
        // If an error occurs (folder doesn't exist), return false
        return false;
    }
}

if (!folderExists(inputFolderPath)){
    console.error(`Folder path "${inputFolderPath}" does not exists.`);
    process.exit(1);
}

scan(inputFolderPath).then(() => {
    console.log('Styled Components --> Tailwind conversion completed');
}).catch(err => {
    console.error(err);
});
