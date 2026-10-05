// import React, { useEffect, useState, useRef } from 'react'
// import { useParams } from 'react-router-dom'
// import axios from 'axios'
// import { Rocket, Code2, Monitor, Send, MessageSquare } from 'lucide-react';
// import { AnimatePresence, motion } from 'framer-motion'
// import { X } from 'lucide-react';
// import Editor from '@monaco-editor/react'
// import { formatHtml } from '../utils/formatHtml';

// // ✅ Bug 4 fix — Header bahar nikala
// function Header({ title, onClose }) {
//     return (
//         <div className="h-14 px-4 flex items-center justify-between border-b border-white/10">
//             <span className='font-semibold truncate'>{title}</span>
//             {onClose && (
//                 <button className='p-2' onClick={onClose}>
//                     <X size={18} />
//                 </button>
//             )}
//         </div>
//     )
// }

// // Chat UI — dono jagah same tha, component banaya
// function ChatPanel({ messages, updateLoading, thinkingSteps, thinkingIndex, prompt, setPrompt, handleUpdate }) {
//     const bottomRef = useRef(null);

//     // ✅ Bug 3 fix — auto scroll
//     useEffect(() => {
//         bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, [messages, updateLoading]);

//     return (
//         <>
//             <div className="flex-1 overflow-y-auto py-4 space-y-4 px-3">
//                 {messages.map((m, i) => (
//                     <div key={i} className={`max-w-[85%] ${m.role === "user" ? "ml-auto" : "mr-auto"}`}>
//                         <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${m.role === "user"
//                                 ? "bg-white text-black"
//                                 : "bg-white/5 border border-white/10 text-zinc-200"
//                             }`}>
//                             {m.content}
//                         </div>
//                     </div>
//                 ))}
//                 {updateLoading && (
//                     <div className="max-w-[85%] mr-auto">
//                         <div className="px-4 py-2 rounded-2xl text-xs bg-white/5 border border-white/10 text-zinc-400 italic">
//                             {thinkingSteps[thinkingIndex]}
//                         </div>
//                     </div>
//                 )}
//                 <div ref={bottomRef} />
//             </div>
//             <div className="p-3 border-t border-white/10">
//                 <div className="flex gap-2">
//                     <input
//                         placeholder='Describe changes...'
//                         className='flex-1 rounded-2xl px-4 py-3 bg-white/5 border border-white/10 text-white outline-none'
//                         onChange={(e) => setPrompt(e.target.value)}
//                         value={prompt}
//                         onKeyDown={(e) => e.key === 'Enter' && !updateLoading && handleUpdate()}
//                     />
//                     <button
//                         className='px-4 py-3 rounded-2xl bg-white text-black disabled:opacity-50'
//                         disabled={updateLoading || !prompt.trim()}
//                         onClick={handleUpdate}
//                     >
//                         <Send size={18} />
//                     </button>
//                 </div>
//             </div>
//         </>
//     )
// }

// function WebsiteEditor() {
//     const { id } = useParams();
//     const [website, setWebsite] = useState(null);
//     const [error, setError] = useState("");
//     const [code, setCode] = useState("");
//     const [messages, setMessages] = useState([]);
//     const [prompt, setPrompt] = useState('');
//     const [updateLoading, setUpdateLoading] = useState(false);
//     const [thinkingIndex, setThinkingIndex] = useState(0);
//     const [showCode, setShowCode] = useState(false);
//     const [showFullPreview, setShowFullPreview] = useState(false);
//     const [showChat, setShowChat] = useState(false);

//     const thinkingSteps = [
//         "Understanding your request...",
//         "Planning layout changes...",
//         "Improving responsiveness...",
//         "Applying animations...",
//         "Finalizing update...",
//     ];

