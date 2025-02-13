import jwt from 'jsonwebtoken';

export const generateToken =  (userId, res) => {    
    const token =  jwt.sign({
            userId
        },
        process.env.JWT_SECRET , {
            expiresIn: '7d',
        }   
    );

    // This token is sent to the client as an HTTP-only cookie named jwt in the response.
    res.cookie('jwt', token, { 
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,// prevent XSS attacks cross-site scripting attacks
        sameSite: 'Strict', // CSRF attacks cross-site request forgery attacks
        secure: process.env.NODE_ENV !== 'development'
    
    });   

    /*  Subsequent Requests:
        For future requests to protected routes, the client automatically includes the jwt cookie in the HTTP headers.
        The server extracts and verifies this token to authenticate the user.
    
    */
    return token;

}