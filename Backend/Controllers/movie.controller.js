const MovieBooking = require("../models/movieBooking.model");
// controllers/paymentController.js
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createMoviePaymentIntent = async (req, res) => {
  try {
    const { totalTickets } = req.body;

    if (!totalTickets || totalTickets <= 0) {
      return res.status(400).json({ message: "Invalid ticket count" });
    }

    const amount = totalTickets * 150 * 100; // ₹150 per ticket

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "inr",
      metadata: {
        userId: req.id.toString(),
      },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Stripe PaymentIntent Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Create a new movie booking
const createMovieBooking = async (req, res) => {
  try {
    const {
      movieId,
      movieTitle,
      date,
      showtime,
      theater,
      location,
      seats,
      totalTickets,
    } = req.body;

    if (
      !movieId ||
      !movieTitle ||
      !date ||
      !showtime ||
      !theater ||
      !location ||
      !seats ||
      !totalTickets
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newBooking = await MovieBooking.create({
      user: req.id,
      movieId,
      movieTitle,
      date,
      showtime,
      theater,
      location,
      seats,
      totalTickets,
    });

    res.status(201).json({
      booking: newBooking,
      message: "Booking confirmed and saved",
    });
  } catch (error) {
    console.error("Booking Save Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// Get all bookings of the logged-in user
const getMyMovieBookings = async (req, res) => {
  try {
    const bookings = await MovieBooking.find({ user: req.id }).sort({ bookingTime: -1 });
    res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",
      bookings,
    });
  } catch (error) {
    console.error("Fetch Bookings Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  createMoviePaymentIntent,
  createMovieBooking,
  getMyMovieBookings,
};
