import BgHero2 from "@/assets/web/home/bg_hero.jpg";
import BookNowButton from "@/components/web/BookNowButton";
import Layout from "@/components/web/WebLayout";
import { Helmet } from "react-helmet-async";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { getAllBarber, getAllService } from "@/utils/barberApi";
import { BarberResponse, ServicesResponse, ServicesItem } from "@/interfaces/BookingInterface";

// Barber images for preview
import Anthony from "@/assets/web/barbers/anth.webp";
import Ej from "@/assets/web/barbers/ej.webp";
import Jamie from "@/assets/web/barbers/jamie.webp";
import Sam from "@/assets/web/barbers/sam.webp";
import Matteo from "@/assets/web/barbers/matteo.webp";
import Luka from "@/assets/web/barbers/luka.webp";
import Ben from "@/assets/web/barbers/ben.webp";
import Callum from "@/assets/web/barbers/callum.webp";
import Ollie from "@/assets/web/barbers/ollie.webp";
import Jeremy from "@/assets/web/barbers/jeremy.webp";
import Harry from "@/assets/web/barbers/harry.webp";

// Barber gallery images (with name label) for grid
import AnthonyGallery from "@/assets/web/barbers/barbers-gallery/anth.webp";
import EjGallery from "@/assets/web/barbers/barbers-gallery/ej.webp";
import JamieGallery from "@/assets/web/barbers/barbers-gallery/jamie.webp";
import SamGallery from "@/assets/web/barbers/barbers-gallery/sam.webp";
import MatteoGallery from "@/assets/web/barbers/barbers-gallery/matteo.webp";
import LukaGallery from "@/assets/web/barbers/barbers-gallery/luka.webp";
import BenGallery from "@/assets/web/barbers/barbers-gallery/ben.webp";
import CallumGallery from "@/assets/web/barbers/barbers-gallery/callum.webp";
import OllieGallery from "@/assets/web/barbers/barbers-gallery/ollie.webp";
import JeremyGallery from "@/assets/web/barbers/barbers-gallery/jeremy.webp";
import HarryGallery from "@/assets/web/barbers/barbers-gallery/harry.webp";

// Square head-aligned thumbnails (no name label) for carousel
import AnthonyThumb from "@/assets/web/barbers/home-thumbnails/anth.webp";
import EjThumb from "@/assets/web/barbers/home-thumbnails/ej.webp";
import JamieThumb from "@/assets/web/barbers/home-thumbnails/jamie.webp";
import SamThumb from "@/assets/web/barbers/home-thumbnails/sam.webp";
import MatteoThumb from "@/assets/web/barbers/home-thumbnails/matteo.webp";
import LukaThumb from "@/assets/web/barbers/home-thumbnails/luka.webp";
import BenThumb from "@/assets/web/barbers/home-thumbnails/ben.webp";
import CallumThumb from "@/assets/web/barbers/home-thumbnails/callum.webp";
import OllieThumb from "@/assets/web/barbers/home-thumbnails/ollie.webp";
import JeremyThumb from "@/assets/web/barbers/home-thumbnails/jeremy.webp";
import HarryThumb from "@/assets/web/barbers/home-thumbnails/harry.webp";

// Social media and other icons
import Logo from "@/assets/web/icons/logo.png";
import Instagram from "@/assets/web/icons/Instagram.svg";
import Tiktok from "@/assets/web/icons/Tiktok.svg";
import Maps from "@/assets/web/icons/Maps.svg";
import GoogleReview from "@/assets/web/icons/GoogleReview.svg";

const isBookingRedirect = import.meta.env.VITE_IS_BOOKING_REDIRECT;
const bookingRedirectUrl = import.meta.env.VITE_BOOKING_REDIRECT_URL;

