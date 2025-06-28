import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import MovieBookingModal from "@/components/MovieBookingModal";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { useSelector } from "react-redux";
import LoginDialog from "@/components/LoginDialog";
import { motion } from 'framer-motion';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const MovieDescription = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const [loginOpen, setLoginOpen] = useState(false);
  const [navbarHeight, setNavbarHeight] = useState(0);


  const posterBaseUrl = "https://image.tmdb.org/t/p/w500";
  const backdropBaseUrl = "https://image.tmdb.org/t/p/original";

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const movieRes = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US&append_to_response=videos`
        );

        const creditRes = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}&language=en-US`
        );
        setMovie(movieRes.data);
        setCredits(creditRes.data);
      } catch (error) {
        console.error("Failed to fetch movie details:", error);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (!movie || !credits) {
    return (
      <>
        <Navbar setNavbarHeight={setNavbarHeight} />
        <div className="min-h-screen mt-20 px-8 py-10">
          <div className="flex flex-col md:flex-row gap-10 max-w-6xl mx-auto">
            <Skeleton className="w-full md:w-[300px] h-[450px] rounded-xl" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[90%]" />
              <Skeleton className="h-4 w-[80%]" />
              <Skeleton className="h-4 w-[70%]" />
              <Skeleton className="h-10 w-[150px]" />
            </div>
          </div>
        </div>
      </>
    );
  }


  return (
    <div>
      <Navbar setNavbarHeight={setNavbarHeight} />
      <div style={{ marginTop: `${navbarHeight-40}px` }}>
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen mt-18 "
          >
          <div
            className="relative text-white mt-18"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), #000), url(${backdropBaseUrl}${movie.backdrop_path})`,
              backgroundSize: "cover",
              backgroundPosition: "top center",
              backgroundRepeat: "no-repeat",
            }}
        >
          <div className="py-12 px-4 md:px-10 bg-black/40">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10">
              {/* Poster */}
              <img
                src={`${posterBaseUrl}${movie.poster_path}`}
                alt={movie.title}
                className="w-full sm:w-[150px] md:w-[250px] lg:w-[300px]  rounded-xl shadow-xl object-cover"
              />

              {/* Movie Details */}
              <div className="space-y-4">
                <h1 className="text-4xl font-bold">{movie.title}</h1>
                <p className="text-gray-300 italic">{movie.tagline}</p>
                <p className="text-gray-100">{movie.overview}</p>
                <div className="text-sm text-gray-300 space-y-1 pt-2">
                  <p>
                    <strong>Release Date:</strong> {movie.release_date}
                  </p>
                  <p>
                    <strong>Runtime:</strong> {movie.runtime} min
                  </p>
                  <p>
                    <strong>Genres:</strong>{" "}
                    {movie.genres.map((g) => g.name).join(", ")}
                  </p>
                  <p>
                    <strong>Rating:</strong> ⭐ {movie.vote_average.toFixed(1)} /
                    10
                  </p>
                  <p>
                    <strong>Votes:</strong> {movie.vote_count.toLocaleString()}
                  </p>
                </div>
                {
                  user ? (
                    <Button className={'bg-red-600 hover:bg-red-500 text-white font-sans'}
                      onClick={() => setOpen(true)}
                    >Book Now</Button>
                  ) : (
                    <Button className={'bg-red-600 hover:bg-red-500 text-white font-sans'}
                      onClick={() => setLoginOpen(true)}
                    >Login to Book</Button>
                  )
                }
              </div>


            </div>
          </div>
        </div>

        {/* Trailer Section */}
        <div className="mt-8 max-w-6xl mx-auto p-4 rounded-2xl dark:bg-white/10 ">
          <h2 className="text-4xl font-semibold mb-4">Trailer</h2>
          <div className="mt-5 max-w-6xl mx-auto">
            {movie.videos && movie.videos.results.length > 0 ? (
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src={`https://www.youtube.com/embed/${movie.videos.results[0].key}`}
                  title="Movie Trailer"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-[400px] h-[150px] md:h-[250px] rounded-xl shadow-xl"
                ></iframe>
              </div>
            ) : (
              <p className="text-gray-400">No trailer available.</p>
            )}
          </div>
        </div>{/* Trailer Section */}

        <div className="mt-8 max-w-6xl mx-auto bg-gray-300 h-[1px]"></div>

        {/* Cast Section */}
        <div className="mt-8 mb-10 max-w-6xl mx-auto">
          <h2 className="text-4xl font-semibold mb-4">Top Cast</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {credits.cast.slice(0, 10).map((actor, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-sm p-3 rounded-lg flex flex-col items-center hover:scale-105 transition"
              >
                <img
                  src={
                    actor.profile_path
                      ? `${posterBaseUrl}${actor.profile_path}`
                      : "https://via.placeholder.com/100x150?text=No+Image"
                  }
                  alt={actor.name}
                  className="w-[150px] h-[150px] rounded-full object-cover shadow-md"
                />
                <p className="text-sm font-semibold mt-2">{actor.name}</p>
                <p className="text-xs text-gray-500">as {actor.character}</p>
              </div>
            ))}
          </div>
        </div>

        </motion.div>
      </div>

      <Footer />

      {
        open && <MovieBookingModal selectedMovie={movie} closeModal={setOpen} />
      }
      {
        loginOpen && <LoginDialog open={loginOpen} setOpen={setLoginOpen} />
      }
    </div>
  );
};

export default MovieDescription;
