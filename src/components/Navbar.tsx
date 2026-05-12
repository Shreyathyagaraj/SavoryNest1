import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, User, LogOut, Menu as MenuIcon, X, Search, Utensils } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

export default function Navbar() {
  const { user, profile, logout } = useAuth();
  const { cartCount } = useCart();
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menu" },
    { name: "Orders", path: "/profile" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-black text-[#ff6b35] tracking-tighter flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg premium-gradient flex items-center justify-center">
                <Utensils size={18} className="text-white" />
              </div>
              SavoryNest
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-semibold transition-colors hover:text-[#ff6b35]",
                  location.pathname === link.path ? "text-[#ff6b35]" : "text-gray-500"
                )}
              >
                {link.name}
              </Link>
            ))}
            {profile?.isAdmin && (
              <Link
                to="/admin"
                className="text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full"
              >
                Admin
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-[#ff6b35] transition-colors md:block hidden">
              <Search size={20} />
            </button>
            <Link to="/cart" className="p-2 text-gray-400 hover:text-[#ff6b35] transition-colors relative">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#ff6b35] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </Link>
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile">
                  <img
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`}
                    alt="profile"
                    className="h-9 w-9 rounded-xl border border-gray-100 shadow-sm"
                  />
                </Link>
              </div>
            ) : (
              <Link
                to="/login"
                className="premium-gradient text-white px-6 py-2.5 rounded-2xl text-sm font-bold hover:shadow-lg hover:shadow-orange-200 transition-all active:scale-95"
              >
                Sign In
              </Link>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-gray-600"
            >
              {isOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white border-b border-gray-100 absolute top-16 left-0 right-0 py-4 px-4 shadow-xl"
          >
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium text-gray-600"
                >
                  {link.name}
                </Link>
              ))}
              {user && (
                <button
                  onClick={() => { logout(); setIsOpen(false); }}
                  className="text-lg font-medium text-red-500 flex items-center"
                >
                  <LogOut size={20} className="mr-2" /> Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
