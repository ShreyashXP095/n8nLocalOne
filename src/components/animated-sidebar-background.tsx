"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface AnimatedSidebarBackgroundProps {
  className?: string
}

export function AnimatedSidebarBackground({ className }: AnimatedSidebarBackgroundProps) {
  return (
    <div className={cn("absolute inset-0 pointer-events-none select-none z-0 opacity-15", className)}>
      <style>{`
        @keyframes drift-1 {
          0% { transform: translate(0, 0); }
          33% { transform: translate(3px, -2px); }
          66% { transform: translate(-2px, 3px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes drift-2 {
          0% { transform: translate(0, 0); }
          33% { transform: translate(-3px, 2px); }
          66% { transform: translate(2px, -3px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes drift-3 {
          0% { transform: translate(0, 0); }
          33% { transform: translate(2px, 3px); }
          66% { transform: translate(-3px, -2px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }

        .drift-1 { animation: drift-1 6s ease-in-out infinite; }
        .drift-2 { animation: drift-2 8s ease-in-out infinite; }
        .drift-3 { animation: drift-3 7s ease-in-out infinite; }

        .wire { fill: none; stroke: hsl(var(--sidebar-foreground)); opacity: 0.15; stroke-width: 1.5; }
        .port { fill: #1E1E2E; stroke: currentColor; stroke-width: 2; }
        
        /* Specific Node Colors matching the screenshot */
        .n-indigo { fill: #5A5873; opacity: 0.9; }
        .n-green { fill: #5C766A; opacity: 0.9; }
        .n-dark { fill: #3A3A4A; }
      `}</style>
      
      <svg
        className="w-full h-full"
        viewBox="0 0 500 700"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Background Grid Pattern */}
          <pattern id="bg-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="hsl(var(--sidebar-foreground))" opacity="0.08" />
          </pattern>

          {/* Path Definitions so animateMotion can reference them */}
          {/* Top Left Pill to Center Circle */}
          <path id="p1" d="M 180 80 C 220 80 200 150 250 150" />
          {/* Top Right Pill to Center Circle */}
          <path id="p2" d="M 330 80 C 290 80 300 150 250 150" />
          {/* Center Circle to Diamond */}
          <path id="p3" d="M 250 190 C 250 210 250 220 250 240" />
          {/* Diamond to Left Chart Node */}
          <path id="p4" d="M 220 270 C 140 320 180 400 150 420" />
          {/* Diamond to Right Rect Node */}
          <path id="p5" d="M 280 270 C 350 310 320 380 350 380" />
          {/* Right Rect Node to Bottom Target */}
          <path id="p6" d="M 350 420 C 350 480 260 520 250 560" />
          {/* Left Chart Node to Bottom Target */}
          <path id="p7" d="M 150 460 C 150 510 240 520 250 560" />
          {/* Diamond direct to Doc Node */}
          <path id="p8" d="M 250 300 C 250 350 300 480 300 520" />
        </defs>

        {/* Fill Background with Dots */}
        <rect width="100%" height="100%" fill="url(#bg-dots)" />

        {/* --- STATIC WIRES --- */}
        <g className="wire">
          <use href="#p1" />
          <use href="#p2" />
          <use href="#p3" />
          <use href="#p4" />
          <use href="#p5" />
          <use href="#p6" />
          <use href="#p7" />
          <use href="#p8" />
          {/* Unconnected/Extra aesthetic wires */}
          <path d="M 50 150 C 50 250 90 380 90 420" />
          <path d="M 450 150 C 450 350 390 350 390 520" />
          <path d="M 150 460 C 100 550 50 600 50 650" />
          <path d="M 400 480 C 450 550 480 600 480 650" />
        </g>

        {/* --- FLOWING ENERGY DOTS --- */}
        {/* Purple/Indigo Flow */}
        <circle r="4" fill="#818CF8" filter="drop-shadow(0 0 4px #818CF8)">
          <animateMotion dur="30s" repeatCount="indefinite"><mpath href="#p1" /></animateMotion>
        </circle>
        <circle r="3" fill="#818CF8" filter="drop-shadow(0 0 2px #818CF8)">
          <animateMotion dur="30s" repeatCount="indefinite" begin="2s"><mpath href="#p1" /></animateMotion>
        </circle>
        <circle r="4" fill="#818CF8" filter="drop-shadow(0 0 4px #818CF8)">
          <animateMotion dur="30s" repeatCount="indefinite"><mpath href="#p5" /></animateMotion>
        </circle>
        <circle r="3" fill="#818CF8" filter="drop-shadow(0 0 4px #818CF8)">
          <animateMotion dur="30s" repeatCount="indefinite"><mpath href="#p8" /></animateMotion>
        </circle>
        
        {/* Green/Teal Flow */}
        <circle r="4" fill="#34D399" filter="drop-shadow(0 0 4px #34D399)">
          <animateMotion dur="20s" repeatCount="indefinite" begin="1s"><mpath href="#p2" /></animateMotion>
        </circle>
        <circle r="4" fill="#34D399" filter="drop-shadow(0 0 4px #34D399)">
          <animateMotion dur="20s" repeatCount="indefinite"><mpath href="#p4" /></animateMotion>
        </circle>
        <circle r="4" fill="#34D399" filter="drop-shadow(0 0 4px #34D399)">
          <animateMotion dur="20s" repeatCount="indefinite"><mpath href="#p6" /></animateMotion>
        </circle>
        <circle r="4" fill="#34D399" filter="drop-shadow(0 0 4px #34D399)">
          <animateMotion dur="20s" repeatCount="indefinite"><mpath href="#p7" /></animateMotion>
        </circle>

        {/* --- NODES --- */}
        
        {/* Top Left Pill (Indigo) */}
        <g className="drift-1" style={{ transformOrigin: "130px 80px" }}>
          <rect x="80" y="60" width="100" height="40" rx="8" className="n-indigo" />
          <rect x="95" y="70" width="20" height="6" rx="3" fill="#818CF8" />
          <rect x="95" y="82" width="30" height="6" rx="3" fill="#A1A1AA" opacity="0.5" />
          <circle cx="180" cy="80" r="5" className="port" style={{ color: '#818CF8' }} />
        </g>

        {/* Top Right Pill (Green) */}
        <g className="drift-2" style={{ transformOrigin: "380px 80px" }}>
          <rect x="330" y="60" width="100" height="40" rx="8" className="n-green" />
          <circle cx="350" cy="80" r="10" className="n-dark" />
          <circle cx="350" cy="80" r="4" fill="#34D399" />
          <rect x="375" y="77" width="30" height="6" rx="3" fill="#34D399" opacity="0.6" />
          <circle cx="330" cy="80" r="5" className="port" style={{ color: '#34D399' }} />
        </g>

        {/* Central Huge Circle (Indigo) */}
        <g className="drift-3" style={{ transformOrigin: "250px 150px" }}>
          <circle cx="250" cy="150" r="35" className="n-indigo" />
          <circle cx="250" cy="150" r="45" fill="none" stroke="#6C6A8F" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="250" cy="150" r="20" className="n-dark" opacity="0.5" />
          <circle cx="250" cy="150" r="10" fill="#818CF8" />
          <circle cx="250" cy="185" r="5" className="port" style={{ color: '#818CF8' }} />
        </g>

        {/* Mid Diamond (Indigo) */}
        <g className="drift-1" style={{ transformOrigin: "250px 270px" }}>
          <path d="M 250 240 L 280 270 L 250 300 L 220 270 Z" className="n-indigo" />
          <rect x="240" y="265" width="20" height="4" rx="2" fill="#A1A1AA" />
          <rect x="242" y="273" width="16" height="4" rx="2" fill="#A1A1AA" opacity="0.5" />
          <circle cx="250" cy="240" r="4" className="port" style={{ color: '#818CF8' }} />
          <circle cx="220" cy="270" r="4" className="port" style={{ color: '#34D399' }} />
          <circle cx="280" cy="270" r="4" className="port" style={{ color: '#818CF8' }} />
          <circle cx="250" cy="300" r="4" className="port" style={{ color: '#818CF8' }} />
        </g>

        {/* Hexagon Right */}
        <g className="drift-2" style={{ transformOrigin: "400px 270px" }}>
          <path d="M 370 250 L 410 250 L 430 270 L 410 290 L 370 290 L 350 270 Z" className="n-indigo" />
          <circle cx="390" cy="270" r="12" className="n-dark" />
          <circle cx="390" cy="270" r="3" fill="#818CF8" />
          <circle cx="350" cy="270" r="4" className="port" style={{ color: '#818CF8' }} />
        </g>

        {/* Large Chart Node Left (Green) */}
        <g className="drift-3" style={{ transformOrigin: "140px 440px" }}>
          <rect x="100" y="420" width="100" height="40" rx="8" className="n-green" />
          {/* Chart Bars */}
          <rect x="110" y="435" width="8" height="15" rx="3" fill="#34D399" />
          <rect x="125" y="430" width="8" height="20" rx="3" fill="#34D399" opacity="0.8" />
          <rect x="140" y="425" width="8" height="25" rx="3" fill="#34D399" opacity="0.6" />
          <rect x="155" y="435" width="8" height="15" rx="3" fill="#34D399" opacity="0.4" />
          <rect x="170" y="438" width="8" height="12" rx="3" fill="#34D399" opacity="0.3" />
          <circle cx="150" cy="420" r="4" className="port" style={{ color: '#34D399' }} />
          <circle cx="150" cy="460" r="4" className="port" style={{ color: '#34D399' }} />
        </g>

        {/* Large Profile/Doc Node Right (Indigo) */}
        <g className="drift-1" style={{ transformOrigin: "350px 400px" }}>
          <rect x="300" y="380" width="100" height="40" rx="8" className="n-indigo" />
          <circle cx="320" cy="400" r="10" className="n-dark" />
          <circle cx="320" cy="400" r="3" fill="#818CF8" />
          <rect x="340" y="390" width="35" height="4" rx="2" fill="#818CF8" />
          <rect x="340" y="398" width="45" height="4" rx="2" fill="#A1A1AA" opacity="0.6" />
          <rect x="340" y="406" width="30" height="4" rx="2" fill="#A1A1AA" opacity="0.6" />
          <circle cx="350" cy="380" r="4" className="port" style={{ color: '#818CF8' }} />
          <circle cx="350" cy="420" r="4" className="port" style={{ color: '#818CF8' }} />
        </g>

        {/* Folded Doc Node Middle (Indigo) */}
        <g className="drift-2" style={{ transformOrigin: "300px 500px" }}>
          <path d="M 280 480 L 310 480 L 320 490 L 320 540 L 270 540 L 270 490 Z" className="n-indigo" />
          <rect x="280" y="500" width="20" height="4" rx="2" fill="#A1A1AA" opacity="0.8" />
          <rect x="280" y="510" width="30" height="4" rx="2" fill="#A1A1AA" opacity="0.8" />
          <rect x="280" y="520" width="15" height="4" rx="2" fill="#A1A1AA" opacity="0.8" />
          <circle cx="300" cy="480" r="4" className="port" style={{ color: '#818CF8' }} />
          <circle cx="300" cy="540" r="4" className="port" style={{ color: '#818CF8' }} />
        </g>

        {/* Large Green Circle Node (Bottom Left) */}
        <g className="drift-1" style={{ transformOrigin: "200px 520px" }}>
           <circle cx="200" cy="520" r="25" className="n-green" />
           <circle cx="200" cy="520" r="8" fill="#34D399" />
           <circle cx="200" cy="520" r="32" fill="none" stroke="#5C766A" strokeWidth="1" />
           <circle cx="200" cy="545" r="4" className="port" style={{ color: '#34D399' }} />
        </g>

        {/* Small Disconnected Nodes */}
        <g className="drift-3">
          {/* Small Green Square Left */}
          <rect x="50" y="190" width="30" height="30" rx="6" className="n-green" />
          <rect x="60" y="200" width="10" height="10" rx="2" fill="#34D399" opacity="0.6" />
          
          {/* Small Indigo Square Right */}
          <rect x="420" y="150" width="30" height="30" rx="6" className="n-indigo" />
          <rect x="425" y="160" width="20" height="3" rx="1" fill="#818CF8" opacity="0.6" />
          <rect x="425" y="167" width="15" height="3" rx="1" fill="#818CF8" opacity="0.6" />

          {/* Hex Right Target Node */}
          <path d="M 400 520 L 440 520 L 450 540 L 440 560 L 400 560 L 390 540 Z" className="n-indigo" />
          <circle cx="420" cy="540" r="3" fill="#818CF8" opacity="0.5" />
          
          {/* Green Circle target left bottom */}
          <circle cx="80" cy="420" r="18" className="n-green" />
          <circle cx="80" cy="420" r="3" fill="#34D399" />
          <circle cx="80" cy="420" r="24" fill="none" stroke="#5C766A" strokeDasharray="3 3" />
        </g>

        {/* Final Bottom Target Node (Indigo Pill) */}
        <g className="drift-2" style={{ transformOrigin: "250px 580px" }}>
          <rect x="200" y="560" width="100" height="30" rx="15" className="n-indigo" />
          <circle cx="250" cy="575" r="5" fill="#818CF8" />
          <circle cx="250" cy="560" r="4" className="port" style={{ color: '#818CF8' }} />
        </g>

      </svg>
    </div>
  )
}
