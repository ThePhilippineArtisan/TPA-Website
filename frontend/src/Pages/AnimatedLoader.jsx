import TPACircleLogo from "../assets/Miniature_Icon_Version/TPACircleLogo.svg";

const AnimatedLoader = () => {
    return(
        <div
            style = {{
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#fff",
            }}
        >

        <style>
          {`
            @keyframes scale {
              0% { transform: scale(6); 
                    opacity: 100%; }
              25% { opacity: 50%; }
              50% { opacity: 100%; }
              75% { opacity: 50%; height: 0vh;}
              100% { opacity: 100%; }
              105% { transform: scale(1);
                     opacity: 50%;}
            }
            
            .loader-logo {
              width: 125px;
              height: 125px;
              animation: scale 0.75s linear infinite alternate;
            }
              span{
              lo
              }
              
          `}
        </style>
        <img 
            src = {TPACircleLogo} 
            className = "loader-logo" 
            alt = "Loading" 
            style = {{ 
                filter: "drop-shadow(2px 5px 7px rgba(0, 0, 0, 0.8))"
            }}/>
    </div>
    )
}

export default AnimatedLoader;