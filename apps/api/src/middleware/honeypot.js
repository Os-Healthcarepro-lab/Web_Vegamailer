/**
 * Simple honeypot middleware to catch spam bots
 * Bots often fill out all fields, including hidden ones
 */
export const honeypot = (fieldName = 'website') => {
	return (req, res, next) => {
		// If the honeypot field is filled, it's likely a bot
		if (req.body[fieldName]) {
			return res.status(400).json({ 
				error: 'Invalid submission' 
			});
		}
		next();
	};
};
