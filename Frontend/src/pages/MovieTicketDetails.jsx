import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { QRCodeCanvas } from "qrcode.react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const MovieTicketDetails = () => {
  const { ticketId } = useParams();
  const movieTickets = useSelector((state) => state.ticket.userMovieTickets);
  const ticket = movieTickets.find((t) => t._id === ticketId);

  const [posterPath, setPosterPath] = useState("");
  const [loadingPoster, setLoadingPoster] = useState(true);

  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    const fetchPoster = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/movie/${ticket.movieId}?api_key=${TMDB_API_KEY}`
        );
        setPosterPath(res.data.poster_path);
      } catch (err) {
        console.error("❌ Failed to fetch poster:", err.message);
      } finally {
        setLoadingPoster(false);
      }
    };

    if (ticket?.movieId) fetchPoster();
  }, [ticket?.movieId]);

  if (!ticket)
    return <p className="text-center mt-20 text-red-500">❌ Ticket not found</p>;

  const posterURL = posterPath
    ? `https://image.tmdb.org/t/p/w500${posterPath}`
    : "https://via.placeholder.com/500x400?text=Movie+Poster";

  return (
    <div className=" min-h-screen dark:bg-[#0a1216]">
      <Navbar setNavbarHeight={setNavbarHeight} />

      <div style={{ marginTop: `${navbarHeight - 50}px` }}>
        <div className="bg-gradient-to-b from-yellow-100 to-white dark:bg-none h-[50vh]" />
        <div className="max-w-5xl mx-auto -mt-80 px-4 py-12">
          <div className="bg-white dark:bg-[#1a2b45] rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row">

            {/* Movie Poster */}
            <div className="md:w-1/2 p-5 flex items-center justify-center">
              {loadingPoster ? (
                <Skeleton className="w-[470px] h-[350px] rounded-lg bg-gray-300 dark:bg-gray-700" />
              ) : (
                <img
                  src={posterURL}
                  alt={ticket.movieTitle}
                  className="w-[470px] h-[350px] object-cover rounded-lg"
                />
              )}
            </div>

            {/* Ticket Info */}
            <div className="md:w-1/2 p-6 space-y-4 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{ticket.movieTitle}</h2>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-white">
                    📅 Date: {new Date(ticket.date).toLocaleDateString()}
                  </Badge>

                  <Badge className="bg-violet-100 text-violet-800 dark:bg-violet-800 dark:text-white">
                    ⏰ Showtime: {ticket.showtime}
                  </Badge>

                  <Badge className="bg-sky-100 text-sky-800 dark:bg-sky-800 dark:text-white col-span-2">
                    📍 Location: {ticket.location}
                  </Badge>

                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-white col-span-2">
                    🏢 Theater: {ticket.theater}
                  </Badge>
                </div>
              </div>

              <div className="pt-4 space-y-2 flex flex-wrap gap-2 border-t dark:border-gray-500 text-sm">
                <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-700 dark:text-white">
                  🎟️ Tickets: {ticket.totalTickets}
                </Badge>

                <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-700 dark:text-white">
                  ⌚ Booked: {new Date(ticket.bookingTime).toLocaleString()}
                </Badge>

                <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-700 dark:text-white">
                  🎬 Movie ID: {ticket.movieId}
                </Badge>
              </div>

              {/* QR Code */}
              <div className="pt-4  md:text-left">
                <p className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">🔳 QR Code:</p>
                <QRCodeCanvas
                  value={`http://localhost:5173/ticket/${ticket._id}`}
                  size={100}
                  className="border p-1 bg-white rounded shadow"
                />
                <p className="text-xs text-gray-500 mt-1">Scan at entry</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MovieTicketDetails;
