import React from "react";
import { NavbarItem } from "./NavbarItem";
import { NavbarItemType } from "../../types/navbarTypes";
import AuthButtons from "../auth/AuthButtons";
import { motion } from "framer-motion";
import { X, User, Menu } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerPortal,
  DrawerTrigger,
} from "../ui/drawer";
import { CompanyLogo } from "../logo/CompanyLogo";
import logoImage from "../../assets/images/FInal-GHG-Logo.png";

interface MobileMenuProps {
  items: NavbarItemType[];
}

const MobileMenu: React.FC<MobileMenuProps> = ({ items }) => {
  const { authenticated } = useSelector((state: RootState) => state.auth);
  const { currentUser } = useSelector((state: RootState) => state.user);

  const displayName =
    currentUser?.username || currentUser?.phoneNumber || "Guest";
  const displayEmail = currentUser?.email;
  const isGuest = !authenticated;

  const itemVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    closed: {
      opacity: 0,
      y: 20,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className="lg:hidden">
      <Drawer>
        <DrawerTrigger asChild>
          <button
            className="text-white p-2 rounded-lg hover:bg-[#121a2a]/50 transition-colors"
            aria-label="Toggle mobile menu"
          >
            <Menu size={24} strokeWidth={2} />
          </button>
        </DrawerTrigger>
        <DrawerPortal>
          <DrawerContent className="fixed inset-y-0 right-0 h-full w-72 max-h-screen bg-[#0a101f] border-l border-[#1e293b] shadow-2xl z-50">
            <div className="h-full flex flex-col max-h-screen">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#6FFFB4] to-[#3694FF] rounded-full blur opacity-70" />
                    <div className="relative bg-[#0a101f] rounded-full p-1">
                      <CompanyLogo
                        type="image"
                        src={logoImage}
                        alt="webscrapper logo"
                        size="md"
                        className="w-8 h-8"
                      />
                    </div>
                  </div>
                  <span className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6FFFB4] to-[#3694FF]">
                    Web Scrapper
                  </span>
                </div>
                <DrawerClose className="p-2 text-[#94a3b8] hover:text-white rounded-full hover:bg-[#121a2a] transition-colors">
                  <X size={20} />
                </DrawerClose>
              </div>

              <div className="flex-1 overflow-y-auto px-4">
                <motion.div
                  initial="closed"
                  animate="open"
                  variants={itemVariants}
                  className={`mb-4 bg-[#121a2a] p-4 rounded-lg border border-[#1e293b] shadow-md ${
                    isGuest ? "opacity-75" : ""
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="relative">
                      <div
                        className={`absolute -inset-1 ${
                          isGuest ? "bg-gray-500/20" : "bg-[#3694FF]/20"
                        } rounded-full blur-sm`}
                      ></div>
                      <div
                        className={`relative flex items-center justify-center w-10 h-10 ${
                          isGuest ? "bg-gray-500/20" : "bg-[#3694FF]/20"
                        } rounded-full`}
                      >
                        <User
                          size={20}
                          className={
                            isGuest ? "text-gray-400" : "text-[#3694FF]"
                          }
                        />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-base font-bold text-white">
                        {displayName}
                      </span>
                      <span className="text-xs text-[#94a3b8]">
                        {isGuest ? "Not logged in" : "Logged in"}
                      </span>
                    </div>
                  </div>

                  {/* {currentUser.role === "ADMIN" && (
                    <Link to="/admin-dashboard">
                      <DropdownMenuItem className="cursor-pointer text-blue-500 focus:text-blue-500 focus:bg-blue-500/10">
                        <ShieldCheck
                          size={16}
                          strokeWidth={2}
                          className="mr-2 opacity-60"
                        />
                        <span>Admin Dashboard</span>
                      </DropdownMenuItem>
                    </Link>
                  )} */}

                  {/* Only show email section if email exists */}
                  {displayEmail && (
                    <div className="bg-[#0a101f]/60 p-2 rounded-md">
                      <span className="text-sm text-[#94a3b8]">Email</span>
                      <div className="text-sm font-medium text-white truncate">
                        {displayEmail}
                      </div>
                    </div>
                  )}
                </motion.div>

                <div className="h-px w-full bg-gradient-to-r from-[#6FFFB4]/20 via-[#3694FF]/20 to-[#6FFFB4]/20 my-6"></div>

                <nav className="space-y-1 pb-6">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial="closed"
                      animate="open"
                      variants={itemVariants}
                      custom={index}
                    >
                      <DrawerClose asChild>
                        <div className="py-1 px-2 text-sm rounded-lg hover:bg-[#121a2a]/60 transition-colors">
                          <NavbarItem item={item} isMobile />
                        </div>
                      </DrawerClose>
                    </motion.div>
                  ))}
                </nav>

                <div className="border-t border-[#1e293b]/30 bg-[#0a101f] p-4">
                  <motion.div
                    initial="closed"
                    animate="open"
                    variants={itemVariants}
                  >
                    <AuthButtons isMobile />
                  </motion.div>
                </div>
              </div>
            </div>
          </DrawerContent>
        </DrawerPortal>
      </Drawer>
    </div>
  );
};

export default MobileMenu;
