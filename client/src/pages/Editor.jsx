import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Rocket, Code2, Monitor, Send,MessageSquare } from 'lucide-react';
import { AnimatePresence } from 'motion/react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react';
import Editor from '@monaco-editor/react'


function WebsiteEditor() {
    const { id } = useParams();
    const [website, setWebsite] = useState(null);
    const [error, setError] = useState("");
    const [code, setCode] = useState("");
    const [messages, setMessages] = useState([]);
    const [prompt, setprompt] = useState('');
    const iframeRef = useRef(null);
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
    ]
    const handleUpdate = async () => {
        if (!prompt) return;
        setUpdateLoading(true);
        const text = prompt
        setprompt("")
        setMessages((m) => [...m, { role: "user", content: text }])
        try {
            const result = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/website/update/${id}`, { prompt:text}, { withCredentials: true })
            console.log(result);
            setUpdateLoading(false);
            setMessages((m) => [...m, { role: "ai", content: result.data.message }])
            setCode(result.data.code)
        } catch (error) {
            setUpdateLoading(false);
            console.error("Error updating website:", error.response?.data);
        }
    }
    useEffect(() => {
        if (!updateLoading) return;
        const i =
            setInterval(() => {
                setThinkingIndex((i) => (i + 1) % thinkingSteps.length);
            }, 2000)
        return () => clearInterval(i)
    }, [updateLoading])
    useEffect(() => {
        const handleGetWebsite = async () => {
            try {
                const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/website/get-by-id/${id}`, { withCredentials: true })
                setWebsite(result.data.website);
                setCode(result.data.website.latestCode);
                setMessages(result.data.website.conversation);
            } catch (error) {
                console.log("Full error:", error.response);
                setError(error.response.data.message);
            }
        }
        handleGetWebsite();
    }, [id]);

    useEffect(() => {
        if (!iframeRef.current || !code) return;
        const blob = new Blob([code], { type: "text/html" })
        const url = URL.createObjectURL(blob);
        iframeRef.current.src = url;
        return () => URL.revokeObjectURL(url);
    }, [code])

    if (error) {
        return (
            <div className='h-screen flex items-center justify-center bg-black text-red-400'>
                {error}
            </div>
        )
    }
    if (!website) {
        return (
            <div className='h-screen flex items-center justify-center bg-black text-red-400'>Loading...</div>
        )
    }
    return (
        <div className="h-screen w-screen flex bg-black text-white overflow-hidden max-w-screen ">
            <aside className='hidden lg:flex w-[380px] min-w-[380px]  flex-col border-r border-white/10 bg-black/80'>
                <Header />
                <>
                    <div className="flex-1 overflow-y-auto py-4 space-y-4">
                        {messages.map((m, i) => (
                            <div key={i}
                                className={`max-w-[85%] ${m.role === "user" ? "ml-auto" : "mr-auto"}`}>
                                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${m.role === "user"
                                    ? "bg-white text-black"
                                    : "bg-white/5 border border-white/10 text-zinc-200"
                                    }`}>{m.content}</div>
                            </div>
                        ))}
                        {updateLoading &&
                            <div className="max-w-[85%] mr-auto">
                                <div className="px-4 py-2 rounded-2xl textr-xs bg-white/5 border border-white/10 text-zinc-400 italic ">{thinkingSteps[thinkingIndex]}
                                </div>
                            </div>}

                    </div>
                    <div className="p-3 border-t border-white/10">
                        <div className="flex gap-2">
                            <input placeholder='Describe Changes...' className='flex-1 resize-none rounded-2xl px-4 py-3 bg-white/5 border border-white/10 text-outline-none' onChange={(e) => setprompt(e.target.value)} value={prompt} />
                            <button className='px-4 py-3 rounded-2xl bg-white text-black ' disabled={updateLoading} onClick={handleUpdate}><Send size={18} /></button>
                        </div>
                    </div>
                </>
            </aside>
            <div className="flex-1 flex flex-col">
                <div className="h-14 px-4 flex justify-between items-center border-b border-white/10 bg-black/80">
                    <span className='text-xs text-zinc-400'>Live Preview</span>
                    <div className="flex gap-2">
                        <button className='flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-sm font-semibold hover:scale-105 transition'>
                            <Rocket size={14} />Deploy
                        </button>
                        <button className='p-2 lg:hidden 'onClick={() =>setShowChat(true)}><MessageSquare size ={18}/></button>
                        <button className='p-2' onClick={() => setShowCode(true)}><Code2 size={18} /></button>
                        <button className='p-2'onClick={() =>setShowFullPreview(true)}><Monitor size={18} /></button>
                    </div>
                </div>
                <iframe ref={iframeRef} className='flex-1 w-full bg-white' />
            </div>
            <AnimatePresence>
                {showChat && (
                    <motion.div
                        initial={{ y : "100%" }} 
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        className="fixed inset-0 z-[9999]  flex flex-col bg-black">
                          <Header onClose = {() =>setShowChat(false)}/>
                          <>
                    <div className="flex-1 overflow-y-auto py-4 space-y-4">
                        {messages.map((m, i) => (
                            <div key={i}
                                className={`max-w-[85%] ${m.role === "user" ? "ml-auto" : "mr-auto"}`}>
                                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${m.role === "user"
                                    ? "bg-white text-black"
                                    : "bg-white/5 border border-white/10 text-zinc-200"
                                    }`}>{m.content}</div>
                            </div>
                        ))}
                        {updateLoading &&
                            <div className="max-w-[85%] mr-auto">
                                <div className="px-4 py-2 rounded-2xl textr-xs bg-white/5 border border-white/10 text-zinc-400 italic ">{thinkingSteps[thinkingIndex]}
                                </div>
                            </div>}

                    </div>
                    <div className="p-3 border-t border-white/10">
                        <div className="flex gap-2">
                            <input placeholder='Describe Changes...' className='flex-1 resize-none rounded-2xl px-4 py-3 bg-white/5 border border-white/10 text-outline-none' onChange={(e) => setprompt(e.target.value)} value={prompt} />
                            <button className='px-4 py-3 rounded-2xl bg-white text-black ' disabled={updateLoading} onClick={handleUpdate}><Send size={18} /></button>
                        </div>
                    </div>
                </>
                        </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {showCode && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        className="fixed inset-y-0 right-0 z-[9999] w-full lg:w-[45%] bg-[#1e1e1e] flex flex-col"
                    >
                        <div className=" h-12 px-4 flex justify-between items-center border-b border-white/10 bg-[#1e1e1e]">
                            <span className=' text-sm font-semibold'>index.html</span>
                            <button className='p-2' onClick={() => setShowCode(false)}>
                                <X size={18} />
                            </button>
                        </div>
                        <Editor
                            theme='vs-dark'
                            language='html'
                            value={code}
                            onChange={(v) => setCode(v)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence
            >
                {showFullPreview && (
                    <motion.div
                        className='fixed inset-0 z-[9999] bg-black'> 
                            <iframe className='w-full h-full bg-white 'srcDoc={code}/>
                            <button className='absolute top-4 right-4 p-2 bg-black/70 rounded-lg'onClick ={() =>setShowFullPreview(false)}><X/></button>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    )

    function Header({onClose}) {
        return (
            <div className="h-14 px-4 flex items-center justify-between border-b border-white/10">
                <span className='font-semibold truncate'>{website.title}</span>
             {onClose && <button className='p-2' onClick={onClose}><X size={18} /></button>}
            </div>
        )
    }


}

export default WebsiteEditor
