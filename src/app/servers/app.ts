import express, { json } from "express";
import cors from "cors";

const app = express();
app.use(json());
app.use(cors({ origin: "*" }));

app.get('/ping', (req, res) => { res.send('server is alive'); });

export default app;