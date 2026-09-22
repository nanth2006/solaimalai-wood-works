import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingBag, LogOut, User, Menu, X, Shield, Sparkles, Clock } from "lucide-react";
import logo from "../assets/logo.png";

const ADMIN_EMAIL = "nanthakumar2006geetha02@gmail.com";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  // Sync auth user and cart count
  useEffect(() => {
    const checkAuthAndCart = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser(null);
        }

        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartCount(storedCart.length);
      } catch {
        // Safe fallback
      }
    };

    checkAuthAndCart();
    window.addEventListener("storage", checkAuthAndCart);
    return () => window.removeEventListener("storage", checkAuthAndCart);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const isAdmin =
    user &&
    (user.email?.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase() ||
      user.role === "admin");

  const navLinks = [
    { name: "Home", path: "/home" },
    { name: "Products", path: "/product" },
    { name: "Track Orders", path: "/tracking" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#1A100A]/95 backdrop-blur-md border-b border-[#C9873F]/25 shadow-xl shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Identity */}
          <Link to="/home" className="flex items-center gap-3 group select-none">
            <div className="relative p-1 rounded-xl bg-gradient-to-tr from-[#3a2012] to-[#703b15] border border-[#C9873F]/40 group-hover:border-[#F0A35C] transition duration-300 shadow-md">
              <img
                src={logo}
                alt="Solaimalai Wood Works Logo"
                className="w-10 h-10 object-cover rounded-lg group-hover:scale-105 transition duration-300"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#F3E9D8] group-hover:text-[#F0A35C] transition duration-300">
                  Solaimalai
                </span>
                <span className="font-serif text-lg sm:text-xl font-medium text-[#C9873F]">
                  Wood Works
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-[#A68F7A] tracking-wider uppercase flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-[#C9873F]" />
                Pure Handcrafted Teak
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#26160d]/70 px-4 py-1.5 rounded-full border border-[#C9873F]/20">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-[#C9873F] text-[#1A100A] font-semibold shadow-md shadow-[#C9873F]/20"
                      : "text-[#D4C3AC] hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* Admin Panel Link ONLY for nanthakumar2006geetha02@gmail.com */}
            {isAdmin && (
              <Link
                to="/admin/product"
                className={`px-3 py-2 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-1 border ${
                  location.pathname === "/admin/product"
                    ? "bg-[#C9873F] text-[#1A100A] border-[#C9873F]"
                    : "bg-[#C9873F]/20 text-[#F0A35C] border-[#C9873F]/40 hover:bg-[#C9873F]/30"
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Panel</span>
              </Link>
            )}
          </nav>

          {/* Right Action Icons & Auth Profile */}
          <div className="hidden md:flex items-center gap-4">
            {/* Cart Icon with Live Badge */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-full bg-[#26160d] border border-[#C9873F]/30 hover:border-[#F0A35C] text-[#F3E9D8] hover:text-[#F0A35C] transition duration-200 shadow-sm group"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition duration-200" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-red-600 to-amber-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth State Button */}
            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-[#4a2b18]">
                <div className="flex items-center gap-2">
                  <div className="relative w-8 h-8 rounded-full bg-[#C9873F]/20 border border-[#C9873F]/40 flex items-center justify-center text-[#F0A35C] font-semibold text-xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                    {isAdmin && (
                      <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-amber-500 rounded-full border border-[#1A100A] flex items-center justify-center text-[8px] text-black font-bold" title="Admin">
                        ★
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#F3E9D8] max-w-[110px] truncate leading-tight">
                      {user.name || "User"}
                    </span>
                    {isAdmin && (
                      <span className="text-[9px] font-bold text-[#F0A35C] uppercase tracking-wider">
                        Master Admin
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full text-[#A68F7A] hover:text-red-400 hover:bg-red-950/30 transition duration-200 cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/"
                className="px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-[#1C130D] bg-gradient-to-r from-[#F0A35C] to-[#C9873F] hover:brightness-110 transition shadow-md shadow-[#C9873F]/20"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            <Link
              to="/cart"
              className="relative p-2 rounded-full bg-[#26160d] border border-[#C9873F]/30 text-[#F3E9D8]"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#26160d] border border-[#C9873F]/30 text-[#F3E9D8] hover:text-[#F0A35C] focus:outline-none"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1A100A] border-b border-[#C9873F]/30 px-6 py-5 space-y-3 animate-fade-in">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? "bg-[#C9873F] text-[#1A100A] font-semibold"
                    : "text-[#D4C3AC] hover:bg-white/5 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          {isAdmin && (
            <Link
              to="/admin/product"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm font-bold text-[#F0A35C] bg-[#C9873F]/15 border border-[#C9873F]/30"
            >
              🛡️ Admin Control Panel
            </Link>
          )}

          <div className="pt-3 border-t border-[#3e2312] flex items-center justify-between">
            {user ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#C9873F]/20 border border-[#C9873F]/40 flex items-center justify-center text-[#F0A35C] text-xs font-bold">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="text-sm text-[#F3E9D8]">{user.name}</span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-400 bg-red-950/40 border border-red-500/30"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-[#1C130D] bg-gradient-to-r from-[#F0A35C] to-[#C9873F]"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
