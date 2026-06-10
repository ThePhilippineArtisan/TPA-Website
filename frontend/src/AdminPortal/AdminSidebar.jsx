import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import "../AdminPortal/AdminSidebar.css"

const AdminSidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem("isAuth")
        
        navigate("/AdminLogInRandomWordsToMakeItHarderToGuessBecauseWhyNot")
    }

    return(
        <div className = {`admin-sidebar ${isCollapsed ? "collapsed" : ""}`}>
            <div className = "sidebar-top">
                <div className = "sidebar-header">
                    {!isCollapsed && <span className = "brand-name"> <p>TPA Admin</p></span>}
                    <button
                        className = "toggle-btn"
                        onClick = {() => setIsCollapsed(!isCollapsed)}
                    >
                        {isCollapsed ?  "→" : "←"}
                    </button>
                </div>

                <nav className = "sidebar-menu">

                    <Link to = "/admin/dashboard" className = "menu-item">
                        {!isCollapsed && <span className = "label"> Dashboard </span>}
                    </Link>

                    <Link to = "/admin/create-article" className = "menu-item">
                        {!isCollapsed && <span className = "label"> Create Article</span>}
                    </Link>

                    <Link to = "/admin/articles" className = "menu-item">
                        {!isCollapsed && <span className = "label"> Manage Articles </span>}
                    </Link>

                    <Link to = "/admin/staff" className = "menu-item">
                        {!isCollapsed && <span className = "label"> Manage Staff </span>}
                    </Link>

                    <Link to = "/admin/manage-page" className = "menu-item">
                        {!isCollapsed && <span className = "label"> Manage Front Page </span>}
                    </Link>
                    
                    <Link to = "/admin/add-releases" className = "menu-item">
                        {!isCollapsed && <span className = "label"> Add Releases </span>}
                    </Link>
                </nav>
            </div>

            <div className = "sidebar-footer">
                <button className = "logout-btn" onClick = {handleLogout}>
                    {!isCollapsed && <span className = "label"> Logout </span>}
                </button>
            </div>

        </div>
    )
}

export default AdminSidebar;