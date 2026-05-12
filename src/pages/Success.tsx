import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Package, ArrowRight, Home } from "lucide-react";
import { motion } from "motion/react";

export default function Success() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="max-w-7xl mx-auto px-4 py-32 flex flex-col items-center text-center space-y-12">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1, rotate: [0, 15, 0] }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="bg-green-50 p-10 rounded-[3rem] text-green-500 shadow-2xl shadow-green-100 relative group"
      >
        <div className="absolute inset-0 bg-green-500/10 rounded-[3rem] animate-ping opacity-20" />
        <CheckCircle2 size={120} className="relative z-10" />
      </motion.div>

      <div className="space-y-6">
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter uppercase">Mission Success</h1>
        <p className="text-gray-400 font-medium text-lg max-w-lg mx-auto">
          Your culinary manifest has been authorized. The SavoryNest fleet is mobilizing for immediate extraction and delivery.
        </p>
      </div>

      <div className="bg-white p-12 rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.02)] border border-gray-50 w-full max-w-lg space-y-10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
           <Package size={100} />
        </div>
        
        <div className="space-y-6 relative z-10">
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
            <span>Manifest ID</span>
            <span className="text-gray-900 font-black">#{orderId || "UNSPECIFIED"}</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
            <span>Estimated Arrival</span>
            <span className="text-[#ff6b35] font-black">15 - 25 CYCLES</span>
          </div>
          <Link
            to={`/orders/${orderId}`}
            className="w-full bg-[#111827] text-white py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center hover:bg-orange-50 hover:text-gray-900 transition-all group shadow-2xl"
          >
            Tactical Tracking <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>

      <Link
        to="/"
        className="text-gray-400 font-black uppercase tracking-widest text-[10px] flex items-center hover:text-[#ff6b35] transition-colors"
      >
        <Home size={16} className="mr-3" />
        Return to Command Center
      </Link>
    </div>
  );
}
