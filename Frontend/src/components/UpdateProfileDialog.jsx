import React, { useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
// import { DialogTitle } from '@radix-ui/react-dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'
import {motion} from 'framer-motion'

const UpdateProfileDialog = ({open ,setOpen}) => {

    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const {user} = useSelector((store)=>store.auth);


    const [input, setInput] = useState({
        name:user?.name,
        email:user?.email,
        phoneNumber:user?.phoneNumber,
        bio:user?.profile?.bio,
        interests:user?.profile?.interests?.join(',') || '',
        file:user?.profile?.resume
    })

    const changeEventhandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
      };
    
      const fileChangeHandler = (e)=>{
        const file = e.target.files?.[0];
        // console.log("Selected file:", file); // ✅ check this
        setInput({ ...input, file });
      }

      const submithandler = async (e) =>{
        e.preventDefault();
        // console.log('submit fired'); 
        // console.log("input state:", input);
        setLoading(true);

        const formData = new FormData();
                formData.append("name", input.name);  
                formData.append("email", input.email);  
                formData.append("phoneNumber", input.phoneNumber);  
                formData.append("bio", input.bio);  
                formData.append("interests", input.interests);  
                if(input.file)formData.append("file", input.file);

                // console.log(formData.entries);

           try {
                
                const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/v1/user/profile/update`, formData ,{
                    headers:{
                        "Content-Type": "multipart/form-data"
                    },
                    withCredentials: true
                });

                if(res.data.success){
                    const user = res.data?.user;
                    console.log(user);
                    dispatch(setUser(user));
                    toast.success(res.data.message)
                }
           } catch (error) {
              console.log(error);
              toast.error(error.response.data.message)
           }finally{
            setLoading(false);
           }
           setOpen(false);
      }

  return (
    <motion.div 
    initial={{opacity:0 , x:100}}
    animate={{opacity:1 , x:0}}
    exit={{opacity:0, x:100}}
    transition={{duration:0.3}}
    
    >
        <Dialog open={open}>
           <DialogContent className={"sm:max-w-[425px]"} onInteractOutside={()=>setOpen(false)} >
             <DialogHeader>
                <DialogTitle>Update Profile</DialogTitle>
             </DialogHeader>

             <form onSubmit={submithandler}>
                <div className='grid gap-4 py-4'>
                    <div className='grid grid-cols-4 items-center gap-4'>

                        <Label htmlFor="name" className={"text-right"}>Name</Label>
                        <Input
                        id="name"
                        name="name"
                        type="text"
                        value={input.name}
                        onChange={changeEventhandler}
                        className={"col-span-3"}
                        />
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>

                        <Label htmlFor="email" className={"text-right"}>Email</Label>
                        <Input
                        id="email"
                        name="email"
                        type="email"
                        value={input.email}
                        onChange={changeEventhandler}
                        className={"col-span-3"}
                        />
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>

                        <Label htmlFor="phoneNumber" className={"text-right"}>Number</Label>
                        <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        value={input.phoneNumber}
                        onChange={changeEventhandler}
                        className={"col-span-3"}
                        />
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>

                        <Label htmlFor="bio" className={"text-right"}>Bio</Label>
                        <Input
                        id="bio"
                        name="bio"
                        value={input.bio}
                        onChange={changeEventhandler}
                        className={"col-span-3"}
                        />
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor="interests" className={"text-right"}>Interests</Label>
                        <Input
                        id="interests"
                        name="interests"
                        value={input.interests}
                        onChange={changeEventhandler}
                        className={"col-span-3"}
                        />
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor="file" className={"text-right"}>Profile Pic</Label>
                        <Input
                        id="file"
                        name="file"
                        type="file"
                        onChange={fileChangeHandler}
                        accept="image/*"
                        className={"col-span-3"}
                        />
                    </div>
                </div>

                <DialogFooter>
                    {
                        loading ? <Button className={'w-full my-4'}><Loader2 className="animate-spin mr-2 h-4 w-4" />Please Wait</Button> :(
                            
                            <Button type="submit" className={'w-full my-4'}>update</Button>
        
                        )
                    }

                </DialogFooter>
             </form>
           </DialogContent>
        </Dialog>
    </motion.div>
  )
}

export default UpdateProfileDialog