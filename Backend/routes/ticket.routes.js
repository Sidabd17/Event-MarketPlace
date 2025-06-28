const express = require('express');
const router = express.Router();
const { createPaymentIntent, bookTicket, getMyTickets} = require('../Controllers/ticket.controller');
const isAuthenticated = require('../middlewares/authmiddleware');

// Protected routes
router.post('/create-payment-intent', isAuthenticated, createPaymentIntent);
router.get('/mytickets', isAuthenticated, getMyTickets);
router.post('/book/:eventId', isAuthenticated, bookTicket);

module.exports = router;