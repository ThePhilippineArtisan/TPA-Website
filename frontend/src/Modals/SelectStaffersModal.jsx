import {useRef, useEffect} from "react"

import "../CSS/SelectStaffersModal.css"

const SelectStaffersModal = ({isOpen, onClose, staffers}) => {
    const dialogRef = useRef(null)

    useEffect(() => {
        const dialog = dialogRef.current

        if(isOpen && !dialog.open){
            dialog.showModal()
        } else if(!isOpen && dialog.open){
            dialog.close()
        }
    }, [isOpen])

    const handleBackdropClick = (action) => {
        if(action.target === dialogRef.current){
            onClose();
        }
    }

    return(
        <dialog
            ref = {dialogRef}
            onClose = {onClose}
            onClick = {handleBackdropClick}
        >
            <div className = "Dialog-Box">
                    <h1>Select Staff</h1>
                    <p> Selected: <span> Joseph Brian Balut </span></p>
                    
                <div className = "Inside-Dialog-Box">
                    <div className = "Staffer-Section">
                            {staffers?.map((stafferItem, index) => (
                                <label key = {index}>
                                    <div className = "Staffer-Item">
                                        <input className = "Staffer-Item-Checkbox" type="checkbox"/> 
                                        <p>{stafferItem.staff_display_name}</p> 
                                    </div>
                                </label>
                            ))}
                    </div>
                </div>
                    <button onClick = {onClose}>Close</button>
            </div>
        </dialog>
    )
}

export default SelectStaffersModal