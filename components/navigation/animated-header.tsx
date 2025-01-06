"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Nav from "./nav";
import Link from "next/link";

export function AnimatedHeader() {
  const { data: session } = useSession();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const controlNavbar = () => {
    if (typeof window !== "undefined") {
      if (window.scrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar);

      return () => {
        window.removeEventListener("scroll", controlNavbar);
      };
    }
  }, [lastScrollY]);

  return (
    <>
      <div className="hidden py-2 text-sm lg:block bg-muted/50">
        <div className="container flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground"
            >
              STORE LOCATOR
            </Link>
          </div>
          <p className="text-center text-xs">
            Free shipping on orders over $50{" "}
            <Link href="#" className="underline">
              LEARN MORE
            </Link>
          </p>
          <div className="flex items-center space-x-4">
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground"
            >
              CONTACT US
            </Link>
          </div>
        </div>
      </div>

      <div
        className={`sticky top-0 z-50 bg-white transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <Nav session={session} />
      </div>
    </>
  );
}

export default AnimatedHeader;
