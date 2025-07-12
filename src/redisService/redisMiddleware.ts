import { Request, Response, NextFunction } from 'express';
import redis from '../config/redisConfig';

const cache = (ttl: number = 300) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = `cache:${req.originalUrl}`;

    try {
      const cached = await redis.get(key);
      if (cached) {
        const parsed = typeof cached === 'string' ? JSON.parse(cached) : cached;
        return res.json(parsed); 
      }
      const originalJson = res.json.bind(res);
      res.json = (data: any): Response => {
        redis.set(key, JSON.stringify(data), { ex: ttl }).catch((err) =>
          console.error('Redis set error:', err)
        );
        return originalJson(data); 
      };
      next();
    } catch (err) {
      console.error('Redis error:', err);
      next();
    }
  };
};

export default cache;
