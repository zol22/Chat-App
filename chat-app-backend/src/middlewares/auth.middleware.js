import jwt from 'jsonwebtoken';
import { findUserById } from '../services/auth.service.js';

// next() function will call the updatedProfile function
// This middleware checks for the presence of the jwt cookie in the incoming request
export const protectRoute = async (req, res, next) => {
    try {
        // Get the token from the cookie
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized - No Token Provided' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ error: 'Unauthorized - Invalid Token' });
        }

        // userId is the payload of the token that was signed in the generateToken function
        const user = await findUserById(decoded.userId);

        if (!user) {
            return res.status(404).json({ error: 'User Not Found' });
        }
        else {
            req.user = user; // Attached the user's information to the request object for use.
            next(); // Call the next function which is updateProfile()
        }   
    } catch (error) {   
        return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}