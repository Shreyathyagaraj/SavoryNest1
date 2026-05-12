import React from "react";
import Navbar from "./Navbar";
import MealBuddy from "./MealBuddy";
import { motion, AnimatePresence } from "motion/react";
import { useLocation } from "react-router-dom";

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#fff9f5] font-sans text-[#1f2937]">
      <Navbar />
      <main className="pt-16 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <MealBuddy />
      <footer className="bg-white border-t border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-6">
              <h3 className="text-2xl font-black text-[#ff6b35] tracking-tighter uppercase">SavoryNest</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Experience the pinnacle of culinary delivery. We partner with elite chefs to bring artisanal flavors directly to your sanctuary.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-6">Explore</h4>
              <ul className="space-y-3 text-sm text-gray-500 font-medium">
                <li><a href="#" className="hover:text-[#ff6b35] transition-colors">Our Story</a></li>
                <li><a href="#" className="hover:text-[#ff6b35] transition-colors">Elite Chefs</a></li>
                <li><a href="#" className="hover:text-[#ff6b35] transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-[#ff6b35] transition-colors">Luxury Events</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-[#ff5a5f]">Help Center</a></li>
                <li><a href="#" className="hover:text-[#ff5a5f]">Safety Information</a></li>
                <li><a href="#" className="hover:text-[#ff5a5f]">Cancellation Options</a></li>
                <li><a href="#" className="hover:text-[#ff5a5f]">Report Infringement</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Subscribe</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-[#ff5a5f] w-full text-sm"
                />
                <button className="bg-[#ff5a5f] text-white px-4 py-2 rounded-r-lg text-sm font-medium">
                  Go
                </button>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 gap-4">
            <p>© 2026 SavoryNest Inc. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-gray-600">Privacy</a>
              <a href="#" className="hover:text-gray-600">Terms</a>
              <a href="#" className="hover:text-gray-600">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
