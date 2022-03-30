import RegisteredHome from "../Components/registeredHome";
import UnregisteredHome from "../Components/unregisteredHome"

import Head from 'next/head';
import { useEffect, useState } from "react";

const Home = () =>{

  const [isAuth, setIsAuth] = useState(false);
  useEffect(()=>{
    setIsAuth(localStorage.getItem("isAuth"))
  },[])

  return(
    <div>
      <Head><title>GetAnswers - Home</title></Head>

      <div className="flex items-center justify-center">
        <h1 className="font-bold text-[3rem] text-red-600 hover:underline">GetAnswers</h1>
      </div>

      {isAuth?
      <RegisteredHome />:
      <UnregisteredHome setIsAuth={setIsAuth}/>}

    </div>
  )
}

export default Home;