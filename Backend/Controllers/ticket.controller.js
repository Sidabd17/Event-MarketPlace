const Stripe = require("stripe");
const Ticket = require("../models/ticket.model");
const Event = require("../models/event.model");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // env me rakho

// 1. Create Payment Intent
const createPaymentIntent = async (req, res) => {
    try {
        const { totalPrice } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(totalPrice * 100), 
            currency: "usd",
        });

        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
            success: true
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Stripe payment intent creation failed",
            success: false
        });
    }
};

// 2. Book Ticket (after payment done)
const bookTicket = async (req, res) => {
    try {
        const { eventId, numberOfTickets, totalPrice } = req.body;
        const userId = req.id;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                message: "Event not found",
                success: false
            });
        }

        if (event.availableTickets < numberOfTickets) {
            return res.status(400).json({
                message: "Not enough tickets available",
                success: false
            });
        }

        const ticket = await Ticket.create({
            user: userId,
            event: eventId,
            numberOfTickets,
            totalPrice,
            paymentStatus: "paid"
        });

        event.availableTickets -= numberOfTickets;
        event.attendees.push(userId);
        await event.save();

        res.status(201).json({
            message: "Ticket booked successfully",
            ticket,
            success: true
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Ticket booking failed",
            success: false
        });
    }
};

// 3. Get My Tickets
const getMyTickets = async (req, res) => {
    try {
        const userId = req.id;

        const tickets = await Ticket.find({ user: userId }).populate("event").sort({ createdAt: -1 });

        res.status(200).json({
            tickets,
            success: true
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to fetch tickets",
            success: false
        });
    }
};

module.exports = {
    createPaymentIntent, bookTicket, getMyTickets
};
