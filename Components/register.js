import { ArrowCircleLeftIcon } from "@heroicons/react/solid";
import { signinWithGoogle } from "../Firebase";

const Register=({ setState })=>{

    return(
        <div className="absolute top-0 w-[100vw] h-[100vh] flex items-center justify-center bg-opacity-90 bg-black">

            <div className="p-[3rem] rounded-xl bg-white">
                <div onClick={()=>{setState("")}} className="flex cursor-pointer items-center justify-flex-start"><ArrowCircleLeftIcon className="border-[0.15rem] border-blue-600 w-[3rem] duration-300 hover:text-red-700 text-red-500"/></div>
                
                <div className="mt-4">
                    <p className="font-semibold text-[1.5rem]">Sign in to continue</p>
                    <div>
                        <button className="px-3 py-2 rounded-xl flex items-center text-white bg-[#3e5ed1] duration-200 hover:bg-[#7289DA]" onClick={signinWithGoogle}>
                            <div className="bg-white rounded-lg p-2">
                                <img src="/google.png" className="w-[2rem]" />
                            </div>
                            <span className="ml-3 font-semibold text-[1.5rem]">Continue With Google</span>
                        </button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Register;