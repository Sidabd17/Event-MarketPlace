import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Bell, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  removeNotification,
  clearNotifications,
  markAsRead,
} from '@/redux/notificationSlice';

const NotificationDropDown = () => {
  const notifications = useSelector((state) => state.notification.items);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const unreadCount = notifications.filter((note) => !note.read).length;

  const handleClick = (note) => {
    dispatch(markAsRead(note.id));
    navigate(`/event/description/${note.id}`);
  };

  const handleRemove = (id) => {
    dispatch(removeNotification(id));
  };

  const handleClearAll = () => {
    dispatch(clearNotifications());
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative cursor-pointer">
          <Bell className="text-2xl text-indigo-600 hover:text-indigo-800" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">
              {unreadCount}
            </span>
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-100 mx-5 max-h-[400px] overflow-y-auto border-gray-700 dark:bg-slate-700 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-gray-800 dark:text-gray-200">Notifications</span>
          {notifications.length > 0 && (
            <button
              className="text-xs text-slate-700 dark:text-slate-300 hover:text-gray-600 hover:scale-110 transition-transform duration-200"
              onClick={handleClearAll}
            >
              Clear All
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-slate-300">No new notifications</p>
        ) : (
          <ul className="space-y-3">
            {notifications.map((note) => (
              <li
                key={note.id}
                className={`border-b rounded-md py-1 px-2 flex justify-between items-start ${
                  note.read ? '' : 'bg-sky-100'
                }`}
              >
                <div
                  className="cursor-pointer flex-1"
                  onClick={() => handleClick(note)}
                >
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    {note.type === "updated" ? "🔄 " : "🆕 "}
                    <span className='dark:text-slate-700'>{note.title}</span>
                    {!note.read && (
                      <span className="ml-2 text-[10px] bg-slate-700 text-slate-100 px-2 py-0.5 rounded-full">
                        Unread
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-600">
                    📅 {new Date(note.date).toDateString()}
                  </p>
                </div>

                <button
                  onClick={() => handleRemove(note.id)}
                  className="text-black border border-gray-600 rounded-full text-sm hover:scale-110 ml-2"
                >
                  <X size={12} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationDropDown;
