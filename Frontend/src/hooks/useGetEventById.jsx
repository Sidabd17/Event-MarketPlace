import axios from "axios";
import { useEffect }  from "react";
import { useDispatch } from "react-redux";
// import { toast } from "sonner";

import { setSelectedEvent} from "../redux/eventSlice";

const useGetEventById = (id)=>{

    const dispatch = useDispatch();

    useEffect(()=>{
        const getEventById = async(id)=>{
             try{
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/event/${id}`,{
                    withCredentials: true
                })
    
                if(res.data.success){
                    dispatch(setSelectedEvent(res.data.event))
                    // toast.success(res.data.message);
                    // console.log(res.data.job);
                }
             }catch(error){
                console.log(error);
             }
        }
        getEventById(id);
    },[id, dispatch])
}

export default useGetEventById;