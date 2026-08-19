import Redis from 'ioredis';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import redisClient from '../config/redis.js';


const rateLimiterRedis = new RateLimiterRedis({
    storeClient: redisClient,
    points: 100, 
    duration: 60, 
});

const rateLimiterMiddleware = async (req, res, next) => {
    try{
      // In a real world app you'd like to put the userID or IP Address
      await rateLimiterRedis.consume('test-user') //(req.ip)

      next();
    } catch (error){
        res.status(429).json({
                message: "Too many requests, Please try again later.",
            });
    }
};


export default rateLimiterMiddleware;