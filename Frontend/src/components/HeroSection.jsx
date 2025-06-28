import React, { useState } from 'react'
import { Search, SearchIcon } from 'lucide-react'
import { Button } from './ui/button'
import { useDispatch } from 'react-redux'
import { setSearchInput } from '@/redux/eventSlice'
import { useNavigate } from 'react-router-dom'
import {motion} from 'framer-motion'

const HeroSection = () => {

  const [input, setInput] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearch =()=>{
     dispatch(setSearchInput(input));
     navigate('/events');
  }

  return (
    <motion.div 
     initial={{opacity:0, x:-100}}
     animate={{opacity:1, x:0}}
     exit={{opacity:0, x:100}}
     transition={{duration:0.4}}
     
     className='text-center '>
         <div className="relative h-[60vh] w-full overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm"></div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 text-white z-10">
        <h1 className="text-3xl md:text-6xl dark:text-white text-white font-extrabold mb-4 drop-shadow-lg">
          Discover Events Near You
        </h1>
        <p className="text-lg text-blue-200 md:text-2xl mb-6 max-w-2xl drop-shadow-md">
          Concerts, meetups, fests — find and attend experiences that match your vibe.
        </p>

        {/* Search Bar */}
        <div className="flex bg-white dark:bg-zinc-800 rounded-md overflow-hidden w-full max-w-xl shadow-lg">
          <input
            type="text"
            placeholder="Search by city, event name, or category"
            className="w-full px-4 py-3 text-black dark:text-white dark:placeholder:text-zinc-200 placeholder:text-zinc-800 dark:bg-zinc-600 outline-none"
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
          <button onClick={handleSearch} className="bg-white text-blue-800 px-3 py-3 font-semibold hover:bg-slate-200 transition-all">
            <SearchIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
    </motion.div>
  )
}

export default HeroSection