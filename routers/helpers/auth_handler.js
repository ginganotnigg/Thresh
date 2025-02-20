const Role = {
	UNKNOWN: 0,
	CANDIDATE: 1,
	BUSINESS_MANAGER: 2,
};

const noAuth = Boolean(process.env.NO_AUTH) ?? false;
console.log("No authentication: " + noAuth);

const authorize = (requiredRole) => {
	return (req, res, next) => {
		if (noAuth === true) {
			return next();
		}

		const roleId = parseInt(req.headers['x-role-id'], 10);

		if (isNaN(roleId)) {
			return res.status(401).json({ message: 'Unauthorized' });
		}

		if (roleId != requiredRole) {
			return res.status(403).json({ message: 'Forbidden' });
		}

		next();
	};
};

module.exports = {
	authorize,
	Role
};