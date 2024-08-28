const express = require('express');
const connectDB = require('./dbConection');
const codeRoutes = require('./src/Routes/code');
const errorHandler = require('./src/Middleware/errorHandler');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./ApiDocs/swagger-output.json');



app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true }));
app.use(express.text())
app.use('/api/code/compile', express.text({ type: '*/*' })); //to send Javascript code
connectDB(); // Connect to the database


app.use('/api/code', codeRoutes);

app.use(errorHandler);   // Error handling middleware

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
