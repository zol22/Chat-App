import { registerUser, findUser, updateUserProfile } from "../services/auth.service.js";
import bycrypt from "bcrypt";
import cloudinary from "../lib/cloudinary.js";
import { setAuthCookies } from "../lib/setAuthCookies.js";
import jwt from 'jsonwebtoken';
import { generateAccessToken } from "../lib/generateToken.js";

// Apply strong password policies, both for ops and in-application user management 
export const signup = async (req, res) => {

    const { name, email, password, profilePic} = req.body;

    // Validate Incoming Data from  SQL injection and XSS attacks
    if (!email || !password || !name) {
        return res.status(400).json({ error: 'Name, Email and Password are required' });
    }

    try {
        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long' });
        }

        // Check if user is already registered
        const user = await findUser(email);
        if (user) {
            return res.status(400).json({ error: 'User already exists' });
        } else {
            // Hash the password before storing it in the database
            const salt = await bycrypt.genSalt(10);
            const hashedPassword = await bycrypt.hash(password, salt);
            const newUser = await registerUser(name, email, hashedPassword, profilePic); // Save user to database

            // Check if user was created successfully
            if (newUser) {
                setAuthCookies(newUser.id,res); // Set both tokens as cookies in the response
                res.status(201).json({ message: 'User registered successfully', user: newUser });
            } else {
                return res.status(400).json({ error: 'Invalid User Data' }); 
            }
        }

    } catch (error) {
        res.status(500).json({ error: 'Internal Sever Error', details : error.message });
    }
}

// Auth rate limiting: Disallow more than X login attempts (including password recovery, etc.) in a period of Y
export const login = async (req, res) => {

    const {email, password } = req.body;

    // Validate Incoming Data from  SQL injection and XSS attacks
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and Password are required' });
    }

    try {
        // Check if user is already registered
        const user = await findUser(email);
        if (user) {
            // Compare the hashed password with the password entered by the user
            const isMatch = await bycrypt.compare(password, user.password);
            if (isMatch) {
                setAuthCookies(user.id,res);
                res.status(200).json({ message: 'User logged in successfully', user: user });
            } else {
                return res.status(400).json({ error: 'Invalid Email or Password' }); // On login failure, don't let the user know whether the username or password verification failed, just return a common auth error
            }   
        } else {
            return res.status(400).json({ error: 'Invalid Email or Password' });
        }
        
    } catch (error) {
        res.status(500).json({ error: 'Internal Sever Error', details : error.message });
    }

}


// VERIFYYY IS THIS CORRECT TO REMOVE BOTH COOKIES 
export const logout = (req, res) => {

    try {
        // Define the cookie options matching those used during cookie creation
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            path: '/', // Ensure this matches the path used when setting the cookies
            // domain: 'yourdomain.com' // Uncomment and set if a specific domain was used
        };

        // Clear the accessToken and refreshToken cookies
        res.clearCookie('accessToken', cookieOptions);
        res.clearCookie('refreshToken', cookieOptions);

        res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}

// It uses cloudinary to store the profile picture and updates the user's profile picture in the database
export const updateProfile = async (req, res) => {
    try {
        const {profilePic} = req.body;
        const userId = req.user._id

        if (!profilePic) {
            return res.status(400).json({ error: 'Profile Picture is required' });
        }
        const updloadedResponse = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await updateUserProfile(userId, updloadedResponse.secure_url); // Check this

        res.status(200).json({ message: 'Profile Picture updated successfully', user: updatedUser });
     
    } catch (error) {
        res.status(500).json({ error: 'Internal Sever Error', details : error.message });
    }
}



export const refreshAccessToken = (req, res) => {
    const { refreshToken } =  req.cookies;

    if (!refreshToken) {
        return res.status(401).json({error: 'No refresh token provided'})
    }

    try {
        // Verify the refresh token using the refresh secret
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
        
        if (!decoded) {
            return res.status(403).json({ error: 'Forbidden- Invalid Token' });
        }

        // Generate a new access token
        const newAccessToken = generateAccessToken(decoded.userId)

        // Set new access as cookie
        res.cookie('accessToken', newAccessToken, {
            maxAge: 15 * 60 * 1000, // 15 minutes
            httpOnly: true,
            sameSite: 'Strict',
            secure: process.env.NODE_ENV !== 'development',
        })
        res.json({ message: 'Access token refreshed', accessToken: newAccessToken });

    } catch (error) {
        res.status(401).json({ error: 'Invalid refresh token', details: error.message });
    }
}



export const checkAuth = (req, res) => {

    try {
        res.status(200).json({ message: 'User is authenticated', user: req.user });

    } catch (error) {
        res.status(500).json({ error: 'Internal Sever Error', details : error.message });
    }
}