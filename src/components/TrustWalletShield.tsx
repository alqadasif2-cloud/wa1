import React from 'react';

interface TrustWalletShieldProps {
  className?: string;
  size?: number;
}

export const TrustWalletShield: React.FC<TrustWalletShieldProps> = ({ 
  className = "w-10 h-10", 
  size = 40 
}) => {
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_0_12px_rgba(16,185,129,0.35)]"
      >
        <defs>
          {/* Left facet gradient: Deep cobalt to vibrant royal blue */}
          <linearGradient id="shieldLeftGrad" x1="20" y1="20" x2="60" y2="105" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="50%" stopColor="#1D4ED8" />
            <stop offset="100%" stopColor="#0B2384" />
          </linearGradient>

          {/* Right facet gradient: Electric cyan to bright emerald green */}
          <linearGradient id="shieldRightGrad" x1="60" y1="20" x2="100" y2="105" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="45%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>

          {/* Subtle top edge highlight */}
          <linearGradient id="shieldHighlight" x1="20" y1="25" x2="100" y2="25" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#34D399" stopOpacity="0.8" />
          </linearGradient>

          {/* Inner ambient glow */}
          <radialGradient id="centerGlow" cx="60" cy="55" r="45" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient back aura */}
        <circle cx="60" cy="60" r="48" fill="url(#centerGlow)" />

        {/* Outer Shield Shell: Left Facet */}
        <path
          d="M 60 18 
             L 24 33 
             C 24 33 24 72 60 102 
             L 60 18 Z"
          fill="url(#shieldLeftGrad)"
        />

        {/* Outer Shield Shell: Right Facet */}
        <path
          d="M 60 18 
             L 96 33 
             C 96 33 96 72 60 102 
             L 60 18 Z"
          fill="url(#shieldRightGrad)"
        />

        {/* Center Crease / Spine Highlight */}
        <line
          x1="60"
          y1="18"
          x2="60"
          y2="101"
          stroke="#FFFFFF"
          strokeOpacity="0.25"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Crisp Top Rim Light */}
        <path
          d="M 24 33 L 60 18 L 96 33"
          stroke="url(#shieldHighlight)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Bottom Tip Rim */}
        <path
          d="M 26 50 C 30 75 60 102 60 102 C 60 102 90 75 94 50"
          stroke="#38BDF8"
          strokeOpacity="0.2"
          strokeWidth="1"
          fill="none"
        />
      </svg>
    </div>
  );
};
