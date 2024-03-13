import * as fs from 'fs/promises';
import * as path from 'path';
import { convert } from './convert';

export async function scan(inputFolderPath: string) {
    // Read the files in the input folder
    const files = await fs.readdir(inputFolderPath);

    // Loop through each file
    for (const file of files) {
        const filePath = path.join(inputFolderPath, file);
        const stats = await fs.stat(filePath);

        // If it's a directory, recursively scan it
        if (stats.isDirectory()) {
            await scan(filePath);
        } else {
            // If it's a file, check if it's a TSX file
            if (file.endsWith('.tsx')) {
                const fileContent = await fs.readFile(filePath, 'utf-8');
                
                // Check if the file contains 'styled.'
                if (fileContent.includes('styled.')) {
                    console.log(`Converting ${filePath}`);
                    await convert(filePath, filePath);
                }
            }
        }
    }
}