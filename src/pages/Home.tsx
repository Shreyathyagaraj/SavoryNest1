import React, { useEffect, useState } from "react";
import { ArrowRight, Play, Star, ChevronRight, Utensils, Zap, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import FoodCard from "../components/FoodCard";
import { cn } from "../lib/utils";
import { collection, query, getDocs, limit } from "firebase/firestore";
import { db } from "../lib/firebase";
import { FoodItem } from "../context/CartContext";

const DEFAULT_FEATURED = [
  {
    id: "d1",
    name: "Savory Beast Burger",
    price: 499,
    category: "Burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop",
    description: "Double Wagyu patty, aged cheddar, truffle aioli, and caramelized onions on a brioche bun.",
    is_veg: false,
    rating: 4.9
  },
  {
    id: "d2",
    name: "Quantum Truffle Pizza",
    price: 649,
    category: "Pizza",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop",
    description: "Wild forest mushrooms, white truffle oil, fresh mozzarella, and aromatic herbs.",
    is_veg: true,
    rating: 4.8
  },
  {
    id: "d3",
    name: "Neo-Ahi Poke Bowl",
    price: 550,
    category: "Seafood",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop",
    description: "Fresh Ahi tuna, edamame, seaweed salad, avocado, and pickled ginger over chilled sushi rice.",
    is_veg: false,
    rating: 4.7
  },
  {
    id: "d6",
    name: "Makhani Matrix Chicken",
    price: 525,
    category: "North Indian",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=800&auto=format&fit=crop",
    description: "Classic butter chicken with a modern smoky infusion and double cream.",
    is_veg: false,
    rating: 4.9
  }
];

function ExperienceCard({ icon: Icon, title, desc, color }: any) {
  return (
    <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.02)] border border-gray-50 space-y-6 hover:shadow-xl hover:shadow-orange-100/20 hover:-translate-y-2 transition-all duration-500 group">
      <div className={cn("w-20 h-20 rounded-[2rem] flex items-center justify-center transition-transform duration-500 group-hover:scale-110", color)}>
        <Icon size={40} />
      </div>
      <div className="space-y-3 text-center md:text-left">
        <h3 className="text-2xl font-black text-gray-900 leading-tight">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed font-medium">
          {desc}
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  const [featuredItems, setFeaturedItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      console.log("Home: Initiating featured item fetch...");
      try {
        const q = query(collection(db, "foodItems"), limit(4));
        const snapshot = await getDocs(q).catch(err => {
          console.error("Home: Firestore fetch failed:", err);
          throw err;
        });
        
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FoodItem[];
        console.log(`Home: Fetched ${items.length} featured items from Firestore`);
        
        if (items.length > 0) {
          setFeaturedItems(items);
        } else {
          console.log("Home: No items in Firestore, using DEFAULT_FEATURED");
          setFeaturedItems(DEFAULT_FEATURED);
        }
      } catch (error) {
        console.error("Home: Error fetching featured items:", error);
        setFeaturedItems(DEFAULT_FEATURED);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 mt-12 py-12 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10 text-center lg:text-left relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-3 bg-orange-100/50 backdrop-blur-sm text-[#ff6b35] px-6 py-2.5 rounded-full text-sm font-black tracking-widest uppercase border border-orange-100"
            >
              <Zap size={16} className="fill-[#ff6b35]" />
              <span>Lightning Fast Delivery</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-6xl md:text-8xl font-black text-gray-900 leading-[0.95] tracking-tight"
            >
              Crave it. <br />
              <span className="premium-text-gradient">SavoryNest</span> it.
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-400 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium"
            >
              Experience the future of food delivery. Elite restaurants, 
              curated menus, and lightning-fast logistics at your command.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6"
            >
              <Link
                to="/menu"
                className="group premium-gradient text-white px-10 py-5 rounded-[2rem] text-xl font-black shadow-2xl shadow-orange-200 hover:scale-105 active:scale-95 transition-all flex items-center"
              >
                Explore Menu
                <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
              </Link>
              <button className="flex items-center space-x-3 px-10 py-5 rounded-[2rem] text-xl font-black text-gray-900 hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-100">
                <div className="bg-white rounded-2xl p-3 shadow-lg border border-gray-50 text-[#ff6b35]">
                  <Play size={18} fill="currentColor" />
                </div>
                <span>Our Story</span>
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center lg:justify-start space-x-12 pt-8"
            >
              <div>
                <p className="text-4xl font-black text-gray-900 tracking-tighter">500+</p>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Partners</p>
              </div>
              <div className="h-12 w-px bg-gray-100" />
              <div>
                <p className="text-4xl font-black text-gray-900 tracking-tighter">20M+</p>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Satisfied</p>
              </div>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-[4rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.1)] aspect-[4/5] max-h-[700px]">
              <img
                src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1200&auto=format&fit=crop"
                alt="SavoryNest Elite Selection"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />
              
              <div className="absolute bottom-10 left-10 right-10 glass-morphism p-8 rounded-[2.5rem] flex items-center justify-between">
                <div>
                   <h4 className="text-white font-black text-xl mb-1">Exclusive Today</h4>
                   <p className="text-white/80 text-sm font-medium italic">Hand-crafted by Chef Marco</p>
                </div>
                <div className="bg-[#ff6b35] text-white p-3 rounded-2xl shadow-lg shadow-orange-500/20">
                   <ChevronRight size={24} />
                </div>
              </div>
            </div>
            
            {/* Float Stats */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 glass-morphism p-6 rounded-[2rem] flex items-center space-x-4 hidden md:flex border border-white/40"
            >
              <div className="bg-orange-100 p-3 rounded-2xl text-[#ff6b35]">
                <Star fill="currentColor" size={24} />
              </div>
              <div>
                <p className="font-black text-gray-900 text-2xl leading-none">4.9</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Global Rating</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <ExperienceCard 
            icon={Utensils} 
            title="Artisanal Cuisines" 
            desc="Curation of the world's most exquisite flavors." 
            color="bg-red-50 text-[#ff6b35]" 
          />
          <ExperienceCard 
            icon={Zap} 
            title="Sonic Delivery" 
            desc="Proprietary logistics ensuring peak freshness." 
            color="bg-orange-50 text-orange-500" 
          />
          <ExperienceCard 
            icon={ShieldCheck} 
            title="Absolute Quality" 
            desc="Rigorous standards for every single ingredient." 
            color="bg-indigo-50 text-indigo-500" 
          />
        </div>
      </section>

      {/* Featured Section */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex justify-between items-end">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">Our Specials</h2>
              <p className="text-gray-500">Curated by our expert chefs for your refined palate.</p>
            </div>
            <Link to="/menu" className="hidden md:flex items-center text-[#ff5a5f] font-bold hover:underline group">
              View All Menu
              <ChevronRight className="ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-3xl h-80 animate-pulse border border-gray-100" />
              ))
            ) : (
              (featuredItems as any[]).filter(item => item && item.name).map((item: any) => (
                <FoodCard key={item.id} item={item} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 sm:px-6 lg:px-8 bg-white py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="relative h-[400px] w-full rounded-[3rem] overflow-hidden shadow-2xl rotate-2">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop"
                alt="Chef preparing food"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">Our customers love us</h2>
              <p className="text-gray-500">Read what over 10,000+ satisfied customers have to say about our service.</p>
            </div>
            
            <div className="bg-[#fff4f0] p-8 rounded-[2.5rem] relative">
              <Star className="text-[#ff5a5f] fill-[#ff5a5f] absolute top-[-20px] right-8" size={40} />
              <p className="text-xl text-gray-800 italic font-medium leading-relaxed">
                "The food quality is unmatched and the delivery is always early. SavoryNest has completely changed how I order food. Highly recommended!"
              </p>
              <div className="mt-8 flex items-center space-x-4">
                <img
                  src="https://ui-avatars.com/api/?name=Alex+Johnson&background=ff5a5f&color=fff"
                  alt="Avatar"
                  className="w-12 h-12 rounded-full ring-4 ring-white"
                />
                <div>
                  <h4 className="font-bold">Alex Johnson</h4>
                  <p className="text-gray-400 text-sm">Product Designer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto premium-gradient rounded-[4rem] p-16 md:px-24 md:py-24 text-center space-y-10 shadow-[0_50px_100px_rgba(255,107,53,0.3)] relative overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 180, 270, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], rotate: [360, 270, 180, 90, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-48 -right-48 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl"
          />
          
          <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter relative z-10 leading-[0.9]">
            Taste the <br /> extraordinary.
          </h2>
          <p className="text-white/80 text-xl max-w-2xl mx-auto relative z-10 font-medium">
            Join SavoryNest Gold and experience the pinnacle of culinary logistics. 
            Elite partners, unlimited free delivery, and artisanal events.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
            <Link
              to="/menu"
              className="bg-white text-[#ff6b35] px-12 py-6 rounded-[2rem] text-2xl font-black shadow-2xl hover:shadow-white/20 transition-all hover:scale-105 active:scale-95"
            >
              Join SavoryNest
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
