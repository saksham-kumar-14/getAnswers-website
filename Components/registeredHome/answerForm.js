import React , { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../Firebase";

const AnswerPopup = ({ setShowPopup , selectedQuestion , userInfo }) => {

    const [answer, setAnswer] = useState("");

    async function handleAnswerSubmission(){
        const currentQuestionRef = doc(db, "questions", selectedQuestion.id);
        let currentTime = new Date();
        currentTime = currentTime.getTime();

        let newComments = selectedQuestion.comments;
        newComments.push({
            name : userInfo.name,
            profile : userInfo.profile,
            time : currentTime,
            answer : answer,
            id : auth.currentUser.uid,
        }) 
        const newFields = { comments:newComments };

        await updateDoc(currentQuestionRef, newFields);
        setShowPopup("");
    }

    return(
        <div className="absolute top-0 w-[100vw] h-[100vh] bg-[rgb(25,25,25)] bg-opacity-90 flex items-center justify-center">
            
            <div className="rounded-xl p-5 w-[50vw] flex flex-col justify-center bg-black text-white">
                <div className="flex flex-col justify-center">
                    <label className="font-semibold text-[1.35rem] ">Post your answer!</label>
                    <textarea onChange={(e)=>{
                        setAnswer(e.target.value)
                    }} className="rounded-xl p-3 font-semibold text-black" placeholder="Type your answer here!"></textarea>
                </div>

                <div className="grid grid-cols-2 py-3">
                    <div className="flex items-center justify-center">
                        <button
                         onClick={()=>{
                             if(answer===""){
                                 alert("Fill the answer field properly!")
                             }else{
                                 handleAnswerSubmission()
                             }
                         }}
                         className="text-[1.25rem] rounded-xl py-2 px-3 bg-[#3e5ed1] font-semibold text-white duration-300 hover:bg-[#7590f0]">Post</button>
                    </div>
                    <div className="flex items-center justify-center">
                        <button
                        onClick={()=>{ setShowPopup("") }} 
                        className="text-[1.25rem] rounded-xl py-2 px-3 bg-red-700 font-semibold text-white duration-300 hover:bg-red-500">Cancel</button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default AnswerPopup