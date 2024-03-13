"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const convert_1 = require("./convert");
// Define the input and output file paths
const inputFilePath = path_1.default.resolve(path_1.default.join(__dirname, '..', 'input'), 'index.tsx');
const outputFilePath = path_1.default.resolve(path_1.default.join(__dirname, '..', "output"), 'index.tsx');
// Call the async function
(0, convert_1.convert)(inputFilePath, outputFilePath).then(() => {
    console.log("File processing completed.");
}).catch((error) => {
    console.error("Error occurred while processing the file:", error);
});
