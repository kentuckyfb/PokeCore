// components/MicroInteractions.tsx
'use client';
import React from 'react';
import { motion } from 'framer-motion';

// Animated indicator dot
export const AnimatedDot: React.FC<{ color: string; delay?: number }> = ({ color, delay = 0 }) => {
  return (
    <motion.span
      className="inline-block w-2 h-2 mr-2 rounded-full flex-shrink-0" // Added flex-shrink-0
      style={{ backgroundColor: color }}
      animate={{
        scale: [1, 1.6, 1], // Pulse effect: normal -> larger -> normal
        opacity: [0.7, 1, 0.7] // Fade in/out slightly during pulse
      }}
      transition={{
        duration: 1.8, // Duration of one pulse cycle
        repeat: Infinity, // Repeat indefinitely
        repeatType: "loop", // Loop the animation
        ease: "easeInOut", // Smooth easing
        delay: delay // Optional delay before starting
      }}
    />
  );
};

// You can add other micro-interaction components here later if needed
// e.g., export const Sparkles = ...

// Optional default export if this is the only component for now
// export default AnimatedDot;