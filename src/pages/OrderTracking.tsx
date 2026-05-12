import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { motion } from "motion/react";
import { 
  Package, 
  ChefHat, 
  Truck, 
  CheckCircle2, 
  ChevronLeft, 
  MapPin, 
  Phone 
} from "lucide-react";
import { cn } from "../lib/utils";

const STATUS_STEPS = [
  { status: "pending", icon: Package, label: "Manifest Locked" },
  { status: "processing", icon: ChefHat, label: "Artisan Prep" },
  { status: "shipped", icon: Truck, label: "On Logistics" },
  { status: "delivered", icon: CheckCircle2, label: "Mission Success" },
];

export default function OrderTracking() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      const unsubscribe = onSnapshot(doc(db, "orders", orderId), (doc) => {
        if (doc.exists()) {
          setOrder({ id: doc.id, ...doc.data() });
        }
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, [orderId]);

  if (loading) return (
    <div className="max-w-5xl mx-auto px-4 py-20 animate-pulse space-y-12">
      <div className="h-20 bg-white rounded-3xl w-1/3" />
      <div className="h-64 bg-white rounded-[4rem]" />
      <div className="h-40 bg-white rounded-[4rem]" />
    </div>
  );

  if (!order) return (
    <div className="max-w-5xl mx-auto px-4 py-32 text-center space-y-12 flex flex-col items-center">
      <div className="bg-white w-40 h-40 rounded-[3rem] flex items-center justify-center shadow-xl mb-4">
        <Package size={64} className="text-gray-200" />
      </div>
      <div className="space-y-6">
        <h2 className="text-5xl font-black text-gray-900 tracking-tighter uppercase">Manifest Not Found</h2>
        <p className="text-gray-400 font-medium max-w-sm mx-auto text-lg">The tracking link for this expedition is invalid or has expired.</p>
      </div>
      <Link to="/profile" className="text-[#ff6b35] font-black text-xs uppercase tracking-widest hover:underline px-8 py-3 bg-orange-50 rounded-2xl">Return to Command</Link>
    </div>
  );

  const currentStep = STATUS_STEPS.findIndex(step => step.status === order.status);

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 space-y-16">
      <div className="flex items-center space-x-6">
        <Link to="/profile" className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#ff6b35] hover:border-orange-100 transition-all group">
          <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
        </Link>
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Track Expedition</h1>
          <p className="text-xs font-black text-gray-400 mt-1 uppercase tracking-widest">MANIFEST_ID: #{orderId}</p>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="bg-white rounded-[4rem] p-12 md:p-20 shadow-[0_50px_100px_rgba(0,0,0,0.02)] border border-gray-50 relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Truck size={150} />
        </div>
        
        <div className="relative flex justify-between items-center max-w-3xl mx-auto">
           {/* Progress Line */}
           <div className="absolute h-1.5 bg-gray-50 top-[30px] left-0 right-0 -z-10 rounded-full" />
           <motion.div 
             initial={{ width: 0 }}
             animate={{ width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` }}
             transition={{ duration: 1.5, ease: "easeInOut" }}
             className="absolute h-1.5 bg-green-500 top-[30px] left-0 -z-10 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.3)]" 
           />

           {STATUS_STEPS.map((step, index) => {
             const Icon = step.icon;
             const isActive = index <= currentStep;
             const isCurrent = index === currentStep;
             
             return (
               <div key={step.status} className="flex flex-col items-center space-y-6">
                 <div className={cn(
                   "w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-700 relative",
                   isActive ? "bg-green-500 text-white shadow-2xl shadow-green-100" : "bg-white border border-gray-100 text-gray-200",
                   isCurrent && "ring-8 ring-green-100 scale-110"
                 )}>
                   <Icon size={28} />
                   {isCurrent && (
                     <div className="absolute -inset-1 rounded-[1.7rem] border-2 border-green-500 animate-ping opacity-20 pointer-events-none" />
                   )}
                 </div>
                 <div className="text-center space-y-1">
                   <h4 className={cn(
                     "text-[10px] font-black uppercase tracking-[0.2em]",
                     isActive ? "text-gray-900" : "text-gray-300"
                   )}>
                     {step.label}
                   </h4>
                   {isCurrent && (
                     <motion.p 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[10px] font-bold text-green-500 uppercase tracking-widest"
                      >
                        In Progress
                      </motion.p>
                   )}
                 </div>
               </div>
             );
           })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-white rounded-[3.5rem] p-12 shadow-sm border border-gray-50 space-y-10 group relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
              <MapPin size={80} />
           </div>
           <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase relative z-10">Destination HQ</h3>
           <div className="flex items-start space-x-6 relative z-10">
             <div className="bg-orange-50 p-5 rounded-[1.5rem] text-[#ff6b35] shadow-lg shadow-orange-50">
               <MapPin size={28} />
             </div>
             <div className="space-y-3">
               <p className="font-black text-gray-900 text-lg leading-tight uppercase tracking-tighter">{order.address}</p>
               <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                 <Phone size={14} className="mr-3 text-[#ff6b35]" />
                 Encrypted: {order.phone}
               </div>
             </div>
           </div>
        </div>

        <div className="bg-[#111827] rounded-[3.5rem] p-12 shadow-2xl space-y-10 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff6b35]/5 rounded-full blur-[100px]" />
          <h3 className="text-2xl font-black tracking-tighter uppercase relative z-10">Manifest Details</h3>
          <div className="space-y-6 relative z-10">
            <div className="space-y-4">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center text-sm font-medium">
                  <span className="text-gray-400 uppercase tracking-wider">{item.name} <span className="text-[10px] text-gray-600 ml-2">x{item.quantity}</span></span>
                  <span className="font-black tracking-tighter">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="pt-8 border-t border-white/5 flex justify-between items-end">
              <span className="text-xs font-black uppercase text-gray-500 tracking-[0.2em] mb-1">Settled Amount</span>
              <span className="text-5xl font-black text-[#ff6b35] tracking-tighter leading-none">₹{order.totalAmount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
