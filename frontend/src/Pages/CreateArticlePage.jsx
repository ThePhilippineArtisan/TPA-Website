import { useState, useRef, useEffect} from "react"

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

    const [submitArticle, setSubmitArticle] = useState({
        articleHeadline: "",
        articleBody: "",
        articleType: "",
        articleAuthors: ["The Philippine Artisan"],
        articleMediaProviders: ["The Philippine Artisan"],
        articleFileUpload: [],
    })

    useEffect(() => {
        AuthorList();       // fetch once when component loads
        MediaProviderList(); 
    }, []);

    const onSubmit = async(e) => {
        e.preventDefault();
        
        if(!submitArticle.articleHeadline && !submitArticle.articleBody){ 
            alert("Hedline or body is required.")
            return;
        }
        const formData = new FormData()

        formData.append("articleHeadline", submitArticle.articleHeadline)
        formData.append("articleBody", submitArticle.articleBody)
        formData.append("articleType", submitArticle.articleType)

        formData.append("articleAuthors", JSON.stringify(submitArticle.articleAuthors))
        formData.append("articleMediaProviders", JSON.stringify(submitArticle.articleMediaProviders))
        for (let i = 0; i < submitArticle.articleFileUpload.length; i++) {
            formData.append("articleFileUpload", submitArticle.articleFileUpload[i])
        }

        try {
            const res = await fetch("http://localhost:5000/article", // take this API
            {
            method: "POST",
            body: formData,
            });

            const data = await res.json();
            console.log("Article saved:", data);
            alert("Article created successfully!");
            return
            } catch (error) {
            console.error("Error creating article:", error);
            alert("Failed to create article.");
            }
            return;
        };

    const [headline, setHeadline] = useState("")
    const [bodyText, setBodyText] = useState("")
    const [articleType, setArticleType] = useState("")
    const [mediaFiles, setMediaFiles] = useState([])

    const [allActiveStaff, setAllActiveStaff] = useState([]) 
    // array because we're getting multiple staffers 
    
    const authorDialogRef = useRef(null)
    const openAuthorDialog = () => authorDialogRef.current.showModal()
    const closeAuthorDialog = () => authorDialogRef.current.close()

    const [selectedAuthor, setSelectedAuthor] = useState([])
    
    const toggleAuthor = (staffId) => {
        setSelectedAuthor((prevAuthors) => {
            const exists = prevAuthors.some(author => author.id === staffId)

            if(exists) // if you deselect, do this
                return prevAuthors.filter(author => author.id !== staffId)
            
            // if not selected, and you want  to select it, do this
                return [
                    ...prevAuthors, // add
                    { id: staffId, contributionType: "writer"}
                ] // return the latest thing u selected with its id
        }) 
    }

    const contributionType = (staffId, type) => {
        setSelectedAuthor(prevAuthors => 
            prevAuthors.map(author => {
                if (author.id === staffId) {
                    return { ...author, contributionType: type}
                }
                else return author
            }
            )
        )
    }
    // prev.map(...) goes through each object a in the previous selectedAuthor array.
    
    
    const [staffSearch, setStaffSearch] = useState("")

    const filteredStaffer = allActiveStaff.filter(staff =>
        staff.staff_display_name
        .toLowerCase()
        .includes(staffSearch.toLowerCase())
    )

    const [selectedMediaProvider, setSelectedMediaProvider] = useState([])
    
    const mediaProviderDialogRef = useRef(null)
    const openMediaProviderDialog = () => mediaProviderDialogRef.current.showModal()
    const closeMediaProviderDialog = () => mediaProviderDialogRef.current.close()

    const AuthorList = async () => {
        try{
        const response = await fetch("http://localhost:5000/active-staff")
        const activeStaffJSON = await response.json() // when fetching list, put it in json
        setAllActiveStaff(activeStaffJSON);
    } catch (error){
        console.error(error)
    }}

    const MediaProviderList = async () => {
        try{
        const response = await fetch("http://localhost:5000/active-staff")
        const activeStaffJSON = await response.json() // when fetching list, put it in json
        setAllActiveStaff(activeStaffJSON);
    } catch (error){
        console.error(error)
    }}    

    const toggleMediaProvider = (staffId) => {
        setSelectedMediaProvider(prev => {
            const exists = prev.some(a => a.id === staffId) //.some means finding anything that fits the condition
            
            if(exists)
                return prev.filter(a => a.id !== staffId)
            return[...prev,
                {id: staffId}
            ]
        })
    }

    return(
        <div className = "Entire-Page">
        <form onSubmit = {onSubmit}>
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
                    
                    <select name = "Article-Type" id = "Article-Type" value = {submitArticle.articleType} onChange = {(e) => setSubmitArticle({...submitArticle, articleType: e.target.value})}>
                        
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
                            // multiple
                            style = {{display: "none"}}

                            onChange = {(e) => setSubmitArticle({...submitArticle, articleFileUpload: e.target.files})}
                        />

                    </label>


                    <img 
                        src = {Author}
                        alt = "Select Author/s"
                        onClick = {openAuthorDialog}
                    />

                    <img 
                        src = {MediaProvider}
                        alt = "Select Media Provider/s"
                        onClick = {openMediaProviderDialog}
                    />

                </div>

                    <dialog ref = {authorDialogRef} className = "Staff-Dialog"> 
                        <div className = "Dialog-Box">
                            <h1> Select Author/s </h1>
                            <div className = "Staffer-Box">
                                <div className="Search-Staff">
                                <input 
                                    type = "Search" 
                                    placeholder = "Search author/s here..."
                                    onChange = {(e) => setStaffSearch(e.target.value)}
                                    ></input>
                                </div>
                                <div className = "Staffer-List">
                                {filteredStaffer.map((staff) => (
                                    <label key = {staff.staff_id} className = "Staff-Item">
                                        <input
                                            style = {{cursor: "pointer"}}
                                            type="checkbox"
                                            checked={selectedAuthor.includes(staff.staff_id)}
                                            onChange={() => toggleAuthor(staff.staff_id)}
                                        />
                                    <div className = "Staff-Name-Container"> <strong id = "Staff-Name">{staff.staff_display_name} </strong> </div>
                                    </label>
                                ))}
                                </div>
                            </div>
                        </div>
                    <button onClick = {closeAuthorDialog}> Done </button>
                    </dialog>

                    <dialog ref = {mediaProviderDialogRef} className = "Staff-Dialog"> 
                        <div className = "Dialog-Box">
                            <h1> Select Media Provider/s </h1>
                            <div className = "Staffer-Box">
                                <div className="Search-Staff">
                                <input 
                                    type = "Search" 
                                    placeholder = "Search author/s here..."
                                    onChange = {(e) => setStaffSearch(e.target.value)}
                                    ></input>

                                </div>
                                <div className = "Staffer-List">
                                    {filteredStaffer.map((staff) => {
                                        
                                        const selectedAuthorObj = selectedAuthor.find(a => a.id === staff.staff_id);

                                        return (
                                            <label key={staff.staff_id} className="Staff-Item">
                                                <input
                                                    style={{ cursor: "pointer" }}
                                                    type="checkbox"
                                                    checked={selectedMediaProvider.some(a => a.id === staff.staff_id)}
                                                    onChange={() => toggleMediaProvider(staff.staff_id)}
                                                />

                                                <div className="Staff-Name-Container">
                                                    <strong id="Staff-Name">{staff.staff_display_name}</strong>

                                                    {selectedAuthorObj && (
                                                        <select
                                                            name="Author-Type"
                                                            value={selectedAuthorObj.contributionType}
                                                            onChange={(e) =>
                                                                contributionType(staff.staff_id, e.target.value)
                                                            }
                                                        >
                                                            <option value = "Writer">Writer</option>
                                                            <option value="Broadcaster">Broadcaster</option>
                                                        </select>
                                                    )}
                                                </div>

                                            </label>
                                        );
                                    })}                                
                                </div>
                            </div>
                        </div>
                    <button onClick = {closeMediaProviderDialog}> Done </button>
                    </dialog>
                </div>

                <div className = "Text-Area">
                    <input
                        type = "text"
                        placeholder = "Enter your new article headline here. (Follow/Subscribe/Add @AvoirJoseph)"
                        id = "Headline-Text"
                        className = "Headline-Input"
                        value = {submitArticle.articleHeadline}
                        onChange = {(e) => setSubmitArticle({...submitArticle, articleHeadline: e.target.value})} // take the value of the thing inside the input, changes setHeadline state
                    />

                    <div
                        contentEditable
                        suppressContentEditableWarning = {true}
                        id = "Body-Text"
                        className = "Headline-Input"
                        value = {submitArticle.articleBody}
                        onInput = {(e) => setSubmitArticle({...submitArticle, articleBody: e.target.innerText})} // take the value to be as setBodyText
                        >
                    </div>          
                </div>
                
                <button type = "submit">Post</button>

        </form>
            <div className = "Preview-Section">
                <h1> Article Preview </h1>
            </div>
        </div>
)
}

export default CreateArticlePage;