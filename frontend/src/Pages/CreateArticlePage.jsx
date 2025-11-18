import React, { useState, useEffect, useRef } from "react"

import BOLD from "../assets/Miniature_Icon_Version/Bold.svg"
import ITALIC from "../assets/Miniature_Icon_Version/Italic.svg"
import EMDASH from "../assets/Miniature_Icon_Version/EmDash.svg"
import SUPERSCRIPT from "../assets/Miniature_Icon_Version/Superscript.svg"
import SUBSCRIPT from "../assets/Miniature_Icon_Version/Subscript.svg"
import HIGHLIGHT from "../assets/Miniature_Icon_Version/Highlight.svg"
import BULLET from "../assets/Miniature_Icon_Version/Bullet.svg"
import NUMBERED from "../assets/Miniature_Icon_Version/Numbered.svg"
import REFERENCE from "../assets/Miniature_Icon_Version/reference.svg"
import ATTACH from "../assets/Miniature_Icon_Version/Attach-File.svg"

import Author from "../assets/Miniature_Icon_Version/Author.svg"
import MediaProvider from "../assets/Miniature_Icon_Version/MediaProvider.svg"

import "../CSS/CreateArticlePage.css"

const CreateArticlePage = () => {
    const authorDialogRef = useRef(null)

    const openAuthorDialog = () => authorDialogRef.current.showModal()
    const closeAuthorDialog = () => authorDialogRef.current.close()

    const mediaProviderDialogRef = useRef(null)

    const openMediaProviderDialog = () => mediaProviderDialogRef.current.showModal()
    const closeMediaProviderDialog = () => mediaProviderDialogRef.current.close()

    const [staffList, setStaffList] = useState([])
    const [selectedAuthor, setSelectedAuthor] = useState([])
    const [selectedMediaProvider, setSelectedMediaProvider] = useState([])

    const [headline, setHeadline] = useState("")
    const [bodyText, setBodyText] = useState("")
    const [articleType, setArticleType] = useState("")

    useEffect(() =>{
        fetch("http://localhost:5000/staff")
            .then((res) => res.json())
            .then((data) => setStaffList(data))
            .catch((err) => console.error("Failed to fetch staff: ", err))
    }, []);

    const toggleAuthor = (id) => {
        setSelectedAuthor((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        )
    }

    const toggleMediaProvider = (id) => {
        setSelectedMediaProvider((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        )
    }

    const handleCreateArticle = async () => {
        const staffCredits = selectedAuthor.map((id) => {
            const staff = staffList.find((s) => s.staff_id === id)
            return {
                staff_id: id,
                contribution_As: "",
                display_name: staff?.staff_display_name || ""
            }
        })
    }

    const mediaCredits = selectedMediaProvider.map((id) =>{
        const staff = staffList.find((s) => s.staff_id === id)
        return{
        }

    })

    return(
        
        <div className = "Entire-Page">
            <div className = "Editor-Rectangle">

                <div className = "Text-Formatting-Section">

                    <img src = { BOLD }/>
                    <img src = { ITALIC }/>   
                    <img src = { HIGHLIGHT }/>
                    <img src = { REFERENCE } />
                    <img src = { SUBSCRIPT }/>  
                    <img src = { SUPERSCRIPT }/> 
                    <img src = { BULLET }/>  
                    <img src = { NUMBERED }/>  
                    <img src = {EMDASH} />

                        {/** <button> Font Size   */}
                    
                    <select name = "Article-Type" id = "Article-Type">
                        <option value = "LOOK"> LOOK </option>
                        <option value = "ICYMI"> ICYMI </option>
                        <option value = "ANNOUNCEMENT"> ANNOUNCEMENT </option>
                        <option value = "ADVISORY"> ADVISORY </option>    
                        <option value = "ALERT"> ALERT </option>
                        <option value = "JUST_IN"> JUST IN </option>
                        <option value = "UNIVERSITY_NEWS"> UNIVERSITY NEWS </option>
                        <option value = "NATIONAL_NEWS"> NATIONAL NEWS</option>
                        <option value = "INTERNATIONAL_NEWS"> INTERNATIONAL NEWS </option>
                        <option value = "DEVELOPING_STORY"> DEVELOPING STORY </option>

                        <option value = "NULL"> ================== </option>

                        <option value = "LOOK"> Makata Mondays </option>
                        <option value = "LOOK"> Tek Tuesday </option>
                        <option value = "ICYMI"> Wankjob Wednesday </option>
                        <option value = "ANNOUNCEMENT"> Tala Thursday</option>
                        <option value = "ADVISORY"> Features Friday </option>    
                        <option value = "ALERT"> Streaming Saturday </option>
                        <option value = "JUST_IN"> Sports Sunday </option>
                    </select> 

                    <label htmlFor="file-upload">
                        <img 
                            src = {ATTACH} 
                            alt = "Upload" 
                            style = {{cursor: "pointer" }} 
                        />
                    </label>
                
                    <img 
                        src = {Author}
                        alt = "Select Author/s"
                        onClick = {openAuthorDialog}
                    />

                    <dialog ref = {authorDialogRef} className = "Staff-Dialog">
                        <div className = "Dialog-Box">
                            <h1> Select Authors </h1>
                            <div className = "Staffer-Box">
                                <div className="Search-Staff">
                                    <input type = "Search" placeholder = "Search here..." />    
                                </div> 
                                <div className = "Staffer-List">
                                    {staffList.map((staff) => (
                                        <label key = {staff.staff_id} className = "Staff-Item">
                                            <input
                                                type = "checkbox"
                                                checked = {selectedAuthor.includes(staff.staff_id)}
                                                onChange = {() => toggleAuthor(staff.staff_id)}
                                            />
                                            <bold id = "Staff-Name"> {staff.staff_display_name} </bold>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className = "Staff-Dialog-Button">
                            <button onClick = {closeAuthorDialog}> Done </button>
                        </div>
                    </dialog>

                    <img 
                        src = {MediaProvider}
                        alt = "Select Media Provider/s"
                        onClick = {openMediaProviderDialog}
                    />

                    <dialog ref = {mediaProviderDialogRef} className = "Staff-Dialog">
                        <div className = "Dialog-Box">
                            <h1> Select Media Provider </h1>
                            <div className = "Staffer-Box">
                               <div className="Search-Staff">
                                    <input type = "Search" placeholder = "Search here..." />    
                                </div> 
                                <div className = "Staffer-List">
                                    {staffList.map((staff) => (
                                        <label key = {staff.staff_id} className = "Staff-Item">
                                            <input 
                                                type = "checkbox"
                                                checked = {selectedMediaProvider.includes(staff.staff_id)}
                                                onChange = {() => toggleMediaProvider(staff.staff_id)}
                                            />
                                            <strong id = "Staff-Name"> {staff.staff_display_name} </strong >
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                            <button onClick = {closeMediaProviderDialog}> Done </button>
                    </dialog>

                    <input 
                        id = "file-upload"
                        type = "file" 
                        multiple
                        style = {{ display: "none" }} 
                        onChange = {(e) => console.log(e.target.files)} 
                    />


                </div>

                <div className = "Text-Area">
                    <input
                        type = "text"
                        placeholder = "Enter your new article headline here. (Follow/Subscribe/Add @AvoirJoseph)"
                        id = "Headline-Text"
                        className = "Headline-Input"
                    />

                    <div
                        contentEditable = {true}
                        suppressContentEditableWarning = {true}
                        id = "Body-Text"
                        className = "Headline-Input">
                        Enter your new article here.
                    </div>
               </div>
            </div>
            <div className = "Preview-Section">
                <h1> Article Preview </h1>
            </div>
        </div>
    )
}

export default CreateArticlePage;