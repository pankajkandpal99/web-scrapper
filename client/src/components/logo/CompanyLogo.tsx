import React from "react";
import { cn } from "../../lib/utils";
import logoImage from "../../assets/images/FInal-GHG-Logo.png";

type CompanyLogoProps = {
  type?: "text" | "image";
  text?: string;
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
  onClick?: () => void;
};

export const CompanyLogo: React.FC<CompanyLogoProps> = ({
  type = "text",
  text = "MyCompany",
  src = logoImage,
  alt = "VoiceMeetMe Logo",
  width = 100,
  height = 100,
  size = "md",
  color = "text-black",
  className = "",
  onClick,
}) => {
  const sizeClasses = {
    sm: "text-sm h-8 w-40",
    md: "text-lg h-12 w-52",
    lg: "text-xl h-16 w-64",
  };

  return (
    <div className={cn("flex items-center", className)} onClick={onClick}>
      {type === "image" ? (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={cn("object-cover", sizeClasses[size])}
        />
      ) : (
        <span className={cn(sizeClasses[size], color, "font-bold")}>
          {text}
        </span>
      )}
    </div>
  );
};
