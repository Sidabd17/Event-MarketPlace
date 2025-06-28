// SearchBarDialog.jsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Search } from 'lucide-react'
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';

const SearchBarDialog = ({ open, setOpen }) => {

  const navigate = useNavigate();

  const movies = useSelector((state) => state.event.movies);
  const events = useSelector((state) => state.event.allEvents);

  const [searchedMovies , setSearchedMovies] = useState(movies);
  const [searchedEvents , setSearchedEvents] = useState(events);

  const [input , setInput] = useState('');

  const [activeCategory, setActiveCategory] = useState('All');


  const posterBaseUrl = "https://image.tmdb.org/t/p/w500";

  useEffect(()=>{
    if(input.trim() === ''){
        setSearchedEvents(events);
        setSearchedMovies(movies);
    }
    else{
        const filteredMovies = movies.filter((movie) => movie.title.toLowerCase().includes(input.toLowerCase()));
        const filteredEvents = events.filter((event) => event.title.toLowerCase().includes(input.toLowerCase()));
        setSearchedMovies(filteredMovies);
        setSearchedEvents(filteredEvents);
    }

  },[input])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Search For Movies , Plays or Events</DialogTitle>
        </DialogHeader>
        
        {/* Search Bar */}
        <div className="flex items-center gap-2 rounded-md w-full px-2 py-1 border-1 border-gray-400">
          <Search />
          <input type="text"
           placeholder='Search for events, movies or plays' 
           className='w-full h-full p-2 outline-none cursor-pointer placeholder:text-gray-600'
           value={input}
           onChange={(e) => setInput(e.target.value)} />
        </div>

        <div className='flex flex-wrap sm:flex-row md:flex-row items-center gap-4 font-semibold'>
            <span 
             className={`${activeCategory === 'All' ? 'bg-violet-800 rounded-full text-white' : '' } w-[85px] text-center px-4 py-1`}
             onClick={() => setActiveCategory('All')}
             >All</span>
            <span
             className={`${activeCategory === 'Movies' ? 'bg-cyan-900 rounded-full text-white' : '' } w-[85px] text-center px-4 py-1`}
             onClick={() => setActiveCategory('Movies')}
             >Movies</span>
            <span 
             className={`${activeCategory === 'Events' ? 'bg-emerald-900 rounded-full text-white' : '' } w-[85px] text-center px-4 py-1`}
             onClick={() => setActiveCategory('Events')}
            >Events</span>
        </div>

        <div className='max-h-[400px] overflow-y-auto space-y-4 no-scrollbar'>
            {
                (activeCategory === 'Movies' || activeCategory === 'All')  &&
                (
                   <div className=''>
                <h1>Top Movies for you</h1>
                <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 '>
                    {
                       searchedMovies.length > 0 ? 
                         (searchedMovies?.slice(0,10).map((movie, index)=>{
                            return (
                                <div key={index} className='flex items-center gap-2 cursor-pointer' onClick={()=> {
                                  setOpen(false);
                                  navigate(`/movie/description/${movie.id}`)
                                }}>
                                    <img src={`${posterBaseUrl}${movie.poster_path}`} className='w-14 h-14 rounded-md my-3'/>
                                    <h1 className='text-md font-semibold'>{movie.title}</h1>
                                </div>
                            )
                        })) : (
                        <h1 className='text-center text-xl font-bold mt-3 text-cyan-950 '>No such Movies Found</h1>
                       )
                    }
                </div>
            </div>
                )
                 }
 
            {
                (activeCategory === 'Events' || activeCategory === 'All') &&
                (
                    <div>
                <h1>Top Events for you</h1>
                <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2  '>
                    {
                       searchedEvents.length > 0 ? (
                        searchedEvents?.map((event, index)=>{
                                return (
                                    <div key={index} className='flex items-center gap-2 cursor-pointer'
                                     onClick={()=>{
                                      setOpen(false);
                                      navigate(`/event/description/${event._id}`)
                                     }}>
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
                )
            }
        </div>

      </DialogContent>
    </Dialog>
  )
}

export default SearchBarDialog
