import jwt from 'jsonwebtoken';
import { findUserById } from '../services/auth.service.js';

/* This middleware extracts the access token from the cookie, verifies it, and allows access if valid.
    - If the access token expires, the client can call the /auth/refresh endpoint, sending the refresh token.
    - The server verifies the refresh token and issues a new access token. 
    - next() function will call the next function specified in each route.

*/
export const protectRoute = async (req, res, next) => {
    try {
        // Get the Accesstoken from the cookie
        const token = req.cookies.accessToken;
        console.log(`This is the token: ${token}`)
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


        console.log(`This is the user info found thanks to the token: ${JSON.stringify(user)}`)

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