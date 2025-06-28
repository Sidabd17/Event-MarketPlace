
import { useNavigate } from 'react-router-dom';
import { MapPin, Ticket, Calendar, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { FaMoneyBill } from 'react-icons/fa';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setSavedEvents } from '@/redux/eventSlice';

const EventCard = ({ event }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const hasPassed = new Date(event?.date) < new Date();

  const savedEvents = useSelector((state) => state.event.savedEvents);
  
 const isSaved = savedEvents.some((e) => e._id === event._id);


  const savedEventHandler = async (e,event) =>{
    e.stopPropagation();
    try {
      const res = await axios.patch(`${import.meta.env.VITE_API_URL}/api/v1/event/toggle/${event._id}` , {} , {withCredentials: true});

      if(res.data.success){
        toast.success(res.data.message);
        dispatch(setSavedEvents(res.data.savedEvents));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  }

  
  return (

    <div
      key={event._id}
      className="min-w-[300px] h-[460px] p-4 bg-white rounded-md shadow-lg overflow-hidden border border-gray-200 cursor-pointer transition-all hover:scale-[1.02]"
      onClick={() => navigate(`/event/description/${event._id}`)}
    >
      {/* Image Section with overlays */}
      <div className="relative h-60 rounded-md bg-cover bg-center" style={{
        backgroundImage: `url(${event.image || "https://via.placeholder.com/300x200"})`
      }}>
        {/* Date Badge */}
        <div className="absolute top-3 left-3 bg-slate-300 px-3 py-1 rounded-md text-center shadow text-xs font-bold">
          <p className="text-black leading-tight">
            {new Date(event.date).getDate().toString().padStart(2, '0')}
            <br />
            {new Date(event.date).toLocaleString('default', { month: 'short' }).toUpperCase()}
          </p>
        </div>

        {/* Heart Icon */}
        <div className="absolute top-3 right-3">
          <button className="bg-white p-1 rounded-full shadow-md">
            <svg
              className={`w-5 h-5 ${isSaved ? 'text-red-500' : 'text-gray-500'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
              onClick={(e)=>savedEventHandler(e,event)}
            >
              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
            </svg>
          </button>
        </div>

        {/* Going Avatars */}
        <div className="absolute bottom-3 left-3 flex items-center space-x-[-8px]">
          {[...Array(4)].map((_, i) => (
            <img
              key={i}
              className="w-6 h-6 rounded-full border-2 border-white"
              src={`https://i.pravatar.cc/150?img=${i + 1}`}
              alt="Attendee"
            />
          ))}
          <span className="ml-2 text-white text-xs font-medium">+1K Going</span>
        </div>
      </div>

      {/* Content */}
      <div className="pt-3 px-1 pb-1 flex flex-col gap-2">
        {/* Category */}
        <span className="text-sm text-center min-w-20 font-medium bg-cyan-200 text-slate-900 px-2 py-1 rounded w-fit">
          {event.category || "Category"}
        </span>

        {/* Title */}
        <h3 className="text-xl font-bold font-sans text-gray-900">
          {event.title}
        </h3>

        {/* Location & Time */}
        <div className="flex gap-2">
          <MapPin className="w-5 h-5 text-black" />
          <p className="text-sm font-medium text-gray-800">
            {event.location}
          </p>
        </div>

        <div className="flex gap-2" >
          <Calendar className="w-5 h-5 text-black" />
          <p className="text-sm font-medium text-gray-600">
            {new Date(event.date).toDateString()}, {event.time}
          </p>
        </div>


        {/* Price & Organizer */}

        <div className="flex gap-2" >
          <FaMoneyBill className="w-5 h-5 text-black" />
          <p className="text-sm font-bold text-gray-800">
            {event.price > 0 ? `From ₹${event.price }` : "Free" }
          </p>
        </div>


        <p className="text-xs text-gray-500">
          By <strong>{event.organizer?.name || "Your Org"}</strong>
        </p>

        {/* Action Buttons */}
        {/* <div className="flex gap-2 mt-3">
          <Button
            className="bg-blue-500 w-1/2 text-white font-medium hover:bg-blue-700  rounded-sm"
            disabled={hasPassed}
            >
            Book Now
          </Button>
          <Button
            variant="outline"
            className="bg-gray-200 w-1/2 text-black font-medium rounded-sm"
          >
            View Details
          </Button>
        </div> */}
      </div>
    </div>
  );
};

export default EventCard;
