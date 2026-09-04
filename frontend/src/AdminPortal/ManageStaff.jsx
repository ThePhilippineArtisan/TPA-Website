import { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"
import { replaceUnderscore, slugify } from "../utils/slugifyUtils"

import "./ManageStaff.css"

const ManageStaff = () => {
    const [staff, setStaff] = useState([])
    const [searchTerm, setSearchTerm] = useState("")

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

    const filteredStaff = staff.filter((member) => {
        if (!searchTerm.trim()) {
            return true
        }
        const query = searchTerm.toLowerCase().trim()
        const idMatch = String(member.staff_id).includes(query)
        const nameMatch = member.staff_display_name?.toLowerCase().includes(query)
        const pseudonymMatch = member.staff_pseudonym?.toLowerCase().includes(query)
        const positionMatch = member.staff_position?.toLowerCase().includes(query)
        const bioMatch = member.staff_bio?.toLowerCase().includes(query)
        return idMatch || nameMatch || pseudonymMatch || positionMatch || bioMatch
    })

    return (
        <div className = "Manage-Staff-Page">
            <div className = "Manage-Staff-Page-Header">
                <h1> Manage Staff </h1>
                <p> Add or edit staff details <span> <a href = "https://supabase.com/dashboard/project/uapnaylpxunquhievzzm/editor/31990?schema=public" target = "_blank" rel = "noopener noreferrer"> here! </a> </span> <br></br> <br></br>
                    Make sure to log-in using our Github account or an authorized/invited team account on our Supabase project. 
                </p>
                <p> To change staff's profile photo, use our Cloudflare R2 Images Account here: <a href = "https://dash.cloudflare.com/f98ca61f7a355790df8cf93617ed1111/r2/default/buckets/tpamediaassets?prefix=staff-photos%2F" target = "_blank" rel = "noopener noreferrer"> here! </a></p>
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
                        >
                            ✕
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
                            </tr>
                        </thead>
                        
                        <tbody>
                            {filteredStaff.map((member) => (
                                <tr key = {member.staff_id}>
                                    <td className = "Manage-Staff-Grid-Row"> {member.staff_id} </td>
                                    <td className = "Manage-Staff-Grid-Row"> {member.staff_display_name} </td>
                                    <td className = "Manage-Staff-Grid-Row"> {member.staff_pseudonym} </td>
                                    <td className = "Manage-Staff-Grid-Row"> 
                                        <div className = "long-column"> {member.staff_bio} </div>
                                    </td>
                                    <td className = "Manage-Staff-Grid-Row"> {member.staff_birthday} </td>
                                    <td className = "Manage-Staff-Grid-Row"> {replaceUnderscore(member.staff_position)} </td>
                                    <td className = "Manage-Staff-Grid-Row long-column"> {member.staff_picture} </td>
                                    <td className = "Manage-Staff-Grid-Row"> {member.join_date} </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

        </div>
    )
}

export default ManageStaff