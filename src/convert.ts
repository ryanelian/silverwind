import * as fs from 'fs/promises';
import * as parser from '@babel/parser';
import * as path from 'path';
import traverse, { NodePath } from '@babel/traverse';
import { default as generate } from '@babel/generator';
import { Expression, Identifier, MemberExpression, TaggedTemplateExpression, TemplateLiteral, isIdentifier, isMemberExpression } from '@babel/types';
import { TailwindConverter } from 'css-to-tailwindcss';

// Helper function to check if the node is a styled component
function isStyledComponent(node: TaggedTemplateExpression): boolean {
    const tagObject = isMemberExpression(node.tag) ? node.tag.object : null;
    return Boolean(tagObject && isIdentifier(tagObject) && tagObject.name === 'styled');
}

// Helper function to extract the HTML tag name
function getTagName(node: TaggedTemplateExpression): string {
    const tagObject = node.tag as MemberExpression;
    return (tagObject.property as Identifier).name;
}

// Helper function to extract Tailwind classes
async function getTailwindClasses(quasi: TemplateLiteral): Promise<string[]> {
    const tw = `.tw {\n${quasi.quasis[0].value.raw.trim()}\n}`;
    const twConverter = new TailwindConverter({
        postCSSPlugins: [require('postcss-nested')],
    });
    const { nodes } = await twConverter.convertCSS(tw);
    if (nodes.length > 0) {
        return nodes[0].tailwindClasses;
    }
    return [];
}

// Helper function to create functional component with Tailwind classes
function createComponentAst(tagName: string, twClasses: string[]): Expression {
    const attributes = twClasses.map((cls) => `${cls}`).join(' ');
    const jsxCode = `<${tagName} className="${attributes}">{children}</${tagName}>`;
    const functionCode = `({ children }: React.PropsWithChildren): JSX.Element => {\n  return ${jsxCode};\n}`;
    return parser.parseExpression(functionCode, {
        sourceType: 'module',
        plugins: [
            "jsx",
            "typescript"
        ]
    });
}

// Function to extract CSS key and value from styled-components
async function convertStyledComponentToTailwind(path: NodePath<TaggedTemplateExpression>) {
    const node = path.node;
    if (isStyledComponent(node)) {
        const tagName = getTagName(node);
        const quasi = node.quasi;
        try {
            const twClasses = await getTailwindClasses(quasi);
            if (twClasses.length > 0) {
                const replacement = createComponentAst(tagName, twClasses);
                path.replaceWithMultiple(replacement);
            }
        } catch (error) {
            console.log(`Error processing tag: ${tagName} at line ${node.loc}`);
        }
    }
}

export async function convert(inputFilePath: string, outputFilePath: string) {
    // Read the input file
    const inputCode = await fs.readFile(inputFilePath, 'utf-8');

    const parsedCode = parser.parse(inputCode, {
        sourceType: 'module',
        sourceFilename: path.basename(inputFilePath),
        plugins: [
            "jsx",
            "typescript"
        ]
    });

    // Traverse the AST and extract CSS classes
    const promises: Promise<void>[] = [];
    traverse(parsedCode, {
        TaggedTemplateExpression(path) {
            promises.push(convertStyledComponentToTailwind(path));
        }
    });

    // Wait for all promises to resolve
    await Promise.all(promises);

    // Generate the code back from the AST
    const { code } = generate(parsedCode, {
        sourceMaps: false,
        comments: true,
        retainLines: true,
    }, inputCode);

    // Write the code to the output file
    await fs.writeFile(outputFilePath, code);
}
