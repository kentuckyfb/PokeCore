# Pokémon Card Explorer

An interactive web application built with Next.js, TypeScript, and Tailwind CSS that displays Pokémon information in a card format with interactive elements.

![image](https://github.com/user-attachments/assets/a21723e9-9e0c-49a9-a139-9007869ee3e9)

## Features

- Interactive Pokémon card with flip animation
- Bento box layout with additional Pokémon information
- Search functionality to find any Pokémon by name or ID
- Random Pokémon generator
- Responsive design with micro-interactions
- Color scheme that adapts to Pokémon type
- Built with Next.js, TypeScript, and Tailwind CSS

## Setup Instructions

### Prerequisites

- Node.js (v16.8 or higher)
- npm or yarn

### Installation

1. Clone this repository:
```bash
git clone https://github.com/yourusername/pokemon-card-explorer.git
cd pokemon-card-explorer
```

2. Install dependencies:
```bash
# Using npm with legacy peer deps to avoid potential dependency conflicts
npm install --legacy-peer-deps

# OR using specific compatible versions
npm install -D tailwindcss@latest postcss@^8.4.0 autoprefixer@^10.4.0
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
pokemon-card-explorer/
├── app/                  # Next.js app directory
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout component
│   └── page.tsx          # Main page component
├── components/           # React components
│   ├── BentoBoxes.tsx    # Bento box components for additional info
│   ├── Footer.tsx        # Footer component
│   ├── Header.tsx        # Header with search functionality
│   └── PokemonCard.tsx   # Main Pokémon card component
├── types/                # TypeScript types
│   └── pokemon.ts        # Pokémon-related type definitions
├── utils/                # Utility functions
│   └── pokemonApi.ts     # Functions for working with PokeAPI
├── tailwind.config.js    # Tailwind CSS configuration
└── README.md             # Project documentation
```

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [PokeAPI](https://pokeapi.co/) - Pokémon data API

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [PokeAPI Documentation](https://pokeapi.co/docs/v2)

## License

This project is licensed under the MIT License.
