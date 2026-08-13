import BgHero2 from "@/assets/web/home/hero.svg";
import { Button } from "@/components/ui/button";
import Layout from "@/components/web/WebLayout";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation } from "react-router-dom";
import { getAllBarber, getAllService } from "@/utils/barberApi";
import { BarberResponse, ServicesResponse, ServicesItem } from "@/interfaces/BookingInterface";

export default function Barbers() {
    const [barberMinPrices, setBarberMinPrices] = useState<Record<string, number>>({});

    localStorage.removeItem("booking_source");

    const location = useLocation();

    const getQueryParams = (search: string) => {
        return new URLSearchParams(search);
    };

    const queryParams = getQueryParams(location.search);
    const fbclid = queryParams.get("fbclid");
    const ttclid = queryParams.get("ttclid");
    const gclid = queryParams.get("gclid");

    const trackingData = {
        utm_source: queryParams.get("utm_source"),
        utm_medium: queryParams.get("utm_medium"),
        utm_campaign: queryParams.get("utm_campaign"),
        utm_content: queryParams.get("utm_content"),
        fbclid: queryParams.get("fbclid"),
    };

    localStorage.setItem("booking_source", JSON.stringify(trackingData));

    if (trackingData.fbclid && trackingData.utm_source) {
        localStorage.setItem("customer_source", JSON.stringify(trackingData));
    }

    localStorage.setItem("utm_source", queryParams.get("utm_source") || "None");
    localStorage.setItem("utm_medium", queryParams.get("utm_medium") || "None");
    localStorage.setItem("utm_campaign", queryParams.get("utm_campaign") || "None");
    localStorage.setItem("utm_content", queryParams.get("utm_content") || "None");

    if (fbclid) {
        localStorage.setItem("booking_origin", "facebook");
    } else if (ttclid) {
        localStorage.setItem("booking_origin", "tiktok");
    } else if (gclid) {
        localStorage.setItem("booking_origin", "google");
    } else {
        localStorage.setItem("booking_origin", "organic");
    }

    const generateRoute = (route: string): string => {
        const parts = location.pathname.split("/");
        if (parts[1] === "meta") {
            return `/meta${route}`;
        } else {
            return route;
        }
    };

    const generateLink = () => {
        const squareLink: string = "https://app.squareup.com/appointments/book/jy2gksgbixkv5v/LEWYVQ46HQREW/start";

        let bookLink: string;
        const parts = location.pathname.split("/");
        if (parts[1] === "meta") {
            bookLink = `/meta/book/services`;
        } else {
            bookLink = "/book/services";
        }

        const customize: boolean = false;
        if (customize) {
            return bookLink;
        } else {
            return squareLink;
        }
    };

    const barberSvgs = [
        {
            svg: "https://s3.milkyano.com/milkyano/fadedlines-bentleigh/barbers/anth1.png",
            link: generateRoute("/anthony"),
            landing: false,
            slug: "anthony",
        },
        {
            svg: "https://s3.milkyano.com/milkyano/fadedlines-bentleigh/barbers/ej1.png",
            link: generateRoute("/ej"),
            landing: false,
            slug: "ej",
        },
        {
            svg: "https://s3.milkyano.com/milkyano/fadedlines-bentleigh/barbers/jamie1.png",
            link: generateRoute("/jamie"),
            landing: false,
            slug: "jamie",
        },
    ];

    useEffect(() => {
        const barberAliases: Record<string, string[]> = {
            anthony: ["ANTHONY", "ANTH"],
            ej: ["EJ"],
            jamie: ["JAMIE"],
        };

        const fetchPrices = async () => {
            try {
                const [fetchedBarbers, fetchedServices]: [BarberResponse, ServicesResponse] = await Promise.all([
                    getAllBarber(),
                    getAllService("all", ""),
                ]);

                const prices: Record<string, number> = {};

                for (const [slug, aliases] of Object.entries(barberAliases)) {
                    const barberProfile = fetchedBarbers?.team_member_booking_profiles?.find((p) =>
                        aliases.some((a) => p.display_name.toUpperCase().includes(a))
                    );

                    if (!barberProfile) continue;

                    const services: ServicesItem[] = fetchedServices?.objects?.filter((service) => {
                        const serviceName = service.item_data.name.toUpperCase();
                        const nameMatch = aliases.some((a) => serviceName.includes(`BY ${a}`));
                        const idMatch = service.item_data.variations.some((v) =>
                            v.item_variation_data.team_member_ids?.includes(barberProfile.team_member_id)
                        );
                        return nameMatch && idMatch;
                    }) ?? [];

                    const servicePrices = services
                        .map((s) => s.item_data.variations[0].item_variation_data.price_money.amount)
                        .filter((p) => p > 0);

                    if (servicePrices.length > 0) {
                        prices[slug] = Math.min(...servicePrices) / 100;
                    }
                }

                setBarberMinPrices(prices);
            } catch {
                // silently fail — badge just won't show
            }
        };

        fetchPrices();
    }, []);

    useEffect(() => {
        // Create a new style element
        const style = document.createElement("style");

        // Define the animation
        style.innerHTML = `
        @keyframes move {
            0% { transform: translateX(100%); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateX(-100%); opacity: 0; }
        }`;

        // Append the style element to the document head
        document.head.appendChild(style);

        // Clean up function
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return (
        <Layout>
            <Helmet>
                <title>Our Barbers | Fadedlines Bentleigh</title>
                <meta
                    name="description"
                    content="Meet the barbers at Fadedlines Bentleigh. Book your fade, haircut or beard trim at 271-275 Centre Rd, Bentleigh VIC."
                />
                <meta property="og:site_name" content="Fadedlines Bentleigh" />
                <meta property="og:title" content="Our Barbers | Fadedlines Bentleigh" />
                <meta
                    property="og:description"
                    content="Meet the barbers at Fadedlines Bentleigh. Book your fade, haircut or beard trim at 271-275 Centre Rd, Bentleigh VIC."
                />
                <meta property="og:image" content="/fadedlines-bentleigh-logo.png" />
                <meta name="twitter:card" content="summary_large_image" />
            </Helmet>

            <section className="flex flex-col justify-center items-center relative pt-40 bg-concrete-dark-80">
                <img
                    alt="hero image"
                    width={500}
                    height={500}
                    src={BgHero2}
                    className="top-0 absolute w-full h-full object-cover"
                />
                <div className="top-0 absolute w-full h-full object-cover z-0 bg-gradient-to-b from-concrete-dark-80/80 to-concrete-dark-80" />
                <div className="flex flex-col justify-center items-center text-center gap-6 z-10">
                    <div className="flex flex-col mb-12">
                        <h2>MEET OUR</h2>
                        <h2 className="text-lime">BARBERS</h2>
                    </div>

                    <svg className="w-7 mt-20" viewBox="0 0 55 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M50.582 0.216618L54.9987 4.63745L30.9279 28.7166C30.5422 29.1048 30.0835 29.4128 29.5783 29.623C29.0731 29.8332 28.5313 29.9414 27.9841 29.9414C27.4369 29.9414 26.8951 29.8332 26.3899 29.623C25.8847 29.4128 25.4261 29.1048 25.0404 28.7166L0.957032 4.63745L5.3737 0.220782L27.9779 22.8208L50.582 0.216618Z"
                            fill="#33FF00"
                        />
                    </svg>
                </div>
            </section>

            <section className="w-full min-h-screen flex  justify-center md:max-w-screen-xl   mx-auto md:py-24 pb-[12rem] md:pb-[4rem] mb-12 relative">
                <div className="w-full flex flex-wrap mx-auto justify-center items-center px-4 md:px-0">
                    {barberSvgs.map((barber, index) => (
                        <Link
                            to={barber.landing ? barber.link : generateLink()}
                            key={index}
                            className="w-full md:w-[300px] py-6 flex flex-col justify-center items-center relative mx-10"
                        >
                            <div className="relative px-4 md:px-0">
                                <img
                                    src={barber.svg}
                                    alt={`Svg ${index}`}
                                    className="h-[400px] md:h-[450px] transition-transform duration-500 ease-in-out hover:scale-110 z-30 mb-12"
                                />
                                {barberMinPrices[barber.slug] !== undefined && (
                                    <span
                                        className={`absolute top-3 z-40 bg-black/75 text-lime text-xs font-bold px-3 py-1.5 rounded-xl border border-lime/50 backdrop-blur-sm tracking-wide ${
                                            index % 2 === 0 ? "left-7 md:left-3" : "right-7 md:right-3"
                                        }`}
                                    >
                                        from ${barberMinPrices[barber.slug] % 1 === 0
                                            ? barberMinPrices[barber.slug]
                                            : barberMinPrices[barber.slug].toFixed(2)}
                                    </span>
                                )}
                            </div>
                            <Button className="border absolute md:relative bottom-[.5rem] md:bottom-[1rem] px-7 py-5 rounded-lg border-[#184937] hover:border-white text-lime bg-transparent backdrop-blur-md z-30 transform hover:scale-110 transition-transform duration-400 ease-in-out hover:shadow-md hover:bg-lime hover:shadow-lime text-xs md:text-base hover:text-white">
                                LEARN MORE
                            </Button>
                        </Link>
                    ))}
                </div>
            </section>
        </Layout>
    );
}
