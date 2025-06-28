// SearchBarDialog.jsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Search } from 'lucide-react'
import { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';

const EventSearchBarDialog = ({events, open, setOpen }) => {


  const [searchedEvents , setSearchedEvents] = useState(events);

  const [input , setInput] = useState('');

  const [activeCategory, setActiveCategory] = useState('All');

  const navigate = useNavigate();

 
  const handleSelect = (category) =>{
     setActiveCategory(category);
     setInput(category);
  }

  useEffect(()=>{
    if(input.trim() === ''){
        setSearchedEvents(events);
    }
    else{
        const filteredEvents = events.filter((event) => event.title.toLowerCase().includes(input.toLowerCase()));
        setSearchedEvents(filteredEvents);
    }
  },[input,events]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Search For various Events</DialogTitle>
        </DialogHeader>
        
        {/* Search Bar */}
        <div className="flex items-center gap-2 rounded-md w-full px-2 py-1 border-1 border-gray-400">
          <Search />
          <input type="text"
           placeholder='Search for various Events' 
           className='w-full h-full p-2 outline-none cursor-pointer placeholder:text-gray-600'
           value={input}
           onChange={(e) => setInput(e.target.value)} />
        </div>

        <div className='flex flex-wrap sm:flex-row md:flex-row items-center gap-4 font-semibold'>
            <span 
             className={`${activeCategory === 'All' ? 'bg-violet-900 rounded-full text-white' : '' } w-[85px] text-center px-4 py-1`}
             onClick={() => {setActiveCategory('All'); setInput('')}}
             >All</span>
            <span
             className={`${activeCategory === 'Concert' ? 'bg-cyan-900 rounded-full text-white' : '' } w-[85px] text-center px-4 py-1`}
             onClick={()=>handleSelect('Concert')}
             >Concert</span>
            <span 
             className={`${activeCategory === 'Sports' ? 'bg-emerald-900 rounded-full text-white' : '' } w-[85px] text-center px-4 py-1`}
             onClick={()=>handleSelect('Sports')}
            >Sports</span>
            <span 
             className={`${activeCategory === 'Comedy' ? 'bg-emerald-900 rounded-full text-white' : '' } w-[85px] text-center px-4 py-1`}
             onClick={()=>handleSelect('Comedy')}
            >Comedy</span>
        </div>

        <div className='max-h-[400px] overflow-y-auto space-y-4 no-scrollbar'>   
            <div>
                <h1>Top Events for you</h1>
                <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 '>
                    {
                       searchedEvents.length > 0 ? (
                        searchedEvents?.map((event, index)=>{
                                return (
                                    <div
                                        key={index}
                                        className='flex items-center gap-2 cursor-pointer'
                                        onClick={() => {
                                            setOpen(false);
                                            setTimeout(() => {
                                            navigate(`/event/description/${event._id}`);
                                            }, 100);
                                        }}
                                        >
                                        <img src={event?.image} className='w-14 h-14 rounded-md my-3 object-center object-cover'/>
                                        <h1 className='text-md font-semibold'>{event?.title}</h1>
                                    </div>
                                )
                            })
                       ) : (
                        <h1 className='text-center text-xl font-bold mt-3 text-cyan-950 '>No such Events Found</h1>
                       )
                    }
                </div>
            </div>
            
        </div>

      </DialogContent>
    </Dialog>
  )
}

export default EventSearchBarDialog
