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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const parser = __importStar(require("@babel/parser"));
const traverse_1 = __importDefault(require("@babel/traverse"));
const generator_1 = __importDefault(require("@babel/generator"));
const types_1 = require("@babel/types");
const css_to_tailwindcss_1 = require("css-to-tailwindcss");
// Helper function to check if the node is a styled component
function isStyledComponent(node) {
    const tagObject = (0, types_1.isMemberExpression)(node.tag) ? node.tag.object : null;
    return Boolean(tagObject && (0, types_1.isIdentifier)(tagObject) && tagObject.name === 'styled');
}
;
// Helper function to extract the HTML tag name
function getTagName(node) {
    const tagObject = node.tag;
    return tagObject.property.name;
}
;
// Helper function to extract Tailwind classes
async function getTailwindClasses(quasi) {
    const tw = `.tw {\n${quasi.quasis[0].value.raw.trim()}\n}`;
    const twConverter = new css_to_tailwindcss_1.TailwindConverter({
        postCSSPlugins: [require('postcss-nested')],
    });
    const { nodes } = await twConverter.convertCSS(tw);
    if (nodes.length > 0) {
        return nodes[0].tailwindClasses;
    }
    return [];
}
;
// Helper function to create functional component with Tailwind classes
function createComponent(tagName, twClasses) {
    const attributes = twClasses.map((cls) => `${cls}`).join(' ');
    const jsxCode = `<${tagName} className="${attributes}">{children}</${tagName}>`;
    const functionCode = `function ({ children }: React.PropsWithChildren) {\n  return ${jsxCode};\n}`;
    return parser.parseExpression(functionCode, {
        sourceType: 'module',
        plugins: [
            "jsx",
            "typescript"
        ]
    });
}
;
// Function to extract CSS key and value from styled-components
async function extractCSSClasses(path) {
    const node = path.node;
    if (isStyledComponent(node)) {
        const tagName = getTagName(node);
        const quasi = node.quasi;
        const twClasses = await getTailwindClasses(quasi);
        if (twClasses.length > 0) {
            const replacement = createComponent(tagName, twClasses);
            path.replaceWithMultiple(replacement);
        }
    }
}
;
async function processFile() {
    // Define the input and output file paths
    const inputFilePath = path.resolve(path.join(__dirname, '..', 'input'), 'index.tsx');
    const outputFilePath = path.resolve(path.join(__dirname, '..', "output"), 'index.tsx');
    // Read the input file
    const inputCode = await fs.readFile(inputFilePath, 'utf-8');
    const parsedCode = parser.parse(inputCode, {
        sourceType: 'module',
        sourceFilename: 'index.tsx',
        plugins: [
            "jsx",
            "typescript"
        ]
    });
    // Traverse the AST and extract CSS classes
    const promises = [];
    (0, traverse_1.default)(parsedCode, {
        TaggedTemplateExpression(path) {
            promises.push(extractCSSClasses(path));
        }
    });
    // Wait for all promises to resolve
    await Promise.all(promises);
    // Generate the code back from the AST
    const { code } = (0, generator_1.default)(parsedCode, {
        sourceMaps: false,
        comments: true,
    }, inputCode);
    // Write the code to the output file
    await fs.writeFile(outputFilePath, code);
}
// Call the async function
processFile().then(() => {
    console.log("File processing completed.");
}).catch((error) => {
    console.error("Error occurred while processing the file:", error);
});
