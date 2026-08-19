import express, { json } from 'express';
import dotenv from 'dotenv';
import {initDB} from './config/db.js';
import rateLimiterMiddleware from './middleware/rateLimiter.js';

import transactionsRoute from './routes/transactionsRoute.js';
import job from "./config/cron.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

//if(process.env.NODE_ENV === "production") job.start();

//middleware
app.use(rateLimiterMiddleware);
app.use(express.json());

app.get("/api/health", (req,res) => {
  res.status(200).json({status: "ok"});
});

app.use("/api/transactions", transactionsRoute);


initDB().then(() => {
app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
});
});


