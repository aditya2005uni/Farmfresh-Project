const jwt = require('jsonwebtoken');
const User = require('../models/User');


const auth = (options = {}) => async (req, res, next) => {

const required = options.required ?? true;
const roles = options.roles ?? null;


const authHeader = req.headers.authorization;
if (!authHeader) {
if (!required) return next();
return res.status(401).json({ message: 'No token provided' });
}


const parts = authHeader.split(' ');
if (parts.length !== 2 || parts[0] !== 'Bearer') {
return res.status(401).json({ message: 'Invalid auth header' });
}


const token = parts[1];
try {
const payload = jwt.verify(token, process.env.JWT_SECRET);
const user = await User.findById(payload.id).select('-password');
if (!user) return res.status(401).json({ message: 'User not found' });


if (roles && !roles.includes(user.role)) {
return res.status(403).json({ message: 'Forbidden: insufficient role' });
}


req.user = user;
next();
} catch (err) {
console.error(err);
return res.status(401).json({ message: 'Invalid or expired token' });
}
};


module.exports = auth;