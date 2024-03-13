#!/usr/bin/env node

import { scan } from './scan'; // Replace './your-module' with the correct path to your module
import * as path from 'path';

// Extract input folder path from command-line arguments
const input = process.argv[2];

// Check if input folder path is provided
if (!input) {
    console.error('Please provide the input folder path.');
    process.exit(1);
}

const inputFolderPath = path.join(process.cwd(), input);

scan(inputFolderPath).then(() => {
    console.log('Styled Components --> Tailwind conversion completed');
}).catch(err => {
    console.error(err);
});
