// src/utils/formatHtml.js
export function formatHtml(html) {
    if (!html) return "";

    const voidTags = new Set([
        "area","base","br","col","embed","hr","img",
        "input","link","meta","param","source","track","wbr"
    ]);

    // Step 1: CSS aur JS ko pehle extract karo
    let cssContent = "";
    let jsContent = "";

    html = html.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (_, css) => {
        cssContent = formatCss(css);
        return `<style>\n${cssContent}\n</style>`;
    });

    html = html.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, (_, js) => {
        jsContent = js.trim();
        return `<script>\n${jsContent}\n</script>`;
    });

    // Step 2: Tags ke beech newline daalo
    html = html
        .replace(/>\s*</g, ">\n<")
        .replace(/>\s*([^<\n]+)\s*</g, (_, text) => {
            const t = text.trim();
            return t ? `>${t}<` : "><";
        });

    // Step 3: Indent karo
    let indent = 0;
    const tab = "  ";

    const lines = html.split("\n").map((rawLine) => {
        const line = rawLine.trim();
        if (!line) return "";

        // Closing tag
        if (/^<\//.test(line)) {
            indent = Math.max(0, indent - 1);
        }

        const result = tab.repeat(indent) + line;

        // Opening tag (not self-closing, not void, not doctype)
        const tagMatch = line.match(/^<([a-zA-Z][a-zA-Z0-9]*)/);
        const tagName = tagMatch?.[1]?.toLowerCase();
        const isSelfClosing = line.endsWith("/>") || voidTags.has(tagName);
        const isClosing = line.startsWith("</");
        const isDoctype = line.startsWith("<!");
        const hasInlineClose = line.includes(`</${tagName}>`);

        if (tagName && !isSelfClosing && !isClosing && !isDoctype && !hasInlineClose) {
            indent++;
        }

        return result;
    });

    return lines.filter((l) => l !== "").join("\n");
}

function formatCss(css) {
    return css
        .trim()
        .replace(/\s*{\s*/g, " {\n  ")
        .replace(/;\s*/g, ";\n  ")
        .replace(/\s*}\s*/g, "\n}\n")
        .replace(/,\s*/g, ",\n")
        .trim();
}