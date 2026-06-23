import { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"
import { replaceUnderscore, slugify } from "../utils/slugifyUtils"

import "./ManageStaff.css"

const ManageStaff = () => {
    const [staff, setStaff] = useState([])

    useEffect(() => {
        const fetchStaff = async () => {
            let {data, error} = await supabase
            .from('staff')
            .select('*')
            .order('staff_order', {ascending: true})

            if(error){
                console.log("Error fetching staffers: ", error)
            } else{
                setStaff(data)
            }
        }

        fetchStaff()
    }, [])

    return(
        <div className = "Manage-Staff-Page">
            <div className = "Manage-Staff-Page-Header">
                <h1> Manage Staff </h1>
                <p> Add or edit staff details <span> <a href="https://supabase.com/dashboard/project/uapnaylpxunquhievzzm/editor/31990?schema=public" target = "_blank"> here! </a> </span> <br></br> <br></br>
                    Make sure to log-in using our Github account or an authorized/invited team account on our Supabase project. 
                </p>
                <p> To change staff's profile photo, use our Cloudflare R2 Images Account here: <a href = "https://dash.cloudflare.com/f98ca61f7a355790df8cf93617ed1111/r2/default/buckets/tpamediaassets?prefix=staff-photos%2F"> here! </a></p>
            </div>

            <div className = "Manage-Staff-Grid-Container">
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
                            { /** <th className = "Manage-Staff-Grid-Column"> <h4> Contributions </h4> </th> **/}
                        </tr>
                    </thead>
                    
                    <tbody>
                        {staff.map((member) => (
                            <tr key = {member.staff_id}>
                                <td className = "Manage-Staff-Grid-Row"> {member.staff_id} </td>
                                <td className = "Manage-Staff-Grid-Row"> {member.staff_display_name} </td>
                                <td className = "Manage-Staff-Grid-Row"> {member.staff_pseudonym} </td>
                                <td className = "Manage-Staff-Grid-Row"> 
                                    <div className = "long-column"> {member.staff_bio} </div> </td>
                                <td className = "Manage-Staff-Grid-Row"> {member.staff_birthday} </td>
                                <td className = "Manage-Staff-Grid-Row"> {replaceUnderscore(member.staff_position)} </td>
                                <td className = "Manage-Staff-Grid-Row long-column"> {member.staff_picture} </td>
                                <td className = "Manage-Staff-Grid-Row"> {member.join_date} </td>
                                { /** <td className="Manage-Staff-Grid-Row">{member.contributions}</td> **/}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default ManageStaff;