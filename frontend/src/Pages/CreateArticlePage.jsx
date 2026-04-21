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
import StaffModal from "../Modals/SelectStaffersModal.jsx"

const CreateArticlePage = () => {
    // People states
    const [staff, setStaff] = useState([]);

    useEffect(() => {
        const fetchStaff = async () => {
            let {data, error} = await supabase
            .from('staff')
            .select('staff_display_name, staff_position, staff_order')
            .eq('staff_isactive', true)
            .order('staff_order', {ascending: true})

            if(error){
                console.log('Error fetching staffers: ', error)
            } else{
                setStaff(data)
            }
        }

        fetchStaff() // everytime you initiate fetchStaff, you call it immediately after before component can be seen
    }, [])

    const [selectedAuthors, setSelectedAuthors] = useState([])
    const [selectedMediaProviders, setSelectedMediaProviders] = useState([])
    
    const [headline, setHeadline] = useState("")
    const [body, setBody] = useState("")

    const [mediaImagePhoto, setMediaImagePhoto] = useState([])

    // Modal states
    const [isAuthorModalOpen, setIsAuthorModalOpen] = useState(false)
    const [isMediaModalOpen, setIsMediaModalOpen] = useState(false)


    const slugify = str => 
        str.toLowerCase()
        .replace(/[^\w\s]/g, "")
        .trim()
        .replace(/\s+/g, "-")

    const addNewArticle = async(isPublishedStatus) => {
        if(!headline){
            alert("Please enter a headline before submitting.")
            return
        }

        const generatedSlug = slugify(headline)

        const newArticlePayloads = {
            article_headline: headline,
            article_body: body,
            slug_headline: generatedSlug,
            is_published: isPublishedStatus
        }

        let {data: articleData, error: articleError} = await supabase
        .from('article')
        .insert([newArticlePayloads])
        .select()
        .single()

        if(articleError){
            console.log('Error creating new article: ', articleError)
            alert(articleError)
            return
        }

        // Inserting in article_staff
        const newArticleId = articleData.article_id

        const authorPayloads = selectedAuthors.map(author => ({
            article_id: newArticleId,
            staff_id: author.staff_id,
            contribution_as: 'Author'
        }))

        const mediaPayloads = selectedMediaProviders.map(media => ({
            article_id: newArticleId,
            staff_id: media.staff_id,
            contribution_as: 'Media_Provider'
        }))

        const allStaffPayloads = [...authorPayloads, ...mediaPayloads] // combines both to be inserted in the article_staff for credits
    
        if(allStaffPayLoads.length > 0) {
            let {errror: staffError} = await supabase
            .from('article_staff')
            .insert(allStaffPayloads)

            if (staffError) {
                console.log('Error linking staff: ', staffError)
                alert(staffError)
                return
            }
        }

        const mediaImagePhotoPayload = selectedMediaProviders.map(image => ({
            article
        }))

        alert("Article saved successfully!")

        setHeadline("")
        setBody("")
        setSelectedAuthor([])
        setSelectedMediaProviders([])
        document.getElementById("Body-Text").innerHTML = ""
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
                            onClick = {() => 
                                setIsAuthorModalOpen(true)
                            }

                            style = {{cursor: "pointer"}}
                        />

                        <StaffModal 
                            isOpen={isAuthorModalOpen} 
                            onClose={() => setIsAuthorModalOpen(false)} 
                            staffers = {staff} 
                            onConfirm = {(selectedStaffers) => {
                                setSelectedAuthors(selectedStaffers)
                                setIsAuthorModalOpen(false)
                            }}
                        />

                        <img 
                            src = {MediaProvider}
                            alt = "Select Media Provider/s"
                            onClick = {() => 
                                setIsMediaModalOpen(true)
                            }

                            style = {{cursor: "pointer"}}
                        />

                        <StaffModal 
                            isOpen={isMediaModalOpen} 
                            onClose={() => setIsMediaModalOpen(false)} 
                            staffers = {staff} 
                            onConfirm = {(selectedStaffers) => {
                                setSelectedMediaProviders(selectedStaffers)
                                setIsMediaModalOpen(false)
                            }}
                        />

                    </div>

                    <div className = "Text-Area">
                        <input
                            type = "text"
                            placeholder = "Enter your new article headline here."
                            id = "Headline-Text"
                            className = "Headline-Input"
                            value = {headline}
                            onChange={(typing) => setNewArticle(typing.target.value)}
                        />

                        <div
                            contentEditable
                            suppressContentEditableWarning = {true}
                            id = "Body-Text"
                            className = "Headline-Input"
                            onChange={(typing) => setBody(typing.currentTarget.innerHTML)}
                            >
                        </div>          
                    </div>
                    
                    <button type = "submit" onClick = {() => addNewArticle(false)}>Save as Draft</button>
                    <button type = "submit" onClick = {() => addNewArticle(true)}>Post</button>
                    <button type = "submit">Schedule Post</button>

                    </div>

                </>
            
            <div className = "Preview-Section">
                <h1> Article Preview </h1>
            </div>
        </div>
    )
}

export default CreateArticlePage;