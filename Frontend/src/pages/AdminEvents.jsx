import EditEventDialog from "@/components/EditEventDialog";
import EventSearchBarDialog from "@/components/EventSearchBarDialog";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";
import { FaMoneyBill } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AdminEventCard from "@/components/AdminEventCard";

const categories = [
  { name: "Concerts", bg: "bg-blue-300", darkbg: "bg-blue-100", text: "text-blue-800" },
  { name: "Meetups", bg: "bg-emerald-200", darkbg: "bg-emerald-100", text: "text-emerald-800" },
  { name: "Comedy Show", bg: "bg-yellow-100", darkbg: "bg-yellow-100", text: "text-yellow-800" },
  { name: "Entertainment", bg: "bg-purple-200", darkbg: "bg-purple-100", text: "text-purple-800" },
  { name: "Matches", bg: "bg-orange-200", darkbg: "bg-orange-100", text: "text-orange-800" },
  { name: "Sports", bg: "bg-red-200", darkbg: "bg-red-100", text: "text-red-800" },
];

const parseEventDateTime = (dateStr, timeStr) => {
  const datePart = dateStr.trim(); // "2025-08-01"
  const timePart = timeStr.trim().toUpperCase(); // "6:00 pm" => "6:00 PM"
  return new Date(`${datePart} ${timePart}`);
};

const AdminEvents = () => {
  const [input, setInput] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [open, setOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // const navigate = useNavigate();
  const events = useSelector((state) => state.event.organizerEvents);
  const [filteredEvents, setFilteredEvents] = useState(events);

  const [navbarHeight, setNavbarHeight] = useState(0);

  const getEventTimestamp = (event) => parseEventDateTime(event.date, event.time).getTime();
  const now = Date.now();

  const liveEvents = filteredEvents.filter(e => {
    const t = getEventTimestamp(e);
    return t <= now && now - t < 2 * 60 * 60 * 1000;
  });
  const upcomingEvents = filteredEvents.filter(e => getEventTimestamp(e) > now);
  const pastEvents = filteredEvents.filter(e => getEventTimestamp(e) < now - 2 * 60 * 60 * 1000);

  // console.log("total filtered events" , liveEvents.length + upcomingEvents.length + pastEvents.length);

  useEffect(() => {
    if (activeCategory.trim() === "") {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(
        events.filter((event) =>
          event.title.toLowerCase().includes(activeCategory.toLowerCase()) ||
          event.category.toLowerCase().includes(activeCategory.toLowerCase()) ||
          event.location.toLowerCase().includes(activeCategory.toLowerCase())
        )
      );
    }
  }, [activeCategory, events]);

  const handleEditClick = (Event) => {
    setSelectedEvent(Event);
    setEditDialogOpen(true);
  };

  return (
    <div className="dark:bg-[#0a1216]">
      <Navbar setNavbarHeight={setNavbarHeight} />
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        transition={{ duration: 0.3 }}
        
        style={{ marginTop: `${navbarHeight - 40}px` }} className="min-h-screen pb-10">
        <div className="bg-gradient-to-b from-cyan-100 to-white dark:bg-none h-[50vh]" />
        <div className="-mt-65 py-5 ">
          <div className="flex items-center justify-center mt-5 px-auto mx-auto max-w-7xl">
            <input
              type="text"
              placeholder="Search by city, event name, or category"
              className="w-[90%] max-w-2xl  px-4 py-3 bg-white placeholder:text-zinc-800 text-black dark:text-white dark:placeholder:text-zinc-700  dark:bg-gray-200 outline-none rounded-md shadow-md"
              onFocus={() => setOpen(true)}
              onChange={(e) => setInput(e.target.value)}
              value={input}
            />
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-6 pt-10">
            {categories.map(({ name, bg, text, darkbg }) => (
              <span
                key={name}
                onClick={() => setActiveCategory(name === activeCategory ? "" : name)}
                className={`px-4 py-2 rounded-full ${bg} ${text} text-sm sm:text-base
                  ${activeCategory === name ? "ring-2 ring-zinc-700 scale-105" : ""}
                  hover:scale-105 font-medium cursor-pointer hover:opacity-90 transition`}
              >
                {name}
              </span>
            ))}
          </div>

          <div className="max-w-5xl mx-auto px-4 py-8 mt-5 gap-6">
            <h2 className="text-2xl font-bold mb-8">Your Events</h2>

            {filteredEvents.length === 0 ? (
              <p className="text-gray-500 ">You haven't created any events yet.</p>
            ) : (
              <>
                {[ 
                  { title: "🔴 Live Events", list: liveEvents },
                  { title: "🟢 Upcoming Events", list: upcomingEvents },
                  { title: "⚪ Past Events", list: pastEvents }
                ].map(({ title, list }) => (
                  <div key={title} className="mb-10 pt-6 border-t border-gray-700 dark:border-gray-200">
                    <h2 className="text-2xl font-bold text-zinc-700 dark:text-white mb-4"> {title}</h2>
                    {
                      list.length === 0 ? (
                        <p className="text-gray-500">No {title.toLowerCase().slice(2, title.length)} found.</p>
                      ) : (
                        <div className="flex justify-center">
                          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-10 mt-4 pb-4">
                            {list.map((event) => (
                              <AdminEventCard key={event?._id} event={event} handleEditClick={handleEditClick} />
                            ))}
                          </div>
                        </div>
                      )
                    }
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </motion.div>

      <Footer />

      {editDialogOpen && (
        <EditEventDialog
          open={editDialogOpen}
          setOpen={setEditDialogOpen}
          eventData={selectedEvent}
        />
      )}

      {open && <EventSearchBarDialog events={events} open={open} setOpen={setOpen} />}
    </div>
  );
};

export default AdminEvents;
