import { useState } from "react";

interface BookingListButtonProps {
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export default function BookingListButton({
  onClick,
  className = "",
  children = "BOOK NOW",
}: BookingListButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative cursor-pointer flex items-center justify-center px-3 md:px-12 py-3 md:py-4 whitespace-nowrap text-[14px] md:text-[20px] rounded-md transition-all duration-300 font-inter font-bold ${className}`}
      style={{
        backgroundColor: isHovered ? "#4A4A4A" : "#2B2B2B",
        border: "none",
        color: "#F0F0F0",
        fontWeight: 700,
        lineHeight: 1,
      }}
    >
      {children}
    </button>
  );
}