//     // Fetch website on load
//     useEffect(() => {
//         if (!id || id === 'undefined') {
//             setError("Invalid website ID. Please go back and try again.");
//             return;
//         }
//         const fetchWebsite = async () => {
//             try {
//                 const result = await axios.get(
//                     `${import.meta.env.VITE_SERVER_URL}/api/website/get-by-id/${id}`,
//                     { withCredentials: true }
//                 );
//                 setWebsite(result.data.website);
//                 setCode(formatHtml(result.data.website.latestCode));
//                 setMessages(result.data.website.conversation || []);
//             } catch (err) {
//                 setError(err.response?.data?.message || "Failed to load website.");
//                 console.log("Full error:", err.response);
//             }
//         };
//         fetchWebsite();
//     }, [id]);

//     // Thinking animation
//     useEffect(() => {
//         if (!updateLoading) return;
//         const interval = setInterval(() => {
//             setThinkingIndex((i) => (i + 1) % thinkingSteps.length);
//         }, 2000);
//         return () => clearInterval(interval);
//     }, [updateLoading]);

//     const handleUpdate = async () => {
//         if (!prompt.trim() || updateLoading) return;
//         const text = prompt;
//         setPrompt("");
//         setUpdateLoading(true);
//         setMessages((m) => [...m, { role: "user", content: text }]);
//         try {
//             const result = await axios.post(
//                 `${import.meta.env.VITE_SERVER_URL}/api/website/update/${id}`,
//                 { prompt: text },
//                 { withCredentials: true }
//             );
//             setMessages((m) => [...m, { role: "ai", content: result.data.message }]);
//             setCode(formatHtml(result.data.code));
//         } catch (err) {
//             setMessages((m) => [...m, { role: "ai", content: "Failed to update. Please try again." }]);
//             console.error("Error updating:", err.response?.data);
//         } finally {
//             setUpdateLoading(false);
//         }
//     };

//     // ✅ Bug 2 fix — POST method + correct field name
//     const handleDeploy = async () => {
//         try {
//             const result = await axios.post(
//                 `${import.meta.env.VITE_SERVER_URL}/api/website/deploy/${website._id}`,
//                 {},
//                 { withCredentials: true }
//             );
//             window.open(result.data.deployedUrl, "_blank");
//         } catch (err) {
//             console.error("Error deploying website:", err.response?.data);
//         }
//     };

//     if (error) {
//         return (
//             <div className='h-screen flex items-center justify-center bg-black text-red-400'>
//                 {error}
//             </div>
//         );
//     }

//     if (!website) {
//         return (
//             <div className='h-screen flex items-center justify-center bg-black text-white'>
//                 Loading...
//             </div>
//         );
//     }

//     const chatProps = { messages, updateLoading, thinkingSteps, thinkingIndex, prompt, setPrompt, handleUpdate };

//     return (
//         <div className="h-screen w-screen flex bg-black text-white overflow-hidden">

//             {/* Desktop Sidebar */}
//             <aside className='hidden lg:flex w-[380px] min-w-[380px] flex-col border-r border-white/10 bg-black/80'>
//                 <Header title={website.title} />
//                 <ChatPanel {...chatProps} />
//             </aside>

//             {/* Main Preview Area */}
//             <div className="flex-1 flex flex-col">
//                 <div className="h-14 px-4 flex justify-between items-center border-b border-white/10 bg-black/80">
//                     <span className='text-xs text-zinc-400'>Live Preview</span>
//                     <div className="flex gap-2">
//                         {!website.deployed && (
//                             <button
//                                 className='flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-sm font-semibold hover:scale-105 transition'
//                                 onClick={handleDeploy}
//                             >
//                                 <Rocket size={14} /> Deploy
//                             </button>
//                         )}
//                         <button className='p-2 lg:hidden' onClick={() => setShowChat(true)}>
//                             <MessageSquare size={18} />
//                         </button>
//                         <button className='p-2' onClick={() => setShowCode(true)}>
//                             <Code2 size={18} />
//                         </button>
//                         <button className='p-2' onClick={() => setShowFullPreview(true)}>
//                             <Monitor size={18} />
//                         </button>
//                     </div>
//                 </div>

