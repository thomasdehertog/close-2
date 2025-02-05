import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductMenu } from "./product-menu";

export const Navbar = () => {
  return (
    <div className="fixed top-0 w-full h-14 px-4 border-b shadow-sm bg-white flex items-center">
      <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
        <div className="flex items-center gap-x-8">
          <Link href="/" className="font-semibold text-xl">
            FinanceHub
          </Link>
          <ProductMenu />
          <Link 
            href="/customers"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Customers
          </Link>
          <Link 
            href="/pricing"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Pricing
          </Link>
        </div>
        <div className="flex items-center gap-x-2">
          <Link href="/sign-in">
            <Button variant="ghost" size="sm">
              Sign in
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button size="sm">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}; 