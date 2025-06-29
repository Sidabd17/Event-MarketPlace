import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import Footer from "../components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LatestEvents from "../components/LatestEvents";
import Features from "../components/Features";
import CTASection from "../components/CTAsection";
import { setCityDetails } from "@/redux/authSlice";
import LatestMovies from "@/components/LatestMovies";

const Home = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // New states for location & city
  const [location, setLocation] = useState({
    lat: null,
    lon: null,
    error: null,
  });

  // const city = useSelector((state) => state.auth.cityName);
  // const [city, setCity] = useState(null);
  const [cityError, setCityError] = useState(null);

  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    if (user?.role === "organizer") navigate("/admin/dashboard");
  }, [user, navigate]);

  // UseEffect to get user location
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({ ...prev, error: "Geolocation not supported" }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // console.log("✅ Location fetched:", position.coords);
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          error: null,
        });
      },
      (error) => {
        setLocation({ lat: null, lon: null, error: error.message });
      }
    );
  }, []);

  // UseEffect to fetch city from OpenStreetMap Nominatim when lat/lon available
  useEffect(() => {
    const fetchCity = async () => {
      if (location.lat && location.lon) {
        try {
          const res = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${location.lat}+${location.lon}&key=${import.meta.env.VITE_OPENCAGE_KEY}`
          );
          const data = await res.json();
          // console.log(data);

          const components = data.results[0]?.components;
          // console.log("components", components);
          dispatch(setCityDetails(components));

        } catch (error) {
          console.log(error);
          setCityError("Failed to fetch city name");
        }
      }
    };

    fetchCity();
  }, [location.lat, location.lon]);

  return (
    <div className="min-h-screen overflow-y-scroll no-scrollbar dark:bg-[#0a1216]">
      <Navbar setNavbarHeight={setNavbarHeight} />
      <div style={{ marginTop: `${navbarHeight-40}px` }} >

        <div className="bg-gradient-to-b from-violet-200 to-white h-[50vh] dark:bg-none" />
        {/* <HeroSection /> */}
        <div className="-mt-80">
          <LatestMovies />

          {/* Pass city as prop to LatestEvents so it can fetch city-based events */}
          <LatestEvents />

          <Features />
          <CTASection />
          <Footer />

        </div>
      </div>
    </div>
  );
};

export default Home;
