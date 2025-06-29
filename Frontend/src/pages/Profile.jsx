import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Avatar, AvatarImage } from "../components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../components/ui/button";
import { Contact, Loader2, Mail, Pen } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Label } from "../components/ui/label";
// import AppliedJobtable from "./AppliedJobtable";
import UpdateProfileDialog from "../components/UpdateProfileDialog";
import { useNavigate } from "react-router-dom";
import { Popover, PopoverTrigger, PopoverContent } from "../components/ui/popover";
import { Input } from "../components/ui/input";
import axios from "axios";
import { toast } from "sonner";
import { setUser } from "@/redux/authSlice";
import { motion } from 'framer-motion'
import useGetUserTickets from "@/hooks/useGetUserTickets";
import JoinedEventTable from "@/components/JoinedEventTable";
import useGetUserMovieTickets from "@/hooks/useGetUserMovieTickets";
import Footer from "@/components/Footer";
import JoinedMovies from "@/components/JoinedMovies";


const Profile = () => {

    useGetUserTickets();
    useGetUserMovieTickets();

    const { userTickets, userMovieTickets } = useSelector((store) => store.ticket);

    const userEvents = userTickets?.map((ticket) => ticket.event) || [];

    const [open, setOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [navbarHeight, setNavbarHeight] = useState(0);

    const { user } = useSelector((store) => store.auth);
    // console.log("Profile" ,user?.profile?.profilePhoto);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!user) navigate('/login');
    }, [user])


    const profileChangeHandler = async () => {
        // console.log(file);
        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/v1/user/profile/update/profilephoto`, formData, { withCredentials: true });
            if (res.data.success) {
                toast.success(res.data.message);
                dispatch(setUser(res.data.user))
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    const getProfilePhoto = () => {
        const photo = user?.profile?.profilePhoto?.trim();
        return photo ? photo : "https://github.com/shadcn.png";
    };

    return (
        <div className="dark:bg-[#0a1216]">
            <Navbar setNavbarHeight={setNavbarHeight} />
            <div style={{ marginTop: `${navbarHeight - 50}px` }} >
                <div className="h-[50vh] bg-gradient-to-b from-yellow-100 to-white dark:bg-none " />
                <motion.div
                    initial={{ opacity: 0, y: -100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 100 }}
                    transition={{ duration: 0.3 }}
                    className="-mt-80 px-4"
                >

                    <div
                        className="max-w-4xl mx-auto bg-gradient-to-b from-cyan-100 to-white dark:bg-gradient-to-b dark:from-cyan-400 dark:to-cyan-100 shadow-lg border border-gray-200 rounded-2xl my-20 p-8">
                        <div className="flex justify-between">
                            <div className="flex items-center gap-4">
                                <Avatar className={"h-16 w-16 sm:h-24 sm:w-24"}>
                                    <Popover>
                                        <PopoverTrigger>
                                            <AvatarImage src={getProfilePhoto()} alt="https://github.com/shadcn.png" />
                                        </PopoverTrigger>
                                        <PopoverContent className={'flex flex-col gap-3'}>
                                            <AvatarImage className={'w-20 rounded-full '}
                                                src={getProfilePhoto()}
                                                alt="Profile photo"
                                            />
                                            <div className="flex gap-2">

                                                <Label className={'font-medium text-md'}>Upload</Label>
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        setFile(e.target.files[0]);
                                                    }}
                                                />
                                            </div>
                                            <Button onClick={profileChangeHandler}>{
                                                loading ? (<><Loader2 className="animate-spin h-4 w-4 mr-2" /> <span>Loading... please wait</span> </>) : (
                                                    <span>Upload new profile pic</span>
                                                )
                                            }
                                            </Button>
                                        </PopoverContent>
                                    </Popover>

                                </Avatar>
                                <div>
                                    <h1 className="font-semibold text-2xl text-[#1e293b] ">{user?.name} </h1>
                                    <p className="text-[#2e343d] text-sm">
                                        {user?.profile.bio}
                                    </p>
                                </div>
                            </div>

                            <Button onClick={() => setOpen(true)} variant={"outline"} className={"text-right dark:text-black dark:border-gray-700"}>
                                <Pen />
                            </Button>

                        </div>

                        <div className="flex flex-col  gap-4 my-5">
                            <div className="flex items-center gap-3">
                                <Mail className="dark:text-black" />
                                <span className="text-[#2563eb] hover:underline cursor-pointer">{user?.email}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Contact className="dark:text-black" />
                                <span className="text-slate-700">{user?.phoneNumber}</span>
                            </div>
                        </div>

                        <div>
                            <h1 className="font-bold text-lg mb-2 dark:text-black">Interests</h1>
                            <div className="flex gap-3 items-center">
                                {
                                    user?.profile?.interests.length > 0 ? user?.profile?.interests.map((item, ind) =>
                                        <Badge className={'px-4 py-2 rounded-full bg-[#d1fae5] text-black border border-[#6ee7b7]  '}
                                            key={ind}>{item}
                                        </Badge>) : (
                                        <Button className={'w-full max-w-sm'} onClick={() => setOpen(true)}>Add your interests or preferences</Button>)
                                }
                            </div>
                        </div>

                    </div>

                    <div className="max-w-4xl mx-auto dark:text-gray-100 dark:bg-none rounded-2xl">
                        <h1 className="font-bold text-xl my-2" >Joined Events</h1>
                        {
                            userEvents.length > 0 ? (
                                <JoinedEventTable joinedEvents={userEvents} />
                            ) : (
                                <p className="text-center text-gray-500">No events joined yet.</p>
                            )
                        }
                    </div>

                    <div className="max-w-4xl mx-auto mb-5 dark:text-gray-100 rounded-2xl">
                        <h1 className="font-bold text-xl my-2" >Movie Tickets</h1>
                        {
                            userMovieTickets.length > 0 ? (
                                <JoinedMovies tickets={userMovieTickets} />
                            ) : (
                                <p className="text-center text-gray-500">No movie tickets purchased yet.</p>
                            )
                        }
                    </div>

                </motion.div>


                <Footer />

                <UpdateProfileDialog open={open} setOpen={setOpen} />
            </div>
        </div>
    );
};

export default Profile;
