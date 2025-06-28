import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "lucide-react";

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-2 py-2 rounded-full shadow-lg bg-slate-200 text-blue-800  transition"
    >
      {isDark ? <SunIcon size={18} /> : <MoonIcon size={22} />}
      {/* <span className="text-sm">{isDark ? "Light Mode" : "Dark Mode"}</span> */}
    </button>
  );
};

export default DarkModeToggle;
