// components/Footer.tsx
'use client';
import React from 'react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  return (
    // REMOVED bg-gray-950 from here
    <motion.footer
      className="py-4 px-4 mt-auto" // Ensure mt-auto pushes footer down
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      {/* This inner div provides the floating, blurred background */}
      <div className="max-w-6xl mx-auto bg-gray-900 bg-opacity-75 backdrop-blur-lg rounded-2xl py-4 px-6 border border-gray-700/50 shadow-lg">
         {/* Slightly increased blur, reduced opacity, lighter border, added shadow */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-400 gap-4"> {/* Added gap */}
          <div className="flex items-center text-center sm:text-left">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 1, type: "spring", stiffness: 100 }}
              className="w-5 h-5 mr-2 flex-shrink-0" // Added flex-shrink-0
            >
              <div
                className="w-full h-full rounded-full"
                style={{ background: "linear-gradient(#ff1a1a 50%, white 50%)", border: "1px solid #333" }}
              />
            </motion.div>
            <span>Pokémon data via PokéAPI. Pokémon and related trademarks are © Nintendo, Game Freak, The Pokémon Company.</span>
             {/* Slightly rephrased for clarity */}
          </div>

          <div className="flex items-center space-x-4 flex-shrink-0"> {/* Added flex-shrink-0 */}
            <motion.a
              href="https://pokeapi.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-200 transition-colors duration-150 font-medium" // Made link slightly bolder/brighter on hover
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              PokéAPI
            </motion.a>

            <div className="flex space-x-3"> {/* Increased spacing slightly */}
              {/* GitHub Icon */}
              <motion.a
                href="https://github.com/your-repo" // TODO: Add your actual repo link
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, y: -2, color: '#FFFFFF' }} // Lift and brighten on hover
                whileTap={{ scale: 0.9 }}
                className="text-gray-500 hover:text-white transition-colors duration-150"
                title="View Source on GitHub"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"> {/* Changed to fill */}
                   <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </motion.a>

              {/* Optional: Twitter Icon */}
              <motion.a
                href="https://twitter.com/your-profile" // TODO: Add your actual profile link
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, y: -2, color: '#1DA1F2' }} // Lift and color on hover
                whileTap={{ scale: 0.9 }}
                className="text-gray-500 hover:text-blue-400 transition-colors duration-150"
                title="Follow on Twitter"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"> {/* Changed to fill */}
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-.424.728-.666 1.631-.666 2.601 0 1.715.873 3.229 2.201 4.114-.81-.026-1.566-.247-2.229-.616v.054c0 2.395 1.703 4.381 3.951 4.83-.414.112-.85.172-1.296.172-.316 0-.622-.031-.921-.086.63 1.952 2.445 3.377 4.604 3.417-1.69 1.319-3.829 2.105-6.146 2.105-.4 0-.792-.023-1.175-.068 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.502 13.999-13.986 0-.213-.005-.426-.015-.637.961-.695 1.797-1.562 2.457-2.549z"/>
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