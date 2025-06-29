import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Footer = () => {
  const {user} = useSelector((store) => store.auth);
  const navigate = useNavigate();

  const createEventHandler = () =>{
    if(user && user?.role === "organizer"){
      navigate('/admin/events/create');
    }else{
      toast.error("Please Join as an Organizer to Create Events");
    }
  }

  return (
    <footer className="bg-sky-100 dark:bg-[#0b0f14] dark:border-t dark:border-t-gray-100 text-gray-700 dark:text-gray-300 py-8">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
        <div>
          <h4 className="font-semibold text-lg mb-2">Eventify</h4>
          <p className="text-sm">
            Your go-to platform for hosting and attending events easily.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-lg mb-2">Quick Links</h4>
          <ul className="space-y-1 text-sm">
            <li><button onClick={createEventHandler} className="hover:underline">Create Event</button></li>
            <li><button onClick={() => navigate("/events")} className="hover:underline">Browse Events</button></li>
            <li><a href="#" className="hover:underline">FAQs</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-lg mb-2">Connect</h4>
          <p className="text-sm">Email: support@eventify.com</p>
          <p className="text-sm">Phone: +91-12345-67890</p>
        </div>
      </div>
      <div className="mt-8 border-t border-gray-300 dark:border-gray-700 text-center pt-4 text-sm">
        © {new Date().getFullYear()} Eventify. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
