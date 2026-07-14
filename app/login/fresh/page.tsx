"use client";

import { useEffect, useState ,  } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store/useAuthStore";


export default function FreshLoginRedirectPage() {
  const router = useRouter();
  function CircularLoader() {
    const [count, setCount] = useState(0);
    const [frame, setFrame] = useState(0);
  
    useEffect(() => {
    
      const interval = setInterval(() => {
        setCount((c) => (c < 100 ? c + 0.5 : 100));
      }, 30); 
  
      return () => clearInterval(interval);
    }, []);
  
    // We use a keyframe animation via inline style for the wave
    // The wave SVG moves up and down
    const waveStyle: React.CSSProperties = {
      animation: `wave ${6}s linear infinite`,
    };
  
    const containerStyle: React.CSSProperties = {
      position: "relative",
      width: "16rem",
      height: "16rem",
      borderRadius: "50%",
      border: "4px solid #d1fae5", // emerald-100
      backgroundColor: "white",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 0 15px rgba(0,0,0,0.1)",
    };
  
    const overlayStyle: React.CSSProperties = {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      overflow: "hidden",
    };
  
    return (
      <div style={containerStyle}>
        {/* The Wave Mask */}
        <div style={overlayStyle}>
          <svg
            width="200%"
            height="100%"
            viewBox="0 0 200 50"
            preserveAspectRatio="none"
            style={waveStyle}
            className="w-[200%] h-full"
          >
            <path
              d="M0,50 C25,50 25,0 50,50 C75,50 75,0 100,50 C125,50 125,0 150,50 C175,50 175,0 200,50"
              fill="#9BF6AA" // Light green fill
              stroke="#34D399" // Light green border
              strokeWidth="2"
            />
          </svg>
        </div>
        
        {/* Counter */}
        <div className="z-10 text-center font-bold text-2xl text-emerald-900 drop-shadow-sm">
          {count >= 100 ? (
            <div className="animate-pulse">
               <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 font-bold">
                  ✓
               </span>
            </div>
          ) : (
            Math.round(count) + "%"
          )}
        </div>
  
        {/* Fallback Spinner for very first instant before wave renders */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm text-emerald-400">
          {count < 20 ? "Loading..." : null}
        </div>
      </div>
    );
  }
  
  // Add styles for the wave
  const globalStyles = () => (
    <style>{`
      @keyframes wave {
        0% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
        100% { transform: translateY(0); }
      }
    `}</style>
  );
  useEffect(() => {
    useAuthStore.getState().clearSessionLocal();
    router.replace("/login");
  }, [router]);

  return (
    <div
      className="flex min-h-dvh items-center justify-center bg-[#F5F9F6] text-sm text-[#586A64]"
      dir="rtl"
    >
        در حال آماده‌سازی صفحه ورود…
        <CircularLoader />
    </div>
  );
}
