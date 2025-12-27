import { initializeApp } from 'firebase/app'; 
import { getFirestore } from 'firebase/firestore'; 
import { getAuth } from 'firebase/auth'; 
 
const firebaseConfig = { 
  apiKey: 'AIzaSyBiQ0P0VHC05iYUKIuWBYoYeACO0zPhvtc', 
  authDomain: 'mobileplantidex.firebaseapp.com', 
  databaseURL: 'https://mobileplantidex-default-rtdb.firebaseio.com', 
  projectId: 'mobileplantidex', 
  storageBucket: 'mobileplantidex.firebasestorage.app', 
  messagingSenderId: '889555587802', 
  appId: '1:889555587802:web:06dd6b1224fcb1b1308be3' 
}; 
 
const app = initializeApp(firebaseConfig); 
 
export const db = getFirestore(app); 
export const auth = getAuth(app); 
