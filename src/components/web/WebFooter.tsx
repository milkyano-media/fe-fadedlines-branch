import React from "react";
import { Link } from "react-router-dom";
import { socials } from "@/components/web/socials";

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
