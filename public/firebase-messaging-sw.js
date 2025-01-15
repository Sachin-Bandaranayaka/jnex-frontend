importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in the messagingSenderId
firebase.initializeApp({
  apiKey: "AIzaSyCHNnZIUw1IQGUkPN7zLPLXbUS9MCvj-WQ",
  authDomain: "jnex-90570.firebaseapp.com",
  projectId: "jnex-90570",
  storageBucket: "jnex-90570.firebasestorage.app",
  messagingSenderId: "589021699009",
  appId: "1:589021699009:web:a670d1766b349a3cf06d40"
});

// Retrieve Firebase Messaging instance
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png', // Update with your actual icon path
    badge: '/logo.png', // Update with your actual badge path
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
