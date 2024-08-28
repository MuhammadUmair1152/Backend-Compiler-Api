const babelParser = require('@babel/parser');
const babelTraverse = require('@babel/traverse').default;
const babelGenerator = require('@babel/generator').default;
const { detectFunctionType } = require('./functionsDetector')

exports.generateAST = (code) => {
    // Parse the code into an AST (Abstract Syntax Tree)
    const ast = babelParser.parse(code, {
        sourceType: 'module',
        plugins: ['jsx'],
    });
    const astExplanation = [];    // Array to store AST explanations
    // Traverse the AST and collect information about each node
    babelTraverse(ast, {
        enter(path) {
            const node = path.node;

            astExplanation.push({
                type: node.type,
                start: node.start,
                end: node.end,
                code: babelGenerator(node).code,
                functionType: path.isFunction() ? detectFunctionType(path) : 'N/A'
            });
        }
    });

    return astExplanation; // Return the AST explanation
};
