import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { motion } from "framer-motion";
// import useGetOrganizerEvents from '@/hooks/useGetOrganizerEvents';
import { useDispatch, useSelector } from "react-redux";
import { setOrganizerEvents, setSelectedEvent } from "@/redux/eventSlice";
// import { setOrganizerEvents } from "@/redux/eventSlice";

const EditEventDialog = ({ open, setOpen, eventData }) => {
  const [loading, setLoading] = useState(false);
  const currentEvents = useSelector((state) => state.event.organizerEvents);
  const {selectedEvent} = useSelector((state) => state.event);

  const isSelectedEvent = selectedEvent?._id === eventData._id;

  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    title: eventData.title || "",
    description: eventData.description || "",
    date: eventData.date || "",
    time: eventData.time || "",
    location: eventData.location || "",
    venue: eventData.venue || "",
    category: eventData.category || "",
    price: eventData.price || "",
    totalTickets: eventData.totalTickets || "",
  });

  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    setFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formdata = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formdata.append(key, value);
    });
    if (file) formdata.append("file", file);

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/event/update/${eventData._id}`,
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        const updatedEvents = currentEvents.map((event) =>
          event._id === res.data.event._id ? res.data.event : event
        );
        dispatch(setOrganizerEvents(updatedEvents));
        if(isSelectedEvent) dispatch(setSelectedEvent(res.data.event));
        setOpen(false);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

    //   useEffect(() => {
        
    //   if (eventData) {
    //     setFormData({
    //       title: eventData.title || "",
    //       description: eventData.description || "",
    //       date: eventData.date || "",
    //       time: eventData.time || "",
    //       location: eventData.location || "",
    //       venue: eventData.venue || "",
    //       category: eventData.category || "",
    //       price: eventData.price || "",
    //       totalTickets: eventData.totalTickets || "",
    //     });
    //   }
    // }, [eventData]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.3 }}
    >
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          key={eventData?._id}  // 👈 force remount on new eventData
          className="sm:max-w-[600px] dark:bg-slate-600"
          onClose={() => setOpen(false)}
          onInteractOutside={() => setOpen(false)}
        >
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
              {Object.entries(formData).map(([key, value]) => (
                <div key={key} className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor={key} className="text-right capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </Label>
                  <Input
                    id={key}
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    className="col-span-3"
                  />
                </div>
              ))}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image" className="text-right">
                  Image
                </Label>
                <Input
                  id="file"
                  name="file"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="col-span-3"
                />
              </div>
            </div>

            <DialogFooter>
              {loading ? (
                <Button className="w-full my-4">
                  <Loader2 className="animate-spin mr-2 h-4 w-4" /> Please Wait
                </Button>
              ) : (
                <Button type="submit" className="w-full my-4">
                  Update Event
                </Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default EditEventDialog;
