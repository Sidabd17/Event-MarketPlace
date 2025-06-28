import { setMovies } from "@/redux/eventSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Skeleton } from "./ui/skeleton";
import { motion } from "framer-motion";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const LatestMovies = () => {
  const navigate = useNavigate();

  const movies = useSelector((state) => state.event.movies);
  const dispatch = useDispatch();

  // const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);

  // const cityName = useSelector((state) => state.auth.cityName || "Default");

  useEffect(() => {
    if (movies.length > 0) {
      setLoading(false); // ✅ Skip fetching again
      return;
    }
    const fetchMovies = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/tmdb/now-playing`
        );
        const data = res.data;
        dispatch(setMovies(data.results));
        // setMovies(data.results || []);
      } catch (err) {
        console.log(err);
        setError("Failed to load movies.");
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const posterBaseUrl = "https://image.tmdb.org/t/p/w500";

  const closeModal = () => setSelectedMovie(null);

  return (
    <motion.div
     initial={{ opacity: 0, y: -80 }}
     animate={{ opacity: 1, y: 0 }} 
     transition={{ duration: 0.5 }}
    >
      <div className="p-4 max-w-7xl mt-16 mx-auto">
        <h2 className="text-md text-slate-800 dark:text-slate-200 font-semibold letter-spacing mt-4 mb-6">
          HITS FROM PREVIOUS WEEK
        </h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, idx) => (
              <div
                key={idx}
                className="rounded-lg bg-white dark:bg-[#111827] p-2 shadow-md dark:shadow-lg border border-gray-200  dark:border-gray-700 animate-pulse"
              >
                <Skeleton className="w-full h-64 rounded-md" />
                  <div className="space-y-2 mt-3 px-1">
                    <Skeleton className="h-4 w-3/4 rounded" />
                    <Skeleton className="h-3 w-1/2 rounded" />
                  </div>
                </div>
              ))}
            </div>

        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-6 ">
            {movies?.slice(0, 4).map((movie) => (
              <div
                key={movie.id}
                className="border rounded shadow hover:shadow-lg cursor-pointer hover:scale-105 transition-all duration-300"
                onClick={() => navigate(`/movie/description/${movie.id}`)}
              >
                <img
                  src={`${posterBaseUrl}${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-64 object-cover rounded-t"
                />
                <div className="p-2 space-y-1 dark:bg-slate-700 rounded-b-md">
                  <h3 className="font-semibold">{movie.title}</h3>
                  <p className="text-sm text-black-600 font-medium">
                    ⭐⭐⭐ IMDb rating :{" "}
                    {movie.vote_average?.toFixed(1) || "N/A"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedMovie && (
        <MovieBookingModal
          selectedMovie={selectedMovie}
          closeModal={closeModal}
        />
      )}
    </motion.div>
  );
};

export default LatestMovies;
