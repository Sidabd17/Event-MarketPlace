import { setUserTickets } from '@/redux/ticketSlice';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';


const useGetUserTickets = () => {
  
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
         const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/ticket/mytickets`, {
          withCredentials: true,
        });

        if(res.data.success){
            dispatch(setUserTickets(res.data.tickets));
            console.log("Tickets fetched successfully:", res.data.tickets);
        }
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };
    fetchTickets();
  }, []);

};

export default useGetUserTickets;