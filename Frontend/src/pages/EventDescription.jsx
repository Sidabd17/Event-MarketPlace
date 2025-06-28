import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import useGetEventById from "@/hooks/useGetEventById";
import { Bookmark, BookmarkCheck, BookMarked, BookmarkIcon, BookmarkMinus, Calendar, Clock, Loader2, MapPin, Ticket, TicketIcon } from "lucide-react";
import { useState } from "react";
import EditEventDialog from "../components/EditEventDialog";
import { FaMoneyBill } from "react-icons/fa";
// import BookingDialog from "./BookTicketDialog";
import BookTicketDialog from "../components/BookTicketDialog";
import AttendeesTable from "../components/AttendeesTable";
import Footer from "@/components/Footer";
import LoginDialog from "@/components/LoginDialog";
import axios from "axios";
import { toast } from "sonner";
import { setSelectedEvent } from "@/redux/eventSlice";

const EventDescription = () => {
  const dispatch = useDispatch();

  const params = useParams();
  const eventId = params.id;
  useGetEventById(eventId);

  const event = useSelector((store) => store.event.selectedEvent);
  console.log(event?.attendees);

  const [open, setOpen] = useState(false);

  const [LoginDialogOpen, setLoginDialogOpen] = useState(false);

  const [bookDialogOpen, setBookDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [navbarHeight, setNavbarHeight] = useState(0);


  const { user } = useSelector((store) => store.auth);

  let attendees = [];
  if (user?.role === "organizer") {
    attendees = event?.attendees || [];
  }

  const eventPassed = new Date(event?.date) < new Date();

  const eventJoinHandler = async () =>{
    try {
      setLoading(true);
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/v1/event/join/${event?._id}` , {} , {withCredentials: true});

      if(res.data.success){
        toast.success(res.data.message);
        dispatch(setSelectedEvent(res.data.event));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to join event. Please try again.");
    }finally{
      setLoading(false);
    }
  }


  return (
    <div className="min-h-screen py-10">
      <Navbar setNavbarHeight={setNavbarHeight} />

      <div style={{ marginTop: `${navbarHeight - 40}px` }} >
        {/* Background Gradient */}
        <div className=" w-full h-[50vh] bg-gradient-to-b from-yellow-100 to-white dark:from-[#0f1c2f] dark:to-[#06121f]" />
        {/* Main Content Container */}
        <motion.div
          initial={{ opacity: 0, x: 150 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -150 }}
          transition={{ duration: 0.4 }}
          className="max-w-7xl mx-auto -mt-70 mb-10 dark:bg-slate-300 rounded-xl p-4 space-y-8"
        >
          {/* TOP SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-9">
            {/* LEFT: Image */}
            <div className="relative col-span-2  h-[30vh] sm:h-[40vh] md:h-[50vh] lg:h-[60vh] w-[100%] rounded-lg overflow-hidden">
              <img
                src={
                  event?.image ||
                  "https://media.istockphoto.com/id/1806011581/photo/overjoyed-happy-young-people-dancing-jumping-and-singing-during-concert-of-favorite-group.jpg"
                }
                alt="Event"
                className="w-full h-full object-cover"
              />
              {/* Overlay Badges */}
              <div className="absolute top-3 left-3 bg-white text-black px-3 py-1 rounded-md text-xs font-bold shadow">
                <p className="leading-tight text-center">
                  {new Date(event?.date).getDate().toString().padStart(2, "0")}
                  <br />
                  {new Date(event?.date).toLocaleString("default", {
                    month: "short",
                  }).toUpperCase()}
                </p>
              </div>
              <div className="absolute bottom-3 right-3 flex items-center space-x-[-10px]">
                {[...Array(4)].map((_, i) => (
                  <img
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-white"
                    src={`https://i.pravatar.cc/150?img=${i + 1}`}
                    alt="Attendee"
                  />
                ))}
                <span className="ml-2 text-white text-xs font-medium">+1K Going</span>
              </div>
            </div>

            {/* RIGHT: Short Info */}
            <div className="bg-white md:min-h-[80%] lg:h-[70%] dark:bg-slate-100 p-5 border-1  rounded-lg flex flex-col justify-between gap-2">
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-black ">{event?.title} | </h2>
                <p className="text-xl lg:text-2xl font-bold text-black" >{event?.location}</p>
                <Badge className="mt-2 bg-red-900 text-white">{event?.category}</Badge>
              </div>

              <div className="flex items-center gap-3 text-gray-900">
                <BookmarkMinus className="w-5 h-5" />
                <span className="text-lg font-semibold">{event?.category}</span>
              </div>

              <div className="flex items-center gap-3 text-gray-900">
                <Calendar className="w-5 h-5" />
                <span>{new Date(event?.date).toDateString()} | {event?.time}</span>
              </div>

              <div className="flex items-center gap-3 text-gray-900">
                <MapPin className="w-5 h-5" />
                <span>{event?.venue}</span>
              </div>

              <div className="flex items-center gap-3 text-gray-900">
                <TicketIcon className="w-5 h-5" />
                <span>Available Tickets: {event?.availableTickets}</span>
              </div>


              <div className="flex border-t py-2 w-full items-center justify-between">
                <div className="flex flex-col items-center dark:text-gray-800">
                 { event?.price > 0 ? (
                  <>
                    <h1 className="text-sm text-gray-600 font-serif">Starts from</h1>
                  <span className="md:text-lg lg:text-xl font-bold">₹{event?.price}</span>
                  </>
                  ) : ( <h1 className="flex items-center gap-2 text-lg font-bold text-gray-800 font-serif"><FaMoneyBill className="w-5 h-5"/> Free</h1> )}
                </div>
                <div className="flex gap-2 mt-2">
                  {user ? (
                    user?.role === "organizer" ? (
                      <div className="flex flex-wrap justify-center gap-2">
                        <Button
                          onClick={() => setOpen(true)}
                          className="bg-black text-white font-sans"
                          disabled={eventPassed}
                        >
                          Edit Event
                        </Button>
                        <Button className="bg-gray-400 text-black">
                          Delete
                        </Button>
                      </div>
                    ) : (
                      <>
                        {
                          event?.price > 0 ? (
                            <Button
                              onClick={() => setBookDialogOpen(true)}
                              className="bg-black text-white md:w-[80%] md:tracking-normal md:font-semibold lg:w-full font-serif font-bold tracking-wide"
                              disabled={eventPassed}
                            >
                              BOOK NOW
                            </Button>
                          ) : (
                            <Button
                              onClick={eventJoinHandler}
                              className="bg-black text-white md:w-[80%] md:tracking-normal md:font-semibold lg:w-full font-serif font-bold tracking-wide"
                              disabled={eventPassed || (event?.attendees?.some((att)=> att._id === user?._id))}
                            >
                              {loading ? (<Loader2 className="animate-spin mr-2 h-4 w-4"/>)  :  (event?.attendees?.some((att)=> att._id === user?._id) ? "Already Joined" : "JOIN NOW")}
                            </Button>
                          )
                        }
                      </>
                    )
                  ) : (
                    <Button
                      className="bg-gray-500 text-white w-full"
                      onClick={() => setLoginDialogOpen(true)}
                    >
                      Login to Book
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM: Full Description */}
          <div className="mt-6 space-y-4 px-2 md:px-8">
            <h3 className="text-2xl font-bold text-slate-800">About the Event</h3>
            <p className="whitespace-pre-line leading-[2.8rem] text-lg text-gray-700">{event?.description.split('. ').join('.\n')}</p>
          </div>

          <div className="mt-6 space-y-4 px-2 md:px-8">
            <h3 className="text-2xl font-bold text-slate-800">Venue</h3>
            <div className="px-8 py-4 border flex justify-between rounded-lg max-w-[80%]">
              <h2 className="text-xl sm:text-2xl md:text-3xl text-gray-700 font-bold items-center">{event?.venue} {event?.location}</h2>
              <button className={'bg-none px-4 py-2 rounded-lg flex gap-4 font-bold border border-gray-400 text-gray-600'}
                onClick={() => {
                  const encodedLocation = encodeURIComponent(`${event?.venue} ${event?.location}`);
                  const mapsURL = `https://www.google.com/maps/dir/?api=1&destination=${encodedLocation}`;
                  window.open(mapsURL, '_blank');
                }}
              >
                <MapPin />
                Get Direction</button>
            </div>

            <h3 className="text-2xl font-bold text-slate-800">Date & Time</h3>
            <div className="px-8 py-4 border rounded-lg max-w-[70%]">
              <h2 className="text-xl sm:text-2xl md:text-3xl text-gray-700 font-bold items-center">{new Date(event?.date).toDateString()} | {event?.time}</h2>
            </div>
          </div>

          {
            attendees.length > 0 && (
              <div className="mt-6 space-y-4 border rounded-md py-4 px-2 md:px-8">
                <h3 className="text-2xl font-bold text-slate-800">Attendees</h3>
                <AttendeesTable attendees={attendees} />
              </div>
            )
          }


          {/* Dialogs */}
          {open && (
            <EditEventDialog open={open} setOpen={setOpen} eventData={event} />
          )}
          {bookDialogOpen && (
            <BookTicketDialog
              open={bookDialogOpen}
              setOpen={setBookDialogOpen}
              eventData={event}
            />
          )}
          {LoginDialogOpen && (
            <LoginDialog open={LoginDialogOpen} setOpen={setLoginDialogOpen} />
          )}
        </motion.div>
      </div>
      <Footer />
    </div>

  );
};

export default EventDescription;
