import  { memo } from "react"
import { Outlet } from "react-router-dom"




const PublicLayout = () => {

    return(
        <main className="w-full">
            <Outlet/>
        </main>
    )
}

export default memo(PublicLayout);