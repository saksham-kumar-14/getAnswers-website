import React, { useState } from 'react';
import { addDoc, collection } from "firebase/firestore";
import { db , auth } from "../../Firebase";

const FormPost = ({ setShowPopup }) => {

    const [text, setText] = useState("");

    // creating a reference to the post collection in the firebase database
    const questionCollection = collection(db, "questions");

    const createQuestion = async () => {
        let time = new Date();
        time = time.getTime();
        const likes = 0;
        const dislikes = 0;
        const peopleLiked = [];
        const peopleDisliked = [];
        const comments = [];
        
        await addDoc(questionCollection, {
            text,
            author:{
                name : auth.currentUser.displayName,
                id : auth.currentUser.uid,
            },
            time,
            likes,
            dislikes,
            peopleLiked,
            peopleDisliked,
            comments

        });
        location.reload();
    }

    return(
        <div className="flex items-center justify-center text-white absolute bg-black top-0 bg-opacity-80 w-[100vw] h-[100vh]">
            <div className="w-[50vw] flex flex-col justify-center p-5 rounded-xl bg-[rgb(25,25,25)]">
                <span className=" text-[1.5rem] font-semibold">Post Your Question!</span>    
                <textarea onChange={(e)=>{
                    setText(e.target.value);
                }} className="rounded-xl font-semibold text-[1.15rem ] p-3 text-black my-4" placeholder="Question"></textarea>

                <div className="grid grid-cols-2">
                    <div className="flex items-center justify-center">
                        <button onClick={()=>{
                            if(localStorage.getItem("isAuth")){
                                createQuestion();
                            }else{
                                alert("log in first")
                            }
                        }} className="text-[1.25rem] rounded-xl py-2 px-3 bg-green-600 font-semibold text-white duration-300 hover:bg-green-500">Post</button>
                    </div>

                    <div className="flex items-center justify-center">
                        <button onClick={()=>{
                            setShowPopup(false)
                        }} className="text-[1.25rem] rounded-xl py-2 px-3 bg-red-700 font-semibold text-white duration-300 hover:bg-red-500">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default FormPost;