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
exports.convert = void 0;
const fs = __importStar(require("fs/promises"));
const parser = __importStar(require("@babel/parser"));
const path = __importStar(require("path"));
const traverse_1 = __importDefault(require("@babel/traverse"));
const generator_1 = __importDefault(require("@babel/generator"));
const types_1 = require("@babel/types");
const css_to_tailwindcss_1 = require("css-to-tailwindcss");
// Helper function to check if the node is a styled component
function isStyledComponent(node) {
    const tagObject = (0, types_1.isMemberExpression)(node.tag) ? node.tag.object : null;
    return Boolean(tagObject && (0, types_1.isIdentifier)(tagObject) && tagObject.name === 'styled');
}
// Helper function to extract the HTML tag name
function getTagName(node) {
    const tagObject = node.tag;
    return tagObject.property.name;
}
function parseMemberExpression(expression) {
    const parts = [];
    let current = expression;
    while (current) {
        if (current.property.type === 'Identifier') {
            parts.push(current.property.name);
        }
        if (current.type === 'MemberExpression') {
            if (current.object.type === 'MemberExpression') {
                current = current.object;
            }
            else {
                if (current.object.type === 'Identifier') {
                    parts.push(current.object.name);
                }
                current = undefined;
            }
        }
    }
    parts.reverse();
    return parts;
}
function getValueByKeys(object, keys) {
    let value = object;
    for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
            value = value[key];
        }
        else {
            return undefined; // If any key is not found, return undefined
        }
    }
    return value ?? "0";
}
// Helper function to extract Tailwind classes
async function getTailwindClasses(node) {
    let css = '';
    let unsupported = false;
    node.quasi.quasis.forEach((q, i) => {
        css += q.value.raw.trim();
        const expression = node.quasi.expressions[i];
        if (expression) {
            if (expression.type === 'MemberExpression') {
                const objectAccess = parseMemberExpression(expression);
                css += getValueByKeys({
                    Color: {
                        AlphaBlack5: 'rgba(0, 0, 0, 0.05)',
                        AlphaBlack12: 'rgba(0, 0, 0, 0.12)',
                        AlphaBlack16: 'rgba(0, 0, 0, 0.16)',
                        AlphaBlack38: 'rgba(0, 0, 0, 0.38)',
                        AlphaBlack60: 'rgba(0, 0, 0, 0.6)',
                        AlphaBlack87: 'rgba(0, 0, 0, 0.87)',
                        AlphaWhite50: 'rgba(255, 255, 255, 0.5)',
                        NeutralWhite: '#fff',
                        Neutral25: '#fafafa',
                        Neutral50: '#f5f5f5',
                        Neutral60: 'rgba(0, 0, 0, 0.6)',
                        Neutral100: '#f0f0f0',
                        Neutral150: '#ebebeb',
                        Neutral200: '#e0e0e0',
                        Neutral250: '#c7c7c7',
                        Neutral300: '#b3b3b3',
                        Neutral350: '#949494',
                        Neutral400: '#8a8a8a',
                        Neutral450: '#616161',
                        Neutral500: '#424242',
                        Neutral600: '#333',
                        Neutral900: '#0f0f0f',
                        NeutralBlack: '#000',
                        AlphaBlue20: 'rgba(66, 165, 245, 0.2)',
                        Primary50: '#e3f2fd',
                        Primary100: '#bbdefb',
                        Primary400: '#42a5f5',
                        Primary700: '#1976d2',
                        Primary800: '#1565C0',
                        Primary900: '#0d47a1',
                        AlphaRed12: 'rgba(214, 40, 70, 0.12)',
                        SemanticRed50: '#ffe7e2',
                        SemanticRed400: '#d62846',
                        SemanticRed600: '#bf2641',
                        SemanticYellow50: '#fff5bd',
                        SemanticYellow400: '#ffb900',
                        SemanticYellow600: '#EA8812',
                        SemanticGreen600: '#02823D',
                    },
                    Layer: {
                        Base: 1,
                        StickyTableHead: 5,
                        StickyTableHeadOverlay: 6,
                        StickyDomainSettingsTitle: 7,
                        GlassOverlay: 10,
                        AdvancedSearch: 50,
                        SideDrawer: 100,
                        Dialog: 100,
                        Dropdown: 100,
                        OtpSetup: 150,
                        ActivityIndicator: 200,
                    }
                }, objectAccess);
            }
            else {
                // console.log('UNSUPPORTED', expression.type); 
                // ArrowFunctionExpression
                unsupported = true;
            }
        }
    });
    // Regular expression to match "& > element" or "&&" or "& element"
    const regex = /&\s*(?:>\s*)?[a-zA-Z*][a-zA-Z0-9-]*/g;
    if (regex.test(css)) {
        unsupported = true;
    }
    if (unsupported) {
        return [];
    }
    // console.log(css);
    const tw = `.tw {\n${css}\n}`;
    // const translator = await import('css-to-tailwind-translator');
    // const result = translator.CssToTailwindTranslator(tw, {
    // });
    // console.log(result);
    // return result.data[0].resultVal.split(' ');
    const twConverter = new css_to_tailwindcss_1.TailwindConverter({
        postCSSPlugins: [require('postcss-nested')],
    });
    const { nodes } = await twConverter.convertCSS(tw);
    if (nodes.length > 0) {
        return nodes[0].tailwindClasses;
    }
    return [];
}
// https://developer.mozilla.org/en-US/docs/Glossary/Void_element
const voidElements = [
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr"
];
const voidElementSet = new Set(voidElements);
function renderComponentCode(tagName, classNames) {
    // do NOT add semicolon at the end of the jsxCode, otherwise the parseExpression will error!
    if (voidElementSet.has(tagName)) {
        return `React.forwardRef(
    (
        props: React.ComponentPropsWithoutRef<"${tagName}">,
        ref: React.ComponentProps<"${tagName}">["ref"]
    ) => {
        return (
            <${tagName} className="${classNames}" ref={ref} {...props} />
        );
    }
)
`;
    }
    else {
        return `React.forwardRef(
    (
        props: React.ComponentPropsWithoutRef<"${tagName}">,
        ref: React.ComponentProps<"${tagName}">["ref"]
    ) => {
        return (
            <${tagName} className="${classNames}" ref={ref} {...props}>
                {props.children}
            </${tagName}>
        );
    }
)
`;
    }
}
// Helper function to create functional component with Tailwind classes
function createComponentAst(tagName, twClasses) {
    const classNames = twClasses.map((cls) => `${cls}`).join(' ');
    const jsxCode = renderComponentCode(tagName, classNames);
    return parser.parseExpression(jsxCode, {
        sourceType: 'module',
        plugins: [
            "jsx",
            "typescript"
        ]
    });
}
// Function to extract CSS key and value from styled-components
async function convertStyledComponentToTailwind(path) {
    const node = path.node;
    if (isStyledComponent(node)) {
        const tagName = getTagName(node);
        try {
            const twClasses = await getTailwindClasses(node);
            if (twClasses.length > 0) {
                const replacement = createComponentAst(tagName, twClasses);
                path.replaceWithMultiple(replacement);
                return true;
            }
        }
        catch (error) {
            console.log(`Error processing tag: ${tagName} at\n${node}\n${error}`);
        }
    }
    return false;
}
async function convert(inputFilePath, outputFilePath) {
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
    const promises = [];
    (0, traverse_1.default)(parsedCode, {
        TaggedTemplateExpression(path) {
            promises.push(convertStyledComponentToTailwind(path));
        }
    });
    // Wait for all promises to resolve
    const promiseResults = await Promise.allSettled(promises);
    // Do not modify file if there are no changes!
    let changesCount = 0;
    promiseResults.forEach(p => {
        if (p.status === 'fulfilled') {
            if (p.value) {
                changesCount++;
            }
        }
    });
    if (changesCount === 0) {
        return;
    }
    // Check if React is imported, if not, add the import statement
    let reactImported = false;
    for (const node of parsedCode.program.body) {
        if (node.type === 'ImportDeclaration' &&
            node.specifiers.some(specifier => specifier.local.name === 'React')) {
            reactImported = true;
            break;
        }
    }
    if (!reactImported) {
        parsedCode.program.body.unshift({
            type: 'ImportDeclaration',
            specifiers: [{
                    type: 'ImportDefaultSpecifier',
                    local: { type: 'Identifier', name: 'React' }
                }],
            source: { type: 'StringLiteral', value: 'react' }
        });
    }
    // Generate the code back from the AST
    const { code } = (0, generator_1.default)(parsedCode, {
        sourceMaps: false,
        comments: true,
        retainLines: false,
    }, inputCode);
    // Write the code to the output file
    await fs.writeFile(outputFilePath, code);
}
exports.convert = convert;
