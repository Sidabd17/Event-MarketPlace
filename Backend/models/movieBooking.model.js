const mongoose = require("mongoose");

const movieBookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  movieId: {
    type: String, // TMDB ID
    required: true,
  },
  movieTitle: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  showtime: {
    type: String,
    required: true,
  },
  theater: {
    type: String,
    required: true,
  },
  location: {
    type: String, // City
    required: true,
  },
  seats: {
    type: [String], // ["A1", "A2"] or ["1", "2"]
    required: true,
    validate: [(val) => val.length > 0, "Select at least one seat"],
  },
  totalTickets: {
    type: Number,
    required: true,
  },
  bookingTime: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("MovieBooking", movieBookingSchema);
