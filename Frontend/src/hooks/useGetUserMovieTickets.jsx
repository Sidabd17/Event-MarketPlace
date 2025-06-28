import { setUserMovieTickets } from '@/redux/ticketSlice';
import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

const useGetUserMovieTickets = () => {
  const dispatch = useDispatch();
   
  useEffect(()=>{
    const getUserMovieTickets = async() =>{
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/movie/mybookings` , {withCredentials: true});
            
            if(res.data.success){
                dispatch(setUserMovieTickets(res.data.bookings));
                console.log(res.data.bookings);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }
    getUserMovieTickets();
  },[])
}

export default useGetUserMovieTickets