import React from "react";
import "../CSS/NewsletterSubscribe.css";

/**
 * NewsletterSubscribe Component
 * Embeds The Philippine Artisan's Substack newsletter subscription box.
 * Styled to seamlessly fit TPA's aesthetic without external promotional clutter.
 * 
 * @param {'banner' | 'article' | 'sidebar'} variant - Controls layout and presentation style
 * @param {string} [title] - Custom headline
 * @param {string} [subtitle] - Custom description text
 * @param {string} [className] - Additional custom CSS class
 */
const NewsletterSubscribe = ({
    variant = "banner",
    title,
    subtitle,
    className = ""
}) => {
    const isSidebar = variant === "sidebar";
    const isArticle = variant === "article";

    const defaultTitle = "Official Email Newsletter";

    const defaultSubtitle = isSidebar
        ? "Get campus dispatches and editorial releases delivered straight to your inbox."
        : isArticle
            ? "Never miss an investigative report, campus story, or official release. Join our official mailing list."
            : "Receive our latest investigative stories, campus news, in-depth features, and official university releases directly in your inbox.";

    return (
        <section
            className={`tpa-newsletter-section tpa-newsletter-${variant} ${className}`}
            aria-label="Official Email Newsletter"
        >
            <div className="tpa-newsletter-container">
                <div className="tpa-newsletter-header">
                    <span className="tpa-newsletter-badge">Official Email Newsletter</span>
                    <h3 className="tpa-newsletter-title">{title || defaultTitle}</h3>
                    <p className="tpa-newsletter-subtitle">{subtitle || defaultSubtitle}</p>
                </div>

                <div className="tpa-newsletter-iframe-wrapper">
                    <iframe
                        src="https://philartisan.substack.com/embed"
                        className="tpa-newsletter-iframe"
                        title="The Philippine Artisan Official Email Newsletter"
                        frameBorder="0"
                        scrolling="no"
                    />
                </div>

                <a
                    href="https://philartisan.substack.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tpa-newsletter-direct-link"
                >
                    <span>Subscribe directly on Substack</span> ⟶
                </a>
            </div>
        </section>
    );
};

export default NewsletterSubscribe;
