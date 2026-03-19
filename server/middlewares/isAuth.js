import jwt from "jsonwebtoken";
import User from "../models/usermodel.js";

const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" }); // ✅ 401, not 400
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ message: "Invalid token" });
        }

        const user = await User.findById(decoded.id).select("-__v"); // ✅ fixed typo: -___v → -__v
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default isAuth;