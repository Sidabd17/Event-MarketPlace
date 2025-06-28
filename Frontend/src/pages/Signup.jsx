import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";
import Footer from "@/components/Footer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

const Signup = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [otp, setOtp] = useState("");

  const { loading } = useSelector((state) => state.auth);

  const [navbarHeight, setNavbarHeight] = useState(0);

  const [input, setInput] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: "",
  });

  const changeEventhandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files[0] });
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const sendOtpHandler = async (e) => {
    e.preventDefault(); 
    

    if(!input.email || !input.name || !input.phoneNumber || !input.password) {
      toast.error("Please fill in all fields.");
      return;
    }
    
    if(!validateEmail(input.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/otp/send-otp`, { email: input.email });

      if (res.data.success){
        toast.success("OTP sent to your email. Please check your inbox.");
        setShowOtpDialog(true);
      }
    } catch (error) {
      toast.error("An error occurred while sending the OTP.");
      console.error("Error sending OTP:", error);
    }finally{
      dispatch(setLoading(false));
    }

  }

  const verifyOtpHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/otp/verify-otp`, { email: input.email, otp: otp });

      if (res.data.success){
        toast.success(res.data.message);
        setShowOtpDialog(false);

        await submitHandler(e);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Error verifying OTP:", error);
      dispatch(setLoading(false));
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault();

    dispatch(setLoading(true));

    try {
      const formData = new FormData();
      formData.append("name", input.name);
      formData.append("email", input.email);
      formData.append("password", input.password);
      formData.append("phoneNumber", input.phoneNumber);
      formData.append("role", input.role);
      if (input.file) formData.append("file", input.file);

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/user/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        withCredentials: true
      });

      if (res.data.success) {
        toast.success(res.data.message);
        console.log(res.data);
        navigate('/login');
      }

    } catch (error) {
      toast.error(error.response.data.message);
      // console.log(error);

    } finally {
      dispatch(setLoading(false));
    }
  }

  return (
    <div className="dark:bg-[#0a1216]">
      <Navbar setNavbarHeight={setNavbarHeight} navbarHeight={navbarHeight} />
      <div style={{ marginTop: `${navbarHeight - 50}px` }}>
        <div className="bg-gradient-to-b from-cyan-100 to-white dark:bg-none h-[40vh]" />
        <div className="flex items-center -mt-50 mb-5 justify-center max-w-5xl mx-auto">
          <form
            onSubmit={(e)=> e.preventDefault()}
            className="w-1/2 border border-gray-200 dark:bg-slate-700 rounded-md p-4 my-10"
          >
            <h1 className="font-bold text-xl mb-5">Create a fresh account</h1>
            <div className="my-2 flex flex-col gap-2">
              <Label>Full name</Label>
              <Input
                type="text"
                placeholder="Enter your full name"
                name="name"
                onChange={(e) => changeEventhandler(e)}
              />
            </div>
            <div className="my-2 flex flex-col gap-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="Enter your email"
                name="email"
                onChange={(e) => changeEventhandler(e)}
              />
            </div>
            <div className="my-2 flex flex-col gap-2">
              <Label>Phone Number</Label>
              <Input
                type="text"
                placeholder="Enter your phone number"
                name="phoneNumber"
                onChange={(e) => changeEventhandler(e)}
              />
            </div>
            <div className="my-2 flex flex-col gap-2">
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Enter password"
                name="password"
                onChange={(e) => changeEventhandler(e)}
              />
            </div>
            <div className="my-2 flex flex-col lg:flex-row md:flex-row sm:flex-col item-center justify-between gap-3 md:gap-4 lg:gap-6">
              <RadioGroup defaultValue="student">
                <div className="flex items-center gap-4 my-3">
                  <div className="flex items-center space-x-2">
                    <Input
                      type="radio"
                      name="role"
                      value="attendee"
                      className={"cursor-pointer"}
                      checked={input.role === "attendee"}
                      onChange={(e) => changeEventhandler(e)}
                    />
                    <Label htmlFor="r1">User</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="radio"
                      name="role"
                      value="organizer"
                      className={"cursor-pointer"}
                      checked={input.role === "organizer"}
                      onChange={(e) => changeEventhandler(e)}
                    />
                    <Label htmlFor="r2">Organizer</Label>
                  </div>
                </div>
              </RadioGroup>

              <div className="flex gap-2 items-center">
                <Label>Profile</Label>
                <Input
                  accept="image/*"
                  className="cursor-pointer"
                  type="file"
                  onChange={(e) => changeFileHandler(e)} />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {
                loading ? (<Button className={'w-full my-4'}><Loader2 className="animate-spin mr-2 h-4 w-4" />Please Wait</Button>) : (
                  <Button  
                   className={"w-full"}
                   onClick={sendOtpHandler}
                   >
                    Sign Up
                  </Button>
                )
              }

              <span className="text-sm">
                Already have an account?
                <Link to="/login" className="text-[#044959] dark:text-emerald-400 font-bold mx-2">
                  Login
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>

      <Footer />

      {
        showOtpDialog && (
          <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Verify Email</DialogTitle>
                <DialogDescription>
                  An OTP has been sent to your email. Please enter it below to continue.
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-4 py-4">
                <Input
                  type="text"
                  placeholder="Enter OTP you received"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>

               {
                loading ? <Button className={'w-full my-4'}><Loader2 className="animate-spin mr-2 h-4 w-4" />Please Wait</Button> : (
                  <Button onClick={verifyOtpHandler} className="w-full">
                    Verify OTP
                  </Button>
                )
               }
                <Button variant="outline" className="w-full" onClick={() => setShowOtpDialog(false)}>
                  Cancel
                </Button>
              
            </DialogContent>
          </Dialog>
        )
      }

    </div>
  );
};

export default Signup;
