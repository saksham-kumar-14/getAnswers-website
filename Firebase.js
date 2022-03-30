import { initializeApp } from "firebase/app"    ;
import { getAuth , GoogleAuthProvider , signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import jwt from 'jsonwebtoken';

const firebaseConfig = {
  apiKey: "AIzaSyABgYPT2ZLaT_2rsMbPD-YNGZOc9OH-q70",
  authDomain: "getanswers-345313.firebaseapp.com",
  projectId: "getanswers-345313",
  storageBucket: "getanswers-345313.appspot.com",
  messagingSenderId: "959270652065",
  appId: "1:959270652065:web:b07a9e807e87ea8cc2c8e0"
};

const clearCookie=()=>{
    document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });

}

const setCookie=(name,value)=>{
    const d = new Date();
    d.setTime(d.getTime() + (30*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const provider = new GoogleAuthProvider();

export const signinWithGoogle = () => {
    signInWithPopup(auth, provider).then((result)=>{

        const name = result.user.displayName;
        const email = result.user.email;
        const profile = result.user.photoURL

        const token = jwt.sign({
            name : name,
            email : email,
            profile : profile
        }, "secret")
        
        setCookie("token",token); 
        localStorage.setItem("isAuth", true)
        location.reload();
        
    }).catch((err)=>{
        alert("Error occcured")
        console.log("err")
    })
}


export const signUserOut = () => {
    signOut(auth).then(()=>{
        localStorage.clear();
        clearCookie();
        location.reload();
    }).catch((err)=>{
        alert("Error occured while signing out");
        console.log("Error",err)
    })
}

export const db = getFirestore(app);