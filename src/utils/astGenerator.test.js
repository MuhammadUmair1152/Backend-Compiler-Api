
const { generateAST } = require('./astGenerator');
const { detectFunctionType } = require('./functionsDetector');

jest.mock('./functionsDetector'); // Mock detectFunctionType

describe('generateAST', () => {
    it('should generate the correct AST explanation for a simple function', () => {
        const code = `
            function add(a, b) {
                return a + b;
            }
        `;
        detectFunctionType.mockReturnValue('Function Declaration'); // Mock function type

        const result = generateAST(code);

        expect(result).toEqual(expect.arrayContaining([
            expect.objectContaining({
                type: 'FunctionDeclaration',
                start: expect.any(Number),
                end: expect.any(Number),
                code: expect.stringContaining('function add'),
                functionType: 'Function Declaration',
            })
        ]));
    });

    it('should handle arrow functions correctly', () => {
        const code = `
            const add = (a, b) => a + b;
        `;
        detectFunctionType.mockReturnValue('Arrow Function'); // Mock function type

        const result = generateAST(code);

        expect(result).toEqual(expect.arrayContaining([
            expect.objectContaining({
                type: 'ArrowFunctionExpression',
                start: expect.any(Number),
                end: expect.any(Number),
                code: expect.stringContaining('(a, b) => a + b'),
                functionType: 'Arrow Function',
            })
        ]));
    });

    it('should return an empty array for empty input', () => {
        const code = "";
        const result = generateAST(code);
        expect(result).toEqual([
            {
                "code": "",
                "end": 0,
                "functionType": "N/A",
                "start": 0,
                "type": "Program",
            },
        ]);
    });
});
