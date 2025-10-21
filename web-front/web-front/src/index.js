import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from 'react-router-dom';
import { initializeApp} from 'firebase/app';
import { getAnalytics} from "firebase/analytics";
import { getAuth } from 'firebase/auth';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <App />
    </BrowserRouter>
  </React.StrictMode>
);

const firebaseConfig = {

  apiKey: "AIzaSyCqB7l4DGO9hgHcn690ZQlYhWtQm6WNyoI",

  authDomain: "neuromind-system-g15.firebaseapp.com",

  databaseURL: "https://neuromind-system-g15-default-rtdb.europe-west1.firebasedatabase.app/",

  projectId: "neuromind-system-g15",

  storageBucket: "neuromind-system-g15.firebasestorage.app",

  messagingSenderId: "673535448187",

  appId: "1:673535448187:web:1fe648ad89c89d73297ede",

  measurementId: "G-P4CZT4V2DR"
}

const app = initializeApp(firebaseConfig)

const analytics = getAnalytics(app);

export const auth = getAuth(app);

reportWebVitals();