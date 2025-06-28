import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function BookTicketDialog({ open , setOpen, eventData }) {
  
  const [count, setCount] = useState(1);
  const navigate = useNavigate();

  const totalPrice = eventData.price * count;

  const handleBook = () => {
     if (count < 1 || count > eventData.availableTickets) {
      toast.error("Invalid number of tickets");
      return;
    }
    toast.success(`Booking ${count} tickets for ₹${totalPrice}`);

    navigate("/checkout", {
      state: {
        eventId: eventData._id,
        numberOfTickets: count,
        totalPrice: eventData.price * count,
        eventTitle: eventData.title,
        eventPrice: eventData.price,
      },
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Book Tickets</DialogTitle>
          <DialogDescription>
            Book tickets for <strong>{eventData.title}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="count" className="text-right">
              Tickets
            </Label>
            <Input
              id="count"
              type="number"
              value={count}
              min={1}
              max={eventData.availableTickets}
              onChange={(e) => setCount(parseInt(e.target.value))}
              className="col-span-3"
            />
          </div>
          <p className="text-sm text-muted-foreground font-medium">
            Total Price: ₹{totalPrice}
          </p>
        </div>

        <DialogFooter>
          <Button onClick={handleBook}>Pay & Book</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
