import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authenticate = async (req, res, next) => {
    console.log('Cookies:', req.cookies); // Log to ensure cookies are sent
    const token = req.cookies.token; // Get token from cookies
    
    // If no token is found, send unauthorized response
    if (!token) {
        return res.status(401).json({ message: "Please login to access this resource" });
    }
    
    try {
        // Verify token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if user exists in the database
        const user = await User.findById(decoded.id); // Or decoded._id depending on your token payload
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Attach the user object to the request for further use
        req.user = user;
        next(); // Proceed to the next middleware or route handler

    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(401).json({ message: "Invalid token" }); // Invalid token or verification failed
    }
};
