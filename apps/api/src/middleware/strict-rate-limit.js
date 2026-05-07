import rateLimit from 'express-rate-limit';

/**
 * Stricter rate limiting for sensitive endpoints
 * - Contact forms
 * - Authentication
 * - Email sending
 */
export const strictRateLimit = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 5, // 5 requests per 15 minutes
	standardHeaders: true,
	legacyHeaders: false,
	message: { 
		error: 'Too many requests from this IP, please try again later.',
		retryAfter: '15 minutes'
	},
	validate: { trustProxy: false },
});

/**
 * Moderate rate limiting for general API endpoints
 */
export const moderateRateLimit = rateLimit({
	windowMs: 5 * 60 * 1000, // 5 minutes
	max: 30, // 30 requests per 5 minutes
	standardHeaders: true,
	legacyHeaders: false,
	message: { error: 'Too many requests, please slow down.' },
	validate: { trustProxy: false },
});
