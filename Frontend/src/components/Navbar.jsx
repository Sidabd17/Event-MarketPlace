import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { LogOut, MapPin, Ticket, User2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/authSlice";
import axios from "axios";
import { toast } from "sonner";
import DarkModeToggle from "./ui/DarkModeToggle";
import { AiOutlineHeart } from "react-icons/ai";
import SearchBar from "./SearchBar";
import NotificationDropDown from "./NotificationDropDown";
import { useEffect, useRef } from "react";
// import { forwardRef } from "react";

const Navbar = ({setNavbarHeight}) => {
  const { user, cityDetails } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const pathname = location.pathname;

  const pathMap = {
    "/": "home",
    "/movies": "movies",
    "/events": "events",
    "/my-bookings": "myBookings",
    "/calendar": "calendar",                                                   // ← ADDED
    "/admin/dashboard": "dashboard",
    "/admin/events": "myEvents",
  };

  const navli = pathMap[pathname] || "";

  const getnavliStyle = {
    home: "bg-violet-100 text-violet-900 dark:bg-violet-200 dark:text-violet-900",
    movies: "bg-cyan-100 text-cyan-900 dark:bg-cyan-200 dark:text-cyan-900",
    events: "bg-blue-100 text-blue-900 dark:bg-blue-200 dark:text-blue-900",
    myBookings: "bg-yellow-50 text-yellow-900 dark:bg-yellow-100 dark:text-yellow-900",
    calendar: "bg-green-100 text-green-900 dark:bg-green-200 dark:text-green-900",     // ← ADDED
    dashboard: "bg-violet-100 text-violet-900",
    myEvents: "bg-blue-100 text-blue-900",
  };

  const baseStyle = "px-3 py-2 rounded-3xl font-semibold cursor-pointer";
  const activeStyle = getnavliStyle[navli];
  const inactiveStyle = "text-black hover:text-gray-700";
  const getClass = (name) =>
    name === navli ? `${baseStyle} ${activeStyle}` : `${baseStyle} ${inactiveStyle}`;

  const handleClick = (path) => {
    navigate(path);
  };

  const logouthandler = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/user/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderNavLinks = () => {
    if (!user) {
      return ["/", "/movies", "/events", "/calendar"].map((path) => (     // ← ADDED "/calendar"
        <span
          key={path}
          onClick={() => handleClick(path)}
          className={getClass(pathMap[path])}
        >
          {pathMap[path].charAt(0).toUpperCase() + pathMap[path].slice(1)}
        </span>
      ));
    }

    if (user.role === "organizer") {
      return ["/admin/dashboard", "/admin/events" , "/calendar"].map((path) => (
        <span
          key={path}
          onClick={() => handleClick(path)}
          className={getClass(pathMap[path])}
        >
          {pathMap[path].includes("dashboard") ? "Dashboard" : "My Events"}
        </span>
      ));
    }

    if (user.role === "attendee") {
      return ["/", "/movies", "/events", "/calendar"].map((path) => (   // ← ADDED "/calendar"
        <span
          key={path}
          onClick={() => handleClick(path)}
          className={getClass(pathMap[path])}
        >
          {pathMap[path].charAt(0).toUpperCase() + pathMap[path].slice(1)}
        </span>
      ));
    }

    return null;
  };

  const navbarRef = useRef();

  useEffect(() => {
    if (navbarRef.current) {
      setNavbarHeight(navbarRef.current.offsetHeight);
    }
    const handleResize = () => {
      if (navbarRef.current) {
        setNavbarHeight(navbarRef.current.offsetHeight);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [setNavbarHeight]);

  const cityName =
    cityDetails?.city ||
    cityDetails?._normalized_city ||
    cityDetails?.town ||
    cityDetails?.village ||
    cityDetails?.county ||
    cityDetails?.state ||
    null;
  const suburb = cityDetails?.suburb || null;

  return (
    <div ref={navbarRef} className="bg-white fixed px-10 top-0 left-0 right-0 z-50 dark:bg-slate-200 dark:text-black shadow-md">
      <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4 px-4 py-3">

        {/* Brand + Search */}
        <div className="flex items-center justify-center w-full md:w-auto  gap-6">
          <div className="flex items-center gap-2 md:gap-4">
            <h1 className="text-2xl font-bold">
              Event<span className="text-[#F83002]">ify</span>
            </h1>

            <div className="hidden md:block w-[1px] h-12 bg-gray-400 dark:bg-gray-600" />
          </div>


          {(!user || user?.role === "attendee") && <SearchBar />}
        </div>

        {/* Nav Links */}
        <ul className="flex flex-wrap text-sm justify-center items-center gap-2 w-full md:w-auto ">
          {renderNavLinks()}
        </ul>

        {/* Right Side */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-center  ">
          <div className="flex items-center gap-2">
            <MapPin className="text-purple-700" />
            <div className="flex flex-col">
              <span className="text-md font-semibold">{suburb}</span>
              <span className="text-sm text-gray-600">{cityName}</span>
            </div>
          </div>

          <Link to="/saved-events" className="bg-slate-200 dark:bg-white rounded-full p-2">
            <AiOutlineHeart className="text-2xl text-red-500 hover:text-red-500 cursor-pointer  " />
          </Link>

          <DarkModeToggle />
          <NotificationDropDown />

          {!user ? (
            <div className="flex flex-col sm:flex-row gap-2">
              <Link to="/login">
                <Button className="bg-[#100c0b] text-white rounded-sm">Login</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-[#043b5d] text-white rounded-sm">Signup</Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"} alt="user avatar" />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-80 mx-4 border-gray-200 border-2 shadow-sm">
                <div className="flex items-center gap-5">
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"} alt="user avatar" />
                  </Avatar>
                  <div className="flex flex-col">
                    <h4 className="font-bold">{user?.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
                  </div>
                </div>
                <div className="flex flex-col mt-2 items-start text-gray-900">
                  {user?.role === "attendee" && (
                    <div className="flex items-center gap-2">
                      <User2 className="dark:text-white" />
                      <Button variant="link">
                        <Link to="/profile">View Profile</Link>
                      </Button>
                    </div>
                  )}
                  <div className="flex items-center mt-2 gap-2">
                    <LogOut className="dark:text-white" />
                    <Button onClick={logouthandler} variant="link">
                      Logout
                    </Button>
                  </div>
                 {user?.role === "attendee" && (
                   <div className="flex items-center mt-2 gap-2">
                    <Ticket className="dark:text-white" />
                    <Button onClick={() => navigate("/my-bookings")} variant="link">
                      View Bookings
                    </Button>
                  </div>
                 )} 
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
   );
}

export default Navbar;