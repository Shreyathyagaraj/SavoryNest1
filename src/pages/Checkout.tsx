import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useNavigate, Navigate } from "react-router-dom";
import { MapPin, Phone, CreditCard, ChevronRight, Loader2, X } from "lucide-react";
import { motion } from "motion/react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Checkout() {
  const { user, profile } = useAuth();
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState(profile?.address || "");
  const [phone, setPhone] = useState(profile?.phone || "");

  if (!user) return <Navigate to="/login" />;
  if (cart.length === 0) return <Navigate to="/menu" />;

  const handlePayment = async () => {
    setError(null);
    if (!address || !phone) {
      setError("Please provide a delivery address and your contact number.");
      return;
    }

    setLoading(true);
    try {
      if (!window.Razorpay) {
        throw new Error("Razorpay SDK not loaded. Check your interface connection.");
      }
      // 1. Create order on backend
      const response = await fetch("/api/payment/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: cartTotal + 5,
          receipt: `receipt_${Date.now()}`
        }),
      });
      
      if (!response.ok) throw new Error("Failed to create Razorpay order");
      const orderData = await response.json();

      // 2. Open Razorpay Checkout
      const options = {
        key: (import.meta as any).env.VITE_RAZORPAY_KEY_ID || "rzp_test_SnegbwO7twL6Wo",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "SavoryNest",
        description: "Premium Food Delivery Manifest",
        order_id: orderData.id,
        handler: async (response: any) => {
          try {
            // 3. Verify payment
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.status === "success") {
              // 4. Save order to Firestore
              const orderRef = await addDoc(collection(db, "orders"), {
                userId: user.uid,
                items: cart,
                totalAmount: cartTotal + 5,
                status: "pending",
                paymentId: response.razorpay_payment_id,
                address,
                phone,
                createdAt: serverTimestamp(),
              });

              clearCart();
              navigate(`/success?orderId=${orderRef.id}`);
            } else {
              setError("Signature verification failed. Potential breach detected.");
            }
          } catch (err) {
            setError("Pipeline verification failed. Check your data link.");
          }
        },
        prefill: {
          name: user.displayName,
          email: user.email,
          contact: phone,
        },
        theme: {
          color: "#ff6b35",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        setError("Deployment failure: " + response.error.description);
      });
      rzp.open();
    } catch (error) {
      console.error("Payment Process Error:", error);
      setError("An algorithmic error occurred. Re-initiate sequence.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 space-y-16">
      <div className="space-y-4">
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter uppercase">Deployment</h1>
        <p className="text-gray-400 font-medium text-lg">Finalizing your culinary manifest for immediate dispatch.</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-8 border-red-500 text-red-600 px-8 py-6 rounded-[2rem] text-sm font-black uppercase tracking-widest animate-in fade-in slide-in-from-top-4 shadow-xl shadow-red-100 flex items-center justify-between">
          <span>{error}</span>
          <X className="cursor-pointer" onClick={() => setError(null)} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
        <div className="space-y-12">
          <div className="bg-white rounded-[3.5rem] p-12 shadow-[0_50px_100px_rgba(0,0,0,0.02)] border border-gray-50 space-y-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <MapPin size={100} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase flex items-center relative z-10">
              <MapPin className="mr-4 text-[#ff6b35]" size={32} />
              HQ Logistics
            </h3>
            <div className="space-y-8 relative z-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] pl-1">Primary Comm-Link</label>
                <div className="relative group">
                   <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#ff6b35] transition-colors" size={20} />
                   <input
                    type="tel"
                    placeholder="Enter encrypted mobile digits"
                    className="w-full bg-gray-50 border border-gray-100 rounded-[2rem] pl-16 pr-8 py-5 text-sm font-black focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-[#ff6b35] transition-all"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] pl-1">Arrival Coordinates</label>
                <textarea
                  placeholder="Street, floor, unit, and tactical entry instructions..."
                  className="w-full bg-gray-50 border border-gray-100 rounded-[2rem] px-8 py-6 text-sm font-black focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-[#ff6b35] transition-all min-h-[150px]"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-12">
          <div className="bg-[#111827] rounded-[3.5rem] p-12 shadow-2xl space-y-10 sticky top-32 text-white relative overflow-hidden group">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute -top-32 -right-32 w-80 h-80 bg-[#ff6b35]/20 rounded-full blur-[100px]"
            />
            
            <h3 className="text-2xl font-black tracking-tighter uppercase flex items-center relative z-10">
              <CreditCard className="mr-4 text-[#ff6b35]" size={32} />
              Manifest Value
            </h3>
            <div className="space-y-6 pt-4 border-t border-white/5 relative z-10">
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm font-medium">
                    <span className="text-gray-400 uppercase tracking-tight">{item.name} <span className="text-[10px] text-gray-600 ml-2">x{item.quantity}</span></span>
                    <span className="font-black tracking-tighter">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="pt-6 border-t border-white/5 space-y-2">
                 <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase tracking-widest">
                    <span>Logistics Fee</span>
                    <span>₹5</span>
                 </div>
                 <div className="flex justify-between items-end pt-2">
                    <span className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Total Manifest</span>
                    <span className="text-5xl font-black text-[#ff6b35] tracking-tighter leading-none">₹{cartTotal + 5}</span>
                 </div>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-white text-gray-900 py-6 rounded-[2rem] text-xl font-black uppercase tracking-widest shadow-2xl hover:bg-orange-50 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed group active:scale-95 relative z-10"
            >
              {loading ? (
                <Loader2 className="animate-spin mr-3" />
              ) : (
                <>Authorize Payment <ChevronRight className="ml-3 group-hover:translate-x-2 transition-transform" /></>
              )}
            </button>

            <div className="flex items-center justify-center space-x-6 grayscale opacity-30 pt-4 relative z-10">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/Visa_2021.svg" className="h-4" alt="Visa" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="Mastercard" />
              <img src="https://razorpay.com/favicon.png" className="h-4" alt="Razorpay" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
