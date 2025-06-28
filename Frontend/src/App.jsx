// App.jsx
import React, { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Events from './pages/Events';
import Browse from './components/Browse';
import Profile from './pages/Profile';
import Mybookings from './pages/Mybookings';
import EventDescription from './pages/EventDescription';
import AdminDashboard from './pages/AdminDashboard';
import CreateEvent from './pages/CreateEvent';
import AdminEvents from './pages/AdminEvents';
import CheckoutPage from './pages/CheckoutPage';
import TicketDetails from './pages/TicketDetails';
import SavedEvents from './pages/SavedEvents';
// import TicketMasterEvents from './pages/TicketMasterEvents';
import Movies from './pages/Movies';
import MovieCheckout from './pages/MovieCheckout';
import MovieDescription from './pages/MovieDescription';
import MovieTicketDetails from './pages/MovieTicketDetails';
import { useSelector } from 'react-redux';
// import { io } from 'socket.io-client';
import { connectSocket, getSocket } from './Socket';
import useSocketListener from './hooks/useSocketListener';
import { useFirebaseNotifications } from './hooks/useFirebaseNotifications';

const App = () => {
  const scrollRef = useRef();

  const user = useSelector((state) => state.auth.user);
  // const socketRef = useRef(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('✅ Service Worker registered with scope:', registration.scope);
        })
        .catch((err) => {
          console.error('❌ Service Worker registration failed:', err);
        });
    }
  }, []);

  useEffect(() => {
    if (user?._id) {
      connectSocket(user._id);

      const socket = getSocket();
      // console.log("Socket instance:", socket);

      socket.on("connect", () => {
        console.log("Socket connected:", socket.id);
      });

      socket.on("event-created", (eventData) => {
        console.log("📥 Event received in attendee browser");
        console.log("🔥 New event created:", eventData);
      });

      socket.on("event-updated", (eventData) => {
        console.log("📥 Event received in attendee browser");
        console.log("🔥Event updated :", eventData);
      });
    }

    return () => {
      const socket = getSocket();
      if (socket) socket.disconnect();
    };
  }, [user]);

  useSocketListener();

  useFirebaseNotifications(user?._id);

  return (
    <div ref={scrollRef} className='overflow-y-auto no-scrollbar h-screen'>
      <BrowserRouter>
        <ScrollToTop scrollRef={scrollRef} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/events" element={<Events />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-bookings" element={<Mybookings />} />
          <Route path="/event/description/:id" element={<EventDescription />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/events/create" element={<CreateEvent />} />
          <Route path="/admin/events" element={<AdminEvents />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/ticket/:ticketId" element={<TicketDetails />} />
          <Route path="/saved-events" element={<SavedEvents />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movie-checkout" element={<MovieCheckout />} />
          <Route path="/movie/description/:id" element={<MovieDescription />} />
          <Route path="/movie/ticket/:ticketId" element={<MovieTicketDetails />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
