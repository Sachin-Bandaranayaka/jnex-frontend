importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyCHNnZIUw1IQGUkPN7zLPLXbUS9MCvj-WQ",
  authDomain: "jnex-90570.firebaseapp.com",
  projectId: "jnex-90570",
  storageBucket: "jnex-90570.firebasestorage.app",
  messagingSenderId: "589021699009",
  appId: "1:589021699009:web:a670d1766b349a3cf06d40",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message:", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/vercel.svg",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
