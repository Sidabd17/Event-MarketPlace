import { Dialog, DialogHeader, DialogContent } from "@/components/ui/dialog";
import { setLoading, setUser } from "@/redux/authSlice";
import { Label } from "@radix-ui/react-label";
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const LoginDialog = ({ open, setOpen }) => {

    // const navigate = useNavigate();
    const dispatch = useDispatch();
    const loading = useSelector((state) => state.auth.loading);

    const [input, setInput] = useState({
        email: "",
        password: "",
    });

    const changeEventhandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

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
        <Dialog open={open} onOpenChange={setOpen} >
            <DialogHeader>Login to you account</DialogHeader>
            <DialogContent className="h-[400px] w-[400px] sm:h-[370px] sm:max-w-md ">
                <form
                    onSubmit={submitHandler}
                    className="w-full flex flex-col gap-2 p-1"
                >
                    <h1 className="font-bold text-xl mb-3">Login to Your account</h1>
                    <div className="my-2 flex flex-col gap-2">
                        <Label className={'text-lg text-slate-800'}>Email</Label>
                        <Input type="email" name="email" placeholder="Enter your email"
                            onChange={changeEventhandler} />
                    </div>
                    <div className="my-2 flex flex-col gap-2">
                        <Label className={'text-lg text-slate-800'}>Password</Label>
                        <Input type="password" placeholder="Enter password"
                            name="password" onChange={changeEventhandler} />
                    </div>
                    {
                        loading ? <Button className={'w-full my-4'}><Loader2 className="animate-spin mr-2 h-4 w-4" />Please Wait</Button> : (
                            <div className="flex flex-col gap-3">
                                <Button type="submit" className={'w-full'}>Login</Button>
                            </div>
                        )
                    }
                    <span className="text-sm mt-4">Have not created any account yet?<Link to='/signup' className="text-[#044959] font-bold mx-2">Signup</Link></span>
                </form>
            </DialogContent>
        </Dialog>
    )

}

export default LoginDialog;