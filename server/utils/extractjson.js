// const extractJson = async (text) => {
//     if (!text) return null;

//     const cleaned = text
//         .replace(/```json/gi, '')
//         .replace(/```/g, '')
//         .trim();

//     const firstBraces = cleaned.indexOf('{')
//     const closeBraces = cleaned.lastIndexOf('}')  // ✅ lastIndexOf

//     if (firstBraces === -1 || closeBraces === -1) return null;

//     const jsonString = cleaned.slice(firstBraces, closeBraces + 1)

//     try {
//         return JSON.parse(jsonString)
//     } catch (error) {
//         console.error("JSON parse error:", error.message); // ✅ debug ke liye
//         return null
//     }
// }

// export default extractJson;

import { jsonrepair } from "jsonrepair";

const extractJson = async (text) => {
    if (!text) return null;

    let cleaned = text.trim();
    if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```[a-zA-Z]*\n?/, '');
    }
    if (cleaned.endsWith('```')) {
        cleaned = cleaned.replace(/```$/, '');
    }
    cleaned = cleaned.trim();

    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');

    if (firstBrace === -1 || lastBrace === -1) return null;

    const jsonString = cleaned.slice(firstBrace, lastBrace + 1);

    try {
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("JSON parse error, attempting repair:", error.message);
        try {
            const repaired = jsonrepair(jsonString);
            return JSON.parse(repaired);
        } catch (repairError) {
            console.error("JSON repair also failed:", repairError.message);
            return null;
        }
    }
};

export default extractJson;