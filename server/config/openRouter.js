const openRouterUrl = "https://openrouter.ai/api/v1/chat/completions"
const model = "deepseek/deepseek-chat"

export const generateResponse = async (prompt) => {
    console.log("🤖 Calling OpenRouter API...")
    const res = await fetch(openRouterUrl, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: model,
            max_tokens: 12000,
            messages: [
                { role: 'system', content: "You are a helpful assistant that helps users build websites." },
                { role: 'user', content: prompt },
            ],
            temperature: 0.2
        }),
    });
  console.log("✅ OpenRouter response status:", res.status)
    if (!res.ok) {
        const err = await res.text()
        throw new Error(`OpenRouter API error: ${err}`)
    }

    const data = await res.json();

    if (!data.choices || data.choices.length === 0) {
        throw new Error("No response from AI model");
    }

    return data.choices[0].message.content;
   
}