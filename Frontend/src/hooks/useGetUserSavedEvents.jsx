import axios from "axios";
import { useDispatch } from "react-redux";
import { setSavedEvents } from "../redux/eventSlice";
import { useEffect } from "react";

const useGetUserSavedEvents = ()=> {

    const dispatch = useDispatch();

    useEffect(()=>{
        const fetchSavedEvents = async()=>{
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/event/saved-events` , {withCredentials: true}); 
                if(res.data.success){
                    dispatch(setSavedEvents(res.data.savedEvents));
                }
            } catch (error) {
                console.log(error);
            }  
        }
        fetchSavedEvents();
    },[])
}

export default useGetUserSavedEvents