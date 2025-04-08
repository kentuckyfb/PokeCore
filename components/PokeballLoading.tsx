// components/PokeballLoading.tsx
'use client';
import React from 'react';
import { motion } from 'framer-motion';

const PokeballLoading: React.FC<{ size?: number; message?: string }> = ({ 
  size = 60, 
  message = "Loading Pokémon data..." 
}) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Top half (red) */}
        <motion.div
          className="absolute top-0 left-0 right-0"
          style={{ 
            height: size / 2, 
            backgroundColor: "#ff1a1a",
            borderTopLeftRadius: size / 2,
            borderTopRightRadius: size / 2,
            borderTop: `${size/12}px solid #333`,
            borderLeft: `${size/12}px solid #333`,
            borderRight: `${size/12}px solid #333`,
          }}
          animate={{ rotateZ: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Bottom half (white) */}
        <motion.div
          className="absolute bottom-0 left-0 right-0"
          style={{ 
            height: size / 2, 
            backgroundColor: "white",
            borderBottomLeftRadius: size / 2,
            borderBottomRightRadius: size / 2,
            borderBottom: `${size/12}px solid #333`,
            borderLeft: `${size/12}px solid #333`,
            borderRight: `${size/12}px solid #333`,
          }}
          animate={{ rotateZ: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Middle line */}
        <div
          className="absolute"
          style={{
            top: (size / 2) - (size / 24),
            left: 0,
            right: 0,
            height: size / 12,
            backgroundColor: "#333",
            zIndex: 2
          }}
        />
        
        {/* Center button */}
        <motion.div
          className="absolute rounded-full bg-white border-gray-800 z-10"
          style={{
            top: size / 2 - size / 7,
            left: size / 2 - size / 7,
            width: size / 3.5,
            height: size / 3.5,
            border: `${size/20}px solid #333`,
            boxShadow: '0 0 0 2px rgba(255,255,255,0.3)'
          }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>
      {message && (
        <motion.p 
          className="mt-4 text-sm text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {message}
        </motion.p>
      )}
    </div>
  );
};

export default PokeballLoading;