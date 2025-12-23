const redis = require('redis');

// Create Redis client with error handling
let client = null;
let redisAvailable = false;

// Only attempt Redis connection if not explicitly disabled
if (process.env.REDIS_DISABLED !== 'true') {
  try {
    client = redis.createClient({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      socket: {
        reconnectStrategy: false, // Don't keep retrying if connection fails
      }
    });

    client.on('error', (err) => {
      // Only log once, not repeatedly
      if (!redisAvailable) {
        console.log('⚠️  Redis not available - running without cache');
        redisAvailable = false;
      }
    });

    client.on('connect', () => {
      console.log('✅ Connected to Redis');
      redisAvailable = true;
    });

    // Try to connect silently
    client.connect().catch(() => {
      redisAvailable = false;
    });
  } catch (error) {
    redisAvailable = false;
  }
} else {
  console.log('ℹ️  Redis disabled - running without cache');
}

// Cache utility functions
const cache = {
  // Get data from cache
  async get(key) {
    if (!redisAvailable || !client) {
      return null;
    }
    try {
      const data = await client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Cache get error:', error.message);
      return null;
    }
  },

  // Set data in cache with TTL
  async set(key, data, ttlSeconds = 300) { // Default 5 minutes
    if (!redisAvailable || !client) {
      return false;
    }
    try {
      await client.setEx(key, ttlSeconds, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Cache set error:', error.message);
      return false;
    }
  },

  // Delete data from cache
  async del(key) {
    if (!redisAvailable || !client) {
      return false;
    }
    try {
      await client.del(key);
      return true;
    } catch (error) {
      console.error('Cache delete error:', error.message);
      return false;
    }
  },

  // Generate cache key for GitHub stats
  getGitHubStatsKey(username) {
    return `github:stats:${username}`;
  },

  // Generate cache key for LeetCode stats
  getLeetCodeStatsKey(username) {
    return `leetcode:stats:${username}`;
  },

  // Generate cache key for Codeforces stats
  getCodeforcesStatsKey(username) {
    return `codeforces:stats:${username}`;
  },

  // Generate cache key for HackerRank stats
  getHackerRankStatsKey(username) {
    return `hackerrank:stats:${username}`;
  }
};

module.exports = cache;
