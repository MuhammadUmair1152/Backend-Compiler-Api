const { generateAST } = require('../utils/astGenerator');
const { CodeExecution, executeCode } = require('../Models/code');

const compileCode = async (req, res) => {
    try {
        // If the request is sent as raw JavaScript, it will be a string, not a JSON object.
        const code = req.body
        // console.log('Received code:', code);
        // Execute the code
        const result = await executeCode(code);
        if (result.error) {
            // Save error to the database
            const codeData = new CodeExecution({ code, output: null, ast: [], error: result.error });
            await codeData.save();
            // console.log('Saved error to database:', codeData);
            return res.status(400).json({ output: null, error: result.error });
        }
        const ast = generateAST(code); // Generate AST
        // console.log('Generated AST:', ast);
        // Save successful execution to the database
        const codeData = new CodeExecution({ code, output: result.output, ast });
        await codeData.save();
        // console.log('Saved to database:', codeData);

        return res.status(200).json({ output: result.output, ast, error: null });

    } catch (err) {
        console.error('Error during code compilation:', err.message);

        // Save error to the database
        const codeData = new CodeExecution({ code: req.body, output: null, ast: [], error: err.message });
        await codeData.save();
        // console.log('Saved error to database:', codeData);

        return res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
};

module.exports = { compileCode };
