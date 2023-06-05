
// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

var firebaseConfig = {
  apiKey: "AIzaSyAZQSuuPakT6Xe3afozMQR9AKzAHt3p1QA",
  authDomain: "fca-tracker-70cc4.firebaseapp.com",
  projectId: "fca-tracker-70cc4",
  storageBucket: "fca-tracker-70cc4.appspot.com",
  messagingSenderId: "769003049672",
  appId: "1:769003049672:web:43ef5b66cd9a7fa9a98bfd",
  measurementId: "G-2Z0C6H1MZP"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// messaging.onBackgroundMessage(function(payload) {
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//   };

//   self.registration.showNotification(notificationTitle,
//     notificationOptions);
// });