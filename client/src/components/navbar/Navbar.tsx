import React from "react";
import { NavbarItem } from "./NavbarItem";
import { Link } from "react-router-dom";
// import { CompanyLogo } from "../logo/CompanyLogo";
import { NavbarItemType } from "../../types/navbarTypes";
import AuthButtons from "../auth/AuthButtons";
import MobileMenu from "./MobileMenu";
import { motion } from "framer-motion";
import { CompanyLogo } from "../logo/CompanyLogo";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import logoImage from "../../assets/images/FInal-GHG-Logo.png";

interface iAppNavbarProps {
  items: NavbarItemType[];
}

export const Navbar: React.FC<iAppNavbarProps> = ({ items }) => {
  const { isAdmin } = useAdminAuth();
  const filteredItems = items.filter(
    (item) => item.href !== "/admin-dashboard" || isAdmin
  );

  return (
    <nav className="sticky top-0 z-40 bg-transparent backdrop-blur-md py-4 border-b border-[#1e293b]/30">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <motion.div whileHover={{ scale: 1.05 }} className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#6FFFB4] to-[#3694FF] rounded-full blur opacity-70 group-hover:opacity-100 transition duration-200" />
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#6FFFB4] to-[#3694FF] rounded-full blur opacity-70 group-hover:opacity-100 transition duration-200"></div>
              <div className="relative bg-[#0a101f] rounded-full p-1">
                <CompanyLogo
                  type="image"
                  src={logoImage}
                  alt="webscrapper logo"
                  size="md"
                  className="w-10 h-10"
                />
              </div>
            </div>
          </motion.div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6FFFB4] to-[#3694FF]">
            Web Scrapper
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-4">
          {filteredItems.map((item) => (
            <NavbarItem key={item.id} item={item} />
          ))}
        </div>

        <div className="flex items-center gap-3 lg:gap-6">
          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex">
            <AuthButtons />
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <MobileMenu items={filteredItems} />
          </div>
        </div>
      </div>
    </nav>
  );
};
