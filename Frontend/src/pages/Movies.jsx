import Navbar from "@/components/Navbar";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import MovieBookingModal from "@/components/MovieBookingModal";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";


const Movies = () => {
  const movies = useSelector((state) => state.event.movies);
  // const [movies, setMovies] = useState([]);
  const navigate = useNavigate();
  
  const [selectedMovie, setSelectedMovie] = useState(null);

    const [navbarHeight, setNavbarHeight] = useState(0);

  // const cityName = useSelector((state) => state.auth.cityName || "Default");
  const {cityDetails} = useSelector((state) => state.auth);
  const cityName =
    cityDetails?.city ||
    cityDetails?._normalized_city ||
    cityDetails?.town ||
    cityDetails?.village ||
    cityDetails?.county ||
    cityDetails?.state ||
    null;


  const posterBaseUrl = "https://image.tmdb.org/t/p/w500";

  const closeModal = () => setSelectedMovie(null);

  return (
    <div className="dark:bg-[#0a1216]">
      <Navbar setNavbarHeight={setNavbarHeight} />
      <div style={{ marginTop: `${navbarHeight-40}px` }} >
        <div className="bg-gradient-to-b from-cyan-50 to-white dark:bg-none h-[50vh]"/>
        <motion.div
          initial={{ opacity: 0, y: 150 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -150 }}
          transition={{ duration: 0.4 }}
        
          className="p-4 max-w-7xl -mt-70 mb-10 mx-auto relative z-10">
          <h2 className="text-3xl font-semibold mb-6 my-5">
            Now Showing in {cityName}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6  ">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="border rounded-2xl shadow hover:shadow-lg transition cursor-pointer"
                onClick={()=> navigate(`/movie/description/${movie.id}`)}
              >
                <img
                  src={`${posterBaseUrl}${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-64 object-cover rounded-t-2xl"
                />
                <div className="p-2 space-y-1 dark:bg-slate-700 rounded-b-xl">
                  <h3 className="font-semibold">{movie.title}</h3>

                  <p className="text-sm text-black-600 font-medium">
                    ⭐⭐⭐ IMDb rating : {movie.vote_average?.toFixed(1) || "N/A"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
       <Footer />

      {selectedMovie && (
        <MovieBookingModal selectedMovie={selectedMovie} closeModal={closeModal} />
      )}
    </div>
  );
};

export default Movies;
