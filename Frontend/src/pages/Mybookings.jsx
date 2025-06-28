import React, { useState } from "react";
import { useSelector } from "react-redux";
import useGetUserTickets from "@/hooks/useGetUserTickets";
import Navbar from "@/components/Navbar";
import { QRCodeCanvas } from "qrcode.react"; // ← QR Code import
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import useGetUserMovieTickets from "@/hooks/useGetUserMovieTickets";
import { motion } from "framer-motion"; // For animations

const Mybookings = () => {
  useGetUserTickets();
  useGetUserMovieTickets();

  const [navbarHeight, setNavbarHeight] = useState(0);

  const movieTickets = useSelector((state) => state.ticket.userMovieTickets);
  const tickets = useSelector((state) => state.ticket.userTickets);

  const navigate = useNavigate();

  return (
    <div className=" dark:bg-[#0a1216] min-h-screen">
      <Navbar setNavbarHeight={setNavbarHeight} />
      <div style={{ marginTop: `${navbarHeight - 50}px` }} >
        <div className="bg-gradient-to-b from-cyan-100 dark:bg-none to-white h-[50vh]" />
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.4 }}

          className="max-w-5xl -mt-60 min-h-[50vh] mb-10 mx-auto py-4 px-4 relative z-10">
          <h2 className="text-3xl font-bold mb-8">🎫 My Bookings</h2>

          {/* 🍿 Movie Bookings */}
          {movieTickets.length > 0 && (
            <div className="mb-10 bg-gradient-to-b from-yellow-50 to-white border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-md">
              <h3 className="text-xl  dark:text-black font-semibold mb-4">🍿 Movie Tickets</h3>
              <div className="flex flex-col gap-4">
                {movieTickets.map((ticket) => {
                  return (
                    <div
                      key={ticket._id}
                      className="bg-white cursor-pointer dark:bg-slate-500 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-lg hover:scale-102 transition-all duration-300 p-5 flex flex-col sm:flex-row justify-between items-center gap-4"
                      onClick={() => navigate(`/movie/ticket/${ticket._id}`)}
                    >
                      {/* Movie Info */}
                      <div className="flex-1 space-y-1 text-left">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {ticket?.movieTitle}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-col-2 lg:grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-300 mt-3">
                          <Badge className="bg-slate-700 text-slate-100">
                            📍 <span className="font-medium">Location:</span>{" "}
                            {ticket?.location}
                          </Badge>

                          <Badge className="bg-slate-700 text-slate-100">
                            🏢 <span className="font-medium">Theater:</span>{" "}
                            {ticket?.theater}
                          </Badge>

                          <Badge className="bg-sky-700 text-sky-100">
                            📅 <span className="font-medium">Date:</span>{" "}
                            {new Date(ticket?.date).toLocaleDateString()}
                          </Badge>

                          <Badge className="bg-sky-700 text-sky-100">
                            ⏰ <span className="font-medium">Showtime:</span>{" "}
                            {ticket?.showtime}
                          </Badge>

                          <Badge className="bg-zinc-700 text-zinc-100">
                            🎟️ <span className="font-medium">Tickets:</span>{" "}
                            {ticket?.totalTickets}
                          </Badge>

                          <Badge className="bg-yellow-100 text-yellow-700">
                            🕒 <span className="font-medium">Booked on:</span>{" "}
                            {new Date(ticket?.bookingTime).toLocaleDateString()}
                          </Badge>
                        </div>
                      </div>

                      {/* QR Code + Scan Text */}
                      <div className="flex flex-col items-center ">
                        <QRCodeCanvas
                          value={`https://event-market-place.vercel.app/movie/ticket/${ticket?._id}`}
                          size={80}
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-200 mt-2">
                          Scan QR
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tickets.length === 0 ? (
            <p className="text-gray-500 text-center">No tickets booked yet.</p>
          ) : (
            <div className="space-y-6 bg-gradient-to-b from-sky-100 to-gray-100 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-md">
              <h3 className="text-xl dark:text-black font-semibold mb-4">🎟️ Event Tickets</h3>
              {tickets.map((ticket) => {
                const event = ticket.event;
                return (
                  <div
                    key={ticket._id}
                    onClick={() => navigate(`/ticket/${ticket._id}`)}
                    className="relative bg-white dark:bg-slate-600 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md flex flex-col md:flex-row items-center overflow-hidden hover:shadow-lg hover:scale-102 transition-all duration-300 cursor-pointer"
                  >
                    {/* Left colored stripe */}
                    {/* <div
                      className={`w-2 h-full ${ticket.paymentStatus === "paid"
                          ? "bg-green-500"
                          : "bg-red-500"
                        }`}
                    ></div> */}

                    {/* Event Image */}
                    {/* <img
                    src={
                      event.image ||
                      "https://via.placeholder.com/300x200?text=Event"
                    }
                    alt={event.title}
                    className="w-full md:w-56 h-40 object-cover md:rounded-none md:rounded-l-lg"
                  /> */}

                    {/* Event Info */}
                    <div className="flex-1 p-4 md:p-6 text-left space-y-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {event.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {event.description?.slice(0, 80)}...
                      </p>

                      <div className="grid grid-cols-1 md:grid-col-2 lg:grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <Badge className={"bg-slate-700 text-slate-200"}>
                          <span className="font-medium">📅 Date:</span>{" "}
                          {new Date(event.date).toLocaleDateString()}
                        </Badge>

                        <Badge className={"bg-slate-700 text-slate-200"}>
                          <span className="font-medium">⏰ Time:</span>{" "}
                          {event.time}
                        </Badge>

                        <Badge className={"bg-sky-700 text-sky-100"}>
                          <span className="font-medium">📍 Venue:</span>{" "}
                          {event.venue || "TBA"}
                        </Badge>

                        <Badge className={"bg-cyan-700 text-cyan-100"}>
                          <span className="font-medium">🎟️ Tickets:</span>{" "}
                          {ticket.numberOfTickets}
                        </Badge>

                        <Badge className={"bg-gray-700 text-gray-100"}>
                          {ticket.totalPrice > 0 ? (
                            <>
                            <span className="font-medium"> Total:</span> ₹{ticket.totalPrice}
                            </>
                          ):(
                            <span className="font-medium">💰 Free</span> 
                          )
                          }
                          
                        </Badge>

                        {/* <Badge
                          className={
                            ticket.paymentStatus === "paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }
                        >
                          <span className="font-medium">🧾 Payment:</span>{" "}
                          <span className="ml-1">
                            {ticket.paymentStatus.toUpperCase()}
                          </span>
                        </Badge> */}
                      </div>
                    </div>

                    {/* QR Code */}
                    <div className="p-4 flex flex-col items-center">
                      <QRCodeCanvas
                        value={`https://event-market-place.vercel.app/ticket/${ticket._id}`}
                        size={80}
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-200 mt-2">Scan QR</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Mybookings;
