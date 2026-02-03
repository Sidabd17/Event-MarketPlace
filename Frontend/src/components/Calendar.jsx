import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, CalendarDays, Clock, MapPin, Ticket } from "lucide-react";
import useGetAllEvents from "@/hooks/useGetAllEvents";

// ─── Helpers ────────────────────────────────────────────────────────────────
const parseDate = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
};

const toDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const DAYS   = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// ─── Category → color system ────────────────────────────────────────────────
const CATEGORY_COLORS = {
  concert:    { dot: "bg-fuchsia-500",  border: "border-fuchsia-500",  light: "bg-fuchsia-500/10", text: "text-fuchsia-400" },
  conference: { dot: "bg-cyan-400",     border: "border-cyan-400",     light: "bg-cyan-400/10",    text: "text-cyan-400" },
  workshop:   { dot: "bg-amber-400",    border: "border-amber-400",    light: "bg-amber-400/10",   text: "text-amber-400" },
  seminar:    { dot: "bg-emerald-400",  border: "border-emerald-400",  light: "bg-emerald-400/10", text: "text-emerald-400" },
  sports:     { dot: "bg-orange-400",   border: "border-orange-400",   light: "bg-orange-400/10",  text: "text-orange-400" },
  default:    { dot: "bg-violet-500",   border: "border-violet-500",   light: "bg-violet-500/10",  text: "text-violet-400" },
};

const getColor = (category) => CATEGORY_COLORS[(category || "").toLowerCase()] || CATEGORY_COLORS.default;

