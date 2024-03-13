import path from "path";
import { convert } from "./convert";

// Define the input and output file paths
const inputFilePath = path.resolve(path.join(__dirname, '..', 'input'), 'index.tsx');
const outputFilePath = path.resolve(path.join(__dirname, '..', "output"), 'index.tsx');

// Call the async function
convert(inputFilePath, outputFilePath).then(() => {
    console.log("File processing completed.");
}).catch((error) => {
    console.error("Error occurred while processing the file:", error);
});
