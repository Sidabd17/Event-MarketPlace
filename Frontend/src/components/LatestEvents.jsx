import React from 'react'
import LatestEventCards from './LatestEventCards';
import useGetAllEvents from '@/hooks/useGetAllEvents';
import { useSelector } from 'react-redux';
import {motion} from 'framer-motion'
import useGetUserSavedEvents from '@/hooks/useGetUserSavedEvents';
const LatestEvents = () => {

  useGetAllEvents();
  useGetUserSavedEvents();

  const {allEvents} = useSelector((state)=>state.event);

  return (
    <div >
    <motion.div 
        initial={{opacity:0, y:-100}}
        animate={{opacity:1, y:0}}
        exit={{opacity:0, y:100}}
        transition={{duration:0.4}}
        className='max-w-7xl mx-auto py-10 flex flex-col '>
        <h1 className='text-2xl font-bold '>Latest Events</h1>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-5 '>
            {
              allEvents.length <= 0 ? <h1>No Events Found</h1> : allEvents.slice(0,3).map((item)=><LatestEventCards key={item._id} event={item}/>)
            }
        </div>
    </motion.div>
    </div>
  )
}

export default LatestEvents