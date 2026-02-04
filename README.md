# 🎟️ Event MarketPlace

A full-stack **MERN Event Booking System** where users can browse, book, and host events — with calendar-based event discovery, secure Stripe payments, real-time notifications, and QR code ticketing.

**Live Demo:** [event-market-place.vercel.app](https://event-market-place.vercel.app)

---

## 📋 Assignment Requirements — Coverage

| Requirement | Status | How It's Implemented |
|---|---|---|
| Browse available events | ✅ | Events page, Browse filter, LatestEvents on homepage |
| Secure payment processing (Stripe/PayPal) | ✅ | Stripe checkout integrated for event & movie tickets |
| Admins manage availability & pricing | ✅ | Admin Dashboard — create, update, delete events; control ticket count & pricing |
| Event reminders & notifications | ✅ | Email reminders before events, FCM push notifications, Socket.io real-time alerts |
| Calendar management | ✅ | Full calendar view — browse events by date, see availability at a glance |
| Booking & availability checks | ✅ | Ticket booking with live availability counter, sold-out detection |
| Responsive webpages | ✅ | Tailwind CSS responsive grid throughout — mobile, tablet, desktop |
| Authentication | ✅ | OTP-based email signup, JWT session management, role-based access (User / Organizer) |

---

## 🚀 Features

### 📅 Calendar Management
- Monthly calendar view with prev/next navigation
- Dates with events are highlighted with color-coded category dots
- Click any date to instantly see all events happening that day
- Each event card shows time, venue, price, and live ticket availability
- Clicking an event card navigates directly to its full detail & booking page

### 🔐 Authentication & Roles
- OTP-based signup with email verification
- JWT-based session handling
- Two roles: **Attendee** (browse & book) and **Organizer** (create & manage events)

### 🎫 Booking & Payments
- Stripe-powered secure checkout for event and movie tickets
- Ticket availability tracked in real time — shows seats remaining or "Sold Out"
- QR code generated on every successful booking for entry verification
- Organizers can scan QR codes to validate attendees at the event

### 🔔 Reminders & Notifications
- Automatic email reminders sent before upcoming events
- Firebase Cloud Messaging (FCM) push notifications — works even when the browser is closed
- Socket.io real-time notifications for event creation and updates — appears instantly in-app

### 🛡️ Admin Panel
- Create new events with image upload (stored on Cloudinary)
- Update event details, pricing, and availability
- Delete events
- View analytics for hosted events
- Full list of created events with status

### 🎬 Bonus — Movie Bookings
- Browse now-playing movies via TMDB API
- Book movie tickets with Stripe
- Movie ticket with QR code saved to user dashboard

### ❤️ Wishlist
- Save/unsave events to a personal wishlist
- Dedicated Saved Events page

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, ShadCN UI, Redux Toolkit, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Auth | JWT, OTP via email |
| Payments | Stripe |
| Notifications | Firebase Cloud Messaging, Socket.io, Email (API key) |
| Image Storage | Cloudinary |
| Movies API | TMDB |
| Hosting | Vercel (Frontend), Railway (Backend) |

---

## 📂 Project Structure

```
Event-MarketPlace/
│
├── Frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI — Navbar, Calendar, LatestEvents, etc.
│   │   ├── pages/               # Route-level pages — Home, CalendarPage, Events, etc.
│   │   ├── redux/               # Redux store — authSlice, eventSlice
│   │   ├── hooks/               # Custom hooks — useGetAllEvents, useSocketListener, etc.
│   │   ├── firebase/            # Firebase Messaging config
│   │   ├── utils/               # Helpers
│   │   └── main.jsx             # App entry point
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── .env
│
├── Backend/
│   ├── Controllers/             # API logic — event, user, ticket, payment controllers
│   ├── Routes/                  # Express route definitions
│   ├── Models/                  # Mongoose schemas — Event, User, Ticket
│   ├── Firebase/                # Firebase Admin SDK setup
│   ├── Socket.js                # Socket.io real-time server
│   ├── index.js                 # Server entry point
│   └── .env
│
└── README.md
```

---

## ⚙️ Local Setup

### 1. Clone

```bash
git clone https://github.com/Sidabd17/Event-MarketPlace.git
cd Event-MarketPlace
```

### 2. Install dependencies

```bash
# Frontend
cd Frontend
npm install

# Backend
cd ../Backend
npm install
```

### 3. Environment variables

**Frontend `.env`**
```
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_OPENCAGE_KEY=
```

**Backend `.env`**
```
PORT=5000
MONGO_URL=
JWT_SECRET=
EMAIL_API_KEY=
STRIPE_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### 4. Run

```bash
# Backend
cd Backend
npm start

# Frontend (new terminal)
cd ../Frontend
npm run dev
```

---

## 🧠 How It Works — User Journey

1. **Sign up** with email → receive OTP → verify → account created
2. **Browse events** on the homepage or use the **Calendar** to pick a date
3. **View event details** — see description, venue, pricing, availability
4. **Book a ticket** → Stripe checkout → payment confirmed → QR code ticket saved
5. **Receive a reminder** email before the event
6. **At the event** — organizer scans the QR code to validate entry

---

## 👨‍💼 Organizer Flow

1. Sign up and select the **Organizer** role
2. Go to **Admin Dashboard**
3. **Create an event** — fill in details, upload an image, set ticket count & price
4. Event goes live → users can browse and book it
5. **Update or delete** events as needed
6. Scan attendee QR codes at the event for entry verification

---

## 🙌 Author

Built by **Md Sajid** — Final Year Major Project