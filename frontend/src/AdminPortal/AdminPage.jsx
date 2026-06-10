import { Outlet } from "react-router-dom"

import "./AdminPage.css"
import AdminSidebar from "./AdminSidebar.jsx"

const AdminPage = () => {
    
    return(
        <div className = "Admin-Page-Layout">
            <AdminSidebar />

            <div className = "Display-Main-Content">
                <Outlet />
            </div>
        </div>
    )
}

export default AdminPage;