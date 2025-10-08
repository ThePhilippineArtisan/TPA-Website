import { useState, useRef } from "react"
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

import "../CSS/NewArticlePage.css"

const NewArticlePage = () => {

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
                        <option value = "LOOK"> ICYMI </option>
                        <option value = "LOOK"> ANNOUNCEMENT </option>
                        <option value = "LOOK"> ADVISORY </option>    
                        <option value = "LOOK"> ALERT </option>
                        <option value = "LOOK"> JUST IN </option>
                        <option value = "LOOK"> UNIVERSITY NEWS </option>
                        <option value = "LOOK"> NATIONAL NEWS</option>
                        <option value = "LOOK"> INTERNATIONAL NEWS </option>
                        <option value = "LOOK"> DEVELOPING STORY </option>
                    </select> 

                    <label htmlFor="file-upload">
                        <img 
                            src = {ATTACH} 
                            alt = "Upload" 
                            style = {{cursor: "pointer" }} 
                        />
                        </label>

                        <input 
                        id = "file-upload"
                        type = "file" 
                        multiple
                        style = {{ display: "none" }} 
                        onChange = {(e) => console.log(e.target.files)} 
                        />
                </div>

                <div className = "Text-Area">
                    <textarea 
                        placeholder = "Enter your new article headline here."
                        id = "headline-text"
                    >
                    </textarea>


                    <textarea 
                        placeholder = "Enter your new article here."
                        id = "body-text"
                    > 
                    </textarea>
                </div>

            </div>

            <div className = "Preview-Section">
                <h1> Article Preview </h1>
            </div>
        </div>
    )
}

export default NewArticlePage;

{/**
    const [text, setText] = useState("")
    const textareaRef = useRef(null)

    const insertAtCursor = (insertText) => {
        const textarea = textareaRef.current
        const start = textarea.selectionStart
        const end = textarea.selectionEnd

        const newText = 
            text.substring(0, start) + insertText + text.substring(end, text.length)
        
        setText(newText)
        
        setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = start + insertText.length
            textarea.focus()
        }, 0)
    }
 
    
                    ref = {textareaRef} 
                    value = {text}
                    onChange = {(e) => setText(e.target.value)}



                    <button onClick = {() => insertAtCursor ("<b>")}> <b> Bold </b>  
                    <button onClick = {() => insertAtCursor ("<i>")}> <i> Italic </i>  
                    
                    <input type = "file"/> 

                    <button> Submit  

*/}