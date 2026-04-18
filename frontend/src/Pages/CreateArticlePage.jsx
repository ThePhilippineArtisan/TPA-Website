import { useState, useEffect} from "react"
import { supabase } from "../supabaseClient"

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
import SelectionModal from "../Modals/SelectStaffersModal.jsx"

const CreateArticlePage = () => {

    const [staff, setStaff] = useState([]);

    useEffect(() => {
        const fetchStaff = async () => {
            let {data, error} = await supabase
            .from('staff')
            .select('staff_display_name, staff_position, staff_order')
            .eq('staff_is_active', true)
            .order('staff_order', {ascending: true})

            if(error){
                console.log('Error fetching staffers: ', error)
            } else{
                setStaff(data)
            }
        }

        fetchStaff() // everytime you initiate fetchStaff, you call it immediately after before component can be seen
    }, [])

    const [newArticleHeadline, setNewArticleHeadline] = useState("")

    const addNewArticle = async () => {
        const newArticleHeadlineData = {
            name: newArticleHeadline,
            isCompleted: false
        }

        let {data, error} = await supabase
        .from('article')
        .insert([newArticleHeadlineData])
        .single()

        if(error){
            console.log('Error creating new article headline: ', error)
        } else{
            setNewArticleHeadline((prev), {...prev, data}) 
            // prev is the previous data it has (currently ""), then set ...prev to data (which holds newArticleHeadlineData)
        }
    }


    return(
        <div className = "Entire-Page">
            <>
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

                        <label htmlFor = "file-upload">
                            <img 
                                src = {ATTACH} 
                                alt = "Upload" 
                                style = {{cursor: "pointer" }}
                            />

                            <input
                                id = "file-upload"
                                type = "file" 
                                style = {{display: "none"}}
                            />

                        </label>


                        <img 
                            src = {Author}
                            alt = "Select Author/s"
                        />

                        <img 
                            src = {MediaProvider}
                            alt = "Select Media Provider/s"
                        />

                    </div>

                    <div className = "Text-Area">
                        <input
                            type = "text"
                            placeholder = "Enter your new article headline here."
                            id = "Headline-Text"
                            className = "Headline-Input"
                            onChange={(typing) => setNewArticle(typing.target.value)}
                        />

                        <div
                            contentEditable
                            suppressContentEditableWarning = {true}
                            id = "Body-Text"
                            className = "Headline-Input"
                            >
                        </div>          
                    </div>
                    
                    <button type = "submit" onClick = {addNewArticle}>Post</button>

                    </div>

                </>
            
            <div className = "Preview-Section">
                <h1> Article Preview </h1>
            </div>
        </div>
    )
}

export default CreateArticlePage;