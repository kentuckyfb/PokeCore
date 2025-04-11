// components/StatRadarChart.tsx (Ensure this is the latest version)
import React from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip
} from 'recharts';
import { Pokemon } from '../types/pokemon';
import { formatStatName } from '../utils/pokemonApi';

interface StatRadarChartProps {
  pokemon: Pokemon;
  typeColor: string;
}

interface RadarStatData {
  subject: string;
  value: number;
  fullMark: number;
}

const StatRadarChart: React.FC<StatRadarChartProps> = ({ pokemon, typeColor }) => {
  const radarData: RadarStatData[] = pokemon.stats.map(statInfo => ({
    subject: formatStatName(statInfo.stat.name),
    value: statInfo.base_stat,
    fullMark: 255, // Max possible base stat for scaling
  }));

  if (pokemon.stats.length === 0) {
      return <p className="text-xs text-gray-400 text-center p-2">No stat data available.</p>;
  }

  return (
    // Using 100% height to fit parent container
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart
        cx="50%"
        cy="50%"
        outerRadius="70%" // Adjust this value to fit the chart visually
        data={radarData}
      >
        <PolarGrid stroke="#444" />
        <PolarAngleAxis
          dataKey="subject"
          stroke="#aaa"
          tickLine={false}
          fontSize={10} // Adjust font size if labels are too big
        />
        {/* PolarRadiusAxis removed for less clutter */}
        <Radar
          name={pokemon.name}
          dataKey="value"
          stroke={typeColor}
          fill={typeColor}
          fillOpacity={0.6}
        />
        <Tooltip
           contentStyle={{ backgroundColor: 'rgba(30, 30, 30, 0.9)', border: `1px solid ${typeColor}`, borderRadius: '5px', padding: '5px 8px' }}
           labelStyle={{ color: '#eee', fontWeight: 'bold', fontSize: '12px', marginBottom: '3px' }}
           itemStyle={{ color: typeColor, fontSize: '11px' }}
           wrapperStyle={{ zIndex: 1000 }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default StatRadarChart;