// ─── Component ──────────────────────────────────────────────────────────────
const Calendar = () => {
  useGetAllEvents();
  const { allEvents } = useSelector((state) => state.event);
  const navigate = useNavigate();

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [direction, setDirection] = useState(1);

  // ── Group events by date ────────────────────────────────────────────────
  const eventsByDate = useMemo(() => {
    const map = {};
    allEvents.forEach((event) => {
      const parsed = parseDate(event.date);
      if (!parsed) return;
      const key = toDateKey(parsed);
      if (!map[key]) map[key] = [];
      map[key].push(event);
    });
    return map;
  }, [allEvents]);

  // ── Calendar grid cells ─────────────────────────────────────────────────
  const calendarDays = useMemo(() => {
    const firstDay    = new Date(currentYear, currentMonth, 1);
    const lastDay     = new Date(currentYear, currentMonth + 1, 0);
    const startOffset = firstDay.getDay();
    const rows        = Math.ceil((startOffset + lastDay.getDate()) / 7);
    const days = [];
    for (let i = 0; i < rows * 7; i++) {
      const dayNum = i - startOffset + 1;
      if (dayNum < 1 || dayNum > lastDay.getDate()) {
        days.push(null);
      } else {
        const key = toDateKey(new Date(currentYear, currentMonth, dayNum));
        const categories = (eventsByDate[key] || []).map(e => (e.category || "default").toLowerCase());
        const uniqueCats = [...new Set(categories)];
        days.push({ dayNum, key, hasEvents: !!eventsByDate[key], uniqueCats, isToday: key === toDateKey(today) });
      }
    }
    return days;
  }, [currentMonth, currentYear, eventsByDate]);

  // ── Filtered list ───────────────────────────────────────────────────────
  const filteredEvents = useMemo(() => {
    if (!selectedDate) return [];
    return eventsByDate[selectedDate] || [];
  }, [selectedDate, eventsByDate]);

  // ── Navigation ──────────────────────────────────────────────────────────
  const goToPrevMonth = () => {
    setDirection(-1);
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else { setCurrentMonth(m => m - 1); }
  };
  const goToNextMonth = () => {
    setDirection(1);
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else { setCurrentMonth(m => m + 1); }
  };

  const selectedDateLabel = useMemo(() => {
    if (!selectedDate) return null;
    const [y, m, d] = selectedDate.split("-").map(Number);
    return `${MONTHS[m - 1]} ${d}, ${y}`;
  }, [selectedDate]);

  const monthKey = `${currentYear}-${currentMonth}`;

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen overflow-hidden dark:bg-[#0a1216] bg-[#f9f9f9]">

      {/* ── Animated gradient orbs — pure background atmosphere ── */}
      <div className="absolute inset-0 -z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-violet-600/25 blur-[130px] animate-pulse" style={{ animationDuration: "4s" }} />
        <div className="absolute -top-10 -right-32 w-[380px] h-[380px] rounded-full bg-fuchsia-500/18 blur-[110px] animate-pulse" style={{ animationDuration: "5.5s" }} />
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full bg-cyan-500/12 blur-[120px] animate-pulse" style={{ animationDuration: "7s" }} />
        <div className="absolute top-1/2 -right-20 w-[250px] h-[250px] rounded-full bg-pink-500/15 blur-[90px] animate-pulse" style={{ animationDuration: "6s" }} />
      </div>

      {/* ── Main content ── */}
      <motion.div
        initial={{ opacity: 0, y: -60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 60 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 max-w-2xl mx-auto px-4 py-10"
      >

        {/* ── Gradient Title ── */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-3 mb-2">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 shadow-lg shadow-violet-500/30">
              <CalendarDays size={24} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              Event Calendar
            </h1>
          </div>
          <p className="text-sm text-gray-500">Browse upcoming events by date</p>
        </div>

        {/* ── Glassmorphism Calendar Card ── */}
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl shadow-black/30 p-5">

          {/* Month Navigator */}
          <div className="flex items-center justify-between mb-5">
            <button
              onClick={goToPrevMonth}
              className="w-10 h-10 rounded-2xl dark:bg-white/8 bg-gray-200 hover:bg-white/18 border dark:border-white/10 border-gray-800 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <ChevronLeft size={18} className="text-gray-800 dark:text-gray-300 " />
            </button>

            <div>
              <span className="text-xl font-bold text-slate-700 dark:text-white tracking-wide">{MONTHS[currentMonth]}</span>
              <span className="text-violet-400 font-semibold ml-2">{currentYear}</span>
            </div>

            <button
              onClick={goToNextMonth}
              className="w-10 h-10 rounded-2xl dark:bg-white/8 bg-gray-200 hover:bg-white/18 border dark:border-white/10 border-gray-800  flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <ChevronRight size={18} className="text-gray-800 dark:text-gray-300" />
            </button>
          </div>

          {/* Day-of-week headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-xs font-bold text-gray-500 py-1.5 uppercase tracking-widest">{d}</div>
            ))}
          </div>

          {/* Day cells — AnimatePresence for smooth month slide */}
          <AnimatePresence mode="wait">
            <motion.div
              key={monthKey}
              initial={{ opacity: 0, x: direction * 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -28 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="grid grid-cols-7 gap-y-1.5"
            >
              {calendarDays.map((day, i) => {
                if (!day) return <div key={`e-${i}`} className="h-14" />;
                const isSelected = selectedDate === day.key;

                return (
                  <div
                    key={day.key}
                    onClick={() => setSelectedDate((prev) => (prev === day.key ? null : day.key))}
                    className={[
                      "h-14 flex flex-col items-center justify-center rounded-2xl cursor-pointer relative transition-all duration-200",
                      isSelected
                        ? "bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 shadow-lg shadow-violet-500/40 scale-[1.08]"
                        : day.isToday
                          ? "bg-white/8 border border-violet-400/50 shadow-md shadow-violet-500/20"
                          : day.hasEvents
                            ? "bg-white/5 border border-transparent hover:bg-white/12 hover:border-white/15"
                            : "hover:bg-white/6",
                    ].join(" ")}
                  >
                    <span className={[
                      "text-sm font-bold leading-none",
                      isSelected ? "text-white" : day.isToday ? "text-violet-300" : day.hasEvents ? "text-gray-800 dark:text-gray-300" : "text-gray-600",
                    ].join(" ")}>
                      {day.dayNum}
                    </span>

                    {/* Multi-color category dots */}
                    {day.hasEvents && (
                      <div className="flex gap-1 mt-1.5">
                        {day.uniqueCats.slice(0, 3).map((cat, idx) => {
                          const c = getColor(cat);
                          return <span key={idx} className={["h-1.5 w-1.5 rounded-full", isSelected ? "bg-white/70" : c.dot].join(" ")} />;
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Legend ── */}
        <div className="mt-4 flex items-center justify-center gap-6 flex-wrap">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-500" />
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </div>
            Events
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="h-4 w-4 rounded-lg border border-violet-400/50 bg-white/8 inline-block" />
            Today
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="h-4 w-4 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 inline-block" />
            Selected
          </div>
        </div>

        {/* ── Event List Section ── */}
        <div className="mt-8">
          {/* Heading */}
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-base font-bold text-white">
              {selectedDateLabel ? (
                <>
                  Events on{" "}
                  <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                    {selectedDateLabel}
                  </span>
                </>
              ) : (
                <span className="text-gray-500 font-normal text-sm">👆 Select a date to explore</span>
              )}
            </h2>
            {filteredEvents.length > 0 && (
              <span className="text-xs font-bold bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white px-3 py-1 rounded-full shadow-md shadow-violet-500/30">
                {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Empty state */}
          {selectedDate && filteredEvents.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-14 rounded-3xl border border-white/8 bg-white/3"
            >
              <p className="text-4xl mb-2">🎭</p>
              <p className="text-gray-500 text-sm">No events on this day</p>
            </motion.div>
          )}

          {/* Staggered event cards */}
          <div className="flex flex-col gap-3">
            <AnimatePresence>
              {filteredEvents.map((event, idx) => {
                const color = getColor(event.category);
                return (
                  <motion.div
                    key={event._id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25, delay: idx * 0.07 }}
                    onClick={() => navigate(`/event/description/${event._id}`)}
                    className={[
                      "group relative flex gap-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4",
                      "cursor-pointer transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:shadow-lg hover:shadow-black/30 hover:-translate-y-0.5",
                      "border-l-[3px]", color.border,
                    ].join(" ")}
                  >
                    {/* Subtle colored glow behind card on hover */}
                    <div className={["absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10 -m-2", color.light].join(" ")} />

                    {/* Thumbnail */}
                    {event.image && (
                      <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border border-white/10 shadow-md shadow-black/30">
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex flex-col justify-between min-w-0 flex-1">
                      {/* Top row */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-bold dark:text-white text-black text-sm truncate">{event.title}</h3>
                          <div className="flex items-center gap-1 mt-0.5">
                            <MapPin size={11} className="text-gray-500 flex-shrink-0" />
                            <p className="text-xs text-gray-800 dark:text-gray-200 truncate">{event.venue}, {event.location}</p>
                          </div>
                        </div>
                        {/* Category tag */}
                        <span className={["inline-flex text-xs font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0 capitalize", color.light, color.text].join(" ")}>
                          {event.category || "General"}
                        </span>
                      </div>

                      {/* Bottom badges row */}
                      <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                        {event.time && (
                          <div className="flex items-center gap-1.5 bg-white/8 rounded-lg px-2.5 py-0.5">
                            <Clock size={11} className="text-violet-400" />
                            <span className="text-xs text-gray-800 dark:text-gray-200">{event.time}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-1.5 bg-white/8 rounded-lg px-2.5 py-0.5">
                          <Ticket size={11} className={color.text} />
                          <span className="text-xs font-bold dark:text-white text-black">
                            {event.price === 0 ? "Free" : `₹${event.price}`}
                          </span>
                        </div>

                        <span className={[
                          "text-xs font-semibold px-2.5 py-0.5 rounded-lg",
                          event.availableTickets > 0 ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400",
                        ].join(" ")}>
                          {event.availableTickets > 0 ? `${event.availableTickets} left` : "Sold out"}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Calendar;