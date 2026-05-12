import React from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();

  if (cartCount === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center space-y-12 flex flex-col items-center">
        <motion.div
           initial={{ scale: 0, rotate: -20 }}
           animate={{ scale: 1, rotate: 0 }}
           className="bg-white w-60 h-60 rounded-[4rem] flex items-center justify-center shadow-2xl mb-8 relative overflow-hidden group"
        >
          <div className="absolute inset-0 premium-gradient opacity-5 group-hover:opacity-10 transition-opacity" />
          <ShoppingBag size={80} className="text-[#ff6b35] relative z-10" />
        </motion.div>
        <div className="space-y-6">
          <h2 className="text-5xl font-black text-gray-900 tracking-tighter uppercase">Manifest is Empty</h2>
          <p className="text-gray-400 font-medium max-w-sm mx-auto text-lg">Your culinary voyage hasn't begun. Explore our curated menu to start your expedition.</p>
        </div>
        <Link
          to="/menu"
          className="bg-[#111827] text-white px-12 py-5 rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all inline-flex items-center group"
        >
          Begin Expedition
          <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="space-y-4 text-center md:text-left">
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter uppercase">Your Manifest</h1>
        <p className="text-gray-400 font-medium text-lg italic">Pending logistical approval and deployment.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
        <div className="lg:col-span-2 space-y-8">
          <AnimatePresence mode="popLayout">
            {cart.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, x: 50 }}
                className="bg-white rounded-[3.5rem] p-8 shadow-[0_50px_100px_rgba(0,0,0,0.02)] border border-gray-50 flex flex-col sm:flex-row items-center gap-10 hover:shadow-xl transition-all group"
              >
                <div className="h-40 w-40 rounded-[2.5rem] overflow-hidden shadow-2xl flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-6 w-full">
                  <div className="flex justify-between items-start">
                    <div>
                        <div className="text-[10px] font-black text-[#ff6b35] uppercase tracking-widest mb-1">{item.category}</div>
                        <h3 className="font-black text-2xl text-gray-900 tracking-tighter uppercase">{item.name}</h3>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-3 bg-gray-50 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-center bg-gray-50/50 p-6 rounded-[2rem]">
                    <span className="font-black text-2xl text-gray-900 leading-none">₹{item.price * item.quantity}</span>
                    <div className="flex items-center space-x-6 bg-white shadow-sm border border-gray-100 rounded-[1.5rem] px-5 py-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="text-gray-300 hover:text-[#ff6b35] transition-colors"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="font-black text-lg w-6 text-center text-gray-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-gray-300 hover:text-[#ff6b35] transition-colors"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="space-y-12">
          <div className="bg-[#111827] rounded-[3.5rem] p-10 shadow-2xl text-white space-y-10 sticky top-32 group overflow-hidden">
            <motion.div
              animate={{ x: [0, 10, 0], y: [0, 5, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute top-0 right-0 w-64 h-64 bg-[#ff6b35]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"
            />
            
            <h3 className="text-2xl font-black tracking-tighter uppercase relative z-10">Logistics Summary</h3>
            <div className="space-y-6 pt-6 border-t border-white/5 relative z-10">
              <div className="flex justify-between text-sm font-medium text-gray-400">
                <span className="uppercase tracking-widest text-[10px]">Sub-Manifest</span>
                <span className="text-white font-black">₹{cartTotal}</span>
              </div>
              <div className="flex justify-between text-sm font-medium text-gray-400">
                <span className="uppercase tracking-widest text-[10px]">Sonic Shipping</span>
                <span className="text-green-400 font-black tracking-widest">WAVED</span>
              </div>
              <div className="flex justify-between text-sm font-medium text-gray-400">
                <span className="uppercase tracking-widest text-[10px]">Service Overhead</span>
                <span className="text-white font-black">₹5</span>
              </div>
              <div className="flex justify-between pt-8 border-t border-white/5 items-end">
                <span className="text-xs font-black uppercase text-gray-500 tracking-[0.2em] mb-1">Total Value</span>
                <span className="text-5xl font-black text-[#ff6b35] tracking-tighter leading-none">₹{cartTotal + 5}</span>
              </div>
            </div>
            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-white text-gray-900 py-6 rounded-[2rem] text-lg font-black uppercase tracking-[0.15em] shadow-2xl hover:bg-orange-50 transition-all flex items-center justify-center group active:scale-95 relative z-10"
            >
              Dispatch Order
              <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
            </button>
            <p className="text-[10px] font-bold text-center text-gray-500 uppercase tracking-widest relative z-10">
              Crated for excellence. Insured by Zyphora.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
