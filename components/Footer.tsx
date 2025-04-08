// components/Footer.tsx
'use client';
import React from 'react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  return (
    <motion.footer 
      className="py-4 px-4 mt-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <div className="max-w-6xl mx-auto bg-gray-900 bg-opacity-80 backdrop-blur-sm rounded-2xl py-4 px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-400">
        <div className="flex items-center mb-3 sm:mb-0">
          <motion.div 
            whileHover={{ rotate: 360 }}
            transition={{ duration: 1, type: "spring" }}
            className="w-5 h-5 mr-2"
          >
            <div 
              className="w-full h-full rounded-full"
              style={{
                background: "linear-gradient(#ff1a1a 50%, white 50%)",
                border: "1px solid #333"
              }}
            />
          </motion.div>
          <span>Pokémon and its trademarks are © of Nintendo, Game Freak, and The Pokémon Company</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <motion.span 
            className="hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Built with
            <motion.span 
              className="text-red-500 inline-block ml-1"
              animate={{ 
                scale: [1, 1.2, 1],
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                repeatDelay: 2
              }}
            >
              ❤️
            </motion.span>
            using
          </motion.span>
          
          <motion.a
            href="https://pokeapi.co/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            PokéAPI
          </motion.a>
          
          <div className="flex space-x-2">
            <motion.a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-gray-400 hover:text-white transition-colors"
              >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </motion.a>
            
            <motion.a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-gray-400 hover:text-white transition-colors"
              >
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
              </svg>
            </motion.a>
          </div>
        </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;