// Tells Google the official business name for this site, so search results show
// "Fadedlines Bentleigh" instead of falling back to the generic brand name.
const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    name: "Fadedlines Bentleigh",
    alternateName: "Fadedlines Barbershop Bentleigh",
    image: "/fadedlines-bentleigh-logo.png",
    address: {
        "@type": "PostalAddress",
        streetAddress: "Shop 7, 271-275 Centre Rd",
        addressLocality: "Bentleigh",
        addressRegion: "VIC",
        postalCode: "3204",
        addressCountry: "AU",
    },
    sameAs: ["https://www.instagram.com/fadedlinesbentleigh", "https://www.tiktok.com/@fadedlinesbentleigh"],
    openingHoursSpecification: [
        { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday"], opens: "12:00", closes: "18:00" },
        { "@type": "OpeningHoursSpecification", dayOfWeek: ["Tuesday"], opens: "12:00", closes: "19:00" },
        { "@type": "OpeningHoursSpecification", dayOfWeek: ["Wednesday"], opens: "12:00", closes: "20:00" },
        { "@type": "OpeningHoursSpecification", dayOfWeek: ["Thursday"], opens: "11:00", closes: "20:00" },
        { "@type": "OpeningHoursSpecification", dayOfWeek: ["Friday"], opens: "10:00", closes: "18:00" },
        { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday"], opens: "09:00", closes: "16:00" },
    ],
};

export const generateLink = (text: string): JSX.Element => {
    const customize: boolean = isBookingRedirect === "false" || false;
    const squareLink: string =
        bookingRedirectUrl || "https://app.squareup.com/appointments/book/jy2gksgbixkv5v/LEWYVQ46HQREW/start";

    let bookLink: string;
    const parts = location.pathname.split("/");
    if (parts[1] === "meta") {
        bookLink = `/meta/book/services`;
    } else {
        bookLink = "/book/services";
    }

    if (customize) {
        return <Link to={bookLink}>{text}</Link>;
    } else {
        return <a href={squareLink}>{text}</a>;
    }
};

export default function Home() {
    localStorage.removeItem("booking_source");

    const location = useLocation();

    // Gallery state management
    const [selectedBarber, setSelectedBarber] = useState(0);
    const [barberMinPrices, setBarberMinPrices] = useState<Record<string, number>>({});
    const previewImageRef = useRef<HTMLDivElement>(null);
    const bookNowButtonRef = useRef<HTMLDivElement>(null);

    // Embla Carousel setup with infinite loop
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: 'center',
        containScroll: false,
    });

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

    // Barber gallery data
    // Grid/carousel order: Jeremy, Ben, Luka, Sam, Anth, Jamie, Ej, Matteo, Callum, Ollie, Harry
    const barberSvgs = [
        {
            svg: Jeremy,
            thumbnail: JeremyGallery,
            carouselThumb: JeremyThumb,
            link: generateRoute("/jeremy"),
            displayName: "JEREMY",
            landing: false,
            slug: "jeremy",
        },
        {
            svg: Ben,
            thumbnail: BenGallery,
            carouselThumb: BenThumb,
            link: generateRoute("/ben"),
            displayName: "BEN",
            landing: false,
            slug: "ben",
        },
        {
            svg: Luka,
            thumbnail: LukaGallery,
            carouselThumb: LukaThumb,
            link: generateRoute("/luka"),
            displayName: "LUKA",
            landing: false,
            slug: "luka",
        },
        {
            svg: Sam,
            thumbnail: SamGallery,
            carouselThumb: SamThumb,
            link: generateRoute("/sam"),
            displayName: "SAM",
            landing: false,
            slug: "sam",
        },
        {
            svg: Anthony,
            thumbnail: AnthonyGallery,
            carouselThumb: AnthonyThumb,
            link: generateRoute("/anthony"),
            displayName: "ANTH",
            landing: true,
            slug: "anthony",
        },
        {
            svg: Jamie,
            thumbnail: JamieGallery,
            carouselThumb: JamieThumb,
            link: generateRoute("/jamie"),
            displayName: "JAMIE",
            landing: false,
            slug: "jamie",
        },
        {
            svg: Ej,
            thumbnail: EjGallery,
            carouselThumb: EjThumb,
            link: generateRoute("/ej"),
            displayName: "EJ",
            landing: true,
            slug: "ej",
        },
        {
            svg: Matteo,
            thumbnail: MatteoGallery,
            carouselThumb: MatteoThumb,
            link: generateRoute("/matteo"),
            displayName: "MATTEO",
            landing: false,
            slug: "matteo",
        },
        {
            svg: Callum,
            thumbnail: CallumGallery,
            carouselThumb: CallumThumb,
            link: generateRoute("/callum"),
            displayName: "CALLUM",
            landing: false,
            slug: "callum",
        },
        {
            svg: Ollie,
            thumbnail: OllieGallery,
            carouselThumb: OllieThumb,
            link: generateRoute("/ollie"),
            displayName: "OLLIE",
            landing: false,
            slug: "ollie",
        },
        {
            svg: Harry,
            thumbnail: HarryGallery,
            carouselThumb: HarryThumb,
            link: generateRoute("/harry"),
            displayName: "HARRY",
            landing: false,
            slug: "harry",
        },
    ];

    // Transform barberSvgs into gallery-friendly format
    const galleryBarbers = barberSvgs.map((barber) => ({
        image: barber.svg,
        thumbnail: barber.thumbnail,
        carouselThumb: barber.carouselThumb,
        name: barber.displayName,
        link: barber.link,
        landing: barber.landing,
        slug: barber.slug,
    }));

    // Duplicate barbers for carousel infinite loop (3x for smooth scrolling)
    const carouselBarbers = [...galleryBarbers, ...galleryBarbers, ...galleryBarbers];

    // Get actual barber index for preview and grid (modulo to map back to original 3)
    const actualBarberIndex = selectedBarber % galleryBarbers.length;

    // Embla: Sync selected slide with state
    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedBarber(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        const barberAliases: Record<string, string[]> = {
            anthony: ["ANTHONY", "ANTH"],
            ej: ["EJ"],
            jamie: ["JAMIE"],
            matteo: ["MATTEO"],
            sam: ["SAM"],
            luka: ["LUKA"],
            ben: ["BEN"],
            callum: ["CALLUM"],
            ollie: ["OLLIE"],
            jeremy: ["JEREMY"],
            harry: ["HARRY"],
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
        if (!emblaApi) return;

        // Start at middle set for smooth infinite loop
        emblaApi.scrollTo(galleryBarbers.length, false);

        onSelect();
        emblaApi.on('select', onSelect);

        return () => {
            emblaApi.off('select', onSelect);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [emblaApi, onSelect]);

    // Handler for hero Book Now button - scroll to gallery Book Now
    const handleHeroBookNowClick = () => {
        if (bookNowButtonRef.current) {
            const isMobile = window.innerWidth < 768;
            const yOffset = isMobile ? -550 : -700;
            const y = bookNowButtonRef.current.getBoundingClientRect().top +
                      window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    // Interaction handlers for gallery
    const handleThumbnailClick = (index: number, e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        // Use Embla to scroll to the selected index
        if (emblaApi) {
            emblaApi.scrollTo(index);
        }

        // Smooth scroll to preview with offset
        setTimeout(() => {
            if (previewImageRef.current) {
                const isMobile = window.innerWidth < 768;
                const yOffset = isMobile ? -220 : -150;
                const y = previewImageRef.current.getBoundingClientRect().top +
                          window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        }, 50);
    };

    const handleNameClick = (index: number) => {
        // Use Embla to scroll to the selected index
        if (emblaApi) {
            emblaApi.scrollTo(index);
        }

        // Scroll to preview
        setTimeout(() => {
            if (previewImageRef.current) {
                const isMobile = window.innerWidth < 768;
                const yOffset = isMobile ? -220 : -150;
                const y = previewImageRef.current.getBoundingClientRect().top +
                          window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        }, 50);
    };

    return (
        <Layout>
            <Helmet>
                <title>Fadedlines Bentleigh | Barbershop in Bentleigh, Melbourne</title>
                <meta
                    name="description"
                    content="Fadedlines Bentleigh - barbershop at 271-275 Centre Rd, Bentleigh VIC. Book fades, haircuts and beard trims with Melbourne's top barbers."
                />
                <meta property="og:site_name" content="Fadedlines Bentleigh" />
                <meta property="og:title" content="Fadedlines Bentleigh | Barbershop in Bentleigh, Melbourne" />
                <meta
                    property="og:description"
                    content="Fadedlines Bentleigh - barbershop at 271-275 Centre Rd, Bentleigh VIC. Book fades, haircuts and beard trims with Melbourne's top barbers."
                />
                <meta property="og:image" content="/fadedlines-bentleigh-logo.png" />
                <meta name="twitter:card" content="summary_large_image" />
                <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>
            </Helmet>

            <section className="relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        alt="hero image"
                        width={3376}
                        height={6000}
                        src={BgHero2}
                        className="w-full h-full object-cover object-[50%_53%] md:object-[50%_38%]"
                    />
                    <div className="absolute inset-0 bg-black/55" />
                </div>
                <div className="relative z-10 flex flex-col justify-center items-center text-center gap-8 pt-24 pb-14 md:pt-36 md:pb-20">
                    <img
                        src={Logo}
                        alt="Fadedlines Barber Shop"
                        className="w-[18rem] md:w-[25rem] h-auto"
                    />
                    <BookNowButton onClick={handleHeroBookNowClick} className="px-14 md:px-16 py-4 md:py-5" />

                    <div className="flex gap-4 mt-4">
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
                            href="https://www.tiktok.com/@fadedlines_bentleigh"
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
            </section>

            <div className="relative z-20 flex flex-col items-center gap-3 pt-6 pb-4 md:pt-10">
                <p className="text-xs md:text-sm tracking-[0.4em] text-white/80 uppercase">Meet your barber</p>
                <svg className="w-5 animate-bounce opacity-80" viewBox="0 0 55 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M50.582 0.216618L54.9987 4.63745L30.9279 28.7166C30.5422 29.1048 30.0835 29.4128 29.5783 29.623C29.0731 29.8332 28.5313 29.9414 27.9841 29.9414C27.4369 29.9414 26.8951 29.8332 26.3899 29.623C25.8847 29.4128 25.4261 29.1048 25.0404 28.7166L0.957032 4.63745L5.3737 0.220782L27.9779 22.8208L50.582 0.216618Z"
                        fill="#E3E0DA"
                    />
                </svg>
            </div>

            <section className="relative z-20 w-full flex flex-col justify-center md:max-w-screen-xl mx-auto pt-0 pb-0 md:pt-2 md:pb-[4rem] mb-[-2rem] md:mb-0 bg-transparent">
                <div className="container mx-auto px-2 md:px-8 scale-[90%] md:scale-100 origin-top">
                    {/* BARBER NAME CAROUSEL HEADER */}
                    <div
                        ref={emblaRef}
                        className="relative overflow-hidden mb-6 md:mb-8 pt-2 pb-[5px]"
                    >
                        <div className="flex items-center">
                            {carouselBarbers.map((barber, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="flex-[0_0_auto] min-w-0 px-2 md:px-4"
                                    >
                                        <button
                                            onClick={() => handleNameClick(index)}
                                            className={`relative flex flex-col items-center gap-1 md:gap-2 px-3 md:px-6 py-1 transition-all duration-500 cursor-pointer ${
                                                selectedBarber === index
                                                    ? "text-white"
                                                    : "text-[#9A9A96]"
                                            }`}
                                        >
                                            {/* Thumbnail Image */}
                                            <div className={`w-20 h-20 md:w-32 md:h-32 rounded-lg overflow-hidden border border-white/20 ${
                                                selectedBarber === index
                                                    ? "ring-2 ring-white"
                                                    : ""
                                            }`}>
                                                <img
                                                    src={barber.carouselThumb}
                                                    alt={barber.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            {/* Barber Name with underline wrapper */}
                                            <div className="relative pb-0">
                                                <span className="text-base md:text-2xl font-normal tracking-[0.2em] whitespace-nowrap">
                                                    {barber.name}
                                                </span>

                                                {/* UNDERLINE for active */}
                                                {selectedBarber === index && (
                                                    <div className="absolute bottom-[-8px] md:bottom-[-10px] left-0 right-0 h-[2px] md:h-[4px] bg-white"></div>
                                                )}
                                            </div>

                                            {/* DIMMED WHITE SPOTLIGHT GRADIENT EFFECT */}
                                            {selectedBarber === index && (
                                                <>
                                                    <div className="absolute inset-0 -z-10 pointer-events-none" style={{ overflow: 'visible' }}>
                                                        <div
                                                            className="absolute left-1/2 -translate-x-1/2"
                                                            style={{
                                                                width: '180%',
                                                                height: '250%',
                                                                bottom: '-15%',
                                                                background: "radial-gradient(ellipse 80% 55% at 50% 100%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.22) 15%, rgba(255,255,255,0.12) 30%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0) 75%)",
                                                                filter: "blur(18px)",
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="absolute inset-0 -z-10 pointer-events-none" style={{ overflow: 'visible' }}>
                                                        <div
                                                            className="absolute left-1/2 -translate-x-1/2"
                                                            style={{
                                                                width: '140%',
                                                                height: '200%',
                                                                bottom: '-10%',
                                                                background: "radial-gradient(ellipse 70% 45% at 50% 100%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.18) 25%, rgba(255,255,255,0.08) 45%, rgba(255,255,255,0) 70%)",
                                                                filter: "blur(10px)",
                                                            }}
                                                        />
                                                    </div>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* MAIN PREVIEW IMAGE */}
                    <div
                        ref={previewImageRef}
                        className="max-w-[240px] md:max-w-sm mx-auto mb-4 md:mb-8 overflow-hidden rounded-2xl shadow-xl shadow-black/40 aspect-[924/1320]"
                    >
                        <img
                            key={actualBarberIndex}
                            src={galleryBarbers[actualBarberIndex].image}
                            alt={galleryBarbers[actualBarberIndex].name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* DIVIDER LINE WITH CTA BUTTON */}
                    <div ref={bookNowButtonRef} className="w-full max-w-screen-md mx-auto mb-4 md:mb-6 flex items-center justify-center gap-4">
                        <div className="flex-1 h-[1px] bg-white/70"></div>
                        <Link to={`${galleryBarbers[actualBarberIndex].link}/book/services`}>
                            <BookNowButton className="px-8 md:px-12 py-3 md:py-4">
                                BOOK WITH {galleryBarbers[actualBarberIndex].name}
                            </BookNowButton>
                        </Link>
                        <div className="flex-1 h-[1px] bg-white/70"></div>
                    </div>

                    {/* THUMBNAIL GRID (3 columns) */}
                    <div className="max-w-screen-md mx-auto relative px-1 md:px-0">
                        <div className="grid grid-cols-3 md:grid-cols-3 gap-4 md:gap-9">
                            {galleryBarbers.map((barber, index) => (
                                <div
                                    key={index}
                                    onClick={(e) => handleThumbnailClick(index + galleryBarbers.length, e)}
                                    className={`aspect-square cursor-pointer relative transition-all duration-200 ${
                                        actualBarberIndex === index ? "scale-100" : "hover:scale-105"
                                    } ${galleryBarbers.length % 3 === 1 && index === galleryBarbers.length - 1 ? "col-start-2" : ""}`}
                                >
                                    <div className={`w-full h-full overflow-hidden rounded-md md:rounded-lg ${
                                        actualBarberIndex === index ? "ring-2 md:ring-4 ring-white opacity-100" : "hover:opacity-80"
                                    }`}>
                                        <img
                                            src={barber.thumbnail}
                                            alt={barber.name}
                                            className="w-full h-full object-cover pointer-events-none"
                                            loading="lazy"
                                        />
                                    </div>
                                    {barberMinPrices[barber.slug] !== undefined && (
                                        <span
                                            className="absolute -top-2.5 z-10 bg-[#D9D9D9] text-[#222] text-xs md:text-sm font-bold px-2 md:px-3 py-1 md:py-1.5 rounded-lg border border-white/70 tracking-wide pointer-events-none shadow-md shadow-black/40 -left-2.5"
                                        >
                                            ${barberMinPrices[barber.slug] % 1 === 0
                                                ? barberMinPrices[barber.slug]
                                                : barberMinPrices[barber.slug].toFixed(2)}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
