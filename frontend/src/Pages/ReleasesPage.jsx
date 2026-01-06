import HTMLFlipbook from "react-pageflip";
import "../CSS/ReleasesPage.css";

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
  ];

  return (
    <div className="Releases-Page">
      <div
          style={{
          backgroundImage: `url("../TPA-Releases/2024-Kalyo/KALYO__2024_Page/KALYO__2024_Page-001.png")`,
          backgroundSize: "10rem",
          backgroundPosition: "center",
          transform: "rotate(3deg)",
          filter: "blur(10px)",
          position: "absolute",
          inset: 0,
          zIndex: -2
          }}
      />

      {/* Dark overlay */}
      
      <div
          style={{
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          position: "absolute",
          height: "148dvh",
          inset: 0,
          zIndex: -1
          }}
      />
      <div className = "Releases-Title"> <div> <span><p> KALYO: ? </p></span> </div>
        <div className = "Releases-Caption">
          <p> Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laudantium id quas labore dolore assumenda delectus ipsa vero culpa ex eveniet. Dicta tempora qui, expedita quod mollitia architecto doloremque reiciendis eos? </p>
        </div>
      </div>
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

    </div>
  );
};

export default ReleasesPage;
