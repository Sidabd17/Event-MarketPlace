import { useEffect } from "react";
import { getSocket } from "../Socket";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { addNotification } from "@/redux/notificationSlice";

const useSocketListener = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    // ✅ Clean any previous listeners
    socket.off("event-created");
    socket.off("event-updated");

    // ✅ Attach event-created listener
    socket.on("event-created", (eventData) => {
      console.log("📣 New event from hook:", eventData);
      toast.success(`🎉 New event: ${eventData.title}`, {
        position: "top-right",
        duration: 5000,
      });

      dispatch(
        addNotification({
          id: eventData._id,
          title: eventData.title,
          date: eventData.date,
          type:"created",
          createdAt: new Date().toISOString(),
        })
      );
    });

    // ✅ Attach event-updated listener globally
    socket.on("event-updated", (eventData) => {
      console.log("📣 Event updated from hook:", eventData);
      toast.success(
        `📌 Event updated: ${eventData.title}, check full details`,
        {
          position: "top-right",
          duration: 5000,
        }
      );

      dispatch(
        addNotification({
          id: eventData._id,
          title: `Updated: ${eventData.title}`,
          date: eventData.date,
          type: "updated",
          createdAt: new Date().toISOString(),
        })
      );
    });

    return () => {
      socket.off("event-created");
      socket.off("event-updated");
    };
  }, []);
};

export default useSocketListener;
