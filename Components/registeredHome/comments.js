import { useState , useEffect } from "react";
import Image from 'next/image'
import { TrashIcon } from "@heroicons/react/solid";
import { auth, db } from "../../Firebase";
import { doc, updateDoc } from "firebase/firestore";

const Comments = ({ setShowPopup , selectedQuestion , questions , setQuestions , setSelectedQuestion }) => {

    function modifyTime(seconds){
        seconds = seconds/1000
        let result = ""
        if(seconds>59){
            if(seconds>(3599)){

                if(seconds > ((3600*24)-1) ){
                    const temp = (Math.floor(seconds/(3600*24))).toString();
                    if(temp==="1"){
                        result = temp + " day ago";
                    }else{
                        result = temp + " days ago";
                    }
                }else{
                    const temp =  (Math.floor(seconds/3600)).toString();
                    if(temp === "1"){
                        result = temp + " hour ago"
                    }else{
                        result = temp + " hours ago"
                    }
                }
            }else{
                const temp = (Math.floor(seconds/60)).toString();
                if(temp==="1"){
                    result = temp + " minute ago"
                }else{
                    result = temp + " minutes ago"
                }
            }
        }else{
            const temp = (Math.floor(seconds)).toString();
            if(temp==="1"){
                result = temp + " second ago"
            }else{
                result = temp + " seconds ago"
            }
        }

        return result;
    }

    const [currentTime, setCurrentTime] = useState();
    
    useEffect(()=>{
        const date = new Date();
        setCurrentTime(date.getTime());
    },[])

    function removeItem(arr , index){
        let result = [];
        for(let i=0;i<arr.length;i++){
            if(i!==index){
                result.push(arr[i])
            }
        }
        return result;
    }

    async function handleAnswerDeletion(index){
        const currentQuestionRef = doc(db, "questions", selectedQuestion.id);
        let newAnswers = [];
        selectedQuestion.comments.map((e,ind)=>{
            if(ind!==index){
                newAnswers.push(e);
            }
        })
        const newFields = { comments : newAnswers };

        await updateDoc(currentQuestionRef , newFields);

        let newQuestions = [];
        questions.map((e)=>{
            if(e.id===selectedQuestion.id){
                let newComments = [];
                e.comments.map((e,ind)=>{
                    if(ind!==index){
                        newComments.push(e)
                    }
                })
                e.comments = newComments
            }

            newQuestions.push(e)
        })
        setQuestions(newQuestions);

        let newQuestion = selectedQuestion;
        newQuestion.comments = removeItem(newQuestion.comments , index);
        setSelectedQuestion(newQuestion)
    }


    return(
        <div className="absolute top-0 flex-col bg-[rgb(25,25,25)] bg-opacity-90 w-[100vw] h-[100vh] flex items-center justify-center">

            <div className="w-[50vw] flex items-center justify-end">
                <span onClick={()=>{
                    setShowPopup("")
                }} className="font-bold text-[3rem] text-red-500 hover:text-red-700 cursor-pointer">
                    X
                </span>
            </div>
            <div className="px-3 py-4 rounded-2xl bg-black text-white w-[50vw] h-[80vh] overflow-y-scroll">
                {selectedQuestion.comments.length === 0 &&
                <span className="font-bold text-[1.5rem] w-[100%] flex items-center justify-center">no answers yet ...</span>}
                
                {selectedQuestion.comments.map((e,index)=>{
                    return(
                        <div className="flex items-center border-2 border-white rounded-2xl p-2 my-3">

                            <div className="w-[90%]">
                                <div className="flex items-center justify-center">
                                    <div className="w-[10%]">
                                        <Image
                                        className="rounded-full cursor-pointer"
                                        width="50"
                                        height="50"
                                        src={e.profile}
                                        />
                                    </div>

                                    <div className="flex flex-col justify-center w-[90%]">
                                        <span>Name : {e.name}</span>
                                        <span>Time : {modifyTime( currentTime - e.time)}</span>
                                    </div>
                                </div>

                                <div>
                                    <span>Answer : {e.answer}</span>
                                </div>
                            </div>

                            <div className="w-[10%] flex items-center justify-center">
                                {auth.currentUser.uid === e.id &&
                                    <button onClick={()=>{ handleAnswerDeletion(index) }}>
                                        <TrashIcon className="w-[3rem]"/>
                                        <span>Delete</span>
                                    </button>
                                }
                            </div>
                        </div>
                    )
                })}
            </div>

        </div>
    )
}

export default Comments;