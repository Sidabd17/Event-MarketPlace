import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const dummyShowtimes = ["10:00 AM", "1:30 PM", "5:00 PM", "8:30 PM"];

const metroTheaters = {
  Mumbai: ["PVR Juhu", "INOX Ghatkopar", "Cinepolis Andheri"],
  Delhi: ["PVR Saket", "INOX Janakpuri", "Cinepolis Connaught Place"],
  Bengaluru: ["PVR Koramangala", "INOX Garuda Mall", "Cinepolis Whitefield"],
  Hyderabad: ["PVR Kukatpally", "INOX GVK One", "Cinepolis Manjeera"],
  Kolkata: ["PVR Mani Square", "INOX South City", "Cinepolis Acropolis"],
  Chennai: ["PVR Phoenix", "INOX Citi Centre", "Cinepolis Express Avenue"],
  Default: ["PVR Central", "INOX Downtown", "Cinepolis Prime"],
};

const getNextFiveDates = () => {
  const dates = [];
  for (let i = 0; i < 5; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const formatted = date.toISOString().split("T")[0];
    const day = date.toLocaleDateString("en-US", { weekday: "short" });
    const dateNum = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "short" });
    dates.push({ formatted, display: `${day}, ${dateNum} ${month}` });
  }
  return dates;
};

const MovieBookingModal = ({ selectedMovie, closeModal }) => {
  const cityName = useSelector((state) => state.auth.cityName || "Default");
  const theatersForCity = metroTheaters[cityName] || metroTheaters["Default"];
  const navigate = useNavigate();

  const [selectedTheater, setSelectedTheater] = useState("");
  const [selectedShowtime, setSelectedShowtime] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  const toggleSeat = (seatNum) => {
    setSelectedSeats((prev) =>
      prev.includes(seatNum)
        ? prev.filter((s) => s !== seatNum)
        : [...prev, seatNum]
    );
  };

  const confirmBooking = () => {
    if (!selectedDate) return toast.error("📅 Select a date");
    if (!selectedTheater) return toast.error("🏢 Select a theater");
    if (!selectedShowtime) return toast.error("⏰ Select a showtime");
    if (selectedSeats.length === 0)
      return toast.error("💺 Select at least one seat");

    navigate("/movie-checkout", {
      state: {
        movieId: selectedMovie.id,
        movieTitle: selectedMovie.title,
        date: selectedDate,
        theater: selectedTheater,
        showtime: selectedShowtime,
        location: cityName,
        seats: selectedSeats,
        totalTickets: selectedSeats.length,
      },
    });
  };

  const dateOptions = getNextFiveDates();

  return (
    <Dialog open={!!selectedMovie} onOpenChange={closeModal}>
      <DialogContent className="w-3xl w-full sm:max-w-3xl p-6 ">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            🎬 {selectedMovie?.title}
          </DialogTitle>
        </DialogHeader>

        <>
          {/* 📅 Select Date - Card Format */}
          <label className="block mb-1 font-semibold">📅 Select Date:</label>
          <div className="flex flex-wrap gap-3 overflow-x-auto mb-4 no-scrollbar">
            {dateOptions.map((dateObj) => (
              <button
                key={dateObj.formatted}
                onClick={() => setSelectedDate(dateObj.formatted)}
                className={`min-w-[90px] border rounded-md px-3 py-2 text-sm text-center shadow-sm transition-all
                ${
                  selectedDate === dateObj.formatted
                    ? "bg-black text-white border-black dark:bg-gray-500 dark:text-black "
                    : "bg-gray-100 text-gray-800 "
                }`}
              >
                {dateObj.display}
              </button>
            ))}
          </div>

          {/* 🏢 Select Theater */}
          <div className="flex gap-4">
              <label className="block mb-1 font-semibold text-sm sm:text-base">🏢 Select Theater:</label>
          <select
            value={selectedTheater}
            onChange={(e) => setSelectedTheater(e.target.value)}
            className="border px-3 py-2 rounded w-full mb-4 dark:bg-slate-700"
          >
            <option value="">-- Select Theater --</option>
            {theatersForCity.map((theater) => (
              <option key={theater} value={theater}>
                {theater}
              </option>
            ))}
          </select>

          {/* ⏰ Select Showtime */}
          <label className="block font-semibold text-sm sm:text-base">⏰ Select Showtime:</label>
          <select
            value={selectedShowtime}
            onChange={(e) => setSelectedShowtime(e.target.value)}
            className="border px-3 py-2 rounded w-full mb-4 dark:bg-slate-700"
          >
            <option value="">-- Select Showtime --</option>
            {dummyShowtimes.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>


          </div>

          {/* 💺 Select Seats */}
          <label className="block mb-2 font-semibold">💺 Select Seats:</label>
          <div className="grid grid-cols-5 gap-2 mb-4">
            {[...Array(20)].map((_, i) => {
              const seatNum = i + 1;
              const isSelected = selectedSeats.includes(seatNum);
              return (
                <button
                  key={seatNum}
                  onClick={() => toggleSeat(seatNum)}
                  className={`border rounded py-1 px-2 text-sm ${
                    isSelected ? "bg-green-500 text-white" : "bg-gray-200 dark:text-gray-800"
                  }`}
                >
                  {seatNum}
                </button>
              );
            })}
          </div>

          {/* 🎟️ Checkout Button */}
          <button
            onClick={confirmBooking}
            className="w-full bg-black dark:bg-sky-600 text-white py-2 rounded hover:bg-black/80 transition"
          >
            🎟️ Continue to Checkout
          </button>
        </>
      </DialogContent>
    </Dialog>
  );
};

export default MovieBookingModal;
