import { useEffect, useState } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import BookingListButton from "@/components/book/BookingListButton";
import {
  BarberResponse,
  BarberServices,
  ServicesResponse,
  ServicesItem,
} from "@/interfaces/BookingInterface";
import { getAllBarber, getAllService } from "@/utils/barberApi";
import Spinner from "../web/Spinner";
import Logo from "@/assets/web/icons/logo.png";
import { ChevronDown } from "lucide-react";
import IconNavbar from "@/assets/svg/icon-navbar-white.svg";

// Bentleigh barbers: Anthony, EJ, Jamie, Sam, and Matteo (based on Square API data)
import Anthony from "@/assets/web/barbers/booking-list/anth-book.webp";
import Ej from "@/assets/web/barbers/booking-list/ej-book.webp";
import Jamie from "@/assets/web/barbers/booking-list/jamie-book.webp";
import Sam from "@/assets/web/barbers/booking-list/sam-book.webp";
import Matteo from "@/assets/web/barbers/booking-list/matteo-book.webp";
import LukaBook from "@/assets/web/barbers/booking-list/luka-book.webp";
import BenBook from "@/assets/web/barbers/booking-list/ben-book.webp";
import CallumBook from "@/assets/web/barbers/booking-list/callum-book.webp";
import OllieBook from "@/assets/web/barbers/booking-list/ollie-book.webp";
import JeremyBook from "@/assets/web/barbers/booking-list/jeremy-book.webp";
import HarryBook from "@/assets/web/barbers/booking-list/harry-book.webp";
import InstagramIcon from "@/assets/book/mdi_instagram.svg";

const barberImages: { [key: string]: string } = {
  ANTHONY: Anthony,
  ANTH: Anthony, // Handle both "Anthony" and "Anth" variations
  EJ: Ej,
  JAMIE: Jamie,
  SAM: Sam,
  MATTEO: Matteo,
  LUKA: LukaBook,
  BEN: BenBook,
  CALLUM: CallumBook,
  OLLIE: OllieBook,
  JEREMY: JeremyBook,
  HARRY: HarryBook,
};

const barberInstagram: { [key: string]: string } = {
  ANTHONY: "@anth.cuts",
  ANTH: "@anth.cuts",
  BEN: "@bmcutzzz",
  JEREMY: "@jeyblends",
  HARRY: "@hi.blendz",
};

