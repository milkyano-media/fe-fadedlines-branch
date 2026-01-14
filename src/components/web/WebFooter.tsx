// import Facebook from "@/assets/web/icons/Facebook.svg";
import Instagram from "@/assets/web/icons/Instagram.svg";
import Tiktok from "@/assets/web/icons/Tiktok.svg";
// import Youtube from "@/assets/web/icons/Youtube.svg";
import Maps from "@/assets/web/icons/Maps.svg";
import GoogleReview from "@/assets/web/icons/GoogleReview.svg";
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

const WebFooter: React.FC = () => {
    return (
        <footer className="flex flex-col">
            <section className="relative z-10 bg-concrete-dark-80">
                <div className="container mx-auto py-12 flex flex-col md:flex-row  justify-between relative z-0">
                    <div className="flex flex-col pb-12 md:py-0 gap-10">
                        <img
                            src="/fadedlines-bentleigh-logo.png"
                            alt="barber shop faded lines"
                            className="w-[20rem] h-auto"
                        />
                        <div className="flex flex-col gap-4 relative z-[99999999]">
                            <h4 className="text-sm font-poppins font-medium">Visit us on:</h4>
                            <div className="flex gap-4">
                                <a
                                    href="https://www.instagram.com/fadedlinesbentleigh"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="transition-all duration-300 hover:scale-110"
                                    style={{
                                        filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 20px rgba(255, 255, 255, 0.4)) drop-shadow(0 0 30px rgba(255, 255, 255, 0.2))'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.filter = 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 25px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 40px rgba(255, 255, 255, 0.3))';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.filter = 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 20px rgba(255, 255, 255, 0.4)) drop-shadow(0 0 30px rgba(255, 255, 255, 0.2))';
                                    }}
                                >
                                    <img alt="Instagram" src={Instagram} className="w-12 h-auto" />
                                </a>
                                <a
                                    href="https://www.tiktok.com/@fadedlinesbentleigh"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="transition-all duration-300 hover:scale-110"
                                    style={{
                                        filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 20px rgba(255, 255, 255, 0.4)) drop-shadow(0 0 30px rgba(255, 255, 255, 0.2))'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.filter = 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 25px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 40px rgba(255, 255, 255, 0.3))';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.filter = 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 20px rgba(255, 255, 255, 0.4)) drop-shadow(0 0 30px rgba(255, 255, 255, 0.2))';
                                    }}
                                >
                                    <img alt="TikTok" src={Tiktok} className="w-12 h-auto" />
                                </a>
                                <a
                                    href="https://maps.app.goo.gl/Lav5YxbAz5SKvGCN7"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="transition-all duration-300 hover:scale-110"
                                    style={{
                                        filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 20px rgba(255, 255, 255, 0.4)) drop-shadow(0 0 30px rgba(255, 255, 255, 0.2))'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.filter = 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 25px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 40px rgba(255, 255, 255, 0.3))';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.filter = 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 20px rgba(255, 255, 255, 0.4)) drop-shadow(0 0 30px rgba(255, 255, 255, 0.2))';
                                    }}
                                >
                                    <img alt="Google Maps" src={Maps} className="w-12 h-auto" />
                                </a>
                                <a
                                    href="https://g.page/r/CeE5XFUFKWxlEBM/review"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="transition-all duration-300 hover:scale-110"
                                    style={{
                                        filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 20px rgba(255, 255, 255, 0.4)) drop-shadow(0 0 30px rgba(255, 255, 255, 0.2))'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.filter = 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 25px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 40px rgba(255, 255, 255, 0.3))';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.filter = 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 20px rgba(255, 255, 255, 0.4)) drop-shadow(0 0 30px rgba(255, 255, 255, 0.2))';
                                    }}
                                >
                                    <img alt="Google Review" src={GoogleReview} className="w-12 h-auto" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Pages Component */}
                    <div className="grid grid-cols-1 md:grid-cols-3 w-full md:w-2/3 gap-4 md:gap-0 text-sm">
                        <div className="flex flex-col gap-4 relative z-40">
                            <h3 className="text-lime">Pages</h3>
                            <ul className="flex flex-col font-light gap-2 text-stone-400">
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
                                    <Link to="/careers" className="hover:text-white">
                                        CAREERS
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

                        {/* Address Component */}
                        <div className="col-span-2">
                            <h3 className="text-lime mb-4">Address</h3>
                            <ul className="flex flex-col font-light gap-2 text-stone-400 mb-10">
                                <li>
                                    <Link to={getMapsLink()} target="_blank" className="hover:text-white">
                                        shop 7-271/275 Centre Rd, Bentleigh VIC 3204, Australia
                                    </Link>
                                </li>
                            </ul>
                            <h3 className="text-lime mb-4">Hours</h3>
                            <ul className="flex flex-col font-light gap-2 text-stone-400">
                                <li>
                                    <Link to={getMapsLink()} target="_blank" className="hover:text-white">
                                        Monday 12 PM - 8 PM
                                    </Link>
                                </li>
                                <li>
                                    <Link to={getMapsLink()} target="_blank" className="hover:text-white">
                                        Tuesday 12 PM - 8 PM
                                    </Link>
                                </li>
                                <li>
                                    <Link to={getMapsLink()} target="_blank" className="hover:text-white">
                                        Wednesday 12 PM - 8 PM
                                    </Link>
                                </li>
                                <li>
                                    <Link to={getMapsLink()} target="_blank" className="hover:text-white">
                                        Thursday 10 AM - 8 PM
                                    </Link>
                                </li>
                                <li>
                                    <Link to={getMapsLink()} target="_blank" className="hover:text-white">
                                        Friday 10 AM - 8 PM
                                    </Link>
                                </li>
                                <li>
                                    <Link to={getMapsLink()} target="_blank" className="hover:text-white">
                                        Saturday 10 AM - 5 PM
                                    </Link>
                                </li>
                                <li>
                                    <Link to={getMapsLink()} target="_blank" className="hover:text-white">
                                        Sunday Closed
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </footer>
    );
};

export default WebFooter;
