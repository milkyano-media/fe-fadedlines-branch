import React from "react";
import { Link } from "react-router-dom";

function isIOS() {
    return [
        /iPad|iPhone|iPod/.test(navigator.userAgent),
        navigator.maxTouchPoints && navigator.maxTouchPoints > 2,
    ].some(Boolean);
}

function getMapsLink() {
    if (isIOS()) {
        return "https://maps.apple/p/C27MbUAz9ZIsQB";
    } else {
        return "https://maps.app.goo.gl/x4J7RE2sqtXZJq5w7?g_st=iw";
    }
}

const iconProps = {
    className: "w-6 h-6",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
};

const socials = [
    {
        label: "Instagram",
        href: "https://www.instagram.com/fadedlinesbentleigh",
        icon: (
            <svg {...iconProps}>
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
            </svg>
        ),
    },
    {
        label: "TikTok",
        href: "https://www.tiktok.com/@fadedlinesbentleigh",
        icon: (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
            </svg>
        ),
    },
    {
        label: "Google Maps",
        href: "https://maps.app.goo.gl/Lav5YxbAz5SKvGCN7",
        icon: (
            <svg {...iconProps} fill="currentColor" stroke="none">
                <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
            </svg>
        ),
    },
    {
        label: "Google Review",
        href: "https://g.page/r/CeE5XFUFKWxlEBM/review",
        icon: (
            <svg {...iconProps}>
                <path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 17l-5.2 2.7 1-5.9-4.3-4.1 5.9-.8L12 3.5z" />
            </svg>
        ),
    },
];

const hours = [
    { day: "Monday", time: "12 PM – 6 PM" },
    { day: "Tuesday", time: "12 PM – 7 PM" },
    { day: "Wednesday", time: "12 PM – 8 PM" },
    { day: "Thursday", time: "11 AM – 8 PM" },
    { day: "Friday", time: "10 AM – 6 PM" },
    { day: "Saturday", time: "9 AM – 4 PM" },
    { day: "Sunday", time: "Closed" },
];

const headingClass = "font-display font-normal text-3xl leading-tight text-white";
const textClass = "font-body font-light text-xs tracking-wide text-white/90";

const WebFooter: React.FC = () => {
    return (
        <footer className="flex flex-col">
            <section className="relative z-10 bg-transparent">
                <div className="container mx-auto py-10 grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 relative z-0">
                    <div className="flex flex-col gap-3 relative z-[99999999]">
                        <h4 className="font-body font-light text-[11px] text-white/70">Visit us on:</h4>
                        <div className="flex gap-5 text-white">
                            {socials.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    className="transition-opacity duration-300 hover:opacity-70"
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 relative z-40">
                        <h3 className={headingClass}>Pages</h3>
                        <ul className={`flex flex-col gap-2 ${textClass}`}>
                            <li>
                                <Link to="/" className="hover:text-white">
                                    HOME
                                </Link>
                            </li>
                            <li>
                                <Link to="/gallery" className="hover:text-white">
                                    GALLERY
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="hover:text-white">
                                    ABOUT US
                                </Link>
                            </li>
                            <li>
                                <a
                                    href="https://app.squareup.com/appointments/book/jy2gksgbixkv5v/LEWYVQ46HQREW/start"
                                    className="hover:text-white"
                                    target="_blank"
                                >
                                    CONTACT US
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h3 className={headingClass}>Address</h3>
                        <Link to={getMapsLink()} target="_blank" className={`${textClass} hover:text-white`}>
                            Shop 7, 271–275 Centre Rd
                            <br />
                            Bentleigh VIC 3204, Australia
                        </Link>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h3 className={headingClass}>Hours</h3>
                        <ul className={`flex flex-col ${textClass}`}>
                            {hours.map(({ day, time }) => (
                                <li key={day} className="border-t border-white/30 first:border-t-0">
                                    <Link
                                        to={getMapsLink()}
                                        target="_blank"
                                        className="flex justify-between py-2 hover:text-white"
                                    >
                                        <span>{day}</span>
                                        <span>{time}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>
        </footer>
    );
};

export default WebFooter;
