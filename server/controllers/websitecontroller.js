// import { generateResponse } from "../config/openRouter.js";
// import extractJson from "../utils/extractjson.js";
// import Website from "../models/websitemodal.js";
// import User from "../models/usermodel.js";
// import mongoose from "mongoose";

// const masterPrompt = `
// YOU ARE A PRINCIPAL FRONTEND ARCHITECT
// AND A SENIOR UI/UX ENGINEER
// SPECIALIZED IN RESPONSIVE DESIGN SYSTEMS.
// ... (same as before)
// `;

// export const generateWebsite = async (req, res) => {
//     try {
//         const { prompt } = req.body;
//         if (!prompt) return res.status(400).json({ message: "Prompt is required" });

//         const user = await User.findById(req.user.id);
//         if (!user) return res.status(400).json({ message: "User not found" });
//         if (user.credits < 50) return res.status(403).json({ message: "Not enough credits" });

//         const finalPrompt = masterPrompt.replace("{USER_PROMPT}", prompt);
//         let raw = "", parsed = null;

//         for (let i = 0; i < 2 && !parsed; i++) {
//             raw = await generateResponse(finalPrompt);
//             parsed = await extractJson(raw);
//             if (!parsed) {
//                 raw = await generateResponse(finalPrompt + "\n\nRETURN ONLY RAW JSON");
//                 parsed = await extractJson(raw);
//             }
//         }

//         if (!parsed || !parsed.code) {
//             return res.status(500).json({ message: "AI returned invalid response" });
//         }

//         const website = await new Website({
//             user: user._id,
//             title: prompt.slice(0, 60),
//             latestCode: parsed.code,
//             slug: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
//             conversation: [
//                 { role: "user", content: prompt },
//                 { role: "ai", content: parsed.message }
//             ]
//         }).save();

//         user.credits -= 50;
//         await user.save();

//         return res.json({ websiteId: website._id, remainingCredits: user.credits });

//     } catch (error) {
//         console.error("Error generating website:", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
//     // websitecontroller.js — generateWebsite function ke end mein yeh log daalo

// };

// export const getWebsiteById = async (req, res) => {
//     try {
//         const { id } = req.params;

//         // ✅ Bug 1 fix — ObjectId validate karo
//         if (!id || !mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).json({ message: "Invalid website ID" });
//         }

//         const website = await Website.findOne({ _id: id, user: req.user.id });
//         if (!website) return res.status(404).json({ message: "Website not found" });

//         return res.status(200).json({ website });
//     } catch (error) {
//         console.error("Error fetching website:", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// };

// export const changes = async (req, res) => {
//     try {
//         const { prompt } = req.body;
//         if (!prompt) return res.status(400).json({ message: "Prompt is required" });

//         const { id } = req.params;
//         if (!id || !mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).json({ message: "Invalid website ID" });
//         }

//         const website = await Website.findOne({ _id: id, user: req.user._id });
//         if (!website) return res.status(404).json({ message: "Website not found" });

//         const user = await User.findById(req.user._id);
//         if (!user) return res.status(400).json({ message: "User not found" });

//         // ✅ Bug 3 fix — 25 check aur 25 deduct
//         if (user.credits < 25) {
//             return res.status(403).json({ message: "Not enough credits" });
//         }

//         // ✅ Bug 2 fix — existing code AI ko bhejo
//         const updatePrompt = `
// You are editing an existing website. Here is the CURRENT HTML:

// ${website.latestCode}

// USER CHANGE REQUEST: ${prompt}

// Apply ONLY the requested changes. Keep everything else intact.
// Return RAW JSON ONLY:
// {
//   "message": "Short confirmation of what was changed",
//   "code": "<COMPLETE UPDATED HTML DOCUMENT>"
// }`;

//         let raw = "", parsed = null;

//         for (let i = 0; i < 2 && !parsed; i++) {
//             raw = await generateResponse(updatePrompt);
//             parsed = await extractJson(raw);
//             if (!parsed) {
//                 raw = await generateResponse(updatePrompt + "\n\nRETURN ONLY RAW JSON");
//                 parsed = await extractJson(raw);
//             }
//         }

//         if (!parsed || !parsed.code) {
//             return res.status(500).json({ message: "AI returned invalid response" });
//         }

//         // ✅ Bug 5 fix — user pehle, ai baad mein
//         website.conversation.push(
//             { role: "user", content: prompt },
//             { role: "ai", content: parsed.message }
//         );
//         website.latestCode = parsed.code;
//         await website.save();

//         user.credits -= 25;
//         await user.save();

//         return res.json({ message: parsed.message, code: parsed.code, remainingCredits: user.credits });

//     } catch (error) {
//         console.error("Error updating website:", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// };

// export const getAll = async (req, res) => {
//     try {
//         const websites = await Website.find({ user: req.user._id });
//         return res.status(200).json({ websites });
//     } catch (error) {
//         console.error("Error fetching websites:", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// };

// export const deploy = async (req, res) => {
//     try {
//         const { id } = req.params;
//         if (!id || !mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).json({ message: "Invalid website ID" });
//         }

//         const website = await Website.findOne({ _id: id, user: req.user._id });
//         if (!website) return res.status(404).json({ message: "Website not found" });

//         if (!website.slug) {
//             website.slug = website.title.toLowerCase()
//                 .replace(/[^a-z0-9]+/g, '-')
//                 .slice(0, 60) + website._id.toString().slice(-5);
//         }

//         website.deployed = true;
//         website.deployedUrl = `${process.env.FRONTEND_URL}/site/${website.slug}`;
//         await website.save();

