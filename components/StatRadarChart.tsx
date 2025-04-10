// components/StatRadarChart.tsx
import React from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip
} from 'recharts';
import { Pokemon } from '../types/pokemon';
import { formatStatName } from '../utils/pokemonApi'; // Assuming you have this utility

interface StatRadarChartProps {
  pokemon: Pokemon;
  typeColor: string; // Pass the main type color for styling
}

// Define the structure recharts expects
interface RadarStatData {
  subject: string; // Stat name (e.g., 'HP')
  value: number;   // The base stat value
  fullMark: number; // The maximum possible value for scaling (e.g., 255)
}

const StatRadarChart: React.FC<StatRadarChartProps> = ({ pokemon, typeColor }) => {
  // Transform Pokemon stats into the format recharts needs
  const radarData: RadarStatData[] = pokemon.stats.map(statInfo => ({
    subject: formatStatName(statInfo.stat.name), // Use your formatted name
    value: statInfo.base_stat,
    fullMark: 255, // Max base stat theoretically possible
  }));

  // Ensure we have 6 stats for a standard radar chart
  if (radarData.length !== 6) {
     // Handle cases where data might be incomplete, maybe show a message or default
     console.warn("Pokemon data missing expected 6 stats for radar chart.");
     // You might want to return null or a placeholder here
     // return <p className="text-xs text-gray-400">Stat data incomplete for radar chart.</p>;
  }

  return (
    // ResponsiveContainer makes the chart fill its parent
    <ResponsiveContainer width="100%" height={250}>
      <RadarChart
        cx="50%" // Center horizontally
        cy="50%" // Center vertically
        outerRadius="80%" // How far the chart extends
        data={radarData}
      >
        {/* Grid lines */}
        <PolarGrid stroke="#555" />

        {/* Labels around the chart (stat names) */}
        <PolarAngleAxis
          dataKey="subject"
          stroke="#ccc" // Color of the labels
          tickLine={false} // Hide lines extending from labels
          fontSize={12}
        />

        {/* Optional: Radial axis numbers (comment out if too cluttered) */}
        {/* <PolarRadiusAxis angle={30} domain={[0, 255]} stroke="#555" fontSize={10} /> */}

        {/* The actual radar area */}
        <Radar
          name={pokemon.name} // For tooltip
          dataKey="value"      // The key in radarData holding the stat value
          stroke={typeColor}   // Outline color
          fill={typeColor}     // Fill color
          fillOpacity={0.6}    // Make fill semi-transparent
        />

        {/* Tooltip on hover */}
        <Tooltip
           contentStyle={{ backgroundColor: 'rgba(40, 40, 40, 0.8)', border: `1px solid ${typeColor}`, borderRadius: '8px' }}
           labelStyle={{ color: '#fff', fontWeight: 'bold' }}
           itemStyle={{ color: typeColor }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default StatRadarChart;