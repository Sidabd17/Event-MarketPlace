import EventCard from '@/components/EventCard';
import useGetUserSavedEvents from '../hooks/useGetUserSavedEvents';
import { useSelector } from 'react-redux';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useState } from 'react';

const SavedEvents = () => {
  useGetUserSavedEvents();
  const [navbarHeight, setNavbarHeight] = useState(0);

  const savedEvents = useSelector((state) => state.event.savedEvents);

  return (
    <div className='dark:bg-[#0a1216]'>
      <Navbar setNavbarHeight={setNavbarHeight} />
      <div style={{ marginTop: `${navbarHeight - 40}px` }}>
        <div className='h-[50vh] bg-gradient-to-b from-yellow-50 to-white dark:bg-none' />
        <div className='-mt-70 mb-10'>
          <h1 className="text-3xl text-center font-bold mb-4 text-gray-800 dark:text-white">Your Saved Events</h1>
          <div className="max-w-7xl mx-auto min-h-[50vh] pt-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {
              savedEvents.length == 0 ? (
                <h1 className="text-2xl text-center font-semibold mb-4 text-gray-800 dark:text-white">No Saved Events Found</h1>
              ) : (
                savedEvents.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))
              )
            }
          
          </div>
        </div>
        <Footer />
      </div>
    </div>

  )

}

export default SavedEvents;