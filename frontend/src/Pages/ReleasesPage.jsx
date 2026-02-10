import HTMLFlipbook from "react-pageflip";
import "../CSS/ReleasesPage.css";

import CalltoAction from "/Group 6.png"
import KALYOBOOKMOCKUP from "../TPA-Releases/2024-Kalyo/KALYO__2024_Page/KALYO BOOK MOCKUP.png"

import { useEffect, useRef } from "react";

const ReleasesPage = () => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const container = scrollRef.current;
    let scrollAmount = 0;

    const scrollInterval = setInterval(() => {
      if (!container)
        return;
      // Move right 
      container.scrollLeft += 1;
      scrollAmount += 1;
      // Reset when reaching the end 
      if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
        container.scrollLeft = 0;
        scrollAmount = 0;
      }
    }, 75);
    return () => clearInterval(scrollInterval);
  }, []);

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
  ];

  return (
    <div className="Releases-Page">
      <div className="List-of-Releases-Covers">
        <div className="Releases-Option" ref = {scrollRef}>
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
            <p> Tabula Rasa '24 - '25</p>
          </div>
          <div className="Releases-Option-Title">
            <p> Duh! Filipit Artihan '24 - '25</p>
          </div>
          <div className="Releases-Option-Title">
            <p> Broadsheet '24 - '25</p>
          </div>
          <div className="Releases-Option-Title">
            <p> Broadsheet '24 - '25</p>
          </div>
          <div className="Releases-Option-Title">
            <p> Broadsheet '24 - '25</p>
          </div>
          <div className="Releases-Option-Title">
            <p> Broadsheet '24 - '25</p>
          </div>

        </div>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: -1
        }}
      />
      <div className="Releases-Title"> <div> <span><p> KALYO: ? </p></span> </div>
        <div className="Releases-Caption">
          <p> Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laudantium id quas labore dolore assumenda delectus ipsa vero culpa ex eveniet. Dicta tempora qui, expedita quod mollitia architecto doloremque reiciendis eos? </p>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-start", width: "100%" }}>
        <HTMLFlipbook
          className="Releases-Book"
          width={500}
          height={600}
          maxShadowOpacity={0.75}
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

        <img
          src={CalltoAction}
          alt="Call to Action"
          style = {{paddingLeft: "1rem", width: "auto", height: "20%"}}
        />
      </div>
    </div>

  );
};

export default ReleasesPage;
