// MovieStripeCheckout.jsx
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useLocation } from "react-router-dom";
import MovieCheckoutForm from "./MovieCheckoutForm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useState } from "react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function MovieCheckout() {
  const { state } = useLocation();

  const [navbarHeight, setNavbarHeight] = useState(0);

  if (!state) return <p className="text-center mt-10">Invalid access</p>;

  return (
    <div>
      <Navbar setNavbarHeight={setNavbarHeight} />
      <div style={{ marginTop: `${navbarHeight - 40}px` }} className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-[#0f1c2f] dark:to-[#06121f]">
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.4 }}

          className="mt-16 py-4 ">
          <Elements stripe={stripePromise}>
            <MovieCheckoutForm movieData={state} />
          </Elements>
        </motion.div>
        <Footer />
      </div>
    </div>
  );
}
