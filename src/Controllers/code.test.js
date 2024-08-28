const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { compileCode } = require('../Controllers/code');
const { CodeExecution } = require('../Models/code');
const app = express();

app.use(express.text({ type: '*/*' }));
app.post('/api/code/compile', compileCode);

describe('POST /api/code/compile', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URI);
    });

    afterEach(async () => {
        await CodeExecution.deleteMany(); // Ensure each test starts with a clean state
    });

    afterAll(async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
    });

    it('should successfully execute valid JavaScript code and return output and AST', async () => {
        const code = `const a = 5; console.log(a);`;

        const response = await request(app)
            .post('/api/code/compile')
            .send(code)
            .expect(200);

        expect(response.body).toHaveProperty('output', '5\n');
        expect(response.body).toHaveProperty('ast');
        expect(response.body.ast.length).toBeGreaterThan(0);

        const codeExecution = await CodeExecution.findOne({ code });
        expect(codeExecution).not.toBeNull();
        expect(codeExecution.output).toBe('5\n');
        expect(codeExecution.ast.length).toBeGreaterThan(0);
    });

    it('should handle errors in the JavaScript code and return an error message', async () => {
        const code = `console.log(a);`; // ReferenceError

        const response = await request(app)
            .post('/api/code/compile')
            .send(code)
            .expect(400);

        expect(response.body).toHaveProperty('output', null);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('a is not defined');

        const codeExecution = await CodeExecution.findOne({ code });
        expect(codeExecution).not.toBeNull();
        expect(codeExecution.error).toBe('a is not defined');
    });

    it('should return a 400 error if there is some error in user code', async () => {
        const invalidCode = "let a = ;"; // Intentionally invalid JS code

        const response = await request(app)
            .post('/api/code/compile')
            .send(invalidCode)
            .expect(400);

        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toContain('Unexpected token');
    });
});
