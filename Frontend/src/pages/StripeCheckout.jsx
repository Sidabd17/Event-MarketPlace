import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    CardElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ eventData }) {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const { eventId, numberOfTickets, totalPrice, eventTitle, eventPrice } = eventData;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/ticket/create-payment-intent`, {
                totalPrice,
            },
            {
                withCredentials: true,
            }
        );

            const clientSecret = res.data.clientSecret;

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                },
            });

            if (result.error) {
                toast.error(result.error.message);
                console.log(result.error.message);
                setLoading(false);
                return;
            }

            if (result.paymentIntent.status === "succeeded") {
                await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/ticket/book/${eventId}`, {
                    eventId,
                    numberOfTickets,
                    totalPrice,
                },
                {
                    withCredentials: true,
                });

                toast.success("Tickets booked successfully!");
                navigate("/my-bookings");
            }
        } catch (err) {
            console.log(err);
            toast.error("Payment failed");

        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto mt-10 mb-10 space-y-6 bg-gradient-to-b from-yellow-50 to-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center text-black">Checkout</h2>

            <div className="rounded-md border p-4 space-y-2 shadow-sm">
                <div className="flex justify-between">
                    <span className="font-medium text-muted-foreground">Event</span>
                    <span className="text-black">{eventTitle}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium text-muted-foreground">Tickets</span>
                    <span className="text-black">{numberOfTickets}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium text-muted-foreground">Price / Ticket</span>
                    <span className="text-black">₹{eventPrice}</span>
                </div>
                <hr />
                <div className="flex justify-between font-semibold">
                    <span className="text-black">Total</span>
                    <span className="text-black">₹{totalPrice}</span>
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
                {loading ? "Processing..." : `Pay ₹${totalPrice}`}
            </button>
        </form>
    );
}

export default function StripeCheckout() {
    const { state } = useLocation();

    if (!state) return <p className="text-center mt-10">Invalid access</p>;

    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm eventData={state} />
        </Elements>
    );
}
