const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    event:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true  
    },
    numberOfTickets: {
        type: Number,
        required: true,
        min: 1
    },
    totalPrice: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'cancelled'],
        default: 'paid'
    }
},{ timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);