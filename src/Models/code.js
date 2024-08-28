const mongoose = require('mongoose');

const codeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    output: {
        type: String,
        default: null
    },
    ast: {
        type: Array,
        default: []
    },
    error: {
        type: String,
        default: null
    }
}, {
    timestamps: true // Automatically manage createdAt and updatedAt fields
});

codeSchema.statics.findByCode = async function (code) {
    return await this.findOne({ code });
};

codeSchema.methods.updateExecution = async function (output, error, ast) {
    this.output = output;
    this.error = error;
    this.ast = ast;
    this.updatedAt = Date.now();
    await this.save();
};
// Using eval 
const executeCode = async (code) => {
    let output = '';
    // Override console.log to capture output
    const originalConsoleLog = console.log;
    console.log = (...args) => {
        output += args.join(' ') + '\n';
    };

    try {
        eval(code); // Directly execute the code using eval
        return { output }; // Return the captured output
    } catch (err) {
        return { error: err.message };
    } finally {
        // Restore the original console.log function
        console.log = originalConsoleLog;
    }
};
const CodeExecution = mongoose.model('CodeExecution', codeSchema);
module.exports = { CodeExecution, executeCode };
    