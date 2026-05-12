import React, { useEffect, useState } from "react";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { FoodItem } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import FoodCard from "../components/FoodCard";
import { Search, Filter, SlidersHorizontal, Database, Loader2 } from "lucide-react";
import { motion } from "motion/react";

const CATEGORIES = ["All", "Burgers", "Pizza", "Pasta", "Seafood", "South Indian", "North Indian", "Chinese", "Desserts", "Beverages"];

const DEFAULT_MENU: FoodItem[] = [
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
    id: "d4",
    name: "Protocol Pasta Carbonara",
    price: 425,
    category: "Pasta",
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80&w=800&auto=format&fit=crop",
    description: "Classic creamy carbonara with smoked pancetta, pecorino romano, and farm-fresh egg yolk.",
    is_veg: false,
    rating: 4.6
  },
  {
    id: "d5",
    name: "Cyber Spice Masala Dosa",
    price: 249,
    category: "South Indian",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800&auto=format&fit=crop",
    description: "Crispy fermented crepe filled with spiced potato mash, served with coconut chutney.",
    is_veg: true,
    rating: 4.9
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
  },
  {
    id: "d7",
    name: "Byte Dim Sum Platter",
    price: 499,
    category: "Chinese",
    image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?q=80&w=800&auto=format&fit=crop",
    description: "Assorted dumplings featuring shrimp, chicken, and seasonal micro-vegetables.",
    is_veg: false,
    rating: 4.7
  },
  {
    id: "d8",
    name: "Deep Space Brownie",
    price: 199,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop",
    description: "Warm fudgy dark chocolate brownie with a core of molten caramel.",
    is_veg: true,
    rating: 4.8
  },
  {
    id: "d9",
    name: "Static Cold Brew",
    price: 185,
    category: "Beverages",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=800&auto=format&fit=crop",
    description: "16-hour slow-steeped single origin Arabica with optional oat milk.",
    is_veg: true,
    rating: 4.7
  }
];

