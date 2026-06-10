import "../CSS/AdminPageLogIn.css"

const AdminPageLogIn = () => {
    return(
        <div className = "Admin-Log-In-Full-Page">
            <div className = "Admin-Log-In-Form-Container">
                <div className = "Admin-Log-In-Form">
                    <div>
                        <h1> Admin Portal </h1>
                        <p> Sign-in using your provided credentials to explore the dashboard</p>
                    </div>
                    <div className = "Admin-Mid-Bottom-Part">
                        <div className = "Admin-Log-In-Form-Inputs">
                            <div>
                                <p> EMAIL ADDRESS </p>
                                <input
                                    placeholder = "credentials@gmail.com"
                                />
                            </div>
                            <div>
                                <p> PASSWORD </p>
                                <input
                                    placeholder="••••••••" 
                                />
                            </div>
                        </div>
                    </div>
                    <div className = "Admin-Log-In-Form-Button">
                        <button> <h2>Log-In</h2></button>
                    </div>
                </div>    
            </div>
        </div>
    )

}

export default AdminPageLogIn