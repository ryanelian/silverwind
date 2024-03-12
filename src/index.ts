import * as fs from 'fs/promises';
import * as path from 'path';
import * as parser from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import { default as generate } from '@babel/generator';
import { Expression, MemberExpression, TaggedTemplateExpression, isIdentifier, isMemberExpression } from '@babel/types';
import { TailwindConverter } from 'css-to-tailwindcss';

// Helper function to check if the node is a styled component
function isStyledComponent(node: TaggedTemplateExpression): boolean {
    const tagObject = isMemberExpression(node.tag) ? node.tag.object : null;
    return Boolean(tagObject && isIdentifier(tagObject) && tagObject.name === 'styled');
};

// Helper function to extract the HTML tag name
function getTagName(node: TaggedTemplateExpression): string {
    const tagObject = node.tag as MemberExpression;
    return (tagObject.property as any).name;
};

// Helper function to extract Tailwind classes
async function getTailwindClasses(quasi: any): Promise<string[]> {
    const tw = `.tw {\n${quasi.quasis[0].value.raw.trim()}\n}`;
    const twConverter = new TailwindConverter({
        postCSSPlugins: [require('postcss-nested')],
    });
    const { nodes } = await twConverter.convertCSS(tw);
    if (nodes.length > 0) {
        return nodes[0].tailwindClasses;
    }
    return [];
};

// Helper function to create functional component with Tailwind classes
function createComponent(tagName: string, twClasses: string[]): Expression {
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
};

// Function to extract CSS key and value from styled-components
async function extractCSSClasses(path: NodePath<TaggedTemplateExpression>) {
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
};

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
    const promises: Promise<void>[] = [];
    traverse(parsedCode, {
        TaggedTemplateExpression(path) {
            promises.push(extractCSSClasses(path));
        }
    });

    // Wait for all promises to resolve
    await Promise.all(promises);

    // Generate the code back from the AST
    const { code } = generate(parsedCode, {
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
