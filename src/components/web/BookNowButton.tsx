import { useState } from "react";

interface BookNowButtonProps {
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
  type?: "button" | "submit" | "reset";
}

export default function BookNowButton({
  onClick,
  className = "",
  children = "BOOK NOW",
  type = "button",
}: BookNowButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type={type}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative cursor-pointer px-8 md:px-12 py-3 md:py-4 text-base md:text-lg rounded-xl transition-all duration-300 font-poppins ${className}`}
      style={{
        backgroundColor: isHovered ? "#F0F0F0" : "#2B2B2B",
        border: "1px solid rgba(255, 255, 255, 0.7)",
        color: isHovered ? "#2B2B2B" : "#F0F0F0",
        fontWeight: isHovered ? 700 : 600,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.35)",
      }}
    >
      {children}
    </button>
  );
}
