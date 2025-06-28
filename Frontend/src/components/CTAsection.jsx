import { useNavigate } from "react-router-dom";
import {toast } from "sonner";
const CTASection = () => {
  const navigate = useNavigate();
   

  const createEventHandler = () => {
    toast.error("Please Join as an Organizer to Create Events");
  }

  return (
    <section className="bg-gradient-to-br from-[#d1e8ff] to-[#f1f8ff] dark:from-[#0f1c2f] dark:to-[#06121f] py-12">
      <div className="max-w-5xl mx-auto text-center px-4">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          Ready to Create or Attend an Event?
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Join Eventify today and make your event journey seamless.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <button onClick={createEventHandler} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
            Create Event
          </button>
          <button onClick={() => navigate("/events")} className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white px-6 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            Browse Events
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
