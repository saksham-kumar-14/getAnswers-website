import React , { useState , useEffect } from "react";
import jwt from 'jsonwebtoken';
import Image from 'next/image';
import { collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { ArrowDownIcon , ArrowUpIcon, TrashIcon, ChatIcon, ChatAlt2Icon } from "@heroicons/react/solid"

import SignOutPopup from "./registeredHome/signOutPopup";
import FormPost from "./registeredHome/formPost";
import AnswerPopup from "./registeredHome/answerForm";
import Comments from "./registeredHome/comments";
import { auth, db } from "../Firebase";

const RegisteredHome=()=>{

    const [userInfo, setUserInfo] = useState();
    const [showPopup, setShowPopup] = useState(false);
    const [questions, setQuestions] = useState();
    const [currentTime, setCurrentTime] = useState();
    
    const [selectedQuestion, setSelectedQuestion] = useState();
    
    
    function purifyToken(cookie){
        let start = 0;
        for(let i=0;i<cookie.length;i++){
            if(cookie[i]==="="){
                start = i+1;
            }
        }
        return cookie.slice(start,cookie.length);
    }

    // creating a reference to the question collection
    const questionCollection = collection(db, "questions")
    useEffect(()=>{
        const token = purifyToken(document.cookie);
        const user = jwt.decode(token)
        let newUser = {}
        newUser.name = user.name;
        newUser.email = user.email;
        newUser.profile = user.profile;
        setUserInfo(newUser);

        const getQuestions = async () => {
            const data = await getDocs(questionCollection);
            let tempQuestions = []
            data.docs.map((e)=>{
                tempQuestions.push({
                    ...e.data(),
                    id: e.id
                })
            })
            console.log(tempQuestions)
            setQuestions(tempQuestions)
        }
        getQuestions();

        const d = new Date();
        setCurrentTime(d.getTime());

    },[])

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


    async function deleteQuestion(id){
        const questionDoc = doc(db, "questions", id)
        await deleteDoc(questionDoc);
        location.reload()
    }

    async function increaseLikes(questionId, question){

        //creating a reference to the current question
        const currentQuestionRef = doc(db, "questions", questionId)

        let newFields = {  }
        if(question.peopleLiked.includes(auth.currentUser.uid)){
            let newPeopleLiked = [];
            question.peopleLiked.map((e)=>{
                if(auth.currentUser.uid!==e){
                    newPeopleLiked.push(e)
                }
            })
            newFields = { likes : question.likes-1, peopleLiked:newPeopleLiked }
        }else{
            let newPeopleLiked = [];
            question.peopleLiked.map((e)=>{
                newPeopleLiked.push(e)
            })
            newPeopleLiked.push(auth.currentUser.uid);
            newFields = { likes : question.likes+1, peopleLiked:newPeopleLiked }

            if(question.peopleDisliked.includes(auth.currentUser.uid)){
                increaseDislikes(questionId, question)
            }
        }

        await updateDoc(currentQuestionRef, newFields)


        // setting the useState questions
        let newQuestions = [];
        questions.map((e)=>{
            if(e===question){
                e.likes = newFields.likes
                e.peopleLiked = newFields.peopleLiked
            }
            newQuestions.push(e)
        })

        setQuestions(newQuestions);

    }

    async function increaseDislikes(questionId,question){
        const currentQuestionRef = doc(db, "questions", questionId);

        let newFields = {  };
        if(question.peopleDisliked.includes(auth.currentUser.uid)){
            let newPeopleDisliked = [];
            question.peopleDisliked.map((e)=>{
                if(e!==auth.currentUser.uid){
                    newPeopleDisliked.push(e)
                }
            })
            newFields = { dislikes:question.dislikes-1 , peopleDisliked:newPeopleDisliked }
        }else{
            let newPeopleDisliked = [];
            question.peopleDisliked.map((e)=>{
                newPeopleDisliked.push(e)
            })
            newPeopleDisliked.push(auth.currentUser.uid);
            newFields = { dislikes:question.dislikes+1 , peopleDisliked:newPeopleDisliked }

            if(question.peopleLiked.includes(auth.currentUser.uid)){
                increaseLikes(questionId, question)
            }
        }

        await updateDoc(currentQuestionRef, newFields);

        // setting up the useState questions prop
        let newQuestions = []
        questions.map((e)=>{
            if(e===question){
                e.dislikes = newFields.dislikes,
                e.peopleDisliked = newFields.peopleDisliked
            }
            newQuestions.push(e);
        })
        setQuestions(newQuestions);

    }


    return(
        <>

        {userInfo!==undefined &&
            <div>
            <nav className="flex items-center font-semibold bg-red-500 p-2">
                <div className="flex flex-col w-[80%] items-end">
                    <span>{userInfo.name}</span>
                    <button className="rounded-xl py-2 px-4 duration-300 hover:bg-[rgb(10,10,10)] bg-[rgb(30,30,30)] font-semibold text-white" onClick={()=>{
                        setShowPopup("post")
                    }}>Post a Question</button>
                </div>

                <div className="w-[10%] flex items-center justify-center">
                    <Image src={userInfo.profile}
                    width="50" height="50" className="rounded-full cursor-pointer" 
                    />
                </div>

                <div className="w-[10%]">
                    <button onClick={()=>{
                        setShowPopup(true)
                    }} className="border-2 border-white font-bold font-[1.3rem] rounded-3xl p-2 text-white duration-300 hover:border-red-700 hover:text-red-700">Sign Out</button>
                </div>
            </nav>

            {questions!==undefined && 
                <div>
                    {questions.map((e)=>{
                        return(

                            <div className="flex flex-col justify-center border-2 rounded-3xl border-black m-3 p-3">
                                <div className="flex items-center">

                                    <div className="flex flex-col items-center justify-center w-[%]">
                                        <div>
                                            <span>{e.likes}</span>

                                            {e.peopleLiked.includes(auth.currentUser.uid)?
                                            <ArrowUpIcon onClick={()=>{
                                                increaseLikes(e.id, e)
                                            }} className="w-[3rem] cursor-pointer text-red-700" />:
                                            <ArrowUpIcon onClick={()=>{
                                                increaseLikes(e.id, e)
                                            }} className="w-[2.5rem] cursor-pointer" />
                                            }
                                            
                                        </div>
                                            
                                        <div>
                                            {e.peopleDisliked.includes(auth.currentUser.uid)?
                                            <ArrowDownIcon onClick={()=>{
                                                increaseDislikes(e.id, e)
                                            }} className="w-[3rem] cursor-pointer text-red-700" />:
                                            <ArrowDownIcon onClick={()=>{
                                                increaseDislikes(e.id, e)
                                            }} className="w-[2.5rem] cursor-pointer" />
                                            }
                                            <span>{e.dislikes}</span>
                                        </div>  
                                    </div>

                                    <div className="w-[85%] flex items-start justify-center flex-col ml-6">
                                        <span className="font-semibold text-[1.5rem]">{e.text}</span>
                                        <div className="grid grid-cols-2 w-[100%] mt-8 text-[1.15rem]">
                                            <div className="flex items-center justify-start">
                                                Questioner: <span className="ml-2 italic font-semibold text-[rgb(60,60,60)] hover:underline">{e.author.name}</span>
                                            </div>
                                            <div className="flex items-center justify-end">
                                                <span className="ml-[3rem] italic text-[rgb(60,60,60)] hover:underline">{modifyTime(currentTime - e.time)}</span>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div className="grid grid-cols-3">
                                    <div className="flex items-center justify-center">
                                        <ChatIcon onClick={()=>{
                                            setShowPopup("answer")
                                            setSelectedQuestion(e)
                                        }} className="w-[3rem] cursor-pointer"/>
                                        <span>Give your answer</span>
                                    </div>

                                    <div className="flex items-center justify-center">
                                        <ChatAlt2Icon onClick={()=>{
                                            setShowPopup("loadComments");
                                            setSelectedQuestion(e)
                                        }} className="w-[3rem] cursor-pointer" />
                                        <span>See answers</span>
                                    </div>

                                    {localStorage.getItem("isAuth") && e.author.id===auth.currentUser.uid &&
                                        <div className="flex items-center justify-center">
                                            <TrashIcon onClick={()=>{
                                                deleteQuestion(e.id)
                                            }} className="w-[3rem] cursor-pointer duration-300 hover:text-red-600"/>
                                        </div>
                                    }
                                </div>
                            </div>
                        )
                    })}
                </div>
            }

            {showPopup===true && <SignOutPopup setShowPopup={setShowPopup} />}
            {showPopup==="post" && <FormPost setShowPopup={setShowPopup} />}
            {showPopup==="answer" && <AnswerPopup setShowPopup={setShowPopup} selectedQuestion={selectedQuestion} userInfo={userInfo} />}
            {showPopup==="loadComments" && <Comments setShowPopup={setShowPopup}
             selectedQuestion={selectedQuestion} questions={questions} setQuestions={setQuestions}
             setSelectedQuestion={setSelectedQuestion} />}

            </div>
        }

        </>
    )
}

export default RegisteredHome;