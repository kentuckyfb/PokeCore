// components/MicroInteractions.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Sparkle component for decorative animations
export const Sparkles: React.FC<{ color?: string; count?: number; size?: number; duration?: number }> = ({
  color = '#ffffff',
  count = 20,
  size = 3,
  duration = 2,
}) => {
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([]);

  useEffect(() => {
    const newSparkles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * size + 1,
      delay: Math.random() * duration,
    }));
    setSparkles(newSparkles);
  }, [count, size, duration]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            top: `${sparkle.y}%`,
            left: `${sparkle.x}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            backgroundColor: color,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0]
          }}
          transition={{ 
            duration: duration,
            delay: sparkle.delay,
            repeat: Infinity,
            repeatDelay: Math.random() * 2
          }}
        />
      ))}
    </div>
  );
};

// Animated indicator dot
export const AnimatedDot: React.FC<{ color: string; delay?: number }> = ({ color, delay = 0 }) => {
  return (
    <motion.span 
      className="inline-block w-2 h-2 rounded-full"
      style={{ backgroundColor: color }}
      animate={{ 
        scale: [1, 1.5, 1],
        opacity: [0.7, 1, 0.7]
      }}
      transition={{ 
        duration: 1.5, 
        repeat: Infinity,
        repeatType: "reverse",
        delay: delay
      }}
    />
  );
};

// Animated loader
export const PokeballLoader: React.FC<{ size?: number; message?: string }> = ({ 
  size = 50,
  message = "Loading..." 
}) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <motion.div
          className="w-full h-full rounded-full"
          style={{
            background: "linear-gradient(#ff1a1a 50%, white 50%)",
            border: "5px solid #333"
          }}
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-white border-4 border-gray-800 z-10"
          style={{
            width: size / 3,
            height: size / 3
          }}
          animate={{
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 1,
            repeat: Infinity
          }}
        />
      </div>
      {message && <p className="mt-4 text-sm text-gray-300">{message}</p>}
    </div>
  );
};

// Hover card effect
export const HoverCard: React.FC<{ children: React.ReactNode; color?: string }> = ({ 
  children, 
  color = '#FF5350' 
}) => {
  return (
    <motion.div
      className="relative rounded-xl overflow-hidden"
      whileHover={{ 
        scale: 1.05,
        boxShadow: `0 10px 25px rgba(0, 0, 0, 0.2), 0 0 15px ${color}33`
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {children}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white opacity-10" />
        <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: color }} />
      </motion.div>
    </motion.div>
  );
};

// Pulsing effect for highlighting important elements
export const PulseHighlight: React.FC<{ children: React.ReactNode; color?: string; delay?: number }> = ({ 
  children, 
  color = 'rgba(255, 255, 255, 0.1)',
  delay = 0
}) => {
  return (
    <div className="relative">
      <motion.div
        className="absolute inset-0 rounded-lg"
        style={{ backgroundColor: color }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ 
          opacity: [0, 0.7, 0],
          scale: [0.95, 1.05, 0.95]
        }}
        transition={{
          duration: 2,
          delay,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

// Interactive tooltip
export const Tooltip: React.FC<{ children: React.ReactNode; text: string }> = ({ children, text }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="absolute bottom-full mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
          >
            {text}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// TypeBadge for Pokémon types with hover effects
export const TypeBadge: React.FC<{ type: string; color: string }> = ({ type, color }) => {
  return (
    <motion.span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ 
        backgroundColor: `${color}66`,
        color: 'white',
        textShadow: '0 1px 2px rgba(0,0,0,0.5)'
      }}
      whileHover={{ 
        scale: 1.1, 
        backgroundColor: color,
      }}
      transition={{ duration: 0.2 }}
    >
      {type}
    </motion.span>
  );
};

// Export all components
export default {
  Sparkles,
  AnimatedDot,
  PokeballLoader,
  HoverCard,
  PulseHighlight,
  Tooltip,
  TypeBadge
};