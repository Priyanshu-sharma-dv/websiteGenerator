// import React, { useEffect, useState } from 'react'
// import { useParams } from 'react-router-dom';
// import axios from 'axios';

// function LiveSite() {
//     const { id } = useParams();
//     const [html, setHtml] = useState("");
//     const [error, setError] = useState("");
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const handleGetWebsite = async () => {
//             try {
//                 const result = await axios.get(
//                     `${import.meta.env.VITE_SERVER_URL}/api/website/get-by-slug/${id}`,
//                     { withCredentials: true }
//                 );
//                 console.log("LiveSite data:", result.data);
//                setHtml(result.data.website.latestCode);
//             } catch (error) {
//                 console.error("Error fetching website:", error);
//                 setError(error.response?.data?.message || "Failed to load site.");
//             } finally {
//                 setLoading(false);
//             }
//         };
//         handleGetWebsite();
//     }, [id]);

//     if (loading) return <div className='min-h-screen flex items-center justify-center text-zinc-400'>Loading...</div>
//     if (error)   return <div className='min-h-screen flex items-center justify-center text-red-500'>{error}</div>

//     return (
//         <iframe
//             title='Live Site'
//             srcDoc={html}
//             className='w-screen h-screen border-none'
//             sandbox='allow-scripts allow-forms'
//         />
//     );
// }

// export default LiveSite;


import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { SandpackProvider, SandpackPreview, SandpackLayout } from '@codesandbox/sandpack-react';

// Vite-shaped generated files ko Sandpack ke classic "react" template (Nodebox-free)
// ke liye convert karta hai — Tailwind CDN se aata hai, koi build step nahi chahiye.
function toPreviewFiles(frontendFiles) {
    if (!frontendFiles) return null;

    let dependencies = { react: "^18.2.0", "react-dom": "^18.2.0" };
    try {
        const pkg = JSON.parse(frontendFiles["package.json"] || "{}");
        if (pkg.dependencies) dependencies = pkg.dependencies;
    } catch {}

    const entry = frontendFiles["src/main.jsx"] || "";
    const indexEntry = entry.replace(/import\s+['"]\.\/index\.css['"];?\n?/, "");

    const preview = {
        "/public/index.html": `<!DOCTYPE html>
<html>
  <head><meta charset="UTF-8" /></head>
  <body>
    <div id="root"></div>
  </body>
</html>`,
        "/src/index.js": indexEntry,
        "/package.json": JSON.stringify({ dependencies }),
    };

    for (const [path, content] of Object.entries(frontendFiles)) {
        if (["src/main.jsx", "src/index.css", "package.json", "index.html"].includes(path)) continue;
        preview[`/${path}`] = content;
    }

    return preview;
}

function LiveSite() {
    const { id } = useParams();
    const [files, setFiles] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleGetWebsite = async () => {
            try {
                const result = await axios.get(
                    `${import.meta.env.VITE_SERVER_URL}/api/website/get-by-slug/${id}`
                );
                setFiles(result.data.website.latestFiles.frontend);
            } catch (error) {
                setError(error.response?.data?.message || "Failed to load site.");
            } finally {
                setLoading(false);
            }
        };
        handleGetWebsite();
    }, [id]);

    if (loading) return <div className='min-h-screen flex items-center justify-center text-zinc-400'>Loading...</div>
    if (error)   return <div className='min-h-screen flex items-center justify-center text-red-500'>{error}</div>

    const previewFiles = toPreviewFiles(files);

    return (
        <SandpackProvider template="react" files={previewFiles} theme="dark">
            <SandpackLayout style={{ height: "100vh" }}>
                <SandpackPreview style={{ height: "100vh" }} showOpenInCodeSandbox={false} showRefreshButton={false} />
            </SandpackLayout>
        </SandpackProvider>
    );
}

export default LiveSite;