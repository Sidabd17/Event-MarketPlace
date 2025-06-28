import { createSlice } from "@reduxjs/toolkit"; 


const eventSlice = createSlice({
    name:"event",
    initialState:{
        allEvents:[],
        selectedEvent:null,
        organizerEvents:[],
        searchInput:"",
        savedEvents:[],
        movies:[],
    },
    reducers:{
        setAllEvents :(state , action)=>{state.allEvents = action.payload},
        setSelectedEvent :(state , action)=>{state.selectedEvent = action.payload},
        setOrganizerEvents :(state , action)=>{state.organizerEvents = action.payload},
        setSearchInput :(state , action)=>{state.searchInput = action.payload}, 
        setSavedEvents :(state , action)=>{state.savedEvents = action.payload},
        setMovies :(state , action)=>{state.movies = action.payload},
    }
})

export const {setAllEvents , setSelectedEvent , setOrganizerEvents , setSearchInput,setSavedEvents,setMovies} = eventSlice.actions;
export default eventSlice.reducer;