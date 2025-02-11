import { registerUser, findUser } from "../services/auth.service.js";
import bycrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";

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
                generateToken(newUser.id, res);
                res.status(201).json({ message: 'User registered successfully', user: newUser });
            } else {
                return res.status(400).json({ error: 'Invalid User Data' }); 
            }
        }

    } catch (error) {
        res.status(500).json({ error: 'Internal Sever Error', details : error.message });
    }
}

// On login failure, don't let the user know whether the username or password verification failed, just return a common auth error
// On login success, return a JWT token that the client can use to authenticate future requests
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
                generateToken(user.id, res);
                res.status(200).json({ message: 'User logged in successfully', user: user });
            } else {
                return res.status(400).json({ error: 'Invalid Email or Password' });
            }   
        } else {
            return res.status(400).json({ error: 'Invalid Email or Password' });
        }
        
    } catch (error) {
        res.status(500).json({ error: 'Internal Sever Error', details : error.message });
    }

}

export const logout = (req, res) => {

    res.send("Logout route");
}