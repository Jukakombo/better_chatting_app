import firebase from "firebase/app";
import "firebase/auth";

export const auth = firebase
  .initializeApp({
    apiKey: "AIzaSyDfq4WKzAlnd0DIhVT_yiZPLmniKfIFaP8",
    authDomain: "unitchat-app.firebaseapp.com",
    projectId: "unitchat-app",
    storageBucket: "unitchat-app.appspot.com",
    messagingSenderId: "330635319717",
    appId: "1:330635319717:web:0343a08765b33b52fc304c",
  })
  .auth();
