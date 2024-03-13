import * as fs from 'fs/promises';
import * as path from 'path';
import { convert } from './convert';

export async function scan(inputFolderPath: string) {
    // Read the files in the input folder
    const files = await fs.readdir(inputFolderPath);

    // Filter out only the TSX files
    const tsxFiles = files.filter(file => file.endsWith('.tsx'));

    // Loop through each TSX file
    for (const file of tsxFiles) {
        const filePath = path.join(inputFolderPath, file);
        const fileContent = await fs.readFile(filePath, 'utf-8');

        // Check if the file contains 'styled.'
        if (fileContent.includes('styled.')) {
            console.log(`Converting ${filePath}`);
            await convert(filePath, filePath);
        }
    }
}

