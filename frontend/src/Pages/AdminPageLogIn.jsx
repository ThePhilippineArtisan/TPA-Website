import "../CSS/AdminPageLogIn.css"

const AdminPageLogIn = () => {
    return(
        <div className = "Admin-Log-In-Full-Page">
            <div className = "Admin-Log-In-Form">
                <div>
                    <h1> Admin Log-In </h1>
                </div>

                <div>
                    <div>
                        <h3> Email Address: <input></input> </h3>
                    </div>
                    <div>
                        <h3> Password: <input></input> </h3>
                    </div>
                </div>

                <div>
                    <button> Log-In </button>
                </div>
            </div>
        </div>
    )

}

export default AdminPageLogIn