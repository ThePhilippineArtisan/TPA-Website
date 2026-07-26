import React, { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import "../AdminPortal/AdminSidebar.css"

const menuItems = [
    {
        path: "/admin/dashboard",
        label: "Dashboard"
    },
    {
        path: "/admin/create-article",
        label: "Create Article"
    },
    {
        path: "/admin/articles",
        label: "Manage Articles",
    },
    {
        path: "/admin/staff",
        label: "Manage Staff",
    },
    {
        path: "/admin/manage-page",
        label: "Front Page",
    },
    {
        path: "/admin/add-releases",
        label: "Releases",
    }
]

const AdminSidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = () => {
        localStorage.removeItem("isAuth")
        navigate("/AdminLogInRandomWordsToMakeItHarderToGuessBecauseWhyNot")
    }

    return (
        <>
            {/* Mobile Header Bar */}
            <div className="admin-mobile-header">
                <div className="mobile-brand">
                    <span className="brand-dot"></span>
                    <span className="brand-title">TPA Admin</span>
                </div>
                <button 
                    className="mobile-hamburger-btn" 
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                </button>
            </div>

            {mobileOpen && (
                <div className="admin-sidebar-overlay" onClick={() => setMobileOpen(false)}></div>
            )}

            {/* Sidebar */}
            <aside className={`admin-sidebar ${isCollapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>
                <div className="sidebar-top">
                    <div className="sidebar-header">
                        <div className="brand-container">
                            {!isCollapsed && <span className="brand-name">Admin Portal </span> }
                        </div>
                        <button
                            className="toggle-btn"
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                        >
                            {isCollapsed ? "→" : "←"}
                        </button>
                    </div>

                    <nav className="sidebar-menu">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`menu-item ${isActive ? "active" : ""}`}
                                    onClick={() => setMobileOpen(false)}
                                    title={isCollapsed ? item.label : ""}
                                >
                                    <span className="menu-icon">{item.icon}</span>
                                    {!isCollapsed && <span className="label">{item.label}</span>}
                                </Link>
                            )
                        })}
                    </nav>
                </div>

                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={handleLogout} title="Sign Out">
                        {!isCollapsed && <span className="label">Logout</span>}
                    </button>
                </div>
            </aside>
        </>
    )
}

export default AdminSidebar
