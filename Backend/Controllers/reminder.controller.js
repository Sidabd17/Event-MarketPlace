const User = require("../models/user.model");
const Ticket = require("../models/ticket.model");
const transporter = require("../utils/mailer");
const admin = require("../Firebase/FirebaseAdmin");

const sendEventReminders = async () => {
  try {
    const users = await User.find();

    for (let user of users) {
      const tickets = await Ticket.find({ user: user._id }).populate("event");

      for (let ticket of tickets) {
        const eventDate = new Date(ticket.event.date);
        const today = new Date();

        // Strip times
        const eventDateStr = eventDate.toDateString();
        const todayStr = today.toDateString();

        const diffInTime = eventDate.getTime() - today.getTime();
        const diffInDays = Math.ceil(diffInTime / (1000 * 60 * 60 * 24));

        // ✅ 1-Day Before: Send Email
        if (diffInDays === 1) {
          await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: user.email,
            subject: `⏰ Reminder: ${ticket.event.title} is tomorrow!`,
            html: `
              <h2>${ticket.event.title}</h2>
              <p><b>Location:</b> ${ticket.event.location}</p>
              <p><b>Date:</b> ${ticket.event.date}</p>
              <p>Be on time. Have a great experience 🎉</p>
            `
          });
        }

        // ✅ Today: Send Push Notification
        if (eventDateStr === todayStr && user.fcmToken) {
          await admin.messaging().send({
            notification: {
              title: `⏰ Reminder: ${ticket.event.title} is today!`,
              body: `Don't forget to attend at ${ticket.event.time} in ${ticket.event.venue}`,
            },
            data: {
              click_action: `https://event-market-place.vercel.app/event/description/${ticket.event._id}`,
              image: ticket.event.image, // Optional
            },
            token: user.fcmToken,
          });
        }
      }
    }

    console.log("✅ Email and push reminders sent successfully");

  } catch (err) {
    console.error("❌ Failed to send reminders", err.message);
  }
};

module.exports = sendEventReminders;
