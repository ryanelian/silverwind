"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scan = void 0;
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const convert_1 = require("./convert");
async function scan(inputFolderPath) {
    // Read the files in the input folder
    const files = await fs.readdir(inputFolderPath);
    // Loop through each file
    for (const file of files) {
        const filePath = path.join(inputFolderPath, file);
        const stats = await fs.stat(filePath);
        // If it's a directory, recursively scan it
        if (stats.isDirectory()) {
            await scan(filePath);
        }
        else {
            // If it's a file, check if it's a TSX file
            if (file.endsWith('.tsx')) {
                const fileContent = await fs.readFile(filePath, 'utf-8');
                // Check if the file contains 'styled.'
                if (fileContent.includes('styled.')) {
                    console.log(`Converting ${filePath}`);
                    await (0, convert_1.convert)(filePath, filePath);
                }
            }
        }
    }
}
exports.scan = scan;
