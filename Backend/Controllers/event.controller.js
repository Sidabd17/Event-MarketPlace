const Event = require('../models/event.model');
const User = require('../models/user.model');
const getDataUri = require('../utils/datauri');
const cloudinary = require('../utils/cloudinary');
const { io } = require('../Socket');
const admin = require('../Firebase/FirebaseAdmin'); // Firebase Admin SDK for notifications
const Ticket = require('../models/ticket.model');

const createEvent = async (req, res) => {
  try {

    const {
      title,
      description,
      date,
      time,
      location,
      venue,
      category,
      price,
      totalTickets,
    } = req.body;

    if (!title || !description || !date || !location || !venue || !category || !price || !totalTickets) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: "Event image is required" });
    }

    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    const event = await Event.create({
      title,
      description,
      date,
      time,
      location,
      venue,
      category,
      price,
      totalTickets,
      availableTickets: totalTickets,
      image: cloudResponse.secure_url,
      organizer: req.id
    });

    io.emit("event-created", event);
    console.log("🔔 Event emitted via io.emit");


    const usersToNotify = await User.find({
      city: location,
      fcmToken: { $exists: true },
    });

    // ✅ Push notification to each user
    for (let user of usersToNotify) {
      await admin.messaging().send({
        notification: {
          title: `🎉 New Event in ${location}`,
          body: `${title} is now live. Tap to view.`,
         // banner
        },
        data: {
          click_action: `https://event-market-place.vercel.app/event/description/${event._id}`,
           icon: "https://event-market-place.vercel.app/vite.svg", // ✅ replace later
          image: cloudResponse.secure_url, 
        },
        token: user.fcmToken,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      event
    });


  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
}

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("organizer", "name email profile.profilePhoto").sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: "Events fetched successfully",
      events
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
}

const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id).populate("organizer", "name email profile.profilePhoto").populate("attendees", "name email profile.profilePhoto profile.interests");
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }
    return res.status(200).json({
      success: true,
      message: "Event fetched successfully",
      event
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
}

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;

    console.log("🔍 Updating event with ID:", id);

    const event = await Event.findById(id);
    if (!event) {
      return res.status(400).json({
        message: "Event not found",
        success: false,
      });
    }

    // 🛡️ Move organizer check here FIRST
    if (event.organizer.toString() !== req.id) {
      return res.status(403).json({
        message: "Unauthorized",
        success: false,
      });
    }

    let image = event.image;

    if (file) {
      const fileUri = getDataUri(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      image = cloudResponse?.secure_url;
    }

    const updatedData = { ...req.body, image };

    const updatedEvent = await Event.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    io.emit("event-updated", updatedEvent);
    // console.log("🔔 Event updated and emitted via io.emit");

    // 🔔 Send notifications
    const usersToNotify = await User.find({
      // city: updatedEvent.location,
      fcmToken: { $exists: true },
    });

    // console.log(`🔔 Notifying ${usersToNotify.length} users in ${updatedEvent.location}`);

    for (let user of usersToNotify) {
      // console.log(`🔔 Sending notification to ${user.email}`);
      try {
        await admin.messaging().send({
          notification: {
            title: `🎉 You have an update about ${updatedEvent.title}`,
            body: `${updatedEvent.title} has been updated. Tap to view new details.`,
           
          },
          data: {
            click_action: `https://event-market-place.vercel.app/event/description/${updatedEvent._id}`,
            //  icon: "http://localhost:5173/vite.svg", // ✅ replace later
             image: updatedEvent.image,
          },
          token: user.fcmToken,
        });

        // console.log(`✅ Notification sent to ${user.email || user._id}`);
      } catch (error) {
        console.error(`❌ Failed to send to ${user.email || user._id}:`, error.message);
      }
    }

    return res.status(200).json({
      message: "Event updated successfully",
      event: updatedEvent,
      success: true,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    if (event.organizer.toString() !== req.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await event.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
}

const joinEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("organizer", "name email profile.profilePhoto").populate("attendees", "name email profile.profilePhoto profile.interests");

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    if (event.availableTickets <= 0) {
      return res.status(400).json({ success: false, message: "Tickets sold out" });
    }

    if (event.attendees.includes(req.id)) {
      return res.status(400).json({ success: false, message: "Already joined" });
    }

    await Ticket.create({
      user: req.id,
      event: event._id,
      numberOfTickets:1,
      totalPrice:0,
      paymentStatus:"paid"
    })

    event.attendees.push(req.id);
    event.availableTickets -= 1;

    await event.save();

    return res.status(200).json({
      success: true,
      message: "Event joined successfully",
      event,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 7. Get My Events (created and joined)
const getMyEvents = async (req, res) => {
  try {
    const createdEvents = await Event.find({ organizer: req.id }).populate("attendees", "name email profile.profilePhoto").sort({ createdAt: -1 });
    const joinedEvents = await Event.find({ attendees: req.id }).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Events Fetched successfully",
      success: true,
      createdEvents: createdEvents ? createdEvents : [],
      joinedEvents: joinedEvents ? joinedEvents : [],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

const toggleSavedEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const index = user.savedEvents.indexOf(eventId);
    let isSaved = false;

    if (index === -1) {
      user.savedEvents.push(eventId); // ❗️push only ID, not full event
      isSaved = true;
    } else {
      user.savedEvents.splice(index, 1);
    }

    await user.save();

    // ✅ Now populate after saving
    const updatedUser = await User.findById(userId).populate("savedEvents");

    return res.status(200).json({
      success: true,
      message: isSaved ? "Event saved successfully" : "Event removed from saved list",
      saved: isSaved,
      savedEvents: updatedUser.savedEvents
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};



const getUserSavedEvents = async (req, res) => {
  try {
    const userId = req.id;

    const user = await User.findById(userId).populate({
          path: "savedEvents",
          options: { sort: { createdAt: -1 } } // ✅ sort inside populated field
        });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    const savedEvents = user.savedEvents;

    return res.status(200).json({
      success: true,
      message: "Saved events fetched successfully",
      savedEvents
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    })
  }
}

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  joinEvent,
  getMyEvents,
  toggleSavedEvent,
  getUserSavedEvents
};