import { createSlice } from "@reduxjs/toolkit";

const ticketSlice = createSlice({
    name: "ticket",
    initialState: {
        userTickets:[],
        userMovieTickets:[]
    },
    reducers: {
        setUserTickets: (state, action) => {
            state.userTickets = action.payload;
        },
        setUserMovieTickets: (state, action)=>{
            state.userMovieTickets = action.payload
        }
    },
});

export const { setUserTickets, setUserMovieTickets } = ticketSlice.actions;
export default ticketSlice.reducer;