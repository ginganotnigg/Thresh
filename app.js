require('dotenv').config();
import express, { json } from 'express';
import Routers from './router/main_router.js';
const app = express();
const PORT = process.env.PORT || 8080;

app.use(json());

// API routes
app.use('/api/tech-tests', Routers);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});
