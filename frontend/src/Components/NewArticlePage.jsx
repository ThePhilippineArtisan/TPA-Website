import { useState, useRef } from "react"

import "../CSS/NewArticlePage.css"

const NewArticlePage = () => {
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

    return(
        <div className = "Entire-Page">
            <div className = "Editor-Rectangle">

                <div className = "Text-Formatting-Section">
                    <button onClick = {() => insertAtCursor ("<b>")}> Bold </button>
                    <button onClick = {() => insertAtCursor ("<i>")}> Italic </button>
                    <button> Submit </button>

                    <input type = "file"/> 
                </div>

                <div className = "Text-Area">
                    <textarea 
                    ref = {textareaRef} 
                    placeholder = "Enter your new article here."
                    value = {text}
                    onChange = {(e) => setText(e.target.value)}
                    >
                    </textarea>

                </div>

            </div>
        </div>
    )
}

export default NewArticlePage;