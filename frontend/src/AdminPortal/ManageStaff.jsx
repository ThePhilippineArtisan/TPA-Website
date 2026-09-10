import { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"
import { replaceUnderscore, slugify } from "../utils/slugifyUtils"

import "./ManageStaff.css"
import EditStaffModal from "./Modals/EditStaffModal.jsx"

const ManageStaff = () => {
    const [staff, setStaff] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedStaffToEdit, setSelectedStaffToEdit] = useState(null)

    useEffect(() => {
        const fetchStaff = async () => {
            let { data, error } = await supabase
                .from("staff")
                .select("*")
                .order("staff_order", { ascending: true })

            if (error) {
                console.log("Error fetching staffers: ", error)
            } else {
                setStaff(data || [])
            }
        }

        fetchStaff()
    }, [])

    const handleStaffUpdated = (updatedMember) => {
        setStaff((prev) =>
            prev.map((m) => (m.staff_id === updatedMember.staff_id ? updatedMember : m))
        )
    }

    const filteredStaff = staff.filter((member) => {
        if (!searchTerm.trim()) {
            return true
        }
        const query = searchTerm.toLowerCase().trim()
        const idMatch = String(member.staff_id).includes(query)
        const nameMatch = member.staff_display_name?.toLowerCase().includes(query) ||
            `${member.staff_first_name || ""} ${member.staff_last_name || ""}`.toLowerCase().includes(query)
        const pseudonymMatch = member.staff_pseudonym?.toLowerCase().includes(query)
        const rawPos = member.staff_position ? member.staff_position.toLowerCase() : ""
        const cleanPos = member.staff_position ? replaceUnderscore(member.staff_position).toLowerCase() : ""
        const positionMatch = rawPos.includes(query) || cleanPos.includes(query)
        const bioMatch = member.staff_bio?.toLowerCase().includes(query)
        return idMatch || nameMatch || pseudonymMatch || positionMatch || bioMatch
    })

    return (
        <div className = "Manage-Staff-Page">
            <div className = "Manage-Staff-Page-Header">
                <h1> Manage Staff </h1>
                <p>
                    Click any staff member row below to edit their details directly. Changes save immediately to the database.
                </p>
            </div>

            <div className = "Admin-Search-Container">
                <div className = "Admin-Search-Input-Wrapper">
                    <svg className = "Admin-Search-Icon" width = "16" height = "16" viewBox = "0 0 24 24" fill = "none" stroke = "currentColor" strokeWidth = "2">
                        <circle cx = "11" cy = "11" r = "8" />
                        <line x1 = "21" y1 = "21" x2 = "16.65" y2 = "16.65" />
                    </svg>
                    <input
                        type = "text"
                        className = "Admin-Search-Input"
                        value = {searchTerm}
                        onChange = {(e) => setSearchTerm(e.target.value)}
                        placeholder = "Search staff by name, pseudonym, or position..."
                    />
                    {searchTerm && (
                        <button
                            type = "button"
                            className = "Admin-Search-Clear"
                            onClick = {() => setSearchTerm("")}
                            aria-label = "Clear search"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    )}
                </div>
                <span style = {{ fontSize: "0.85rem", color: "#64748b" }}>
                    Showing {filteredStaff.length} of {staff.length} staff members
                </span>
            </div>

            <div className = "Manage-Staff-Grid-Container">
                {filteredStaff.length === 0 ? (
                    <div style = {{ color: "black", padding: "5rem", textAlign: "center" }}>
                        <h3>No staff members found matching "{searchTerm}".</h3>
                    </div>
                ) : (
                    <table className = "Manage-Staff-Table">
                        <thead className = "Manage-Staff-Grid-Columns">
                            <tr>
                                <th className = "Manage-Staff-Grid-Column"> <h4> ID </h4> </th>
                                <th className = "Manage-Staff-Grid-Column"> <h4> Name </h4> </th>
                                <th className = "Manage-Staff-Grid-Column"> <h4> Pseudonym </h4> </th>
                                <th className = "Manage-Staff-Grid-Column"> <h4> Bio</h4> </th>
                                <th className = "Manage-Staff-Grid-Column"> <h4> Birthday</h4> </th>
                                <th className = "Manage-Staff-Grid-Column"> <h4> Position </h4> </th>
                                <th className = "Manage-Staff-Grid-Column"> <h4> Photo</h4> </th>
                                <th className = "Manage-Staff-Grid-Column"> <h4> Join Date</h4> </th>
                                <th className = "Manage-Staff-Grid-Column"> <h4> Actions </h4> </th>
                            </tr>
                        </thead>
                        
                        <tbody>
                            {filteredStaff.map((member) => (
                                <tr 
                                    key = {member.staff_id}
                                    className = "Manage-Staff-Clickable-Row"
                                    onClick = {() => setSelectedStaffToEdit(member)}
                                    title = "Click to edit staff member"
                                >
                                    <td className = "Manage-Staff-Grid-Row"> {member.staff_id} </td>
                                    <td className = "Manage-Staff-Grid-Row" style = {{ fontWeight: "600", color: "var(--primary-blue)" }}> 
                                        {member.staff_display_name} 
                                    </td>
                                    <td className = "Manage-Staff-Grid-Row"> {member.staff_pseudonym || "-"} </td>
                                    <td className = "Manage-Staff-Grid-Row"> 
                                        <div className = "long-column"> {member.staff_bio || "-"} </div>
                                    </td>
                                    <td className = "Manage-Staff-Grid-Row"> {member.staff_birthday || "-"} </td>
                                    <td className = "Manage-Staff-Grid-Row"> {replaceUnderscore(member.staff_position)} </td>
                                    <td className = "Manage-Staff-Grid-Row long-column"> {member.staff_picture || "-"} </td>
                                    <td className = "Manage-Staff-Grid-Row"> {member.join_date || "-"} </td>
                                    <td className = "Manage-Staff-Grid-Row" onClick = {(e) => e.stopPropagation()}>
                                        <button
                                            type = "button"
                                            className = "Staff-Row-Edit-Btn"
                                            onClick = {() => setSelectedStaffToEdit(member)}
                                            title = "Edit staff details and pseudonym"
                                        >
                                            ✎ Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {selectedStaffToEdit && (
                <EditStaffModal
                    staff={selectedStaffToEdit}
                    onClose={() => setSelectedStaffToEdit(null)}
                    onSave={handleStaffUpdated}
                />
            )}
        </div>
    )
}

export default ManageStaff