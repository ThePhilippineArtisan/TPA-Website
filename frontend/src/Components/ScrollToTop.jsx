import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        // Prevent browser from automatically restoring stale scroll positions on SPA navigation
        if ("scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual";
        }
    }, []);

    useEffect(() => {
        if (hash) {
            const elementId = hash.substring(1);
            if (elementId === "home") {
                window.scrollTo({ top: 0, left: 0, behavior: "instant" });
            } else {
                const element = document.getElementById(elementId);
                if (element) {
                    setTimeout(() => {
                        element.scrollIntoView({ behavior: "smooth" });
                    }, 50);
                } else {
                    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
                }
            }
        } else {
            // When navigating to another page without a hash, always scroll to the top
            window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        }
    }, [pathname, hash]);

    return null;
};

export default ScrollToTop;
