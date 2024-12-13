require("dotenv").config();
const express = require("express");
const { json } = require("body-parser");
const Routers = require("./routers/main_router.js");
const app = express();
const PORT = process.env.PORT || 8080;
const sequelize = require("./utils/database");

sequelize
    .sync({ force: false }) // Set force: true to drop and recreate tables on every sync
    .then(() => {
        console.log("Database & tables created!");
    })
    .catch((err) => {
        console.error("Unable to create tables, shutting down...", err);
        process.exit(1);
    });

app.use(express.json());

// API routes
app.use('/api', Routers);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong', error: err.message });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
