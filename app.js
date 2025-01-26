require("dotenv").config();
const express = require("express");
const { json } = require("body-parser");
const Routers = require("./routers/main_router.js");
const app = express();
const PORT = process.env.PORT || 8080;
const sequelize = require("./utils/database");
// const winston = require('winston');

sequelize
    .sync({ force: true }) // Set force: true to drop and recreate tables on every sync
    .then(() => {
        console.log("Database & tables created!");
    })
    .catch((err) => {
        console.error("Unable to create tables, shutting down...", err);
        process.exit(1);
    });

app.use(express.json());

// API routes
// app.get('/api', () => { throw new Error('Not Found') });
app.use('/api', Routers);


// Configure winston logger
// const logger = winston.createLogger({
//   level: 'error',
//   format: winston.format.combine(
//     winston.format.timestamp(),
//     winston.format.json()
//   ),
//   transports: [
//     new winston.transports.Console(),
//     new winston.transports.File({ filename: 'error.log' })
//   ]
// });

// Error-handling middleware
app.use((err, req, res, next) => {
    // Log the error using winston
    console.error({
        message: err.message,
        stack: err.stack,
        status: err.status || 500
    });

    // Set default error status and message
    const statusCode = err.status || 500;
    const message = err.message || 'Internal Server Error';

    // Respond to the client
    res.status(statusCode).json({
        success: false,
        error: message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Not Found'
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});