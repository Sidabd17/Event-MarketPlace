import { setOrganizerEvents } from '@/redux/eventSlice';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {toast} from "sonner";

const useGetOrganizerEvents = ()=>{
    const dispatch = useDispatch();

    useEffect(()=>{
        const getOrganizerEvents = async()=>{
            try{
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/event/my-events` , {
                    withCredentials: true
                })

                if(res.data.success){
                    // toast.success(res.data.message);
                    dispatch(setOrganizerEvents(res.data.createdEvents));
                }
            }catch(error){
                console.log(error);
                toast.error(error.data.message);
            }
        }
        getOrganizerEvents();
    },[])
}

export default useGetOrganizerEvents;