export default function Menu() {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      console.log("Fetching items start...");
      try {
        const q = query(collection(db, "foodItems"));
        const snapshot = await getDocs(q);
        console.log("Snapshot docs count:", snapshot.docs.length);
        const data = snapshot.docs.map(doc => {
          const docData = doc.data();
          return { 
            id: doc.id, 
            ...docData,
            name: docData.name || "Untitled Dish",
            price: docData.price || 0,
            category: docData.category || "General",
            image: docData.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop",
            description: docData.description || "No description available.",
            is_veg: docData.is_veg ?? true,
            rating: docData.rating || 4.5
          };
        }) as FoodItem[];
        
        if (data.length < 5) {
          console.log("Low items count, showing seed option");
          // If totally empty, use fallback for now so UI isn't empty
          if (data.length === 0) {
            setItems(DEFAULT_MENU);
            setIsUsingFallback(true);
          } else {
            setItems(data);
            setIsUsingFallback(false);
          }
        } else {
          console.log("Data found, setting items");
          setItems(data);
          setIsUsingFallback(false);
        }
      } catch (error) {
        console.error("Error fetching menu:", error);
        setItems(DEFAULT_MENU);
        setIsUsingFallback(true);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const [seeding, setSeeding] = useState(false);
  const { profile } = useAuth(); // Assume we have access to profile for admin check

  const seedDatabase = async () => {
    if (!profile?.isAdmin) return;
    setSeeding(true);
    try {
      const { addDoc } = await import("firebase/firestore");
      for (const item of DEFAULT_MENU) {
        const { id, ...itemData } = item;
        await addDoc(collection(db, "foodItems"), {
          ...itemData,
          createdAt: new Date().toISOString()
        });
      }
      // Refresh items
      const q = query(collection(db, "foodItems"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FoodItem[];
      setItems(data);
      alert("Database Seeded Successfully!");
    } catch (error: any) {
      console.error("Seed Error:", error);
      alert("Failed to seed: " + error.message);
    } finally {
      setSeeding(false);
    }
  };

  console.log("Current state - loading:", loading, "items count:", items.length);

  const filteredItems = items.filter(item => {
    if (!item) return false;
    const itemName = item.name || "";
    const itemCategory = item.category || "";
    const matchesCategory = selectedCategory === "All" || itemCategory === selectedCategory;
    const matchesSearch = itemName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  console.log("Filtered items count:", filteredItems.length);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 py-10">
      {profile?.isAdmin && items.length > 0 && items.length < 5 && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-orange-50 border border-orange-100 p-4 rounded-3xl flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-2xl flex items-center justify-center text-[#ff6b35]">
              <Database size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Low Inventory Detected</p>
              <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">Database has only {items.length} units. Seed more items for a full experience.</p>
            </div>
          </div>
          <button 
            onClick={seedDatabase}
            disabled={seeding}
            className="bg-[#ff6b35] text-white text-[10px] font-black px-6 py-2 rounded-xl uppercase tracking-widest hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            {seeding ? "Syncing..." : "Rapid Seed"}
          </button>
        </motion.div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter">SavoryNest Elite Menu (V2) {items.length > 0 && <span className="text-xs text-gray-300 font-normal">({items.length} units detected)</span>}</h1>
          <p className="text-gray-400 max-w-lg font-medium">Verified connection to culinary database. Experience the pinnacle of gastronomic logistics.</p>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="relative group flex-1 md:w-96">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#ff6b35] transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search dishes, tags, ingredients..."
              className="w-full bg-white border border-gray-100 rounded-[2rem] pl-14 pr-6 py-4 focus:outline-none focus:ring-4 focus:ring-orange-100/50 focus:border-[#ff6b35] transition-all shadow-sm font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="p-4 bg-white border border-gray-100 rounded-[1.5rem] text-gray-400 hover:text-[#ff6b35] hover:border-[#ff6b35] transition-all shadow-sm">
            <SlidersHorizontal size={24} />
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex overflow-x-auto pb-6 gap-3 no-scrollbar scroll-smooth">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-8 py-4 rounded-[1.5rem] text-sm font-black whitespace-nowrap transition-all tracking-widest uppercase ${
              selectedCategory === cat
                ? "premium-gradient text-white shadow-xl shadow-orange-200"
                : "bg-white text-gray-400 border border-gray-100 hover:border-[#ff6b35] hover:text-[#ff6b35] shadow-sm"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {(loading) ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-3xl h-[400px] animate-pulse">
              <div className="h-2/3 bg-gray-100 rounded-t-3xl" />
              <div className="p-5 space-y-4">
                <div className="h-6 bg-gray-100 rounded w-3/4" />
                <div className="h-4 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))
        ) : filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center space-y-4">
             <div className="text-6xl">🍲</div>
             <h3 className="text-2xl font-bold text-gray-900">No dishes available in {selectedCategory}</h3>
             <p className="text-gray-500">Try adjusting your filters or search query.</p>
             <div className="flex flex-col items-center gap-4">
               <button 
                 onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}
                 className="text-[#ff6b35] font-black underline tracking-widest uppercase text-xs"
               >
                 Reset Intelligence Filter
               </button>
             </div>
          </div>
        )}
      </div>

      {profile?.isAdmin && (isUsingFallback || items.length < 5) && (
        <div className="mt-20 p-12 bg-orange-50 rounded-[3rem] border-2 border-dashed border-orange-200 text-center space-y-6">
          <div className="w-20 h-20 bg-orange-100 rounded-3xl flex items-center justify-center mx-auto text-[#ff6b35]">
            <Database size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Expand Your Culinary Database</h3>
            <p className="text-gray-500 max-w-md mx-auto">Your database has only {items.length} item(s). To provide a premium user experience, we recommend seeding the full artisanal menu collection.</p>
          </div>
          <button 
            onClick={seedDatabase}
            disabled={seeding}
            className="premium-gradient text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest shadow-2xl shadow-orange-200 flex items-center mx-auto hover:scale-105 active:scale-95 transition-all"
          >
            {seeding ? <Loader2 className="mr-3 animate-spin" size={20} /> : <Database className="mr-3" size={20} />}
            Seed Production Menu
          </button>
        </div>
      )}
    </div>
  );
}
