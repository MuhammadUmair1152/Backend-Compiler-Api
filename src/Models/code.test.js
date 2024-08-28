const mongoose = require('mongoose');
const { CodeExecution, executeCode } = require('./code');

describe('CodeExecution Model and executeCode Function', () => {

    beforeAll(async () => {
        const mongoUri = process.env.MONGODB_URI; // you can change according to ur uri
        await mongoose.connect(mongoUri); // No need for deprecated options
    });

    afterEach(async () => {
        await CodeExecution.deleteMany(); // Ensure a clean state for each test
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test('should execute JavaScript code and return the correct output', async () => {
        const code = `let a = 5; let b = a + 10; console.log(b);`;

        const { output, error } = await executeCode(code);

        expect(output.trim()).toBe('15');
        expect(error).toBeUndefined();
    });

    test('should save code execution to the database', async () => {
        const code = `let a = 5; let b = a + 10; console.log(b);`;
        const { output } = await executeCode(code);
        const ast = [{ type: 'VariableDeclaration', start: 0, end: 9, code: 'let a = 5;' }];

        const codeExecution = new CodeExecution({ code, output, ast });
        await codeExecution.save();

        const savedExecution = await CodeExecution.findById(codeExecution._id);
        expect(savedExecution).toBeTruthy();
        expect(savedExecution.output.trim()).toBe('15');
        expect(savedExecution.ast).toEqual(ast);
    });

    test('should update code execution in the database', async () => {
        const code = `let a = 5; let b = a + 10; console.log(b);`;
        const { output } = await executeCode(code);
        const ast = [{ type: 'VariableDeclaration', start: 0, end: 9, code: 'let a = 5;' }];

        let codeExecution = new CodeExecution({ code, output, ast });
        await codeExecution.save();

        // Update the code and re-run the execution
        const updatedCode = `let a = 5; let b = a + 20; console.log(b);`;
        const { output: updatedOutput } = await executeCode(updatedCode);
        const updatedAst = [{ type: 'VariableDeclaration', start: 0, end: 9, code: 'let a = 5;' }];

        codeExecution.code = updatedCode;
        await codeExecution.updateExecution(updatedOutput, null, updatedAst);

        const updatedExecution = await CodeExecution.findById(codeExecution._id);
        expect(updatedExecution.output.trim()).toBe('25');
        expect(updatedExecution.ast).toEqual(updatedAst);
    });

    test('should find code execution by code', async () => {
        const code = `let a = 5; let b = a + 10; console.log(b);`;
        const { output } = await executeCode(code);
        const ast = [{ type: 'VariableDeclaration', start: 0, end: 9, code: 'let a = 5;' }];

        const codeExecution = new CodeExecution({ code, output, ast });
        await codeExecution.save();

        const foundExecution = await CodeExecution.findByCode(code);
        expect(foundExecution).toBeTruthy();
        expect(foundExecution.output.trim()).toBe('15');
        expect(foundExecution.ast).toEqual(ast);
    });
});
