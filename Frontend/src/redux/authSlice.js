import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:"auth",
    initialState:{
        user:null,
        loading:false,
        cityDetails:[],
    },
    reducers:{
        setUser:(state , action)=>{state.user = action.payload},
        setCityDetails:(state , action)=>{state.cityDetails = action.payload},
        setLoading:(state , action)=>{state.loading = action.payload} 
    }
})

export const {setCityDetails, setUser,setLoading} = authSlice.actions;
export default authSlice.reducer;