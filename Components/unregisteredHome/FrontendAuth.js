
const FrontendAuth = ({ setState }) => {


    return(
        <div className="py-12 grid grid-rows-2">

            <div className="flex flex-col justify-center">
                <p className="font-semibold italic text-[2rem] mx-20">Register Now!</p>
                <div className="flex justify-center items-center">
                    <button onClick={()=>{
                        setState("register")
                    }} className="text-[1.5rem] border-2 font-bold py-2 px-3 rounded-2xl border-red-500 duration-300 hover:border-red-700 hover:text-red-700 text-red-500">
                        Sign In
                    </button>
                </div>
            </div>

        </div>
    )
}

export default FrontendAuth;