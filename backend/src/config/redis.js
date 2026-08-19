import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

const redisClient = new Redis({
    host: process.env.RD_HOST,
    port: Number(process.env.RD_PORT),
    username: process.env.RD_USER,
    password: process.env.RD_PASSWORD,
    enableOfflineQueue: false,
});

redisClient.on('connect', () => console.log('Redis Connected!'));
redisClient.on('error', (err) => console.error('Redis Client Error', err));


export default redisClient;