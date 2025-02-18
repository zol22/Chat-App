import jwt from 'jsonwebtoken';

/* 

- **Storage:** Store access tokens in memory or secure cookies with the `HttpOnly` and `Secure` flags to mitigate security risks.
- **Expiration:** Set short expiration times for access tokens to limit exposure if compromised.
- **Refresh Tokens:** Use refresh tokens to maintain user sessions without requiring frequent re-authentication.
*/

export const generateAccessToken =  (userId) => {   
     // Short-lived, e.g., 15 minutes 
    const token =  jwt.sign({
            userId
        },
        process.env.JWT_SECRET , {
            expiresIn: '15m', 
        }   
    );
    return token;
}


export const generateRefreshToken = (userId) => {
    // Long-lived, e.g., 7 days
    const token =  jwt.sign({
        userId
    },
    process.env.JWT_REFRESH_SECRET , {
        expiresIn: '7d',
    }   
);    
    return token
}