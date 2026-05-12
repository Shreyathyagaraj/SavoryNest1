import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  deleteDoc, 
  query, 
  orderBy 
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { 
  Plus, 
  Trash2, 
  Edit, 
  LayoutDashboard, 
  Utensils, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  Loader2,
  Database,
  Star,
  X,
  Upload,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  Box,
  CreditCard,
  Settings,
  LogOut,
  ShieldCheck,
  FileText,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { format } from "date-fns";

export default function Admin() {
  const { profile, logout, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [items, setItems] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [adminRequests, setAdminRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [newItem, setNewItem] = useState({
    name: "",
    price: 0,
    category: "Burgers",
    description: "",
    image: "",
    is_veg: true,
    rating: 4.5
  });

  if (authLoading) return null;
  if (!profile?.isAdmin) return <Navigate to="/" />;

  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const handleFirestoreError = (error: any, operation: string, path: string) => {
        const errInfo = {
          error: error.message,
          operationType: operation,
          path,
          authInfo: {
            userId: profile?.uid,
            email: profile?.email,
            emailVerified: profile?.emailVerified || false,
            isAnonymous: false,
            providerInfo: []
          }
        };
        console.error(`Admin ${operation} Error:`, JSON.stringify(errInfo));
        throw new Error(JSON.stringify(errInfo));
      };

      try {
        const itemSnap = await getDocs(query(collection(db, "foodItems"), orderBy("name"))).catch(e => handleFirestoreError(e, 'list', 'foodItems'));
        setItems(itemSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const orderSnap = await getDocs(query(collection(db, "orders"), orderBy("createdAt", "desc"))).catch(e => handleFirestoreError(e, 'list', 'orders'));
        setOrders(orderSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const userSnap = await getDocs(query(collection(db, "users"))).catch(e => handleFirestoreError(e, 'list', 'users'));
        setUsers(userSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const requestSnap = await getDocs(query(collection(db, "adminRequests"), orderBy("createdAt", "desc"))).catch(e => handleFirestoreError(e, 'list', 'adminRequests'));
        setAdminRequests(requestSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error: any) {
        // If it's the JSON error we threw, we can handle it or just log it
        try {
          const info = JSON.parse(error.message);
          console.error("Parsed Firestore Error:", info);
        } catch {
          console.error("Admin Fetch Error:", error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [profile]);

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  
  // Chart Data Preparation
  const chartData = orders.slice(0, 10).reverse().map(order => ({
    name: order.createdAt?.toDate ? format(order.createdAt.toDate(), "MMM dd") : "Today",
    revenue: order.totalAmount,
    orders: 1
  }));

  const analyticsData = [
    { name: 'Mon', revenue: 4000, orders: 24 },
    { name: 'Tue', revenue: 3000, orders: 18 },
    { name: 'Wed', revenue: 2000, orders: 12 },
    { name: 'Thu', revenue: 2780, orders: 20 },
    { name: 'Fri', revenue: 1890, orders: 15 },
    { name: 'Sat', revenue: 2390, orders: 25 },
    { name: 'Sun', revenue: 3490, orders: 30 },
  ];

  const [seeding, setSeeding] = useState(false);

  const seedDatabase = async () => {
    setSeeding(true);
    try {
      const defaultItems = [
        // Burgers
        {
          name: "Savory Beast Burger",
          price: 499,
          category: "Burgers",
          image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop",
          description: "Double Wagyu patty, aged cheddar, truffle aioli, and caramelized onions on a brioche bun.",
          is_veg: false,
          rating: 4.9
        },
        {
          name: "Matrix Veggie Burger",
          price: 349,
          category: "Burgers",
          image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop",
          description: "Quinoa-beetroot patty, smashed avocado, microgreens, and chipotle mayo.",
          is_veg: true,
          rating: 4.7
        },
        {
          name: "Silicon Valley Smash",
          price: 450,
          category: "Burgers",
          image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop",
          description: "Smashed beef patty, secret sauce, artisanal pickles, and processed cheddar.",
          is_veg: false,
          rating: 4.5
        },
        // Pizza
        {
          name: "Quantum Truffle Pizza",
          price: 649,
          category: "Pizza",
          image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop",
          description: "Wild forest mushrooms, white truffle oil, fresh mozzarella, and aromatic herbs.",
          is_veg: true,
          rating: 4.8
        },
        {
          name: "Inferno Pepperoni Pizza",
          price: 599,
          category: "Pizza",
          image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?q=80&w=800&auto=format&fit=crop",
          description: "Artisanal pepperoni, spicy honey, red pepper flakes, and aged parmesan.",
          is_veg: false,
          rating: 4.6
        },
        {
          name: "Garden Matrix Pizza",
          price: 549,
          category: "Pizza",
          image: "https://images.unsplash.com/photo-1566843972142-a7fc3ae65089?q=80&w=800&auto=format&fit=crop",
          description: "Kalamata olives, bell peppers, grilled zucchini, and sun-dried tomatoes.",
          is_veg: true,
          rating: 4.4
        },
        // Seafood
        {
          name: "Neo-Ahi Poke Bowl",
          price: 550,
          category: "Seafood",
          image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop",
          description: "Fresh Ahi tuna, edamame, seaweed salad, avocado, and pickled ginger over chilled sushi rice.",
          is_veg: false,
          rating: 4.7
        },
        {
          name: "Glitch Garlic Shrimp",
          price: 650,
          category: "Seafood",
          image: "https://images.unsplash.com/photo-1559742811-822833d13f6b?q=80&w=800&auto=format&fit=crop",
          description: "Jumbo king prawns sautéed in fermented garlic butter and cold-pressed lemon oil.",
          is_veg: false,
          rating: 4.8
        },
        // Pasta
        {
          name: "Protocol Pasta Carbonara",
          price: 425,
          category: "Pasta",
          image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80&w=800&auto=format&fit=crop",
          description: "Classic creamy carbonara with smoked pancetta, pecorino romano, and farm-fresh egg yolk.",
          is_veg: false,
          rating: 4.6
        },
        {
          name: "Zen Pesto Linguine",
          price: 399,
          category: "Pasta",
          image: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?q=80&w=800&auto=format&fit=crop",
          description: "Fresh basil pesto, toasted pine nuts, extra virgin olive oil, and parmesan.",
          is_veg: true,
          rating: 4.7
        },
        // South Indian
        {
          name: "Cyber Spice Masala Dosa",
          price: 249,
          category: "South Indian",
          image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800&auto=format&fit=crop",
          description: "Crispy fermented crepe filled with spiced potato mash, served with coconut chutney.",
          is_veg: true,
          rating: 4.9
        },
        {
          name: "Poddy Ghee Roast Idli",
          price: 199,
          category: "South Indian",
          image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800&auto=format&fit=crop",
          description: "Mini idlis tossed in pure ghee and spicy malgapodi powder.",
          is_veg: true,
          rating: 4.8
        },
        // North Indian
        {
          name: "Makhani Matrix Chicken",
          price: 525,
          category: "North Indian",
          image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=800&auto=format&fit=crop",
          description: "Classic butter chicken with a modern smoky infusion and double cream.",
          is_veg: false,
          rating: 4.9
        },
        {
          name: "Recursive Paneer Tikka",
          price: 449,
          category: "North Indian",
          image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=800&auto=format&fit=crop",
          description: "Tandoor-charred cottage cheese with marinated bell peppers and mint chutney.",
          is_veg: true,
          rating: 4.8
        },
        // Chinese
        {
          name: "Data Hakka Noodles",
          price: 299,
          category: "Chinese",
          image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=800&auto=format&fit=crop",
          description: "Wok-fired noodles with julienned vegetables and a secret spice blend.",
          is_veg: true,
          rating: 4.4
        },
        {
          name: "Byte Dim Sum Platter",
          price: 499,
          category: "Chinese",
          image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?q=80&w=800&auto=format&fit=crop",
          description: "Assorted dumplings featuring shrimp, chicken, and seasonal micro-vegetables.",
          is_veg: false,
          rating: 4.7
        },
        // Desserts
        {
          name: "Deep Space Brownie",
          price: 199,
          category: "Desserts",
          image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop",
          description: "Warm fudgy dark chocolate brownie with a core of molten caramel.",
          is_veg: true,
          rating: 4.8
        },
        {
          name: "Cloud Nine Cheesecake",
          price: 299,
          category: "Desserts",
          image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=800&auto=format&fit=crop",
          description: "Silky New York style cheesecake with a vibrant wild berry reduction.",
          is_veg: true,
          rating: 4.9
        },
        // Beverages
        {
          name: "Static Cold Brew",
          price: 185,
          category: "Beverages",
          image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=800&auto=format&fit=crop",
          description: "16-hour slow-steeped single origin Arabica with optional oat milk.",
          is_veg: true,
          rating: 4.7
        },
        {
          name: "Neon Mint Cooler",
          price: 149,
          category: "Beverages",
          image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop",
          description: "Zesty lemon and lime infusion with crushed peppermint and a hint of ginger.",
          is_veg: true,
          rating: 4.5
        }
      ];

      const newItems = [];
      for (const item of defaultItems) {
        const docRef = await addDoc(collection(db, "foodItems"), {
          ...item,
          createdAt: new Date().toISOString()
        });
        newItems.push({ id: docRef.id, ...item });
      }
      setItems(prev => [...prev, ...newItems]);
      alert(`Logistics Restored: ${defaultItems.length} units deployed.`);
    } catch (error: any) {
      console.error("Seed Error:", error);
      alert("Failed to seed database: " + error.message);
    } finally {
      setSeeding(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, "foodItems"), {
        ...newItem,
        createdAt: new Date().toISOString()
      });
      setItems(prev => [...prev, { id: docRef.id, ...newItem }]);
      setShowAddModal(false);
      setNewItem({ name: "", price: 0, category: "Burgers", description: "", image: "" });
      alert("Operational Item: Authorized & Deployed.");
    } catch (error: any) {
      console.error("Add Item Error:", error);
      alert("Critical Error: Deployment Aborted - " + error.message);
    }
  };

  const handleEditItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    try {
      const { id, ...data } = editingItem;
      await updateDoc(doc(db, "foodItems", id), {
        ...data,
        updatedAt: new Date().toISOString()
      });
      setItems(prev => prev.map(item => item.id === id ? editingItem : item));
      setShowEditModal(false);
      setEditingItem(null);
      alert("Protocol Update: Successful.");
    } catch (error: any) {
      console.error("Edit Item Error:", error);
      alert("Protocol Error: Update Denied - " + error.message);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
    } catch (error: any) {
      console.error("Update Status Error:", error);
      alert("Failed to update status: " + error.message);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!window.confirm("Are you sure? This will permanently delete the item from the database.")) return;
    try {
      await deleteDoc(doc(db, "foodItems", id));
      setItems(prev => prev.filter(i => i.id !== id));
      alert("Item decommissioned and erased from database.");
    } catch (error: any) {
      console.error("Delete Item Error:", error);
      alert("Critical: Failed to delete item. " + error.message);
    }
  };

  const handleApproveAdmin = async (requestId: string, userUid: string) => {
    try {
      await updateDoc(doc(db, "users", userUid), { isAdmin: true });
      await updateDoc(doc(db, "adminRequests", requestId), { status: "approved" });
      setAdminRequests(adminRequests.map(r => r.id === requestId ? { ...r, status: "approved" } : r));
      setUsers(users.map(u => u.id === userUid ? { ...u, isAdmin: true } : u));
    } catch (error) {
      console.error("Approve Admin Error:", error);
    }
  };

  const handleRejectAdmin = async (requestId: string) => {
    try {
      await updateDoc(doc(db, "adminRequests", requestId), { status: "rejected" });
      setAdminRequests(adminRequests.map(r => r.id === requestId ? { ...r, status: "rejected" } : r));
    } catch (error) {
      console.error("Reject Admin Error:", error);
    }
  };

  return (
    <div className="flex bg-[#030712] min-h-screen text-gray-300 font-sans selection:bg-orange-500/30">
      {/* Sidebar */}
      <aside className="w-80 bg-[#030712]/50 backdrop-blur-3xl border-r border-white/5 p-10 flex flex-col justify-between hidden xl:flex sticky top-0 h-screen z-50">
        <div className="space-y-12">
          <div className="flex items-center space-x-3">
             <div className="w-10 h-10 rounded-xl premium-gradient flex items-center justify-center text-white shadow-xl shadow-orange-500/20">
               <Utensils size={24} />
             </div>
             <span className="text-2xl font-black text-white tracking-tighter uppercase">SavoryNest</span>
          </div>

          <nav className="space-y-4">
            {[
              { id: "dashboard", icon: LayoutDashboard, label: "Overview" },
              { id: "menu", icon: Utensils, label: "Menu Editor" },
              { id: "orders", icon: ShoppingCart, label: "Recent Orders" },
              { id: "analytics", icon: TrendingUp, label: "Detailed Stats" },
              { id: "requests", icon: ShieldCheck, label: "Admin Requests" },
              { id: "users", icon: Users, label: "User Control" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center space-x-4 px-6 py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all",
                  activeTab === tab.id 
                    ? "premium-gradient text-white shadow-2xl shadow-orange-500/20" 
                    : "text-gray-500 hover:text-white hover:bg-white/5"
                )}
              >
                <tab.icon size={20} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 space-y-4">
             <div className="flex justify-between items-center text-[#ff6b35]">
                <Box size={24} />
                <ArrowUpRight size={18} />
             </div>
             <p className="text-xs font-bold text-gray-400">Upgrade to SavoryNest Enterprise for more insights.</p>
             <button className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-sm transition-all border border-white/10">Go Pro</button>
          </div>
          <button onClick={logout} className="flex items-center space-x-4 px-6 py-4 text-red-400 font-black text-sm uppercase tracking-widest hover:bg-red-500/10 rounded-[1.5rem] w-full transition-all">
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 space-y-12 max-w-7xl mx-auto w-full relative">
        {/* Background Gradients */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] -z-10 animate-pulse pointer-events-none" />
        <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

        <header className="flex justify-between items-center">
            <div className="space-y-1">
              <h1 className="text-4xl font-black text-white tracking-tighter">Command Center</h1>
              <p className="text-gray-500 font-medium tracking-tight">Managing SavoryNest's elite culinary fleet.</p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="relative group md:block hidden">
                <Bell size={24} className="text-gray-600 group-hover:text-[#ff6b35] transition-colors cursor-pointer" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#030712]" />
              </div>
              <div className="h-12 w-px bg-white/10 mx-4 md:block hidden" />
              <div className="flex items-center space-x-3 bg-white/5 p-1.5 pr-6 rounded-2xl border border-white/5">
                 <img src={profile?.photoURL || "https://ui-avatars.com/api/?name=Admin"} className="w-10 h-10 rounded-xl shadow-lg border border-white/10" alt="" />
                 <div className="text-left hidden sm:block">
                    <p className="text-sm font-black text-white leading-none">{profile?.displayName}</p>
                    <p className="text-[9px] font-bold text-orange-500 uppercase tracking-widest mt-1">Prime Admin</p>
                 </div>
              </div>
            </div>
        </header>

        {activeTab === "dashboard" && (
          <div className="space-y-12">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               <StatCard 
                 icon={CreditCard} 
                 label="Gross Revenue" 
                 value={`₹${totalRevenue.toLocaleString()}`} 
                 trend="up" 
                 trendVal="+12.5%" 
                 color="text-[#ff6b35] bg-orange-500/10 border-orange-500/20"
               />
               <StatCard 
                 icon={ShoppingCart} 
                 label="Fleet Orders" 
                 value={orders.length} 
                 trend="up" 
                 trendVal="+8.2%" 
                 color="text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
               />
               <StatCard 
                 icon={Utensils} 
                 label="Artisanal Dishes" 
                 value={items.length} 
                 trend="down" 
                 trendVal="-2 items" 
                 color="text-red-400 bg-red-500/10 border-red-500/20"
               />
               <StatCard 
                 icon={Users} 
                 label="Active Members" 
                 value={`${users.length || "14.2k"}`} 
                 trend="up" 
                 trendVal="+22%" 
                 color="text-green-400 bg-green-500/10 border-green-500/20"
               />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl rounded-[3rem] p-10 border border-white/10 shadow-2xl space-y-8">
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-black text-white tracking-tighter uppercase">Revenue Velocity</h3>
                    <select className="bg-white/5 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl focus:outline-none border border-white/10">
                      <option>Last 7 Days</option>
                      <option>Last 30 Days</option>
                    </select>
                  </div>
                  <div className="h-[300px] w-full relative overflow-hidden bg-white/[0.02] rounded-2xl border border-white/5">
                    <ResponsiveContainer width="100%" height="100%" debounce={50}>
                      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ff6b35" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#ff6b35" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                          <XAxis 
                            dataKey="name" 
                            stroke="#6b7280" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false} 
                            tick={{fontWeight: 'bold'}}
                          />
                          <YAxis 
                            stroke="#6b7280" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false} 
                            tick={{fontWeight: 'bold'}}
                            tickFormatter={(value) => `₹${value}`}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#111827', 
                              border: '1px solid #ffffff10',
                              borderRadius: '16px',
                              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              color: '#fff'
                            }}
                            itemStyle={{ color: '#ff6b35' }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="revenue" 
                            stroke="#ff6b35" 
                            strokeWidth={4}
                            fillOpacity={1} 
                            fill="url(#colorRevenue)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
            </div>
         })}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] pl-1">Premium Value (₹)</label>
                    <input
                      required
                      type="number"
                      className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-5 text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-[#ff6b35] transition-all"
                      value={newItem.price}
                      onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] pl-1">Cuisine Pillar</label>
                    <select
                      className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-5 text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-orange-500/20 transition-all appearance-none"
                      value={newItem.category}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    >
                      {["Burgers", "Pizza", "Pasta", "Seafood", "South Indian", "North Indian", "Chinese", "Desserts", "Beverages"].map(c => (
                        <option key={c} value={c} className="bg-[#0b0f1a]">{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] pl-1">Rating Protocol</label>
                    <input
                      required
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-5 text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-orange-500/20 transition-all"
                      value={newItem.rating}
                      onChange={(e) => setNewItem({ ...newItem, rating: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-6 bg-white/5 border border-white/10 rounded-3xl">
                  <label className="text-sm font-bold text-white flex-1">Vegetarian Protocol</label>
                  <button
                    type="button"
                    onClick={() => setNewItem({ ...newItem, is_veg: !newItem.is_veg })}
                    className={cn(
                      "w-14 h-8 rounded-full p-1 transition-all duration-300",
                      newItem.is_veg ? "bg-green-500" : "bg-gray-700"
                    )}
                  >
                    <div className={cn("w-6 h-6 bg-white rounded-full transition-transform duration-300", newItem.is_veg ? "translate-x-6" : "translate-x-0")} />
                  </button>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] pl-1">Visual Asset URL</label>
                  <div className="relative">
                    <input
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-5 text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-orange-500/20 transition-all"
                      value={newItem.image}
                      onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                      <Upload size={20} />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] pl-1">Technical Specs (Description)</label>
                  <textarea
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-5 text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-orange-500/20 transition-all resize-none"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  />
                </div>

                <button type="submit" className="w-full premium-gradient text-white py-6 rounded-[2rem] text-xl font-black shadow-2xl shadow-orange-500/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest">
                   Authorize Listing
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && editingItem && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setShowEditModal(false); setEditingItem(null); }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="bg-[#0b0f1a] border border-white/10 rounded-[4rem] p-12 max-w-2xl w-full relative z-10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] space-y-10"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-4xl font-black text-white tracking-tighter uppercase">Recalibrate Protocol</h3>
                <button onClick={() => { setShowEditModal(false); setEditingItem(null); }} className="w-12 h-12 bg-white/5 text-gray-400 hover:text-white rounded-full flex items-center justify-center transition-all">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleEditItem} className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] pl-1">Dish Identity</label>
                    <input
                      required
                      placeholder="e.g. Truffle Infused Burger"
                      className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-5 text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-[#ff6b35] transition-all"
                      value={editingItem.name}
                      onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] pl-1">Premium Value (₹)</label>
                    <input
                      required
                      type="number"
                      className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-5 text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-[#ff6b35] transition-all"
                      value={editingItem.price}
                      onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] pl-1">Cuisine Pillar</label>
                    <select
                      className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-5 text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-orange-500/20 transition-all appearance-none"
                      value={editingItem.category}
                      onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    >
                      {["Burgers", "Pizza", "Pasta", "Seafood", "South Indian", "North Indian", "Chinese", "Desserts", "Beverages"].map(c => (
                        <option key={c} value={c} className="bg-[#0b0f1a]">{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] pl-1">Rating Protocol</label>
                    <input
                      required
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-5 text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-orange-500/20 transition-all"
                      value={editingItem.rating}
                      onChange={(e) => setEditingItem({ ...editingItem, rating: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-6 bg-white/5 border border-white/10 rounded-3xl">
                  <label className="text-sm font-bold text-white flex-1">Vegetarian Protocol</label>
                  <button
                    type="button"
                    onClick={() => setEditingItem({ ...editingItem, is_veg: !editingItem.is_veg })}
                    className={cn(
                      "w-14 h-8 rounded-full p-1 transition-all duration-300",
                      editingItem.is_veg ? "bg-green-500" : "bg-gray-700"
                    )}
                  >
                    <div className={cn("w-6 h-6 bg-white rounded-full transition-transform duration-300", editingItem.is_veg ? "translate-x-6" : "translate-x-0")} />
                  </button>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] pl-1">Visual Asset URL</label>
                  <div className="relative">
                    <input
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-5 text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-orange-500/20 transition-all"
                      value={editingItem.image}
                      onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                      <Upload size={20} />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] pl-1">Technical Specs (Description)</label>
                  <textarea
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-5 text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-orange-500/20 transition-all resize-none"
                    value={editingItem.description}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  />
                </div>

                <button type="submit" className="w-full premium-gradient text-white py-6 rounded-[2rem] text-xl font-black shadow-2xl shadow-orange-500/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest">
                   Modify Deployment
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, trend, trendVal }: any) {
  return (
    <div className={cn("rounded-[3rem] p-10 bg-white/5 border backdrop-blur-xl space-y-6 group hover:shadow-2xl hover:shadow-orange-500/10 transition-all", color)}>
      <div className="flex justify-between items-start">
        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center transition-transform group-hover:rotate-12 border border-white/5">
          <Icon size={28} />
        </div>
        <div className={cn(
          "flex items-center space-x-1 px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border",
          trend === "up" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"
        )}>
          {trend === "up" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          <span>{trendVal}</span>
        </div>
      </div>
      <div>
        <p className="text-3xl font-black text-white tracking-tighter">{value}</p>
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mt-1">{label}</p>
      </div>
    </div>
  );
}
