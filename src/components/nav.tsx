"use client";

import { useState, useEffect } from "react";
import { User, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/app/utils/utils";
import Button from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getMyListCount } from "@/app/utils/my-list";
import { useUser, SignInButton, SignOutButton } from "@clerk/nextjs";
import { LogoutButton } from "@/components/logout-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Movies", href: "/movies" },
  { name: "TV Shows", href: "/tv" },
  { name: "My List", href: "/my-list" },
];

export function NetflixNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [myListCount, setMyListCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { isSignedIn, user } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Update count on mount and when list changes
    const updateCount = () => {
      setMyListCount(getMyListCount());
    };

    updateCount();
    window.addEventListener("myListUpdated", updateCount);
    return () => window.removeEventListener("myListUpdated", updateCount);
  }, []);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-black/90 backdrop-blur-sm"
            : "bg-gradient-to-b from-black/50 to-transparent"
        )}>
        <div className="flex items-center justify-between px-4 py-4 md:px-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-red-600 font-bold text-2xl">
                Benarasoft Inc.
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-white relative",
                    pathname === item.href ? "text-white" : "text-gray-300"
                  )}>
                  {item.name}
                  {item.name === "My List" && myListCount > 0 && isSignedIn && (
                    <Badge
                      variant="secondary"
                      className="absolute -top-2 -right-2 bg-red-600 text-white text-xs min-w-[1.25rem] h-5 flex items-center justify-center p-0">
                      {myListCount > 99 ? "99+" : myListCount}
                    </Badge>
                  )}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {/* Desktop User Menu */}
            {isSignedIn ? (
              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="w-8 h-8 rounded-full cursor-pointer">
                      <img src={user.imageUrl} className="rounded-full" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="bg-gray-900 border-gray-800 text-white"
                    align="end">
                    <div className="px-2 py-1.5 text-sm">
                      <div className="font-medium">{user.fullName}</div>
                      <div className="text-gray-400">
                        {user.emailAddresses[0].emailAddress}
                      </div>
                    </div>
                    <DropdownMenuSeparator className="bg-gray-800" />
                    <DropdownMenuItem
                      asChild
                      className="text-gray-300 hover:text-white hover:bg-gray-800">
                      <Link href="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      asChild
                      className="text-gray-300 hover:text-white hover:bg-gray-800">
                      <Link href="/settings">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-800" />
                    <DropdownMenuItem asChild>
                      <LogoutButton />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <SignInButton mode="modal">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white bg-red-600 border-none hover:bg-red-800 hidden md:flex">
                  Get Started
                </Button>
              </SignInButton>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-white hover:text-white hover:bg-white/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeMobileMenu}
          />
          <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-black/95 backdrop-blur-md border-l border-gray-800">
            <div className="flex flex-col h-full">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeMobileMenu}
                  className="text-white hover:text-white hover:bg-white/10">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Mobile Navigation */}
              <div className="flex-1 overflow-y-auto">
                <nav className="p-4 space-y-2">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={closeMobileMenu}
                      className={cn(
                        "flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium transition-colors",
                        pathname === item.href
                          ? "bg-red-600 text-white"
                          : "text-gray-300 hover:text-white hover:bg-gray-800"
                      )}>
                      <span>{item.name}</span>
                      {item.name === "My List" &&
                        myListCount > 0 &&
                        isSignedIn && (
                          <Badge
                            variant="secondary"
                            className="bg-red-500 text-white">
                            {myListCount > 99 ? "99+" : myListCount}
                          </Badge>
                        )}
                    </Link>
                  ))}
                </nav>

                {/* Mobile User Section */}
                {isSignedIn ? (
                  <div className="p-4 border-t border-gray-800">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-medium">
                        <img
                          src={user.imageUrl}
                          alt="User Avatar"
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium text-white">
                          {user.fullName}
                        </div>
                        <div className="text-sm text-gray-400">
                          {user.emailAddresses[0].emailAddress}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Link
                        href="/dashboard"
                        onClick={closeMobileMenu}
                        className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                        Dashboard
                      </Link>
                      <Link
                        href="/tv"
                        onClick={closeMobileMenu}
                        className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                        Discover TV Shows
                      </Link>
                      <Link
                        href="/settings"
                        onClick={closeMobileMenu}
                        className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                        Settings
                      </Link>
                      <Button
                        onClick={() => {
                          // handleSignOut();
                          closeMobileMenu();
                        }}
                        variant="ghost"
                        className="w-full justify-start px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 border-t border-gray-800">
                    <SignInButton mode="modal">
                      <Button
                        onClick={() => {
                          closeMobileMenu();
                        }}
                        className="w-full bg-red-600 hover:bg-red-700 text-white">
                        <User className="mr-2 h-4 w-4" />
                        Sign In
                      </Button>
                    </SignInButton>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
