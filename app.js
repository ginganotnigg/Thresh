require('dotenv').config();
const express = require('express');
const Routers = require('./routers/main_router.js');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

// API routes
app.use('/api/tests', Routers);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});
