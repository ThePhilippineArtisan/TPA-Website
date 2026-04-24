
import React, { useEffect, useState} from "react"
import { useParams } from "react-router-dom"
import { supabase } from "../supabaseClient"

import "../CSS/StaffProfile.css"

const StaffProfile = () => {
    const { staffSlug } = useParams()

    const [staffDetails, setStaffDetails] = useState(null)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
            const fetchStaffMember = async () => {
                try {
                    const slugParts = staffSlug.split('-');
                    const staffId = slugParts[slugParts.length - 1];

                    const { data, error } = await supabase
                        .from('staff')
                        .select('*')
                        .eq('staff_id', staffId)
                        .single();

                    if (error) throw error;
                    
                    setStaffDetails(data);
                } catch (error) {
                    console.error("Error fetching staff member:", error);
                } finally {
                    setLoading(false); 
                }
            };

            if (staffSlug) {
                fetchStaffMember();
            }
        }, [staffSlug]);

        if (loading) {
            return <div style={{ color: "white", textAlign: "center", marginTop: "5rem" }}>Loading profile...</div>;
        }

        if (!staffDetails) {
            return <div style={{ color: "white", textAlign: "center", marginTop: "5rem" }}>Staff member not found.</div>;
        }

    const replaceUnderscore = (str) => {
        if (!str) return "" 
        return str.replaceAll("_", " ") 
    }
    
    return(
        <div className = "Staff-Profile-Full-Page">
            <div className = "Staff-Profile-Main-Content">
                <div className = "Staff-Profile-Image-Content">
                    <div className = "Horizontal-Staff-Profile-About">
                        <div className = "Profile-Image-Container">
                            <img 
                                src = {staffDetails.staff_picture}
                            />
                        </div>
                        <div className = "Right-Side-Profile-About">
                            <h1> {staffDetails.staff_display_name} </h1>
                            <p> {replaceUnderscore(staffDetails.staff_position)} <span style = {{color: 'gray'}}> | Joined {staffDetails.join_date} </span></p>
                            <br></br>

                            <div className = "Profile-Bio-Container">
                            <h2>About {staffDetails.staff_first_name} </h2>
                                <br></br>
                                <p> {staffDetails.staff_bio} </p>
                            </div>
                        </div>
                    </div>
                    <div className = ""> <br></br> <br></br>
                        <h1> Recent articles </h1>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StaffProfile