import React from "react";
import { Plus, Star, Clock } from "lucide-react";
import { FoodItem, useCart } from "../context/CartContext";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

interface FoodCardProps {
  item: FoodItem;
  key?: any;
}

export default function FoodCard({ item }: FoodCardProps) {
  const { addToCart } = useCart();

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group"
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop"}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop";
          }}
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1 shadow-sm border border-white/20">
          <Star size={12} className="text-orange-400 fill-orange-400" />
          <span className="text-[10px] font-black">{item.rating || "4.5"}</span>
        </div>
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-2 shadow-sm border border-white/20">
          <div className={cn(
            "w-2.5 h-2.5 rounded-sm border-2 flex items-center justify-center",
            item.is_veg ? "border-green-500" : "border-red-500"
          )}>
            <div className={cn("w-1 h-1 rounded-full", item.is_veg ? "bg-green-500" : "bg-red-500")} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">{item.is_veg ? "Veg" : "Non-Veg"}</span>
        </div>
      </div>
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="font-black text-gray-900 line-clamp-1 uppercase tracking-tight">{item.name}</h3>
          <span className="text-[#ff6b35] font-black text-lg tracking-tighter">₹{item.price}</span>
        </div>
        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
          {item.description}
        </p>
        <div className="pt-3 flex items-center justify-between">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">{item.category}</span>
          <button
            onClick={() => addToCart(item)}
            className="p-2 bg-[#ff5a5f] text-white rounded-2xl hover:bg-[#ff454a] transition-all shadow-lg shadow-red-100 active:scale-95"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