//                 {/* ✅ Bug 1 fix — srcdoc use karo, blob nahi */}
//                 <iframe
//                     srcDoc={code}
//                     className='flex-1 w-full bg-white'
//                     sandbox='allow-scripts allow-same-origin allow-forms'
//                     title="Website Preview"
//                 />
//             </div>

//             {/* Mobile Chat Drawer */}
//             <AnimatePresence>
//                 {showChat && (
//                     <motion.div
//                         initial={{ y: "100%" }}
//                         animate={{ y: 0 }}
//                         exit={{ y: "100%" }}
//                         className="fixed inset-0 z-[9999] flex flex-col bg-black"
//                     >
//                         <Header title={website.title} onClose={() => setShowChat(false)} />
//                         <ChatPanel {...chatProps} />
//                     </motion.div>
//                 )}
//             </AnimatePresence>

//             {/* Code Editor Drawer */}
//             <AnimatePresence>
//                 {showCode && (
//                     <motion.div
//                         initial={{ x: "100%" }}
//                         animate={{ x: 0 }}
//                         exit={{ x: "100%" }}
//                         className="fixed inset-y-0 right-0 z-[9999] w-full lg:w-[45%] bg-[#1e1e1e] flex flex-col"
//                     >
//                         <div className="h-12 px-4 flex justify-between items-center border-b border-white/10">
//                             <span className='text-sm font-semibold text-white'>index.html</span>
//                             <button className='p-2 text-white' onClick={() => setShowCode(false)}>
//                                 <X size={18} />
//                             </button>
//                         </div>
//                         <Editor
//                             theme='vs-dark'
//                             language='html'
//                             value={code}
//                             onChange={(v) => setCode(v || "")}
//                             options={{
//                                 wordWrap: "on",
//                                 minimap: { enabled: false },
//                                 fontSize: 13,
//                                 lineNumbers: "on",
//                                 scrollBeyondLastLine: false,
//                                 automaticLayout: true,
//                             }}
//                         />
//                     </motion.div>
//                 )}
//             </AnimatePresence>

//             {/* Full Preview Modal */}
//             <AnimatePresence>
//                 {showFullPreview && (
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                         className='fixed inset-0 z-[9999] bg-black'
//                     >
//                         <iframe
//                             className='w-full h-full bg-white'
//                             srcDoc={code}
//                             sandbox='allow-scripts allow-same-origin allow-forms'
//                             title="Full Preview"
//                         />
//                         <button
//                             className='absolute top-4 right-4 p-2 bg-black/70 rounded-lg text-white'
//                             onClick={() => setShowFullPreview(false)}
//                         >
//                             <X size={18} />
//                         </button>
//                     </motion.div>
//                 )}
//             </AnimatePresence>
//         </div>
//     );
// }

// export default WebsiteEditor



import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Rocket, Code2, Monitor, Send, MessageSquare, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion'
import {
    SandpackProvider,
    SandpackPreview,
    SandpackCodeEditor,
    SandpackFileExplorer,
    SandpackLayout,
} from '@codesandbox/sandpack-react';

function Header({ title, onClose }) {
    return (
        <div className="h-14 px-4 flex items-center justify-between border-b border-white/10">
            <span className='font-semibold truncate'>{title}</span>
            {onClose && (
                <button className='p-2' onClick={onClose}>
                    <X size={18} />
                </button>
            )}
        </div>
    )
}

