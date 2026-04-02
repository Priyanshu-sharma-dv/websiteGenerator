import React from 'react'
import { useEffect} from 'react'
import {useState} from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

function Editor() {
    const {id} = useParams();
    const[website, setWebsite] = useState(null);
    const[error,setError] = useState("");
    useEffect(() => {
        const handleGetWebsite = async () =>{
            try{
                const result  = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/website/get-by-id/${id}`,{withCredentials:true})
                setWebsite(result.data.website);
                
            }catch(error){
                console.log("Full error:", error.response); 
               setError(error.response.data.message);
            }
        }
        handleGetWebsite();
    }, [id]);

    if(error){
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
    
    <div className="h-screen w-screen flex bg-black text-white overflow-hidden">
        <aside>
      <Header/>
      <Chat />
        </aside>
    </div>
    )
    function Header(){
  return (
    <div className="h-14 px-4 flex items-center justify-between border-b border-white/10">
       <span>{website.title}</span> 
    </div>
  )

}
function Chat(){
  return (
    <div className="">

    </div>
  )

}
}


export default Editor

