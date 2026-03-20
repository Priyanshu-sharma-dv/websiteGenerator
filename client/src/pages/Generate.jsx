import React from 'react'
import { FiArrowLeft } from 'react-icons/fi';
import {motion} from 'motion/react'
import { useNavigate } from 'react-router-dom';

function Generate() {
  const navigate = useNavigate();
  return (
    <div className='min-h-screen bg-linear-to-br from-[#050505] via-[#0a0a0a] to-[#050505] text-white'>
      <div className="stick top-0 z-40 backdrop-blur-xl bg-black/50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex item-center justify-between">
        <div className="flex items-center gap-4">
          <button className='p-2 rounded-lg hover:bg-white/10  transition'onClick={() =>navigate("/")}><FiArrowLeft size={16}/></button>
          <h1 className='text-lg font-semibold'>Genweb.<span className='text-zinc-500'>Ai</span> </h1>
        </div>
      
      </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <motion.div  initial={{opacity:0, y:30}}
          animate={{opacity:1, y:0}}
          className='text-center mb-16'
          >
         <h1 className='text-4xl md:text-5xl font-bold mb-5 leading-light '>
          Build Website with
          <span className='block bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent '>Real AI Power</span>
         </h1>
         <p className='text-zinc-500 max-w-2xl mx-auto'>
          This process may take several minutes.
          genweb.ai focuses on quality, not shortcuts.
         </p>
        </motion.div>
        <div className="mb-14">
          <h1 className='text-xl font-semibold mb-2 '>Describe your website</h1>
          <div className="relative">
            <textarea 
            name =" "
            id =" "
            placeholder='Describe your website in detail ...'
            className='w-full h-56 p-6 rounded-3xl bg-black/60 border border-white/10 outline-none text-sm leading-relaxed focus:ring-2 focus:ring-white/20'
            >
            </textarea>
          </div>
        </div>
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='px-8 py-4 bg-linear-to-r from-white to-zinc-400 text-black font-semibold rounded-2xl hover:from-white hover:to-zinc-400 transition'
          >
            Generate Website
          </motion.button>
        </div>
      </div>
    </div>
  )
}

export default Generate
