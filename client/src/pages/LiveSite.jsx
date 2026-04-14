import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';

function LiveSite() {
    const { id } = useParams();
    const [html, setHtml] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleGetWebsite = async () => {
            try {
                const result = await axios.get(
                    `${import.meta.env.VITE_SERVER_URL}/api/website/get-by-slug/${id}`,
                    { withCredentials: true }
                );
                console.log("LiveSite data:", result.data);
               setHtml(result.data.website.latestCode);
            } catch (error) {
                console.error("Error fetching website:", error);
                setError(error.response?.data?.message || "Failed to load site.");
            } finally {
                setLoading(false);
            }
        };
        handleGetWebsite();
    }, [id]);

    if (loading) return <div className='min-h-screen flex items-center justify-center text-zinc-400'>Loading...</div>
    if (error)   return <div className='min-h-screen flex items-center justify-center text-red-500'>{error}</div>

    return (
        <iframe
            title='Live Site'
            srcDoc={html}
            className='w-screen h-screen border-none'
            sandbox='allow-scripts allow-forms'
        />
    );
}

export default LiveSite;