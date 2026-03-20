const extractJson = async (text) => {
    if (!text) return null;

    const cleaned = text
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();

    const firstBraces = cleaned.indexOf('{')
    const closeBraces = cleaned.lastIndexOf('}')  // ✅ lastIndexOf

    if (firstBraces === -1 || closeBraces === -1) return null;

    const jsonString = cleaned.slice(firstBraces, closeBraces + 1)

    try {
        return JSON.parse(jsonString)
    } catch (error) {
        console.error("JSON parse error:", error.message); // ✅ debug ke liye
        return null
    }
}

export default extractJson;