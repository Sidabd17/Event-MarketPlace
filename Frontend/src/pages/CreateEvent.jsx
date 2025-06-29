import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
// import { useDispatch } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Footer from "@/components/Footer";

const CreateEvent = () => {
  //   const dispatch = useDispatch();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [navbarHeight, setNavbarHeight] = useState(0);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    venue: "",
    category: "",
    price: "",
    totalTickets: "",
  });

  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let time = formData?.time?.trim().toUpperCase();

    // ✅ Strict time format validation
    const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;
    if (time && !timeRegex.test(time)) {
      toast.error("Invalid time format. Use hh:mm AM/PM (e.g. 05:30 PM)");
      setLoading(false);
      return;
    }

    formData.time = time ;

    if (
      !formData.title ||
      !formData.description ||
      !formData.date ||
      !formData.time ||
      !formData.location ||
      !formData.venue ||
      !formData.category ||
      !formData.price ||
      !formData.totalTickets ||
      !image
    ) {
      toast.error("All fields including image are required.");
      return;
    }

    const form = new FormData();
    for (let key in formData) {
      form.append(key, formData[key]);
    }
    form.append("file", image);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/event/create`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      })

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/dashboard");
        console.log("Event created successfully", res.data.event);
      }

    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event.");
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="min-h-screen dark:bg-[#0a1216]">
      <Navbar setNavbarHeight={setNavbarHeight} />
      <div style={{ marginTop: `${navbarHeight - 50}px` }} >
        <div className="bg-gradient-to-b from-blue-100 to-white dark:bg-none h-[50vh]" />
        <div className="-mt-60 pb-16 px-4">
          <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white">
            Create a New Event
          </h1>
          <p className="text-center text-muted-foreground mt-2">
            Fill out the form below to add your event.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-5 max-w-2xl mx-auto bg-white dark:bg-slate-700 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-8 space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2  gap-4">
              {[
                { label: "Title", name: "title", type: "text", placeholder: "Event title" },
                { label: "Date", name: "date", type: "date" },
                { label: "Time", name: "time", type: "text", placeholder: "e.g. 5:30 PM (12-hour Format)" },
                { label: "Location", name: "location", type: "text", placeholder: "City, Venue Area" },
                { label: "Venue", name: "venue", type: "text", placeholder: "Auditorium / Hall name" },
                { label: "Category", name: "category", type: "text", placeholder: "Sports/Concert/Entertainment" },
                { label: "Price", name: "price", type: "number", placeholder: "Entry fee" },
                { label: "Total Tickets", name: "totalTickets", type: "number", placeholder: "How many tickets?" },
              ].map((field, idx) => (
                <div key={idx} className="grid grid-cols-3 gap-1">
                  <Label htmlFor={field.name} className="text-base">
                    {field.label}
                  </Label>
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder || ""}
                    required
                    className={'col-span-2 placeholder:text-gray-700 dark:placeholder:text-gray-400 px-4 py-1 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-[#1a1d24] dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900'}
                  />
                </div>
              ))}
            </div>
            <div>
              <Label htmlFor="description" className="text-base mb-2">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell something about the event..."
                required
              />
            </div>

            <div>
              <Label htmlFor="image" className="text-base mb-2">
                Upload Event Image
              </Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
            </div>


            {loading ? (<Button className={'w-full my-4'}><Loader2 className="animate-spin mr-2 h-5 w-5" />Please Wait</Button>) : (
              <Button type="submit" className={"w-full"}>
                Create Event
              </Button>
            )}

          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreateEvent;
