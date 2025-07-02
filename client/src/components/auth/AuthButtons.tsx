import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ChevronDown, LogOut, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { RootState } from "../../store";
import { logoutUser } from "../../features/auth/auth.slice";

interface AuthButtonsProps {
  isMobile?: boolean;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({ isMobile = false }) => {
  const dispatch = useAppDispatch();
  const { authenticated } = useAppSelector((state: RootState) => state.auth);
  const { currentUser } = useAppSelector((state: RootState) => state.user);

  const defaultAvatar =
    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
  const userInitial =
    currentUser?.username?.charAt(0) ||
    currentUser?.email?.charAt(0) ||
    currentUser?.phoneNumber?.charAt(0) ||
    "G";

  const handleSignOut = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isMobile) {
    return (
      <div className="flex flex-col gap-3 w-full">
        {authenticated ? (
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="w-full gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
          >
            <LogOut size={16} />
            Sign Out
          </Button>
        ) : (
          <Link to="/login" className="w-full">
            <Button className="w-full gap-2 bg-primary hover:bg-secondary text-primary-foreground">
              <LogIn size={16} />
              Sign In
            </Button>
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {authenticated ? (
        currentUser && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-auto p-0 hover:bg-transparent flex flex-row gap-x-2"
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={currentUser.avatar || defaultAvatar}
                    alt={currentUser.username || "User"}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">
                    {userInitial.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown
                  size={16}
                  strokeWidth={2}
                  className="text-muted-foreground"
                />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56 mt-2" align="end">
              <DropdownMenuLabel className="flex flex-col">
                <span className="text-sm font-medium text-foreground">
                  {currentUser.username || currentUser.phoneNumber}
                </span>
                {currentUser.email && (
                  <span className="text-xs text-muted-foreground truncate">
                    {currentUser.email}
                  </span>
                )}
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              {/* {currentUser && currentUser.role === "ADMIN" && (
                <Link to="/admin-dashboard">
                  <DropdownMenuItem className="cursor-pointer text-primary hover:text-primary hover:bg-primary/10">
                    <ShieldCheck size={16} strokeWidth={2} className="mr-2" />
                    <span>Admin Dashboard</span>
                  </DropdownMenuItem>
                </Link>
              )} */}

              <DropdownMenuItem
                onClick={handleSignOut}
                className="cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut size={16} strokeWidth={2} className="mr-2" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      ) : (
        <Link to="/login">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-200" />
            <div className="relative bg-primary hover:bg-secondary text-primary-foreground px-6 py-2 rounded-lg font-semibold transition-all cursor-pointer">
              Sign In
            </div>
          </motion.button>
        </Link>
      )}
    </div>
  );
};

export default AuthButtons;
