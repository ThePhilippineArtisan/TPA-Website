import { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"

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
                <p> Add or edit staff details here! </p>
            </div>

            <div className = "Manage-Staff-Grid-Container">
                <table className = "Manage-Staff-Table">
                    <thead className = "Manage-Staff-Grid-Columns">
                        <tr>
                            <th className = "Manage-Staff-Grid-Column">
                                <h4> Staff ID </h4>
                            </th>
                            <th className = "Manage-Staff-Grid-Column">
                                <h4> Staff Name </h4>
                            </th>
                            <th className = "Manage-Staff-Grid-Column">
                                <h4> Staff Name </h4>
                            </th>
                            <th className = "Manage-Staff-Grid-Column">
                                <h4> Staff Pseudonym </h4>
                            </th>
                            <th className = "Manage-Staff-Grid-Column">
                                <h4> Staff Bio</h4>
                            </th>
                            <th className = "Manage-Staff-Grid-Column">
                                <h4> Staff Birthday</h4>
                            </th>
                            <th className = "Manage-Staff-Grid-Column">
                                <h4> Staff Position </h4>
                            </th>
                            <th className = "Manage-Staff-Grid-Column">
                                <h4> Staff Photo</h4>
                            </th>
                            <th className = "Manage-Staff-Grid-Column">
                                <h4> Staff Join Date</h4>
                            </th>
                            <th className = "Manage-Staff-Grid-Column">
                                <h4> Staff Pseudonym </h4>
                            </th>
                            <th className = "Manage-Staff-Grid-Column">
                                <h4> Staff Contributions </h4>
                            </th>
                        </tr>
                    </thead>

                    <div className = "Manage-Staff-Grid-Rows">
                        <div className = "Manage-Staff-Grid-Row">
                            
                        </div>
                    </div>

                </table>
            </div>

        </div>
    )
}

export default ManageStaff;