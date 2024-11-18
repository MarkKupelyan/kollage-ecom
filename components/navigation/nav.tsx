import { auth } from "@/server/auth";
import { UserButton } from "./user-button";
import Link from "next/link";
import Logo from "@/components/navigation/logo";
import { Button } from "../ui/button";
import { LogIn } from "lucide-react";
import CartDrawer from "../cart/cart-drawer";
import Algolia from "../products/algolia";
import CategoryLinks from "./CategoryLinks";
import MobileNav from "./MobileNav";

const Nav = async () => {
  const session = await auth();

  return (
    <>
      {/* Desktop Navigation */}
      <header className="bg-white shadow-md sticky top-0 z-50 py-4 px-8 hidden md:block">
        <nav>
          <ul className="flex justify-between items-center md:gap-8 gap-4">
            <li className="flex flex-1">
              <Link href="/" aria-label="Kollage logo">
                <Logo />
              </Link>
            </li>
            <li className="flex-1 px-20">
              <CategoryLinks />
            </li>
            <li className="h-24 w-96 rounded-md bg-background px-0 py-5 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
              <Algolia />
            </li>
            <li className="relative flex items-center hover:bg-muted">
              <CartDrawer />
            </li>
            {!session ? (
              <li className="flex items-center justify-center">
                <Button asChild>
                  <Link className="flex gap-2" href="/auth/login">
                    <LogIn size={16} />
                    <span>Login</span>
                  </Link>
                </Button>
              </li>
            ) : (
              <li className="flex items-center justify-center">
                <UserButton expires={session?.expires} user={session?.user} />
              </li>
            )}
          </ul>
        </nav>
      </header>

      {/* Mobile Navigation - Sticky */}
      <header className="md:hidden sticky top-0 z-50 bg-white  shadow-md">
        <MobileNav session={session} />
      </header>
    </>
  );
};

export default Nav;
