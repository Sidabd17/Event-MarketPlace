import EventCard from '@/components/EventCard';
import EventSearchBarDialog from '@/components/EventSearchBarDialog';
import Footer from '@/components/Footer';
// import LatestEventCards from '@/components/LatestEventCards';
import Navbar from '@/components/Navbar';
import useGetUserSavedEvents from '@/hooks/useGetUserSavedEvents';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import useGetAllEvents from '@/hooks/useGetAllEvents';

const categories = [
  { name: "Concert", bg: "bg-blue-300", darkbg: "bg-blue-100", text: "text-blue-800" },
  { name: "Meetup", bg: "bg-emerald-200", darkbg: "bg-emerald-100", text: "text-emerald-800" },
  { name: "Comedy Show", bg: "bg-yellow-100", darkbg: "bg-yellow-100", text: "text-yellow-800" },
  { name: "Entertainment", bg: "bg-purple-200", darkbg: "bg-purple-100", text: "text-purple-800" },
  { name: "Matches", bg: "bg-orange-200", darkbg: "bg-orange-100", text: "text-orange-800" },
  { name: "Sports", bg: "bg-red-200", darkbg: "bg-red-100", text: "text-red-800" },
];

const Events = () => {

  // const searchedInput = useSelector((state) => state.event.searchInput);
  useGetAllEvents();
  useGetUserSavedEvents();

  const [activeCategory, setActiveCategory] = useState("");
  const [open, setOpen] = useState(false);

  const [navbarHeight, setNavbarHeight] = useState(0);


  const { allEvents } = useSelector((store) => store.event);
  const [filteredEvents, setFilteredEvents] = useState(allEvents);

  function parseEventDateTime(dateStr, timeStr) {
    const cleanDate = dateStr.trim();                     // "2025-08-15"
    const cleanTime = timeStr.trim().toUpperCase();       // "6:00 pm" => "6:00 PM"
    return new Date(`${cleanDate} ${cleanTime}`);
  }

  useEffect(() => {
    if (activeCategory.trim() == "") {
      setFilteredEvents(allEvents);
      return;
    } else {
      setFilteredEvents(
        allEvents.filter((event) => event.title.toLowerCase().includes(activeCategory.toLowerCase()) ||
          event.category.toLowerCase().includes(activeCategory.toLowerCase()) ||
          event.location.toLowerCase().includes(activeCategory.toLowerCase()))
      );
    }
  }, [activeCategory, allEvents]);


  return (
    <div className='flex flex-col dark:bg-[#0a1216]'>
      <Navbar setNavbarHeight={setNavbarHeight} />
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        transition={{ duration: 0.3 }}
        style={{ marginTop: `${navbarHeight - 40}px` }}
        className='min-h-screen pb-10'>

        <div className='bg-gradient-to-b from-blue-100 to-white dark:bg-none h-[50vh]' />
        <div className="flex items-center justify-center -mt-70 pt-10 max-w-7xl mx-auto">
          {/* Search Bar */}
          <div className="flex bg-white dark:bg-zinc-800 rounded-md overflow-hidden w-full max-w-xl shadow-lg">
            <input
              type="text"
              placeholder="Search by city, event name, or category"
              className="w-full px-4 py-3 text-black dark:text-white dark:placeholder:text-zinc-200 placeholder:text-zinc-800 dark:bg-slate-600 outline-none"
              onFocus={() => setOpen(true)}
            />
          </div>
        </div>


        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mt-10">
          {categories.map(({ name, bg, text, darkbg }) => (
            <span
              onClick={() => {
                setActiveCategory(activeCategory === name ? "" : name);
              }}
              key={name}
              className={`px-4 py-2 rounded-full dark:{${darkbg}} ${bg} ${text} 
                       ${activeCategory === name ? "ring-2 ring-zinc-700 dark:ring-3 dark:ring-white scale-105" : ""}
                       hover:scale-105 font-medium cursor-pointer hover:opacity-90 transition`}
            >
              {name}
            </span>
          ))}
        </div>


        <div className='max-w-7xl mx-auto py-5 flex flex-col space-y-12'>
          <div className='flex items-center gap-10'>
            <h1 className='text-4xl font-bold'>
              <span className='text-red-400 dark:text-red-500'>
                {!activeCategory ? "Latest " : `Searched Result for:`}
              </span>{" "}
              {activeCategory || "Events"}
            </h1>
          </div>

          {['Live', 'Upcoming', 'Past'].map((type) => {
            const now = new Date();
            const nowTime = now.getTime();
            const nowDateString = now.toDateString();

            const classifiedEvents = filteredEvents.filter(event => {
              const eventDateTime = parseEventDateTime(event.date, event.time);
              const eventTime = eventDateTime.getTime();
              const diffMin = (eventTime - nowTime) / 60000;

              if (type === 'Live') {
                return eventDateTime.toDateString() === nowDateString && Math.abs(diffMin) <= 120;
              }
              if (type === 'Upcoming') return eventTime > nowTime;
              if (type === 'Past') return eventTime < nowTime;
            });

            return (
              <div key={type} className='border-t border-gray-800 dark:border-gray-700 pt-4'>
                <h2 className="text-3xl font-semibold mb-4">
                  {type === 'Live' ? '🔴 Live Events' :
                    type === 'Upcoming' ? '🟢 Upcoming Events' :
                      '⚪ Past Events'}
                </h2>

                {classifiedEvents?.length > 0 ? (
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {classifiedEvents.map(event => (
                      <EventCard key={event._id} event={event} />
                    ))}
                  </div>
                ) : (
                  <p className='text-gray-500 text-lg italic'>No {type.toLowerCase()} events found.</p>
                )}
              </div>
            );
          })}
        </div>

        {
          open && <EventSearchBarDialog events={allEvents} open={open} setOpen={setOpen} />
        }
      </motion.div>
      <Footer />
    </div>
  )
}

export default Events