//         return res.status(200).json({ deployedUrl: website.deployedUrl });
//     } catch (error) {
//         console.error("Error deploying website:", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// };

// // ✅ Bug 4 fix — deployed sites public hain, auth nahi
// export const getBySlug = async (req, res) => {
//     try {
//         const website = await Website.findOne({ slug: req.params.slug });
//         if (!website) return res.status(404).json({ message: "Website not found" });
//         if (!website.deployed) return res.status(403).json({ message: "Website not deployed yet" });

//         return res.status(200).json({ website });
//     } catch (error) {
//         console.error("Error fetching website by slug:", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// };

import { generateResponse } from "../config/openRouter.js";
import extractJson from "../utils/extractjson.js";
import Website from "../models/websitemodal.js";
import User from "../models/usermodel.js";
import mongoose from "mongoose";
import { masterPrompt } from "../prompts/masterPrompt.js";
import { buildUpdatePrompt } from "../prompts/updatePrompt.js";

function isValidProject(parsed) {
    return (
        parsed &&
        typeof parsed.frontend === "object" &&
        typeof parsed.backend === "object" &&
        Object.keys(parsed.frontend).length > 0 &&
        Object.keys(parsed.backend).length > 0
    );
}

export const generateWebsite = async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ message: "Prompt is required" });

        const user = await User.findById(req.user.id);
        if (!user) return res.status(400).json({ message: "User not found" });
        if (user.credits < 50) return res.status(403).json({ message: "Not enough credits" });

        const finalPrompt = masterPrompt.replace("{USER_PROMPT}", prompt);
        let raw = "", parsed = null;

        for (let i = 0; i < 2 && !isValidProject(parsed); i++) {
            raw = await generateResponse(
                i === 0 ? finalPrompt : finalPrompt + "\n\nRETURN ONLY RAW JSON MATCHING THE EXACT SHAPE SPECIFIED"
            );
            parsed = await extractJson(raw);
        }

        if (!isValidProject(parsed)) {
            return res.status(500).json({ message: "AI returned invalid response" });
        }

        const website = await new Website({
            user: user._id,
            title: prompt.slice(0, 60),
            latestFiles: {
                frontend: parsed.frontend,
                backend: parsed.backend,
            },
            slug: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
            conversation: [
                { role: "user", content: prompt },
                { role: "ai", content: parsed.message }
            ]
        }).save();

        user.credits -= 50;
        await user.save();

        return res.json({ websiteId: website._id, remainingCredits: user.credits });

    } catch (error) {
        console.error("Error generating website:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getWebsiteById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid website ID" });
        }

        const website = await Website.findOne({ _id: id, user: req.user.id });
        if (!website) return res.status(404).json({ message: "Website not found" });

        return res.status(200).json({ website });
    } catch (error) {
        console.error("Error fetching website:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const changes = async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ message: "Prompt is required" });

        const { id } = req.params;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid website ID" });
        }

        const website = await Website.findOne({ _id: id, user: req.user._id });
        if (!website) return res.status(404).json({ message: "Website not found" });

        const user = await User.findById(req.user._id);
        if (!user) return res.status(400).json({ message: "User not found" });

        if (user.credits < 25) {
            return res.status(403).json({ message: "Not enough credits" });
        }

        const existingFiles = {
            frontend: website.latestFiles.frontend,
            backend: website.latestFiles.backend,
        };

        const updatePrompt = buildUpdatePrompt({ existingFiles, changeRequest: prompt });

        let raw = "", parsed = null;

        for (let i = 0; i < 2 && !isValidProject(parsed); i++) {
            raw = await generateResponse(
                i === 0 ? updatePrompt : updatePrompt + "\n\nRETURN ONLY RAW JSON MATCHING THE EXACT SHAPE SPECIFIED"
            );
            parsed = await extractJson(raw);
        }

        if (!isValidProject(parsed)) {
            return res.status(500).json({ message: "AI returned invalid response" });
        }

        website.conversation.push(
            { role: "user", content: prompt },
            { role: "ai", content: parsed.message }
        );
        website.latestFiles = {
            frontend: parsed.frontend,
            backend: parsed.backend,
        };
        await website.save();

        user.credits -= 25;
        await user.save();

        return res.json({
            message: parsed.message,
            files: website.latestFiles,
            remainingCredits: user.credits
        });

    } catch (error) {
        console.error("Error updating website:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getAll = async (req, res) => {
    try {
        const websites = await Website.find({ user: req.user._id });
        return res.status(200).json({ websites });
    } catch (error) {
        console.error("Error fetching websites:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const deploy = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid website ID" });
        }

        const website = await Website.findOne({ _id: id, user: req.user._id });
        if (!website) return res.status(404).json({ message: "Website not found" });

        if (!website.slug) {
            website.slug = website.title.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .slice(0, 60) + website._id.toString().slice(-5);
        }

        website.deployed = true;
        website.deployedUrl = `${process.env.FRONTEND_URL}/site/${website.slug}`;
        await website.save();

        return res.status(200).json({ deployedUrl: website.deployedUrl });
    } catch (error) {
        console.error("Error deploying website:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getBySlug = async (req, res) => {
    try {
        const website = await Website.findOne({ slug: req.params.slug });
        if (!website) return res.status(404).json({ message: "Website not found" });
        if (!website.deployed) return res.status(403).json({ message: "Website not deployed yet" });

        return res.status(200).json({ website });
    } catch (error) {
        console.error("Error fetching website by slug:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};