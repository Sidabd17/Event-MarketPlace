// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyALk0VSlILwf96-1Ypk7wUM_bNFUf2Fqrk",
  authDomain: "eventify-7f80f.firebaseapp.com",
  projectId: "eventify-7f80f",
  messagingSenderId: "69715184163",
  appId: "1:69715184163:web:b0c34ba58bbd551cfeff96",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const title = payload.notification?.title || 'New Notification';
  const body = payload.notification?.body || '';
  const image = payload.data?.image;
  // const icon = payload.data?.icon || '/logo192.png';
  const click_action = payload.data?.click_action || '/';

  const notificationOptions = {
    body,
    // icon: icon || '/logo192.png',  // fallback to app logo
    image,                         // show banner (if present)
    data: { click_action },
  };

  self.registration.showNotification(title, notificationOptions);
});

// ✅ Redirect when user clicks on notification
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const url = event.notification.data?.click_action || '/';
  event.waitUntil(clients.openWindow(url));
});