function ChatPanel({ messages, updateLoading, thinkingSteps, thinkingIndex, prompt, setPrompt, handleUpdate }) {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, updateLoading]);

    return (
        <>
            <div className="flex-1 overflow-y-auto py-4 space-y-4 px-3">
                {messages.map((m, i) => (
                    <div key={i} className={`max-w-[85%] ${m.role === "user" ? "ml-auto" : "mr-auto"}`}>
                        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${m.role === "user"
                                ? "bg-white text-black"
                                : "bg-white/5 border border-white/10 text-zinc-200"
                            }`}>
                            {m.content}
                        </div>
                    </div>
                ))}
                {updateLoading && (
                    <div className="max-w-[85%] mr-auto">
                        <div className="px-4 py-2 rounded-2xl text-xs bg-white/5 border border-white/10 text-zinc-400 italic">
                            {thinkingSteps[thinkingIndex]}
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>
            <div className="p-3 border-t border-white/10">
                <div className="flex gap-2">
                    <input
                        placeholder='Describe changes...'
                        className='flex-1 rounded-2xl px-4 py-3 bg-white/5 border border-white/10 text-white outline-none'
                        onChange={(e) => setPrompt(e.target.value)}
                        value={prompt}
                        onKeyDown={(e) => e.key === 'Enter' && !updateLoading && handleUpdate()}
                    />
                    <button
                        className='px-4 py-3 rounded-2xl bg-white text-black disabled:opacity-50'
                        disabled={updateLoading || !prompt.trim()}
                        onClick={handleUpdate}
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </>
    )
}

// Vite-shaped generated files ko Sandpack ke classic "react" template (Nodebox-free)
// ke liye convert karta hai — Tailwind externalResources se aata hai, koi build step nahi chahiye.
function toPreviewFiles(frontendFiles) {
    if (!frontendFiles) return null;

    let dependencies = { react: "^18.2.0", "react-dom": "^18.2.0" };
    try {
        const pkg = JSON.parse(frontendFiles["package.json"] || "{}");
        if (pkg.dependencies) dependencies = pkg.dependencies;
    } catch {
        // parse fail ho to default deps hi use ho jayenge
    }

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

function WebsiteEditor() {
    const { id } = useParams();
    const [website, setWebsite] = useState(null);
    const [error, setError] = useState("");
    const [files, setFiles] = useState(null); // { frontend: {...}, backend: {...} }
    const [messages, setMessages] = useState([]);
    const [prompt, setPrompt] = useState('');
    const [updateLoading, setUpdateLoading] = useState(false);
    const [thinkingIndex, setThinkingIndex] = useState(0);
    const [showCode, setShowCode] = useState(false);
    const [showFullPreview, setShowFullPreview] = useState(false);
    const [showChat, setShowChat] = useState(false);

    const thinkingSteps = [
        "Understanding your request...",
        "Planning layout changes...",
        "Improving responsiveness...",
        "Applying animations...",
        "Finalizing update...",
    ];

    useEffect(() => {
        if (!id || id === 'undefined') {
            setError("Invalid website ID. Please go back and try again.");
            return;
        }
        const fetchWebsite = async () => {
            try {
                const result = await axios.get(
                    `${import.meta.env.VITE_SERVER_URL}/api/website/get-by-id/${id}`,
                    { withCredentials: true }
                );
                setWebsite(result.data.website);
                setFiles(result.data.website.latestFiles);
                setMessages(result.data.website.conversation || []);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load website.");
            }
        };
        fetchWebsite();
    }, [id]);

    useEffect(() => {
        if (!updateLoading) return;
        const interval = setInterval(() => {
            setThinkingIndex((i) => (i + 1) % thinkingSteps.length);
        }, 2000);
        return () => clearInterval(interval);
    }, [updateLoading]);

    const handleUpdate = async () => {
        if (!prompt.trim() || updateLoading) return;
        const text = prompt;
        setPrompt("");
        setUpdateLoading(true);
        setMessages((m) => [...m, { role: "user", content: text }]);
        try {
            const result = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/api/website/update/${id}`,
                { prompt: text },
                { withCredentials: true }
            );
            setMessages((m) => [...m, { role: "ai", content: result.data.message }]);
            setFiles(result.data.files); // { frontend, backend }
        } catch (err) {
            setMessages((m) => [...m, { role: "ai", content: "Failed to update. Please try again." }]);
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleDeploy = async () => {
        try {
            const result = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/api/website/deploy/${website._id}`,
                {},
                { withCredentials: true }
            );
            window.open(result.data.deployedUrl, "_blank");
        } catch (err) {
            console.error("Error deploying website:", err.response?.data);
        }
    };

    if (error) {
        return <div className='h-screen flex items-center justify-center bg-black text-red-400'>{error}</div>;
    }

    if (!website || !files) {
        return <div className='h-screen flex items-center justify-center bg-black text-white'>Loading...</div>;
    }

    const chatProps = { messages, updateLoading, thinkingSteps, thinkingIndex, prompt, setPrompt, handleUpdate };
    const previewFiles = toPreviewFiles(files.frontend);

    return (
        <SandpackProvider
            template="react"
            files={previewFiles}
            theme="dark"
            options={{ externalResources: ["https://cdn.tailwindcss.com"] }}
        >
            <div className="h-screen w-screen flex bg-black text-white overflow-hidden">
                <aside className='hidden lg:flex w-[380px] min-w-[380px] flex-col border-r border-white/10 bg-black/80'>
                    <Header title={website.title} />
                    <ChatPanel {...chatProps} />
                </aside>

                <div className="flex-1 flex flex-col">
                    <div className="h-14 px-4 flex justify-between items-center border-b border-white/10 bg-black/80">
                        <span className='text-xs text-zinc-400'>Live Preview</span>
                        <div className="flex gap-2">
                            {!website.deployed && (
                                <button
                                    className='flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-sm font-semibold hover:scale-105 transition'
                                    onClick={handleDeploy}
                                >
                                    <Rocket size={14} /> Deploy
                                </button>
                            )}
                            <button className='p-2 lg:hidden' onClick={() => setShowChat(true)}>
                                <MessageSquare size={18} />
                            </button>
                            <button className='p-2' onClick={() => setShowCode(true)}>
                                <Code2 size={18} />
                            </button>
                            <button className='p-2' onClick={() => setShowFullPreview(true)}>
                                <Monitor size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1">
                        <SandpackLayout style={{ height: "100%" }}>
                            <SandpackPreview style={{ height: "100%" }} showOpenInCodeSandbox={false} />
                        </SandpackLayout>
                    </div>
                </div>

                <AnimatePresence>
                    {showChat && (
                        <motion.div
                            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                            className="fixed inset-0 z-[9999] flex flex-col bg-black"
                        >
                            <Header title={website.title} onClose={() => setShowChat(false)} />
                            <ChatPanel {...chatProps} />
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {showCode && (
                        <motion.div
                            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                            className="fixed inset-y-0 right-0 z-[9999] w-full lg:w-[55%] bg-[#1e1e1e] flex flex-col"
                        >
                            <div className="h-12 px-4 flex justify-between items-center border-b border-white/10">
                                <span className='text-sm font-semibold text-white'>Project files</span>
                                <button className='p-2 text-white' onClick={() => setShowCode(false)}>
                                    <X size={18} />
                                </button>
                            </div>
                            <SandpackLayout style={{ height: "100%" }}>
                                <SandpackFileExplorer style={{ height: "100%" }} />
                                <SandpackCodeEditor style={{ height: "100%" }} showLineNumbers showTabs wrapContent />
                            </SandpackLayout>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {showFullPreview && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className='fixed inset-0 z-[9999] bg-black'
                        >
                            <SandpackLayout style={{ height: "100%" }}>
                                <SandpackPreview style={{ height: "100%" }} showOpenInCodeSandbox={false} />
                            </SandpackLayout>
                            <button
                                className='absolute top-4 right-4 p-2 bg-black/70 rounded-lg text-white'
                                onClick={() => setShowFullPreview(false)}
                            >
                                <X size={18} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </SandpackProvider>
    );
}

export default WebsiteEditor