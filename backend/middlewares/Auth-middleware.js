const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {


        const authHeader = req.headers.authorization;   // 
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header not provided' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token not provided' });
        }

        const verifytoken = jwt.verify(token, process.env.JWT_SECRET);
        if (!verifytoken) {
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }
        
        req.userData = verifytoken;  // creating own field of userData which is used for subsequent middleware or route handlers.
        next();
    } catch (error) {
        res.status(403).json({ message: 'No access is provided', error: error.message });
    }
};