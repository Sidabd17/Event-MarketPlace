import { setAllEvents } from '@/redux/eventSlice'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
// import { toast } from 'sonner';

const useGetAllEvents = () => {
   
    const dispatch = useDispatch();

   useEffect(()=>{
    const getEvents = async()=>{
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/event/`,{
                withCredentials: true
            })

            if(res.data.success){
                dispatch(setAllEvents(res.data.events))
            }
        } catch (error) {
            console.log(error);
        }
    }
    getEvents();
   },[])
}

export default useGetAllEvents
