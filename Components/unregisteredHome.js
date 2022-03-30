import React , { useState } from 'react';

import Register from './register';
import SideAnimation from './unregisteredHome/sideAnimation';
import FrontendAuth from './unregisteredHome/FrontendAuth';

const UnregisteredHome=({ setIsAuth })=>{

    const [state, setState] = useState("")

    return(
        <div>

            <div className='grid grid-cols-2'>
                <SideAnimation />
                <FrontendAuth setState={setState} />
            </div>

            {state==="register" && <Register setState={setState} />}
        </div>
    )
}

export default UnregisteredHome;