#!/usr/bin/env node
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
const scan_1 = require("./scan");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
// Extract input folder path from command-line arguments
const input = process.argv[2];
// Check if input folder path is provided
if (!input) {
    console.error('Please provide the input folder path.');
    process.exit(1);
}
const inputFolderPath = path.join(process.cwd(), input);
function folderExists(folderPath) {
    try {
        // Check if the folder exists
        fs.statSync(folderPath);
        return true;
    }
    catch (err) {
        // If an error occurs (folder doesn't exist), return false
        return false;
    }
}
if (!folderExists(inputFolderPath)) {
    console.error(`Folder path "${inputFolderPath}" does not exists.`);
    process.exit(1);
}
(0, scan_1.scan)(inputFolderPath).then(() => {
    console.log('Styled Components --> Tailwind conversion completed');
}).catch(err => {
    console.error(err);
});