const BookList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [barberServices, setBarberServices] = useState<BarberServices>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [expandedBarber, setExpandedBarber] = useState<string | null>(null);

  useEffect(() => {
    // ✅ Fixed joinBarbersAndServices function
    const joinBarbersAndServices = (
      barbers: BarberResponse | undefined,
      services: ServicesResponse | undefined,
      specificBarber: string | null,
    ) => {
      const barberServices: BarberServices = { data: [] };

      // Bentleigh barber sort order: Jeremy, Ben, Luka, Sam, Anth, Jamie, EJ, Matteo, Callum, Ollie, Harry
      const sortOrder = [
        "JEREMY",
        "BEN",
        "LUKA",
        "SAM",
        "ANTHONY", // Will match "Anthony", "ANTHONY", "Anth", etc.
        "JAMIE",
        "EJ",
        "MATTEO",
        "CALLUM",
        "OLLIE",
        "HARRY",
        "MIKEY",
      ];

      // 1. Use all available profiles
      let sortedProfiles = barbers?.team_member_booking_profiles ?? [];

      // 2. Filter for a specific barber if provided
      if (specificBarber && specificBarber !== "book") {
        // Alias mapping: URL barber name → possible display names in Square API
        const barberAliases: { [key: string]: string[] } = {
          "anthony": ["ANTHONY", "ANTH"],
          "ej": ["EJ"],
          "jamie": ["JAMIE"],
          "sam": ["SAM"],
          "matteo": ["MATTEO"],
          "mikey": ["MIKEY"],
          "luka": ["LUKA"],
          "ben": ["BEN"],
          "callum": ["CALLUM"],
          "ollie": ["OLLIE"],
          "jeremy": ["JEREMY"],
          "harry": ["HARRY"],
        };

        const searchAliases = barberAliases[specificBarber.toLowerCase()] || [specificBarber.toUpperCase()];

        sortedProfiles = sortedProfiles.filter((profile) => {
          const profileName = profile.display_name.toUpperCase();
          return searchAliases.some(alias => profileName.includes(alias));
        });
      }

      // 3. Sort based on predefined sortOrder, unknowns go to bottom
      sortedProfiles = sortedProfiles.sort((a, b) => {
        const aIndex = sortOrder.findIndex((name) =>
          a.display_name.toUpperCase().includes(name),
        );
        const bIndex = sortOrder.findIndex((name) =>
          b.display_name.toUpperCase().includes(name),
        );
        const aSort = aIndex !== -1 ? aIndex : 999;
        const bSort = bIndex !== -1 ? bIndex : 999;
        return aSort - bSort;
      });

      // 4. Match services with each barber
      if (sortedProfiles && services) {
        for (let i = 0; i < sortedProfiles.length; i++) {
          const currentBarber = sortedProfiles[i];

          // Extract barber's first name for name matching
          const barberFirstName = currentBarber.display_name.split(' ')[0].toUpperCase();

          const servicesForBarber = services.objects.filter((service) => {
            const serviceName = service.item_data.name.toUpperCase();

            // Method 1: Check if service name explicitly mentions this barber
            // Handle various patterns: "By Jamie", "by Jamie", "BY JAMIE"
            // Also check for "Anth" variant of "Anthony"
            const namePatterns = [
              `BY ${barberFirstName}`,
              `BY ${currentBarber.display_name.toUpperCase()}`,
            ];

            // For Anthony, also check for "Anth" variant
            if (barberFirstName === 'ANTHONY') {
              namePatterns.push('BY ANTH');
            }

            const nameMatch = namePatterns.some(pattern => serviceName.includes(pattern));

            // Method 2: Check team_member_ids (original logic)
            const idMatch = service.item_data.variations.some((variation) =>
              variation.item_variation_data.team_member_ids?.includes(
                currentBarber.team_member_id,
              ),
            );

            // IMPORTANT FIX: Service must match BOTH name AND id
            // This prevents "Any Barber" ID from causing wrong assignments
            return nameMatch && idMatch;
          });

          barberServices.data.push({
            barber: currentBarber,
            services: servicesForBarber,
          });
        }
      }

      setBarberServices(barberServices);

      // Auto-expand if there's only one barber
      if (
        barberServices.data.length === 1 &&
        barberServices.data[0].barber.team_member_id
      ) {
        setExpandedBarber(barberServices.data[0].barber.team_member_id);
      }
    };

    const fetchData = async () => {
      setIsLoading(true);
      const parts = location.pathname.split("/");

      // Determine which barber to show
      let specificBarber = null;
      let barber;
      let query;
      // Handle different URL patterns
      parts[1] === "meta" ? (barber = parts[2]) : (barber = parts[1]);
      // DISABLED: Type filtering - now showing all items without "(O)" filter
      // parts[1] === "meta" ? (type = "M") : (type = "O");
      const type = ""; // No filtering by type

      const isBookingPath =
        parts.includes("book") || parts.includes("services");

      // Set the specific barber based on URL
      if (barber && barber !== "book" && isBookingPath) {
        specificBarber = barber;
      }

      // Determine query for API - Bentleigh specific barbers
      // Always use "all" for general booking or specific Bentleigh barbers
      if (
        barber === "anthony" ||
        barber === "ej" ||
        barber === "jamie" ||
        barber === "sam" ||
        barber === "book"
      ) {
        query = "all";
      } else {
        query = barber || "all"; // Default to "all" if no specific barber
      }

      const fetchedBarbers = await getAllBarber();
      const fetchedServices = await getAllService(query, type);

      joinBarbersAndServices(fetchedBarbers, fetchedServices, specificBarber);
      setIsLoading(false);
    };

    fetchData();
  }, [location.pathname]);

  const handleBookNowClick = async (item: ServicesItem) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 100));
      localStorage.removeItem("bookedItems");
      const updatedBookings = [item];
      localStorage.setItem("bookedItems", JSON.stringify(updatedBookings));
      const parts = location.pathname.split("/");
      const newPath = "/" + parts.slice(1, parts.length - 1).join("/");
      navigate(`${newPath}/appointment`);
    } catch (error) {
      console.error("Error booking the item:", error);
    }
  };

  const toggleBarberServices = (barberId: string) => {
    setExpandedBarber(expandedBarber === barberId ? null : barberId);
  };

  const getBarberImage = (displayName: string) => {
    const upperName = displayName.toUpperCase();
    for (const [key, value] of Object.entries(barberImages)) {
      if (upperName.includes(key)) {
        return value;
      }
    }
    return null;
  };

  const getBarberInstagram = (displayName: string): string => {
    const fromName = displayName.match(/@[^\s)]+/)?.[0];
    if (fromName) return fromName;
    const upperName = displayName.toUpperCase();
    for (const [key, value] of Object.entries(barberInstagram)) {
      if (upperName.includes(key)) return value;
    }
    return "";
  };

  const extractPriceRange = (services: ServicesItem[]) => {
    const prices = services
      .map((service) => {
        const priceAmount = service.item_data.variations[0].item_variation_data.price_money.amount;
        // Convert from cents to dollars
        return priceAmount / 100;
      })
      .filter((price) => price > 0);

    if (prices.length === 0) return "";

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    return minPrice === maxPrice ? `$${minPrice}` : `$${minPrice}-$${maxPrice}`;
  };

  const cleanDisplayName = (name: string): string => {
    // Remove (Available Now), (O), (o), (M), (m), surcharge text and any extra spaces
    return name
      .replace(/\(Available Now\)/gi, "")
      .replace(/\(O\)/gi, "") // Case insensitive - removes both (O) and (o)
      .replace(/\(M\)/gi, "") // Case insensitive - removes both (M) and (m)
      .replace(/\+\s*\[15%\s*Surcharge\s*On\s*Sundays\]/gi, "")
      .trim()
      .replace(/\s+/g, " "); // Replace multiple spaces with single space
  };

  const formatPrice = (priceAmount: number): string => {
    // Convert from cents to dollars
    const dollars = priceAmount / 100;
    return `$${dollars.toFixed(2)}`;
  };

  return (
    <section className="relative bg-transparent min-h-screen">
      <div
        className="fixed top-0 left-0 right-0 z-50 h-16 md:h-[72px] px-6 flex items-center justify-between border-b-[0.5px] border-white/60 shadow-lg shadow-black/20 backdrop-blur-md"
        style={{ background: "rgba(74, 74, 74, 0.8)" }}
      >
        {/* Left: Home icon (visible on mobile) */}
        <div className="flex items-center md:hidden">
          <Link to="/home">
            <img
              src={IconNavbar}
              alt="Home"
              className="w-8 h-auto opacity-100"
            />
          </Link>
        </div>

        {/* Center: Main logo (always centered) */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <Link to="/home">
            <img src={Logo} alt="Fadedlines Bentleigh" className="h-11 md:h-12 w-auto" />
          </Link>
        </div>

        {/* Right: Empty space for mobile balance */}
        <div className="w-8 md:hidden"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pt-24 pb-16 md:pt-32 md:pb-24">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-6 min-h-[calc(100vh-12rem)] md:min-h-[calc(100vh-8rem)] md:pt-16">
            <h3 className="text-xl font-bold text-white">Loading data...</h3>
            <Spinner />
          </div>
        ) : (
          <div className="space-y-16 md:space-y-24">
            {barberServices?.data.filter((item) => !item.barber.display_name.toUpperCase().includes("MIKEY")).map((item) => (
              <div key={item.barber.team_member_id} className="relative">
                <div className="flex flex-col md:grid md:grid-cols-[380px,1fr] gap-6 md:gap-12">
                  {/* Barber Image Section */}
                  <div className="relative">
                    {/* Barber card: photo on top, info panel below */}
                    <div className="w-[85%] md:w-[380px] mx-auto rounded-[20px] overflow-hidden border border-white/70 bg-[#C4C4C0]">
                      <div className="aspect-[1/1] md:aspect-[3/4] overflow-hidden">
                        <img
                          src={getBarberImage(item.barber.display_name) ?? undefined}
                          alt={item.barber.display_name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="px-5 py-4">
                        <h2 className="text-[32px] font-extrabold font-inter text-[#2B2B2B] uppercase mb-1.5">
                          {item.barber.display_name.split(" ")[0]}
                        </h2>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={InstagramIcon}
                              alt="Instagram"
                              className="w-[14px] h-[14px] brightness-0 opacity-80"
                            />
                            <p className="text-[13px] font-medium font-inter text-[#2B2B2B]/90">
                              {getBarberInstagram(item.barber.display_name)}
                            </p>
                          </div>
                          {(item.barber.display_name.includes("(Available Now)") ||
                            item.barber.display_name.toLowerCase().includes("available now") ||
                            item.barber.is_bookable) && (
                            <span className="text-xs font-inter text-[#2B2B2B] bg-[#B0B0AB] border border-[#2B2B2B]/25 px-2 py-1 rounded-full">
                              Available Now
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="flex flex-col">

                    {/* Services Section */}
                    <div className="w-full">
                      {/* Desktop: Dropdown card (header + collapsible list) */}
                      <div className="hidden md:block rounded-[20px] overflow-hidden border border-white/70 bg-[#C4C4C0] shadow-lg shadow-black/20">
                        <button
                          type="button"
                          onClick={() =>
                            toggleBarberServices(item.barber.team_member_id)
                          }
                          aria-expanded={expandedBarber === item.barber.team_member_id}
                          className="w-full flex items-center justify-between px-6 py-5 text-[#2B2B2B] hover:bg-[#BBBBB6] transition-colors"
                        >
                          <span className="flex flex-col items-start gap-1">
                            <span className="text-xl font-extrabold font-inter uppercase tracking-wide">
                              View Services
                            </span>
                            <span className="text-sm font-inter text-[#2B2B2B]/70">
                              {item.services.length} services · {extractPriceRange(item.services)} AUD
                            </span>
                          </span>
                          <span className="flex items-center justify-center h-10 w-10 rounded-full bg-[#2B2B2B] text-[#F0F0F0]">
                            <ChevronDown
                              className={`h-5 w-5 transition-transform duration-300 ${
                                expandedBarber === item.barber.team_member_id ? "rotate-180" : ""
                              }`}
                            />
                          </span>
                        </button>

                        <div
                          className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                            expandedBarber === item.barber.team_member_id
                              ? "grid-rows-[1fr]"
                              : "grid-rows-[0fr]"
                          }`}
                        >
                          <div className="overflow-hidden">
                            <ul className="border-t border-[#2B2B2B]/15 divide-y divide-[#2B2B2B]/15">
                              {item.services.map((service) => (
                                <li
                                  key={service.id}
                                  className="flex items-center gap-6 px-6 py-4 hover:bg-[#BBBBB6] transition-colors"
                                >
                                  <div className="flex-1 min-w-0">
                                    <h3 className="text-[#2B2B2B] text-base font-semibold font-inter truncate">
                                      {cleanDisplayName(service.item_data.name)}
                                    </h3>
                                    <p className="text-[#2B2B2B]/70 text-sm font-inter mt-0.5">
                                      {formatPrice(
                                        service.item_data.variations[0]
                                          .item_variation_data.price_money.amount
                                      )}
                                    </p>
                                  </div>
                                  <BookingListButton
                                    onClick={() => handleBookNowClick(service)}
                                    className="md:px-6 md:py-3 md:text-sm md:w-36 flex-shrink-0 tracking-wide"
                                  >
                                    BOOK NOW
                                  </BookingListButton>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Mobile: 2-Column Grid - Always Visible */}
                      <div className="md:hidden w-[85%] mx-auto grid grid-cols-2 gap-3">
                        {item.services.map((service) => (
                          <div
                            key={service.id}
                            className="bg-[#C4C4C0] p-3 flex flex-col gap-2 border border-white/50 rounded-lg"
                          >
                            <div className="flex-1">
                              <h3 className="text-[#2B2B2B] text-xs font-bold font-inter text-center">
                                {cleanDisplayName(service.item_data.name)}
                              </h3>
                              <p className="text-[#2B2B2B]/80 text-xs mt-1 text-center">
                                {formatPrice(
                                  service.item_data.variations[0]
                                    .item_variation_data.price_money.amount
                                )}
                              </p>
                            </div>
                            <BookingListButton
                              onClick={() => handleBookNowClick(service)}
                              className="w-full h-10 text-xs"
                            >
                              BOOK NOW
                            </BookingListButton>
                          </div>
                        ))}
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BookList;
