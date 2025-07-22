# 🎟️ Event MarketPlace — Book, Browse & Host Events Seamlessly

Welcome to **Event MarketPlace**, a full-stack web app where users can **browse, book, and host events** or **movies**, with real-time updates, OTP-based signup, email reminders, QR code ticketing, and secure Stripe payments.

- 🔥 Built with React + Vite + Tailwind + Node.js + Express + Stripe + Firebase Messaging


<br>

## 📸 Demo

> _(Add live link or GIF screenshots here)_  
> Example: `https://eventify.vercel.app`

---
<br>

## 🚀 Features

- 🔐 **OTP-Based Signup** with Email Verification
- 🧠 **Smart Event Filters**: Live, Upcoming, Past
- 💳 **Stripe Payments** for Movie Ticketing
- 📩 **Email Reminders** before event time
- 📥 **FCM Push Notifications** (when browser is closed)
- 🔔 **Real-time Notifications** via Socket.io
- ❤️ **Wishlist** System for saved events
- 🧾 **QR Code Tickets** with Scan Verification
- 📈 **Event Analytics** for Hosts
- 🎬 **Now Playing Movies** via TMDB API
- 🧑‍🎤 **Multi-role System**: Users and Hosts

---
<br>

## 🛠️ Tech Stack

| Frontend        | Backend           | Integrations               | Hosting / DB           |
|----------------|-------------------|----------------------------|------------------------|
| React + Vite   | Node.js + Express | Stripe (Payments)          | Vercel (Frontend)      |
| Tailwind + ShadCN | REST APIs      | Firebase Cloud Messaging    | Railway / MongoDB      |
| Redux Toolkit  | Socket.io         | TMDB Movie API              | Firebase Auth          |

---
<br>

## 📂 Folder Structure
```
Event MarketPlace/
├── Frontend/
│ ├── src/
│ │ ├── components/ # Reusable UI components
│ │ ├── pages/ # Core pages (Home, EventPage, etc.)
│ │ ├── redux/ # Global state store & slices
│ │ ├── firebase/ # Firebase Messaging config
│ │ ├── utils/ # Helper functions
│ │ └── main.jsx # App entry point
│ ├── tailwind.config.js # Tailwind setup
│ ├── vite.config.js # Vite config
│ └── .env # Environment variables
│
├── Backend/
│ ├── Controllers/ # Logic for all APIs
│ ├── Routes/ # API route definitions
│ ├── Models/ # Mongoose models
│ ├── Socket.js # Real-time logic (Socket.io)
│ ├── index.js # Entry point
│ └── .env # Backend secrets
```


---
<br>

## 🧪 Local Setup

### 1️⃣ Clone the repository

```
git clone https://github.com/yourusername/event-marketplace.git
cd Event\ MarketPlace
```

### 2️⃣ Install dependencies

# Frontend
```
cd Frontend
npm install
```

# Backend
```
cd ../Backend
npm install
```
---
<br>

3️⃣ Set up environment variables
Create .env files in both Frontend and Backend folders.

🔐 Frontend .env
```
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```
🛡️ Backend .env
```
PORT=YOUR_PORT
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_API_KEY=your_email_api_key
STRIPE_SECRET=your_stripe_secret_key
```
---
<br>


🧠 How It Works
User signs up with OTP → Verifies via email

Browses events or movies → Filters (Live, Upcoming, Past)

Books a ticket → Stripe checkout → Ticket saved

QR Code gets generated and shown on booking

Reminder Email sent automatically before event

Push Notification sent via Firebase Cloud Messaging

Real-time Notifications show instantly via Socket.io

---
<br>

🧾 Booking Flow with QR Code
On successful booking:

Backend generates a unique QR code

Shown in user dashboard

Hosts can scan QR to validate entry

---
<br>

📦 Movie Booking (Stripe)
Users can book movie tickets using Stripe Payment

Movie data is fetched using TMDB API

After payment, movie ticket with QR is saved to user

🔮 Future Enhancements
📱 Convert to Progressive Web App (PWA)

🌐 Multi-language support

🧑‍🤝‍🧑 Group bookings

📍 Google Maps Integration on event pages

🧾 Invoice download for bookings

---
<br>

🙌 Author
Built with ❤️ by Md Sajid
This is my final year major project — feedback welcome!

📄 License
This project is licensed under the MIT License.






