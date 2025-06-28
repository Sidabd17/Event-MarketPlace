const express = require("express");

const router = express.Router();

const {createMovieBooking, getMyMovieBookings, createMoviePaymentIntent} = require("../Controllers/movie.controller");
const isAuthenticated = require("../middlewares/authmiddleware");

router.route('/create-payment-intent').post(isAuthenticated, createMoviePaymentIntent);
router.route('/book').post(isAuthenticated, createMovieBooking);
router.route('/mybookings').get(isAuthenticated, getMyMovieBookings);

module.exports = router;