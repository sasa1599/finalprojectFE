"use client";
import React, { useState, useEffect } from "react";
const EnhancedTechEliteBanner: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <div
      className="w-full overflow-hidden mb-8 cursor-pointer transition-all duration-300 relative group"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ height: isMobile ? "320px" : "420px" }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 300"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full"
        style={{
          transform:
            isHovered && !isMobile
              ? `translate(${(mousePosition.x - 50) / 30}px, ${
                  (mousePosition.y - 50) / 30
                }px)`
              : "none",
          transition: "transform 0.3s ease-out",
        }}
      >
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#1e3a8a" />
            <animate
              attributeName="x1"
              values="0%;100%;0%"
              dur="30s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="y1"
              values="0%;100%;0%"
              dur="25s"
              repeatCount="indefinite"
            />
          </linearGradient>
          <radialGradient
            id="spotlightGradient"
            cx="50%"
            cy="50%"
            r="70%"
            fx="50%"
            fy="50%"
          >
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="1500" height="500" fill="url(#bgGradient)" />
        <circle
          cx={isHovered && !isMobile ? mousePosition.x * 12 : "600"}
          cy={isHovered && !isMobile ? mousePosition.y * 3 : "150"}
          r="250"
          fill="url(#spotlightGradient)"
          style={{ transition: "cx 0.1s, cy 0.1s" }}
        />
        <pattern
          id="grid"
          width="120"
          height="120"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 120 0 L 0 0 0 120"
            fill="none"
            stroke="#1e3a5f"
            strokeWidth="1"
          />
        </pattern>
        <rect width="1200" height="300" fill="url(#grid)" opacity="0.5" />
        <g className="network-connections">
          <path
            d="M480 80 L 550 80 L 650 110 L 750 80 L 850 110 L 900 130 L 820 150 L 700 130 L 600 160 L 500 140 L 480 80"
            stroke="#3b82f6"
            strokeWidth="2"
            fill="none"
            opacity={isHovered ? "0.9" : "0.6"}
          >
            <animate
              attributeName="opacity"
              values="0.6;0.9;0.6"
              dur="3s"
              repeatCount="indefinite"
            />
          </path>

          {/* Network pulse animation */}
          <circle cx="600" cy="160" r="2" fill="#60a5fa">
            <animate
              attributeName="r"
              values="2;20;2"
              dur="4s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="1;0;1"
              dur="4s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
        <g className="network-nodes">
          {[
            { cx: 480, cy: 80, delay: 0 },
            { cx: 550, cy: 80, delay: 0.3 },
            { cx: 650, cy: 110, delay: 0.6 },
            { cx: 750, cy: 80, delay: 0.9 },
            { cx: 850, cy: 110, delay: 1.2 },
            { cx: 900, cy: 130, delay: 1.5 },
            { cx: 820, cy: 150, delay: 1.8 },
            { cx: 700, cy: 130, delay: 2.1 },
            { cx: 600, cy: 160, delay: 2.4 },
            { cx: 500, cy: 140, delay: 2.7 },
          ].map((dot, index) => (
            <circle
              key={index}
              cx={dot.cx}
              cy={dot.cy}
              r={isHovered ? "8" : "6"}
              fill="#3b82f6"
              style={{ transition: "r 0.3s ease" }}
            >
              <animate
                attributeName="r"
                values="5;7;5"
                dur="2s"
                repeatCount="indefinite"
                begin={`${dot.delay}s`}
              />
              <animate
                attributeName="fill"
                values="#3b82f6;#60a5fa;#3b82f6"
                dur="3s"
                repeatCount="indefinite"
                begin={`${dot.delay}s`}
              />
            </circle>
          ))}
        </g>

        <defs>
          <filter
            id="enhancedGlow"
            x="-30%"
            y="-30%"
            width="160%"
            height="160%"
          >
            <feGaussianBlur stdDeviation="15" result="blur" />
            <feFlood floodColor="#3b82f6" result="glowColor" />
            <feComposite
              in="glowColor"
              in2="blur"
              operator="in"
              result="softGlow"
            />
            <feComposite in="SourceGraphic" in2="softGlow" operator="over" />
          </filter>
        </defs>

        <text
          x="600"
          y="130"
          fontFamily="Arial, sans-serif"
          fontSize={isMobile ? "60" : "90"}
          fontWeight="bold"
          textAnchor="middle"
          fill="#60a5fa"
          filter="url(#enhancedGlow)"
        >
          TechLite
          <animate
            attributeName="opacity"
            values="0.9;1;0.9"
            dur="3s"
            repeatCount="indefinite"
          />
        </text>

        <text
          x="600"
          y="200"
          fontFamily="Arial, sans-serif"
          fontSize={isMobile ? "24" : "36"}
          fontWeight="bold"
          textAnchor="middle"
          fill="#f8fafc"
          opacity={isHovered ? "1" : "0.9"}
          style={{ transition: "opacity 0.3s ease" }}
        >
          We sell Handphone and Electronics
        </text>
        <g>
          <rect
            x={isMobile ? "425" : "400"}
            y="230"
            width={isMobile ? "350" : "400"}
            height="40"
            rx="20"
            fill="#0c4a6e"
            opacity={isHovered ? "0.7" : "0.5"}
            style={{ transition: "opacity 0.3s ease" }}
          />
          <text
            x="600"
            y="258"
            fontFamily="Arial, sans-serif"
            fontSize={isMobile ? "20" : "26"}
            textAnchor="middle"
            fill="#cbd5e1"
          >
            with good price
          </text>
        </g>
        <path
          d="M350,130 C400,110 450,150 500,130 S550,90 600,100 S650,120 700,100 S750,70 800,90 S850,120 900,110"
          stroke="#0ea5e9"
          strokeWidth="3"
          fill="none"
          opacity="0.3"
          strokeDasharray="5,5"
        >
          <animate
            attributeName="d"
            values="M350,130 C400,110 450,150 500,130 S550,90 600,100 S650,120 700,100 S750,70 800,90 S850,120 900,110;
                   M350,140 C400,120 450,140 500,120 S550,100 600,110 S650,130 700,110 S750,80 800,100 S850,130 900,120;
                   M350,130 C400,110 450,150 500,130 S550,90 600,100 S650,120 700,100 S750,70 800,90 S850,120 900,110"
            dur="15s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
    </div>
  );
};

export default EnhancedTechEliteBanner;
