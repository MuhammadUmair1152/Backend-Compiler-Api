const { detectFunctionType } = require('./functionsDetector');
const babelParser = require('@babel/parser');
const babelTraverse = require('@babel/traverse').default;

const parseCode = (code) => babelParser.parse(code, { sourceType: 'module', plugins: ['jsx'] });

describe('detectFunctionType', () => {    //to detect a simple function
    it('should detect a function declaration', () => {
        const code = `
            function add(a, b) {
                return a + b;
            }
        `;
        const ast = parseCode(code);
        let functionType;
        babelTraverse(ast, {
            FunctionDeclaration(path) {
                functionType = detectFunctionType(path);
                path.stop(); // Stop traversal after finding the function
            }
        });
        expect(functionType).toContain('Function Declaration');
    });

    it('should detect an arrow function', () => {   // to detect arrow function
        const code = `
            const add = (a, b) => a + b;
        `;
        const ast = parseCode(code);
        let functionType;
        babelTraverse(ast, {
            ArrowFunctionExpression(path) {
                functionType = detectFunctionType(path);
                path.stop(); // Stop traversal after finding the function
            }
        });

        expect(functionType).toContain('Arrow Function');
    });

    it('should detect an async function', () => {   // to detect async function
        const code = `
            async function fetchData() {
                return await fetch('/data');
            }
        `;
        const ast = parseCode(code);
        let functionType;

        babelTraverse(ast, {
            FunctionDeclaration(path) {
                functionType = detectFunctionType(path);
                path.stop(); // Stop traversal after finding the function
            }
        });

        expect(functionType).toContain('Async Function');
    });

    it('should return "N/A" for non-function nodes', () => {
        const code = `const a = 1;`;
        const ast = parseCode(code);
        let functionType = 'N/A';

        babelTraverse(ast, {
            VariableDeclaration(path) {
                functionType = detectFunctionType(path);
                path.stop(); // Stop traversal after checking the node
            }
        });

        expect(functionType).toBe('N/A');
    });
    it('should detect IIFE', () => {    //to detect IIFE function
        const code = `(function() {
            console.log('This is an IIFE');
        })();`;
        const ast = parseCode(code);
        let functionType = '';
        babelTraverse(ast, {
            FunctionExpression(path) {  //
                functionType = detectFunctionType(path);
                path.stop();
            }
        });
        expect(functionType).toContain('IIFE');
    });
    it('should detect a recursive function', () => {
        const code = `
        function factorial(n) {
            if (n === 0) {
                return 1;
            }return n * factorial(n - 1);  
        }`;
        const ast = parseCode(code);
        let functionType = '';
        babelTraverse(ast, {
            FunctionDeclaration(path) {
                functionType = detectFunctionType(path);
                path.stop();
            }
        });
        expect(functionType).toContain('Recursive Function');
    });


});
