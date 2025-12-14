import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";

const adminUrl = import.meta.env.VITE_ADMIN_PANEL_URL;
// console.log(adminUrl);
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#081525] backdrop-blur-sm border-b border-primary-foreground/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-2 text-primary-foreground font-bold text-xl h-full"
        >
          <img
            src="/logo.jpg"
            alt="MKfrx logo"
            className="h-full w-auto object-contain"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
          >
            Home
          </Link>

          {user && user.role != "admin" && (
            <Link
              to="/markets"
              className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              Live Markets
            </Link>
          )}
          {user && user.role != "admin" && (
            <Link
              to="/payment-details"
              className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              Payment Details
            </Link>
          )}

          {user && user.role === "admin" && (
            <a
              href={adminUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              Admin Panel
            </a>
          )}

          <Link
            to="/blogs"
            className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
          >
            Blogs
          </Link>

          <Link
            to="/about"
            className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
          >
            About Us
          </Link>

          <Link
            to="/contact"
            className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
          >
            Contact Us
          </Link>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <span className="text-primary-foreground/80 text-sm">
                {user.name}
              </span>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-primary-foreground hover:bg-primary-foreground/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={() => navigate("/login")}
                className="text-primary-foreground hover:bg-primary-foreground/10"
              >
                Login
              </Button>

              <Button
                onClick={() => navigate("/signup")}
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
              >
                Sign Up
              </Button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger>
              <Menu className="h-6 w-6 text-primary-foreground" />
            </SheetTrigger>

            <SheetContent
              side="right"
              className="bg-[#081525] text-primary-foreground"
            >
              <div className="flex flex-col gap-6 mt-10 text-lg">
                <Link to="/" className="hover:text-accent transition">
                  Home
                </Link>

                <Link to="/markets" className="hover:text-accent transition">
                  Live Markets
                </Link>

                {user && user.role === "admin" && (
                  <Link to="/admin" className="hover:text-accent transition">
                    Admin Panel
                  </Link>
                )}

                <Link to="/blogs" className="hover:text-accent transition">
                  Blogs
                </Link>

                <Link to="/about" className="hover:text-accent transition">
                  About Us
                </Link>

                <Link to="/contact" className="hover:text-accent transition">
                  Contact Us
                </Link>

                <div className="border-t border-primary-foreground/20 pt-4">
                  {user ? (
                    <Button
                      onClick={handleLogout}
                      className="w-full bg-red-600 text-white hover:bg-red-700"
                    >
                      Logout
                    </Button>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <Button
                        variant="outline"
                        onClick={() => navigate("/login")}
                        className="w-full border-primary-foreground text-accent-foreground"
                      >
                        Login
                      </Button>

                      <Button
                        onClick={() => navigate("/signup")}
                        className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                      >
                        Sign Up
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
