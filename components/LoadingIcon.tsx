// components/LoadingIcon.tsx
'use client';
import React from 'react';
import { motion } from 'framer-motion';

interface LoadingIconProps {
  size?: number;
  message?: string;
}

const LoadingIcon: React.FC<LoadingIconProps> = ({ size = 50, message }) => {
  const halfSize = size / 2;
  const borderSize = Math.max(1, Math.floor(size / 12)); // Scale border with size
  const centerButtonSize = size / 3.5;
  const centerButtonBorderSize = Math.max(1, Math.floor(size / 20));
  const centerDotSize = centerButtonSize / 2.5;

  return (
    <div className="flex flex-col items-center justify-center" aria-label={message || 'Loading content'}>
      <motion.div
        className="relative"
        style={{ width: size, height: size }}
        // Animation: Subtle wobble and bounce
        animate={{
          rotate: [-3, 3, -3],
          y: [-1, 1, -1]
        }}
        transition={{
          duration: 1.0, // Slightly faster wobble
          repeat: Infinity,
          repeatType: 'mirror', // Smooth back-and-forth
          ease: 'easeInOut',
        }}
      >
        {/* Top Red Half */}
        <div
          className="absolute top-0 left-0 right-0 bg-[#ff1a1a]" // Standard red
          style={{
            height: halfSize,
            borderTopLeftRadius: halfSize,
            borderTopRightRadius: halfSize,
            border: `${borderSize}px solid #333`, // Black border
            borderBottom: 'none', // Avoid double border in middle
          }}
        />
        {/* Bottom White Half */}
        <div
          className="absolute bottom-0 left-0 right-0 bg-white"
          style={{
            height: halfSize,
            borderBottomLeftRadius: halfSize,
            borderBottomRightRadius: halfSize,
            border: `${borderSize}px solid #333`, // Black border
            borderTop: 'none', // Avoid double border
          }}
        />
        {/* Center Black Band */}
        <div
          className="absolute left-0 right-0 bg-[#333]" // Black band
          style={{
            top: `calc(50% - ${borderSize}px)`, // Position band correctly
            height: borderSize * 2,
            zIndex: 1, // Above halves
          }}
        />
        {/* Center White Button Outline */}
        <div
          className="absolute rounded-full bg-white border-[#333]"
          style={{
            top: `calc(50% - ${centerButtonSize / 2}px)`,
            left: `calc(50% - ${centerButtonSize / 2}px)`,
            width: centerButtonSize,
            height: centerButtonSize,
            borderWidth: `${centerButtonBorderSize}px`,
            zIndex: 2, // Above band
          }}
        />
        {/* Center Button Inner Dot (Pulsing) */}
         <motion.div
          className="absolute rounded-full bg-[#333]" // Inner dot
          style={{
            top: `calc(50% - ${centerDotSize / 2}px)`,
            left: `calc(50% - ${centerDotSize / 2}px)`,
            width: centerDotSize,
            height: centerDotSize,
            zIndex: 3, // On very top
          }}
          // Animation: Subtle pulse
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Optional Loading Message */}
      {message && (
        <motion.p
          className="mt-4 text-sm text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {message}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingIcon;