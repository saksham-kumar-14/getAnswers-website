import { signUserOut } from "../../Firebase"

const SignOutPopup = ({ setShowPopup }) => {

    return(
        <div className=" bg-black bg-opacity-80 text-white flex items-center justify-center absolute top-0 w-[100vw] h-[100vh]">
            <div className="bg-[rgb(10,10,10)] color-white font-semibold p-8 rounded-xl font-[1.5rem]">
                <p className="text-[1.5rem]">You sure want to sign out?</p>
                <div className="grid grid-cols-2 m-2 pt-4">
                    <div className="flex items-center justify-center">
                        <button onClick={signUserOut} className="text-[1.15rem] duration-300 hover:bg-[#617de0] font-bold rounded-xl p-2 bg-[#3e5ed1]">Sign Out</button>
                    </div>
                    
                    <div className="flex items-center justify-center">
                        <button onClick={()=>{
                            setShowPopup(false)
                        }} className="text-[1.15rem] font-bold rounded-xl p-2 bg-red-600 duration-300 hover:bg-red-400">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignOutPopup;