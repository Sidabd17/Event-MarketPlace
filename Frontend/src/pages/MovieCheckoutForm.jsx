import {
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function MovieCheckoutForm({ movieData }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const cityName = useSelector((state) => state.auth.cityName || "Default");

  const [loading, setLoading] = useState(false);

  const {
    movieId,
    movieTitle,
    date,
    showtime,
    theater,
    seats,
    totalTickets,
  } = movieData;

  const amount = totalTickets * 150;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create PaymentIntent
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/movie/create-payment-intent`,
        {
          totalTickets,
        },
        { withCredentials: true }
      );

      const clientSecret = res.data.clientSecret;

      // 2. Confirm card payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        toast.error(result.error.message);
        setLoading(false);
        return;
      }

      if (result.paymentIntent.status === "succeeded") {
        // 3. Save booking in DB
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/movie/book`,
          {
            movieId,
            movieTitle,
            date,
            showtime,
            theater,
            location: cityName,
            seats,
            totalTickets,
          },
          { withCredentials: true }
        );

        toast.success("Movie booked successfully!");
        navigate("/my-bookings");
      }
    } catch (err) {
      console.error(err);
      toast.error("Payment or booking failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto mt-10 mb-10 space-y-6 p-4 rounded-xl shadow-md bg-gradient-to-b from-yellow-50 to-white">
      <h2 className="text-2xl text-black font-bold text-center">Movie Checkout</h2>

      <div className="rounded-md border p-4 space-y-2 shadow-sm">
        <div className="flex justify-between">
          <span className="font-medium text-muted-foreground">Movie</span>
          <span className="text-black">{movieTitle}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-muted-foreground">Theater</span>
          <span className="text-black">{theater}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-muted-foreground">Showtime</span>
          <span className="text-black">{showtime}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-muted-foreground">Tickets</span>
          <span className="text-black">{totalTickets}</span>
        </div>
        <hr />
        <div className="flex justify-between font-semibold">
          <span className="text-black">Total</span>
          <span className="text-black">₹{amount}</span>
        </div>
      </div>

      <div className="border p-4 rounded-md shadow-sm">
        <label className="block mb-2 text-sm text-black font-medium">Card Details</label>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#000',
                '::placeholder': {
                  color: '#888',
                },
              },
              invalid: {
                color: '#e53935',
              },
            },
          }}
          className="border rounded-md p-3"
        />
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="bg-black text-white px-6 py-2 rounded w-full"
      >
        {loading ? "Processing..." : `Pay ₹${amount}`}
      </button>
    </form>
  );
}
