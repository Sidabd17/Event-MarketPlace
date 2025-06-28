import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "@/components/Navbar";
import { QRCodeCanvas } from "qrcode.react";
import { Badge } from "@/components/ui/badge"; // Badge import
import Footer from "@/components/Footer";
import { useState } from "react";

const TicketDetails = () => {
  const { ticketId } = useParams();
  const tickets = useSelector((state) => state.ticket.userTickets);
  const ticket = tickets.find((t) => t._id === ticketId);

  const [navbarHeight, setNavbarHeight] = useState(0);

  if (!ticket)
    return <p className="text-center mt-20 text-red-500">❌ Ticket not found</p>;

  const { event } = ticket;

  return (
    <div className=" min-h-screen dark:bg-[#0a1216]">
      <Navbar setNavbarHeight={setNavbarHeight} />

      <div style={{ marginTop: `${navbarHeight - 50}px` }}>
        <div className="bg-gradient-to-b from-yellow-100 to-white dark:bg-none h-[50vh]" />
        <div className="max-w-5xl  mx-auto -mt-70 px-4 py-12 ">
          <div className="bg-white dark:bg-[#1a2b45] rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row">

            {/* Event Image (40% height on small, left on md) */}
            <div className="md:w-1/2 p-5 overflow-hidden">
              <img
                src={event.image || "https://via.placeholder.com/600x400?text=Event+Image"}
                alt={event.title}
                className="w-[470px] h-[400px] object-cover object-center rounded-t-md  md:rounded-md"
              />
            </div>

            {/* Event & Ticket Info */}
            <div className="md:w-1/2 p-6 space-y-4 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{event.title}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{event.description?.slice(0, 120)}...</p>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <Badge className="bg-slate-800 text-gray-100 dark:bg-slate-100 dark:text-slate-800">
                    📅 Date: {new Date(event.date).toLocaleDateString()}
                  </Badge>

                  <Badge className="bg-slate-800 text-gray-100 dark:bg-slate-100 dark:text-slate-800">
                    🕒 Time: {event.time}
                  </Badge>

                  <Badge className="bg-sky-700 text-sky-100 dark:bg-sky-100 dark:text-sky-800 col-span-2">
                    📍 Venue: {event.venue || "TBA"}
                  </Badge>
                </div>
              </div>

              <div className="pt-4 space-y-2 flex gap-10 border-t dark:border-gray-500 text-sm">
                <Badge className="bg-gray-800 text-gray-100 dark:bg-gray-100 dark:text-gray-800">
                  🎟️ Tickets: {ticket.numberOfTickets}
                </Badge>

                <Badge className="bg-slate-800 text-gray-100 dark:bg-gray-200 dark:text-gray-800">
                  💰 {ticket.totalPrice === 0 ? "Free" : `Price : ${ticket.totalPrice}`}
                </Badge>

                {/* <Badge
                  className={`${ticket.paymentStatus === "paid"
                      ? "bg-green-100 text-green-800 dark:bg-green-700 dark:text-white"
                      : "bg-red-100 text-red-700 dark:bg-red-700 dark:text-white"
                    }`}
                >
                  🧾 Payment: {ticket.paymentStatus.toUpperCase()}
                </Badge> */}
              </div>

              {/* QR Code */}
              <div className="pt-4 md:text-left">
                <p className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">🔳 QR Code:</p>
                <QRCodeCanvas
                  value={`http://localhost:5173/ticket/${ticket._id}`}
                  size={100}
                  className="border p-1 bg-white rounded shadow"
                />
                <p className="text-xs text-gray-500 mt-1">Scan at entry</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TicketDetails;
