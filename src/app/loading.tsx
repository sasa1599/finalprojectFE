"use client";
import React, { useEffect, useState } from "react";

export default function Loading() {
  const [pulseIntensity, setPulseIntensity] = useState(0.2);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseIntensity((prev) => (prev === 0.2 ? 0.5 : 0.2));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white overflow-hidden">
      <div className="relative w-full max-w-3xl flex flex-col items-center justify-center">
        {/* Enhanced glow effect */}
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, rgba(79, 70, 229, ${pulseIntensity}) 0%, rgba(0, 0, 0, 0) 70%)`,
            animation: "pulse-glow 4s ease-in-out infinite",
          }}
        ></div>

        {/* TechLite text with enhanced glow */}
        <div className="relative z-10 mb-4">
          <h1 className="text-7xl font-bold glow-text">
            Tech<span className="text-indigo-400">Lite</span>
          </h1>
        </div>

        {/* Loading text with dots animation */}
        <div className="text-2xl text-gray-400 z-10">
          Loading
          <span className="dots" style={{ animation: "slowDots 3s infinite" }}>
            ...
          </span>
        </div>

        {/* Tech emojis in fixed positions with very slow movement */}
        <div className="absolute w-full h-full">
          {[
            { emoji: "📱", top: "30%", left: "20%" },
            { emoji: "💻", top: "40%", left: "75%" },
            { emoji: "⌚", top: "60%", left: "25%" },
            { emoji: "🎧", top: "50%", left: "80%" },
            { emoji: "📷", top: "70%", left: "55%" },
            { emoji: "🎮", top: "25%", left: "65%" },
            { emoji: "🔋", top: "65%", left: "15%" },
            { emoji: "📡", top: "20%", left: "35%" },
          ].map((item, i) => (
            <div
              key={i}
              className="absolute text-3xl opacity-40"
              style={{
                top: item.top,
                left: item.left,
                animation: `gentleFloat ${40 + i * 5}s ease-in-out infinite`,
                animationDelay: `${-i * 3}s`,
                filter: "drop-shadow(0 0 5px rgba(79, 70, 229, 0.5))",
              }}
            >
              {item.emoji}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .glow-text {
          text-shadow: 0 0 10px rgba(79, 70, 229, 0.7),
            0 0 20px rgba(79, 70, 229, 0.5), 0 0 30px rgba(79, 70, 229, 0.3);
          animation: text-pulse 4s ease-in-out infinite;
        }

        @keyframes text-pulse {
          0%,
          100% {
            text-shadow: 0 0 10px rgba(79, 70, 229, 0.5),
              0 0 20px rgba(79, 70, 229, 0.3), 0 0 30px rgba(79, 70, 229, 0.1);
          }
          50% {
            text-shadow: 0 0 15px rgba(79, 70, 229, 0.8),
              0 0 25px rgba(79, 70, 229, 0.6), 0 0 35px rgba(79, 70, 229, 0.4);
          }
        }

        @keyframes pulse-glow {
          0%,
          100% {
            opacity: 0.7;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }

        @keyframes slowDots {
          0% {
            opacity: 0.3;
            content: ".";
          }
          33% {
            opacity: 0.6;
            content: "..";
          }
          66% {
            opacity: 1;
            content: "...";
          }
          100% {
            opacity: 0.3;
            content: ".";
          }
        }

        @keyframes gentleFloat {
          0%,
          100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(-10px, -10px);
          }
          50% {
            transform: translate(0, -15px);
          }
          75% {
            transform: translate(10px, -5px);
          }
        }
      `}</style>
    </div>
  );
}
