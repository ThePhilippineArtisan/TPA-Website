import { useEffect, useRef } from "react";
import { supabase } from "../supabaseClient"

import HTMLFlipbook from "react-pageflip";
import "../CSS/ReleasesPage.css";



import KALYOBOOKMOCKUP from "../TPA-Releases/2024-Kalyo/KALYO__2024_Page/KALYO BOOK MOCKUP.png"

const ReleasesPage = () => {

  

  const photos = [
    new URL("../TPA-Releases/2024-Kalyo/KALYO__2024_Page/KALYO__2024_Page-001.png", import.meta.url).href,
    new URL("../TPA-Releases/2024-Kalyo/KALYO__2024_Page/KALYO__2024_Page-002.png", import.meta.url).href,
    new URL("../TPA-Releases/2024-Kalyo/KALYO__2024_Page/KALYO__2024_Page-003.png", import.meta.url).href,
    new URL("../TPA-Releases/2024-Kalyo/KALYO__2024_Page/KALYO__2024_Page-004.png", import.meta.url).href,
    new URL("../TPA-Releases/2024-Kalyo/KALYO__2024_Page/KALYO__2024_Page-005.png", import.meta.url).href,
    new URL("../TPA-Releases/2024-Kalyo/KALYO__2024_Page/KALYO__2024_Page-006.png", import.meta.url).href,
    new URL("../TPA-Releases/2024-Kalyo/KALYO__2024_Page/KALYO__2024_Page-007.png", import.meta.url).href,
    new URL("../TPA-Releases/2024-Kalyo/KALYO__2024_Page/KALYO__2024_Page-008.png", import.meta.url).href,
    new URL("../TPA-Releases/2024-Kalyo/KALYO__2024_Page/KALYO__2024_Page-009.png", import.meta.url).href,
    new URL("../TPA-Releases/2024-Kalyo/KALYO__2024_Page/KALYO__2024_Page-010.png", import.meta.url).href,
    new URL("../TPA-Releases/2024-Kalyo/KALYO__2024_Page/KALYO__2024_Page-011.png", import.meta.url).href,
    new URL("../TPA-Releases/2024-Kalyo/KALYO__2024_Page/KALYO__2024_Page-012.png", import.meta.url).href,
    new URL("../TPA-Releases/2024-Kalyo/KALYO__2024_Page/KALYO__2024_Page-013.png", import.meta.url).href,
    new URL("../TPA-Releases/2024-Kalyo/KALYO__2024_Page/KALYO__2024_Page-014.png", import.meta.url).href,
    new URL("../TPA-Releases/2024-Kalyo/KALYO__2024_Page/KALYO__2024_Page-015.png", import.meta.url).href,
    new URL("../TPA-Releases/2024-Kalyo/KALYO__2024_Page/KALYO__2024_Page-016.png", import.meta.url).href,
    new URL("../TPA-Releases/2024-Kalyo/KALYO__2024_Page/KALYO__2024_Page-017.png", import.meta.url).href,
    new URL("../TPA-Releases/2024-Kalyo/KALYO__2024_Page/KALYO__2024_Page-018.png", import.meta.url).href,
    new URL("../TPA-Releases/2024-Kalyo/KALYO__2024_Page/KALYO__2024_Page-019.png", import.meta.url).href,
    new URL("../TPA-Releases/2024-Kalyo/KALYO__2024_Page/KALYO__2024_Page-020.png", import.meta.url).href,
    new URL("../TPA-Releases/2024-Kalyo/KALYO__2024_Page/KALYO__2024_Page-021.png", import.meta.url).href,
  ]

  return (
    <div className="Releases-Page-Container">
      <div className = "Releases-Page"> 
        <div className="List-of-Releases-Covers">
          <div className="Releases-Option">
            <div className="Releases-Option-Title">
              <p> Kalyo '24 - '25</p>
            </div>
            <div className="Releases-Option-Title">
              <p> Newsletter '24 - '25</p>
            </div>
            <div className="Releases-Option-Title">
              <p> Tabula Rasa '24 - '25</p>
            </div>
            <div className="Releases-Option-Title">
              <p> Duh! Filipit Artihan '24 - '25</p>
            </div>
            <div className="Releases-Option-Title">
              <p> PhilArts </p>
            </div>
            <div className="Releases-Option-Title">
              <p> Broadsheet '24 - '25</p>
            </div>

          </div>
        </div>
        <div className="Releases-Title"> 
          <div className = "Releases-Title-Type">
              <p> The Official Literary Folio of The Philippine Artisan </p>
            <span>
              KALYO: ? '24 - '25
            </span>
             <hr style = {{width: "80%", margin: "1rem 0rem"}}></hr>
            <div>
              <p> Click here for the full soft copy of this release </p>
            </div>
          </div>
          <div className="Releases-Caption">
            <p> Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laudantium id quas labore dolore assumenda delectus ipsa vero culpa ex eveniet. Dicta tempora qui, expedita quod mollitia architecto doloremque reiciendis eos? 
            </p>
          </div>
        </div>

        <div className = "Releases-Book-Container">
          <div className = "Releases-Book-Button-Container">
            <HTMLFlipbook
              className="Releases-Book"
              width={500}
              height={600}
              maxShadowOpacity={0.5}
              drawShadow={true}
              showCover={true}
              size="fixed"
            >

              {photos.map((photo, index) => (
                <div className="Demo-Page" key={index}>
                  <img
                    src={photo}
                    loading="lazy"
                    draggable={false}
                    style={{ width: "100%", height: "100%", cursor: "grab" }}
                  />
                </div>
              ))}

            </HTMLFlipbook>
            <div className = "Releases-Book-Button">
              <button> Previous </button>
              <div className = "Releases-Book-Button-Counter">
                <p> 1 of 10 </p>
              </div>
              <button> Next </button>
            </div>
          </div>
        </div>

        <div className = "List-Of-Releases-Container">
            <div className = "List-Of-Releases">
              <div>
                <h1> AY 2025 - 2026 RELEASES</h1>
                <div className = "Releases-Book-And-Title-Container">
                  <div className = "Releases-Book-And-Title">
                      <span className = "Releases-Option-Title"> <b>Kalyo</b>Kamatayan </span>
                    <div className = "Releases-Book-Image">
                      <img 
                        src = {KALYOBOOKMOCKUP}
                      />
                    </div>
                  </div>

                  <div className = "Releases-Book-And-Title">
                      <span className = "Releases-Option-Title"> <b>PhilArts</b>Status Quo </span>
                    <div className = "Releases-Book-Image">
                      <img 
                        src = {KALYOBOOKMOCKUP}
                      />
                    </div>
                  </div>

                  <div className = "Releases-Book-And-Title">
                      <span className = "Releases-Option-Title"> <b>Broadsheet</b>'25 - '26 </span>
                    <div className = "Releases-Book-Image">
                      <img 
                        src = {KALYOBOOKMOCKUP}
                      />
                    </div>
                  </div>

                  <div className = "Releases-Book-And-Title">
                      <span className = "Releases-Option-Title"> <b>Newsletter</b> '25 - '26 1st Batch </span>
                    <div className = "Releases-Book-Image">
                      <img 
                        src = {KALYOBOOKMOCKUP}
                      />
                    </div>
                  </div>

                  <div className = "Releases-Book-And-Title">
                      <span className = "Releases-Option-Title"> 
                        <b>Newsletter</b>
                        '25 - '26 2nd Batch 
                      </span>
                    <div className = "Releases-Book-Image">
                      <img 
                        src = {KALYOBOOKMOCKUP}
                      />
                    </div>
                  </div>

                  <div className = "Releases-Book-And-Title">
                      <span className = "Releases-Option-Title">
                        <b>Tabula Rasa</b>
                        Does this have titles?
                      </span>
                    <div className = "Releases-Book-Image">
                      <img 
                        src = {KALYOBOOKMOCKUP}
                      />
                    </div>
                  </div>

                </div>
              </div>
            </div>
            <div className = "Releases-Filter">

            </div>
        </div>
      </div>
    </div>

  );
};

export default ReleasesPage;
