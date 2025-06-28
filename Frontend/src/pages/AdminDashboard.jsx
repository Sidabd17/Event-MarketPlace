import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useGetOrganizerEvents from "@/hooks/useGetOrganizerEvents";
import EditEventDialog from "@/components/EditEventDialog";
import { FaMoneyBill } from "react-icons/fa";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import StatsCard from "@/components/StatsCard";

const AdminDashboard = () => {
  const user = useSelector((state) => state.auth.user);

  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [navbarHeight, setNavbarHeight] = useState(0);

  useGetOrganizerEvents();
  const navigate = useNavigate();

  const events = useSelector((state) => state.event.organizerEvents);
  // console.log("Organizer Events:", events);

  const now = new Date();

  const totalEvents = events?.length;
  const upcoming = events?.filter((e) => new Date(e.date) > now).length;
  const past = events?.filter((e) => new Date(e.date) <= now).length;

  const handleEditClick = (Event) => {
    setSelectedEvent(Event);
    setOpen(true);
  }


  return (
    <div 
      className="min-h-screen dark:bg-[#0a1216]">
      <Navbar setNavbarHeight={setNavbarHeight} />
      <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4 }} 
         style={{ marginTop: `${navbarHeight - 40}px` }} className="min-h-screen">
        <div className="bg-gradient-to-b from-violet-200 to-white dark:bg-none h-[50vh]" />
        <div className="max-w-7xl -mt-70 mx-auto px-4 py-8">
          {/* Welcome */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name} 👋
            </h1>
            <p className=" text-slate-800 dark:text-slate-200">
              Here's a quick overview of your event activity.
            </p>
          </div>

          {/* Stats Cards */}
          <StatsCard totalEvents={totalEvents} upcoming={upcoming} past={past}/>

          {/* Create Button */}
          <div className="mb-6 text-right">
            <Button
              onClick={() => navigate("/admin/events/create")}
              className="bg-black text-white font-bold py-2 px-4 rounded-md shadow-md hover:scale-105 transition
                       dark:bg-gradient-to-r dark:from-cyan-200 dark:to-blue-300 dark:text-slate-800"
            >
              + Create New Event
            </Button>
          </div>

          {/* Event Table */}
          <Card
            className={
              "text-black bg-gradient-to-b from-yellow-100 to-yellow-50 dark:from-[#0f1c2f] dark:to-[#06121f] p-4 rounded-md shadow-lg overflow-hidden  dark:bg-transparent border-2 border-gray-200 dark:border-gray-700"
            }
          >
            <CardHeader>
              <CardTitle className="text-2xl text-black dark:text-gray-200">Your latest created events</CardTitle>
            </CardHeader>
            <CardContent>
              {events.length === 0 ? (
                <p className="text-muted-foreground">
                  You haven’t created any events yet.
                </p>
              ) : (
                <div className="flex justify-center items-center px-4">
                  <div className="flex flex-wrap justify-center gap-6 w-full max-w-7xl">
                    {events.slice(0, 3).map((event) => {
                      const eventDate = new Date(event.date);
                      const status = eventDate > Date.now() ? "Upcoming" : "Past";
                      return (
                        <div
                          key={event._id}
                          className="w-full sm:w-[90%] md:w-[48%] lg:w-[31%] p-3 bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden transition hover:scale-[1.02] cursor-pointer"
                          onClick={() => navigate(`/event/description/${event._id}`)}
                        >
                          {/* Image Section */}
                          <div
                            className="relative aspect-[16/10] bg-cover bg-center rounded-lg"
                            style={{
                              backgroundImage: `url(${event.image || "https://via.placeholder.com/300x200"})`
                            }}
                          >
                            {/* Date Badge */}
                            <div className="absolute top-3 left-3 bg-slate-300 px-3 py-1 rounded-md text-center shadow text-xs font-bold">
                              <p className="text-black leading-tight">
                                {new Date(event.date).getDate().toString().padStart(2, '0')}
                                <br />
                                {new Date(event.date).toLocaleString('default', { month: 'short' }).toUpperCase()}
                              </p>
                            </div>

                            {/* Heart Icon */}
                            <div className="absolute top-3 right-3">
                              <button className="bg-white p-1 rounded-full shadow-md">
                                <svg
                                  className="w-5 h-5 text-red-500"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                                </svg>
                              </button>
                            </div>

                            {/* Avatars */}
                            <div className="absolute bottom-3 left-3 flex items-center space-x-[-8px]">
                              {[...Array(4)].map((_, i) => (
                                <img
                                  key={i}
                                  className="w-6 h-6 rounded-full border-2 border-white"
                                  src={`https://i.pravatar.cc/150?img=${i + 1}`}
                                  alt="Attendee"
                                />
                              ))}
                              <span className="ml-2 text-white text-xs font-medium">+1K Going</span>
                            </div>
                          </div>

                          {/* Content Section */}
                          <div className="pt-2 flex flex-col gap-2">
                            <div className="flex gap-4 items-center flex-wrap">
                              <span className="text-sm font-medium bg-cyan-200 text-slate-900 px-2 py-1 rounded">
                                {event.category || "Category"}
                              </span>
                              <span className={`text-sm font-medium px-2 py-1 rounded ${status === "Upcoming" ? "bg-green-300" : "bg-red-400"}`}>
                                {status}
                              </span>
                            </div>

                            <h3 className="text-lg sm:text-xl font-bold text-gray-900">{event.title}</h3>

                            <div className="flex gap-2 items-center text-sm text-gray-700">
                              <FaMoneyBill className="w-4 h-4 text-black font-bold" />
                              {event.price > 0 ? `From ₹${event.price}` : "Free"}
                            </div>

                            <p className="text-xs text-gray-500">
                              By <strong>{event.organizer?.name || "Your Org"}</strong>
                            </p>

                            <div className="flex gap-2 mt-3">
                              <Button
                                className="bg-slate-800 w-1/2 text-white font-medium hover:bg-slate-700 rounded-sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditClick(event);
                                }}
                                disabled={new Date(event?.date) < new Date()}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                className="bg-gray-200 w-1/2 text-black font-medium rounded-sm"
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
      <Footer />
      {
        open && (
          <EditEventDialog open={open} setOpen={setOpen} eventData={selectedEvent} />
        )
      }
    </div>
  );
};

export default AdminDashboard;


