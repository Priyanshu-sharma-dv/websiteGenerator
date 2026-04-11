import React from 'react'
import { useParams } from 'react-router-dom';
import { useEffect,useState} from 'react';
import axios from 'axios';
function LiveSite() {
    const {id} = useParams();
    const [html,setHtml] = useState("");
    const [error, SetError] = useState("");
   useEffect(() =>{
    const handleGetWebsite = async()=>{
        try{
            const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/website/get-by-id/${id}`,
            {withCredentials:true})
            setHtml(result.data.latestCode);
           
        }catch(error){
            console.error("Error fetching website:", error);
            SetError(error.response?.data.message)
        }
    }
    handleGetWebsite();
   },[id])
    if(error) return <div className='min-h-screen flex items-center justify-center text-red-500'>{error}</div>
  return (
    <iframe title='Live Site' srcDoc={html} className='w-screen border-none'sandbox='allow-scripts allow-same-origin allow-forms'/>
  )
}

export default LiveSite
