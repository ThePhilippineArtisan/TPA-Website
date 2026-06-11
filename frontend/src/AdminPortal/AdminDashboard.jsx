import "./AdminDashboard.css"

const AdminDashboard = () => {
    return(
        <div className = "Admin-Dashboard">
            <div className = "Admin-Dashboard-Header">
                <h1> Welcome to the Admin Dashboard!</h1>
                <p> Check the website's stats, nerd crap, and everything in between. </p>
            </div>

            <div className = "Admin-Dashboard-BTN">
                <div className = "Admin-Dashboard-BTN-Stats">
                    <p> 6,967,420 </p>
                    <h3> Website visits </h3>
                </div>
                <div className = "Admin-Dashboard-BTN-Stats">
                    <p> 6,967 </p>
                    <h3> Website visits for the past 30 days </h3>
                </div>
                <div className = "Admin-Dashboard-BTN-Stats">
                    <p> 23.26 GB / 100 GB </p>
                    <h3> Cloudflare R2 Image storage </h3>
                </div>
                <div className = "Admin-Dashboard-BTN-Stats">
                    <p> $123.67 </p>
                    <h3> Cloudflare monthly bill </h3>
                </div>
            </div>
            
            <hr></hr>
            <div className = "Admin-Dashboard-Bottom-BTN">
                <div className = "Admin-Dashboard-Superlative-Container">
                    <div >
                        <h2> Most popular tags </h2>
                        <p className = "Admin-Dashboard-Mosts"> • Dog-fighting rink</p>
                        <p className = "Admin-Dashboard-Mosts"> • Gawad Tek </p>
                        <p className = "Admin-Dashboard-Mosts"> • Earthquake Drill </p>
                    </div>
                    
                    <div>
                        <h2> Most recent posts </h2>
                        <div className = "Admin-Dashboard-Mosts">
                            <p> Nuremberg: Death Toll at Auschwitz climbs... </p>
                            <p> <span> 6,000,000 visits </span> </p>
                        </div>

                        <div className = "Admin-Dashboard-Mosts">
                            <p> A second tower has hit the twin towers... </p>
                            <p> <span> 2,977 visits </span> </p>
                        </div>
                        
                        <div className = "Admin-Dashboard-Mosts">
                            <p> Counting or not counting gang violence... </p>
                            <p> <span> 3,000 visits </span> </p>
                        </div>
                    </div>
                </div>

                <div className = "Admin-Dashboard-Quick-Actions">
                    <h2> Quick Actions </h2>
                    <div className = "Admin-Quick-Actions">
                        <p> Create an Article </p>
                    </div>
                    <div className = "Admin-Quick-Actions">
                        <p> Configure Website Showcase Slides </p>
                    </div>
                    <div className = "Admin-Quick-Actions">
                        <p> Add New Releases </p>
                    </div>
                    <div className = "Admin-Quick-Actions">
                        <p> Add New Staff </p>
                    </div>
                    <div className = "Admin-Quick-Actions">
                        <p> Add New YouTube Video Embed </p>
                    </div>
                    <div className = "Admin-Quick-Actions">
                        <p> Coming Soon... </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard;