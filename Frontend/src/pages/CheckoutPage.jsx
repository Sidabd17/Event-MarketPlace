import Navbar from "@/components/Navbar";
import StripeCheckout from "./StripeCheckout";
import { useLocation } from "react-router-dom";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useState } from "react";

const CheckoutPage = () => {
  const { state } = useLocation();

  const [navbarHeight, setNavbarHeight] = useState(0);

  if (!state) return <p>Invalid access</p>;

  return (
    <div>
      <Navbar setNavbarHeight={setNavbarHeight} />
      <div style={{ marginTop: `${navbarHeight - 40}px` }}>
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-[#0f1c2f] dark:to-[#06121f]">
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.4 }}
            className="mt-16 py-4">
            <StripeCheckout />
          </motion.div>
          <Footer />
        </div>
      </div>
    </div>

  );
};

export default CheckoutPage;
