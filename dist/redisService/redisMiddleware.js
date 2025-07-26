import redis from '../config/redisConfig.js';
const cache = (ttl = 300) => {
    return async (req, res, next) => {
        const key = `cache:${req.originalUrl}`;
        try {
            const cached = await redis.get(key);
            if (cached) {
                const parsed = typeof cached === 'string' ? JSON.parse(cached) : cached;
                return res.json(parsed);
            }
            const originalJson = res.json.bind(res);
            res.json = (data) => {
                redis.set(key, JSON.stringify(data), { ex: ttl }).catch((err) => console.error('Redis set error:', err));
                return originalJson(data);
            };
            next();
        }
        catch (err) {
            console.error('Redis error:', err);
            next();
        }
    };
};
export default cache;
