import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { collection, query, where, getDocs, orderBy, doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { motion, AnimatePresence } from "motion/react";
import { Package, MapPin, Clock, ChevronRight, LogOut, Heart, Settings, Utensils, X, Phone, Edit3 } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";

export default function Profile() {
  const { user, profile, logout } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProfile, setEditProfile] = useState({
    phone: profile?.phone || "",
    address: profile?.address || ""
  });

  useEffect(() => {
    if (profile) {
      setEditProfile({
        phone: profile.phone || "",
        address: profile.address || ""
      });
    }
  }, [profile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await updateDoc(doc(db, "users", user.uid), {
        phone: editProfile.phone,
        address: editProfile.address
      });
      setShowEditModal(false);
      window.location.reload();
    } catch (err) {
      console.error("Profile Update Error:", err);
    }
  };

  useEffect(() => {
    if (user) {
      const fetchOrders = async () => {
        try {
          const q = query(
            collection(db, "orders"),
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc")
          );
          const snapshot = await getDocs(q);
          setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
          console.error("Error fetching orders:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchOrders();
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="bg-white rounded-[4rem] p-12 shadow-[0_50px_100px_rgba(0,0,0,0.02)] border border-gray-50 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
         {/* Background Decor */}
        <div className="absolute top-0 right-0 w-96 h-96 premium-gradient rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-5" />
        
        <div className="relative group">
          <img
            src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`}
            alt="avatar"
            className="w-40 h-40 rounded-[3rem] object-cover ring-[12px] ring-gray-50 group-hover:scale-105 transition-transform duration-500 shadow-2xl"
          />
          <div className="absolute -bottom-2 -right-2 bg-white p-3 rounded-2xl shadow-xl border border-gray-50 text-[#ff6b35]">
            <Settings size={20} />
          </div>
        </div>

        <div className="flex-1 text-center md:text-left space-y-4">
          <div className="inline-flex items-center space-x-2 bg-orange-50 text-[#ff6b35] px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border border-orange-100">
            Elite Member
          </div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter">{user.displayName}</h1>
          <p className="text-gray-400 font-medium">{user.email}</p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-6">
            <div className="flex items-center space-x-3 bg-white border border-gray-100 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 shadow-sm">
              <Package size={18} className="text-[#ff6b35]" />
              <span>{orders.length} Voyages</span>
            </div>
            <div className="flex items-center space-x-3 bg-white border border-gray-100 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 shadow-sm">
              <Heart size={18} className="text-red-500" />
              <span>12 Favorites</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full md:w-auto">
          <button 
            onClick={logout}
            className="flex items-center justify-center space-x-3 px-10 py-5 bg-red-50 text-red-500 rounded-[2rem] hover:bg-red-100 transition-all font-black uppercase tracking-widest text-xs"
          >
            <LogOut size={18} />
            <span>Abandon Session</span>
          </button>

          {!profile?.isAdmin && (
            <AdminAccessSection />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-10">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Recent Expeditions</h2>
            <Link to="/menu" className="text-[#ff6b35] font-black text-xs uppercase tracking-widest hover:translate-x-2 transition-transform">New Request →</Link>
          </div>

          <div className="space-y-6">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-32 bg-white rounded-[2.5rem] animate-pulse border border-gray-50" />
              ))
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <Link key={order.id} to={`/orders/${order.id}`}>
                  <motion.div
                    whileHover={{ x: 10 }}
                    className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-50 flex items-center justify-between hover:shadow-xl hover:shadow-orange-100/20 transition-all group"
                  >
                    <div className="flex items-center space-x-8">
                      <div className="bg-orange-50 p-5 rounded-3xl text-[#ff6b35] group-hover:scale-110 transition-transform shadow-lg shadow-orange-50">
                        <Package size={28} />
                      </div>
                      <div>
                        <h4 className="font-black text-gray-900 uppercase tracking-tighter text-lg">Manifest #{order.id.slice(0, 8)}</h4>
                        <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">
                          {order.items.length} items • ₹{order.totalAmount}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-8">
                      <div className="hidden md:block text-right">
                        <p className={cn(
                          "text-[10px] font-black uppercase tracking-[0.2em]",
                          order.status === "delivered" ? "text-green-500" : "text-orange-500"
                        )}>{order.status}</p>
                        <p className="text-[10px] font-bold text-gray-300 mt-1 uppercase tracking-widest">
                          {order.createdAt?.toDate().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-200 group-hover:text-[#ff6b35] group-hover:bg-orange-50 transition-all">
                        <ChevronRight size={24} />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))
            ) : (
              <div className="bg-white rounded-[3rem] p-20 text-center space-y-6 border border-gray-50 border-dashed">
                <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto text-gray-200">
                  <Package size={48} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-gray-900 tracking-tighter">THE manifest is clean</h3>
                  <p className="text-gray-400 font-medium">Your culinary journey begins with your first order.</p>
                </div>
                <Link to="/menu" className="inline-block premium-gradient text-white px-10 py-4 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-orange-100">Browse Menu</Link>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-12">
          <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-50 space-y-8">
             <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase flex items-center">
               <MapPin className="mr-3 text-[#ff6b35]" size={24} />
               HQ Addresses
             </h3>
             <div className="space-y-6">
               {(profile?.address || profile?.phone) ? (
                 <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 space-y-4 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-5">
                      <MapPin size={48} />
                   </div>
                   {profile?.phone && (
                     <div className="flex items-center space-x-3 text-gray-500">
                        <Phone size={16} className="text-[#ff6b35]" />
                        <span className="font-bold">{profile.phone}</span>
                     </div>
                   )}
                   {profile?.address && (
                     <div className="flex items-start space-x-3 text-gray-500 leading-relaxed text-sm">
                        <MapPin size={16} className="text-[#ff6b35] mt-1 shrink-0" />
                        <span className="font-medium italic">{profile.address}</span>
                     </div>
                   )}
                 </div>
               ) : (
                 <p className="text-gray-400 font-medium italic text-center py-4">No tactical coordinates registered.</p>
               )}
               <button 
                onClick={() => setShowEditModal(true)}
                className="w-full py-5 bg-white border-2 border-dashed border-gray-100 rounded-[2rem] text-[10px] font-black uppercase tracking-widest text-gray-400 hover:border-[#ff6b35] hover:text-[#ff6b35] transition-all"
               >
                 {profile?.address || profile?.phone ? "Modify Coordinates" : "+ Establish New HQ"}
               </button>
             </div>
          </div>

          <div className="bg-[#111827] rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-2xl">
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute top-0 right-0 w-64 h-64 bg-[#ff6b35]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
            />
            <div className="space-y-8 relative z-10">
              <div className="flex items-center space-x-3">
                 <div className="w-10 h-10 rounded-xl premium-gradient flex items-center justify-center shadow-lg">
                    <Utensils size={20} />
                 </div>
                 <h3 className="text-2xl font-black tracking-tighter uppercase">SavoryNest Gold</h3>
              </div>
              <p className="text-gray-400 text-sm font-medium leading-relaxed">
                Unlock sonic delivery logistics, zero service fees, and priority artisanal kitchen access.
              </p>
              <button className="w-full premium-gradient text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-black/20 hover:scale-105 active:scale-95 transition-all">
                Ascend to Gold
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowEditModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="bg-white rounded-[4rem] p-12 max-w-xl w-full relative z-10 shadow-2xl space-y-10"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Identity Profile</h3>
                <button onClick={() => setShowEditModal(false)} className="w-12 h-12 bg-gray-50 text-gray-400 hover:text-gray-900 rounded-full flex items-center justify-center transition-all">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] pl-1">Primary Comm-Link</label>
                  <div className="relative group">
                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#ff6b35] transition-colors" size={20} />
                    <input
                      placeholder="Enter mobile digits"
                      className="w-full bg-gray-50 border border-gray-100 rounded-[1.5rem] pl-16 pr-6 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-orange-100 transition-all"
                      value={editProfile.phone}
                      onChange={(e) => setEditProfile({ ...editProfile, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] pl-1">Primary Arrival Coordinates</label>
                  <textarea
                    placeholder="Enter full delivery coordinates..."
                    className="w-full bg-gray-50 border border-gray-100 rounded-[1.5rem] px-6 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-orange-100 transition-all min-h-[120px]"
                    value={editProfile.address}
                    onChange={(e) => setEditProfile({ ...editProfile, address: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full premium-gradient text-white py-5 rounded-[2rem] text-lg font-black shadow-2xl shadow-orange-100 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest"
                >
                  Update Manifest
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AdminAccessSection() {
  const { user, requestAdmin, profile } = useAuth();
  const [code, setCode] = useState("");
  const [reason, setReason] = useState("");
  const [showRequest, setShowRequest] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleApplyCode = async () => {
    setError("");
    const secret = (import.meta as any).env.VITE_ADMIN_SECRET_CODE || "SavoryNestAdmin2026";
    if (code === secret) {
      try {
        await updateDoc(doc(db, "users", user!.uid), { isAdmin: true });
        window.location.reload();
      } catch (err) {
        setError("Authorization failed.");
      }
    } else {
      setError("Invalid security protocol code.");
    }
  };

  const handleRequest = async () => {
    if (!reason.trim()) {
      setError("Reason required for escalation.");
      return;
    }
    try {
      await requestAdmin(reason);
      setSuccess("Manifest Request Transmitted.");
      setShowRequest(false);
      setReason("");
    } catch (err) {
      setError("Transmission failure.");
    }
  };

  return (
    <div className="space-y-6 pt-8 border-t border-gray-100 w-full">
      <div className="space-y-4">
        <label className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] block text-center md:text-left">Core Command Authorization</label>
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <input 
            placeholder="Protocol Code"
            type="password"
            className="bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-orange-100 flex-1 transition-all"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button 
            onClick={handleApplyCode}
            className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-[#ff6b35] transition-all shadow-lg active:scale-95"
          >
            Authorize
          </button>
        </div>
      </div>

      {error && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider animate-in fade-in slide-in-from-top-1 text-center md:text-left">{error}</p>}
      {success && <p className="text-[10px] text-green-500 font-bold uppercase tracking-wider animate-in fade-in slide-in-from-top-1 text-center md:text-left">{success}</p>}
      
      <div className="pt-2 text-center md:text-left">
        {!showRequest ? (
          <button 
            onClick={() => setShowRequest(true)}
            className="text-[10px] font-black text-gray-300 uppercase tracking-widest hover:text-[#ff6b35] transition-colors"
          >
            Request Access Esclation?
          </button>
        ) : (
          <div className="space-y-4 w-full animate-in zoom-in-95 duration-200">
             <textarea 
              placeholder="Justify escalation request..."
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-orange-100 min-h-[100px] transition-all"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
             />
             <div className="flex gap-6 justify-center md:justify-start">
               <button onClick={handleRequest} className="text-[10px] font-black text-[#ff6b35] uppercase tracking-widest hover:underline">Transmit</button>
               <button onClick={() => setShowRequest(false)} className="text-[10px] font-black text-gray-300 uppercase tracking-widest hover:underline">Abort</button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
