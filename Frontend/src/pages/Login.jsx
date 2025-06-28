import React, { use, useState } from "react";
import Navbar from "../components/Navbar";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group"
import { Button } from "../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";
import Footer from "@/components/Footer";
import { Dialog, DialogDescription, DialogHeader, DialogTitle, DialogContent } from "@/components/ui/dialog";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);

  const [navbarHeight, setNavbarHeight] = useState(0);
  const [open, setOpen] = useState(false);
  const [openOtpDialog, setOpenOtpDialog] = useState(false);
  const [resent , setResent] = useState(false);

  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const [otp, setOtp] = useState("");

  const changeEventhandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const sendOtpHandler = async () => {
    
    if (!validateEmail(input.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/otp/send-otp`, { email: input.email });

      if (res.data.success) {
        toast.success("OTP sent to your email. Please check your inbox.");
        setOpen(false);
        setOpenOtpDialog(true);
      }
    } catch (error) {
      toast.error(error.response.data.message || "Failed to send OTP. Please try again.");
      console.error("Error sending OTP:", error);
    } finally {
      dispatch(setLoading(false));
    }

  }

  const resentHandler = async () =>{
    setResent(true);
    await sendOtpHandler();
    setResent(false);
  }

  const verifyOtpHandler = async () => {
  
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/otp/verify-otp`, { email: input.email, otp: otp });

      if (res.data.success) {
        toast.success(res.data.message);
        setOpenOtpDialog(false);
        await resetPasswordHandler();
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Error verifying OTP:", error);
      dispatch(setLoading(false));
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/user/login`, input, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      });

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setUser(res.data.user))
        navigate('/');
      }

    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    } finally {
      dispatch(setLoading(false));
    }
  }

  const resetPasswordHandler = async () => {
    if(!validateEmail(input.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if(!input.email || !input.password) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/user/reset-password`, input, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    } finally {
      dispatch(setLoading(false));
    }
  }

  return (
    <div className="dark:bg-[#0a1216]" >
      <Navbar setNavbarHeight={setNavbarHeight} />
      <div style={{ marginTop: `${navbarHeight - 50}px` }}>
        <div className="bg-gradient-to-b from-yellow-50 to-white dark:bg-none dark:to-[#06121f] h-[50vh]" />
        <div className="flex  items-center justify-center -mt-65 max-w-3xl mx-auto ">
          <form
            onSubmit={submitHandler}
            className="w-1/2 border border-gray-200 dark:bg-slate-900 flex flex-col gap-2 rounded-md p-4 my-10"
          >
            <h1 className="font-bold sm:text-sm md:text-lg lg:text-xl mb-5">Login to Your account</h1>
            <div className="my-2 flex flex-col gap-2">
              <Label className={'md:text-md lg:text-lg text-slate-800 dark:text-slate-200'}>Email</Label>
              <Input type="email" name="email" placeholder="Enter your email" 
                className={'dark:bg-gray-100 dark:placeholder:text-slate-400 dark:text-slate-800'}
                onChange={changeEventhandler} />
            </div>
            <div className="my-2 flex flex-col gap-2">
              <Label className={'md:text-md lg:text-lg text-slate-800 dark:text-slate-200'}>Password</Label>
              <Input type="password" placeholder="Enter password" name="password"
                className={'dark:bg-gray-100 dark:placeholder:text-slate-400 dark:text-slate-800'}
                 onChange={changeEventhandler} />
            </div>


            {
              loading ? <Button className={'w-full my-4'}><Loader2 className="animate-spin mr-2 h-4 w-4 dark:text-black dark:bg-cyan-200" />Please Wait</Button> : (
                <div className="flex flex-col gap-3">
                  <Button type="submit" className={'w-full dark:bg-cyan-200 dark:text-gray-600'}>Login</Button>
                </div>
              )
            }
            <h1 className="sm:text-xsm lg:text-sm mt-4">Forgot your password? 
                <button onClick={(e) => { e.preventDefault(); setOpen(true) }} 
                className="text-[#044959] dark:text-emerald-600 font-bold mx-2 cursor-pointer">Reset Password</button>
                </h1>
            <span className="sm:text-xsm lg:text-sm mt-4">Have not created any account yet?<Link to='/signup' className="text-[#044959] dark:text-emerald-600 font-bold mx-2">Signup</Link></span>
          </form>
        </div>
      </div>
      <Footer />

      {
        open && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className={'flex flex-col gap-3  justify-center p-10 w-90'}>
              <DialogHeader>
                <DialogTitle>Reset your password via Email</DialogTitle>
                <DialogDescription>
                  Enter your email to reset your password
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col w-70 gap-2 items-center">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={input.email}
                  onChange={(e) => setInput({ ...input, email: e.target.value })}
                />
                <Input
                  type="password"
                  placeholder="Enter your new password"
                  className="my-4"
                  value={input.password}
                  onChange={(e) => setInput({ ...input, password: e.target.value })}
                />
              </div>

              {
                loading ? (
                  <Button className={'w-70'}><Loader2 className="animate-spin mr-2 h-4 w-4" />Please Wait, Sending OTP</Button>
                ) : (
                  <Button className={'w-70'} onClick={sendOtpHandler} >Submit</Button>
                )
              }

            </DialogContent>
          </Dialog>
        )
      }

      {
        openOtpDialog && (
          <Dialog open={openOtpDialog} onOpenChange={setOpenOtpDialog}>
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

              <Button variant="link" onClick={resentHandler} className="text-sm text-blue-500 underline">Resend OTP</Button>

              {
                loading ? (
                  <Button className={'w-full my-4'}><Loader2 className="animate-spin mr-2 h-4 w-4" />Please Wait, {resent ? "Resending OTP" : "Verifying OTP"}</Button>
                ) : (
                  <Button className={'w-full'} onClick={verifyOtpHandler}>Verify OTP</Button>
                )
              }

            </DialogContent>
          </Dialog>
        )
      }
    </div>
  )
}

export default Login
