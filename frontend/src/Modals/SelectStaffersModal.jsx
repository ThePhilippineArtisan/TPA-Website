import {useRef, useEffect, useState} from "react"

import "../CSS/SelectStaffersModal.css"

const SelectStaffersModal = ({isOpen, onClose, staffers, onConfirm}) => {
    const dialogRef = useRef(null)

    const [selectedStaff, setSelectedStaff] = useState([])

    useEffect(() => {
        const dialog = dialogRef.current

        if(isOpen && !dialog.open){
            dialog.showModal()
            setSelectedStaff([]) // clear and start with no toggled staffer
        } else if(!isOpen && dialog.open){
            dialog.close()
        }
    }, [isOpen])

    const handleBackdropClick = (action) => {
        if(action.target === dialogRef.current){
            onClose();
        }
    }

    const handleToggle = (staffMember) => {
        setSelectedStaff((prev) => {
            if(prev.includes(staffMember)){ // if you've already selected, deselect the staffer.
                return prev.filter(staff => staff !== staffMember)
            } else{
                return [...prev, staffMember]
            }
        })
    }

    const handleConfirmSelection = () => {
        onConfirm(selectedStaff)
        onClose();
    }

    return(
        <dialog
            ref = {dialogRef}
            onClose = {onClose}
            onClick = {handleBackdropClick}
        >
            <div className = "Dialog-Box">
                <>
                    <h1>Select Staff</h1>
                    <div>
                        {selectedStaff.length > 0 && (
                        <div>
                            {selectedStaff.map((staffShowItem, index) => (
                                    <span key = {index}> 
                                        {staffShowItem.staff_display_name} 
                                        <button
                                            onClick={() => handleToggle(staffShowItem)}
                                        >
                                            &times;
                                        </button>
                                    </span>
                            ))}
                        </div>
                        )
                        }
                    </div>
                    <div>
                        Search
                    </div>
                    <div className = "Inside-Dialog-Box">
                        <div className = "Staffer-Section">
                                {staffers?.map((staffItem, index) => (
                                    <label key = {index}>
                                        <div className = "Staffer-Item">
                                            <input className = "Staffer-Item-Checkbox" 
                                            type = "checkbox"
                                            checked = {selectedStaff.includes(staffItem)}
                                            onChange = {() => handleToggle(staffItem)}
                                            /> 
                                            <strong> <p>{staffItem.staff_display_name}</p> </strong>
                                        </div>
                                    </label>
                                ))}
                        </div>
                    </div>
                </>
                <button onClick = {onClose}>Close</button>
                <button onClick = {handleConfirmSelection}>Confirm</button>
            </div>
        </dialog>
    )
}

export default SelectStaffersModal