import { Link, useSearchParams } from "react-router-dom";
import RANDOMIZE from "../assets/Miniature_Icon_Version/random.svg";
import "../CSS/Tabs.css";

const TAB_ITEMS = [
    { label: "ALL", type: null, title: "All Media Segments" },
    { label: "OPINION", type: "OPINION", title: "Opinion Articles" },
    { label: "EDITORIAL", type: "EDITORIAL", title: "Editorial Pieces" },
    { label: "Makata Monday", type: "MAKATA_MONDAYS", title: "Poetry, Prose, Pretention Galore!" },
    { label: "Tek Tuesday", type: "TEK_TUESDAY", title: "Our Teks dive into the world of technology!" },
    { label: "Wankjob Wednesday", type: "WANKJOB_WEDNESDAY", title: "Editorial Cartoonist and Wankers Wanking for attention" },
    { label: "Tala Thursday", type: "TALA_THURSDAY", title: "Filipino por Indio words of the Day!" },
    { label: "Features Friday", type: "FEATURES_FRIDAY", title: "Professional Yappers Yapping About Yap" },
    { label: "Streaming Saturday", type: "STREAMING_SATURDAY", title: "Streaming & Pop Culture Reviews" },
    { label: "Sports Sunday", type: "SPORTS_SUNDAY", title: "May Athletes pa pala tayo bukod kina Pacquiao, Yulo, Eala, at Diaz?" }
];

const Tabs = () => {
    const [searchParams] = useSearchParams();
    const activeType = searchParams.get("type");

    const getRandomType = () => {
        const types = TAB_ITEMS.map(t => t.type).filter(Boolean);
        const randomType = types[Math.floor(Math.random() * types.length)];
        return randomType;
    };

    return (
        <div className="Tabs">
            {TAB_ITEMS.map((item) => {
                const isActive = activeType === item.type || (!activeType && item.type === null);
                const toPath = item.type ? `/media-segment?type=${item.type}` : "/media-segment";

                return (
                    <Link
                        key={item.label}
                        to={toPath}
                        title={item.title}
                        className={isActive ? "active-tab" : ""}
                    >
                        {item.label}
                    </Link>
                );
            })}

            <Link
                to={`/media-segment?type=${getRandomType()}`}
                title="Can't figure out what you want? Random segment!"
            >
                <img src={RANDOMIZE} style={{ height: "1.5rem" }} alt="Random Segment" />
            </Link>
        </div>
    );
};

export default Tabs;