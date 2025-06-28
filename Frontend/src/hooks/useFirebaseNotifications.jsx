// src/hooks/useFirebaseNotifications.js
import { useEffect } from 'react';
import { messaging, getToken, onMessage } from '../Firebase/Firebase';
import { toast } from 'sonner';

export const useFirebaseNotifications = (userId) => {
  useEffect(() => {
    if (!userId) return;

    Notification.requestPermission().then(async (permission) => {
      if (permission === 'granted') {
        const token = await getToken(messaging, {
          vapidKey:  "BBHe2vbVMg1MAIKfhWQuRmB1DVu0W1cP1rKowsSqDxVmFqb9jAylz6M7P44DA5y4c4BhvX0YAl31K6l2-Tz_jsc",
        });

        if (token) {
          // send token to backend
          await fetch(`${import.meta.env.VITE_API_URL}/api/v1/notification/register-token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, userId }),
          });
        }
      }
    });

    // Listen for foreground messages
    onMessage(messaging, (payload) => {
      toast(payload.notification.title + ' - ' + payload.notification.body);
    });
  }, [userId]);
};
