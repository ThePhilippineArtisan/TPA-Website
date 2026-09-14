import React, { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { supabase } from "../supabaseClient.js"
import "../AdminPortal/AdminSidebar.css"

const Icons = {
    Dashboard: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
        </svg>
    ),
    Calendar: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
    ),
    CreateArticle: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
        </svg>
    ),
    Articles: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
        </svg>
    ),
    Staff: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
    ),
    FrontPage: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>
        </svg>
    ),
    Videos: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
        </svg>
    ),
    Releases: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
    ),
    Pubmats: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
        </svg>
    ),
    AuditLogs: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
    ),
    Logout: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
    )
}

const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: Icons.Dashboard },
    { path: "/admin/content-calendar", label: "Content Calendar", icon: Icons.Calendar },
    { path: "/admin/create-article", label: "Create Article", icon: Icons.CreateArticle },
    { path: "/admin/articles", label: "Manage Articles", icon: Icons.Articles },
    { path: "/admin/staff", label: "Manage Staff", icon: Icons.Staff },
    { path: "/admin/manage-page", label: "Manage Front Page", icon: Icons.FrontPage },
    { path: "/admin/manage-videos", label: "Manage Videos", icon: Icons.Videos },
    { path: "/admin/manage-releases", label: "Manage Releases", icon: Icons.Releases },
    { path: "/admin/manage-pubmats", label: "Manage Pubmats", icon: Icons.Pubmats },
    { path: "/admin/audit-logs", label: "Activity & Logs", icon: Icons.AuditLogs }
]

const AdminSidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = ""
        }
        return () => {
            document.body.style.overflow = ""
        }
    }, [mobileOpen])

    useEffect(() => {
        setMobileOpen(false)
    }, [location.pathname])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate("/admin/AdminLogInRandomWordsToMakeItHarderToGuessBecauseWhyNot")
    }

    const currentItem = menuItems.find(item => location.pathname === item.path)

    return (
        <>
            {/* Mobile Header Bar */}
            <header className="admin-mobile-header">
                <div className="mobile-brand">
                    <span className="brand-dot"></span>
                    <span className="brand-title">TPA Admin</span>
                    {currentItem && (
                        <span className="mobile-active-pill">
                            {currentItem.label}
                        </span>
                    )}
                </div>
                <button
                    className="mobile-hamburger-btn"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
                    aria-expanded={mobileOpen}
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        {mobileOpen ? (
                            <>
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </>
                        ) : (
                            <>
                                <line x1="3" y1="12" x2="21" y2="12"></line>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <line x1="3" y1="18" x2="21" y2="18"></line>
                            </>
                        )}
                    </svg>
                </button>
            </header>

            {/* Mobile Backdrop Overlay */}
            {mobileOpen && (
                <div
                    className="admin-sidebar-overlay"
                    onClick={() => setMobileOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar Navigation */}
            <aside
                className={`admin-sidebar ${isCollapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}
                aria-label="Admin Navigation"
            >
                <div className="sidebar-top">
                    <div className="sidebar-header">
                        <div className="brand-container">
                            <span className="brand-badge">TPA</span>
                            {!isCollapsed && <span className="brand-name">Admin Portal</span>}
                        </div>
                        {/* Desktop collapse toggle */}
                        <button
                            className="toggle-btn desktop-only-toggle"
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points={isCollapsed ? "9 18 15 12 9 6" : "15 18 9 12 15 6"} />
                            </svg>
                        </button>
                        {/* Mobile close button */}
                        <button
                            className="mobile-drawer-close"
                            onClick={() => setMobileOpen(false)}
                            aria-label="Close sidebar"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    <nav className="sidebar-menu">
                        {menuItems.map((item) => {
                            const IconComponent = item.icon
                            const isActive = item.path.includes("#")
                                ? (location.pathname + location.hash) === item.path
                                : location.pathname === item.path && !location.hash

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`menu-item ${isActive ? "active" : ""}`}
                                    onClick={() => setMobileOpen(false)}
                                    title={isCollapsed ? item.label : ""}
                                >
                                    <span className="menu-icon">
                                        <IconComponent />
                                    </span>
                                    {!isCollapsed && <span className="label">{item.label}</span>}
                                </Link>
                            )
                        })}
                    </nav>
                </div>

                <div className="sidebar-footer">
                    <button
                        className="logout-btn"
                        onClick={handleLogout}
                        title="Sign Out"
                    >
                        <span className="menu-icon">
                            <Icons.Logout />
                        </span>
                        {!isCollapsed && <span className="label">Logout</span>}
                    </button>
                </div>
            </aside>
        </>
    )
}

export default AdminSidebar
