import { generateResponse } from "../config/openRouter.js";
import  extractJson  from "../utils/extractjson.js";
export const getCurrentUser = async (req, res) => {
    try {
        res.status(200).json({
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                avatar: req.user.avatar,
                credits: req.user.credits,
                plan: req.user.plan,
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
