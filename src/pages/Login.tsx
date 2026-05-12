import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import { motion } from "motion/react";
import { Utensils } from "lucide-react";

export default function Login() {
  const { user, signInWithGoogle, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return null;
  if (user) return <Navigate to="/" />;

  const handleLogin = async () => {
    await signInWithGoogle();
    navigate("/");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full bg-white rounded-[4rem] p-16 shadow-[0_50px_100px_rgba(0,0,0,0.05)] border border-gray-50 text-center space-y-10"
      >
        <div className="w-24 h-24 rounded-[2.5rem] premium-gradient flex items-center justify-center mx-auto mb-6 shadow-xl shadow-orange-100">
          <Utensils className="text-white" size={48} />
        </div>
        <div className="space-y-4">
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter">SavoryNest</h1>
          <p className="text-gray-400 font-medium text-lg px-4">Sign in to experience high-fidelity culinary logistics.</p>
        </div>

        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center space-x-4 bg-white border border-gray-100 py-5 rounded-[2rem] hover:shadow-xl transition-all font-black text-gray-900 shadow-sm active:scale-95"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6" />
          <span>Continue with Google</span>
        </button>

        <div className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.2em] pt-4">
          By signing in, you agree to our <br />
          <span className="text-[#ff6b35] cursor-pointer">Terms Luxurios</span> & <span className="text-[#ff6b35] cursor-pointer">Privacy Protocol</span>
        </div>
      </motion.div>
    </div>
  );
}
