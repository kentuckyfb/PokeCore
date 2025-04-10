// components/PokemonRelationshipGraph.tsx
import React, { useState, useEffect, useCallback } from 'react';
// --- CORRECTED IMPORT ---
import { // Use curly braces for named imports
  ReactFlow, // Moved inside {}
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  Connection,
  Position,
  MarkerType,
  NodeTypes,
  useReactFlow, // Keep if used
  ReactFlowProvider // Import Provider if hooks like useReactFlow are used INSIDE this component
} from '@reactflow/core';
// --- END CORRECTION ---
import { Background } from '@reactflow/background';
import { Controls } from '@reactflow/controls';

import { Pokemon, PokemonSpecies } from '../types/pokemon';
import { getTypeColor, capitalize } from '../utils/pokemonApi';

interface PokemonRelationshipGraphProps {
  pokemon: Pokemon;
  species: PokemonSpecies;
  loadPokemon?: (nameOrId: string | number) => void; // Optional, for clicking related pokemon
  // Add functions for clicking types/abilities if needed
  onTypeClick?: (typeName: string) => void;
  onAbilityClick?: (abilityName: string) => void;
}

// --- Node Data Structures ---
interface PokemonNodeData {
  label: string;
  image?: string;
  typeColor: string;
}
interface TypeNodeData {
  label: string;
  color: string;
}
interface AbilityNodeData {
  label: string;
  isHidden: boolean;
}

// --- Define Node and Edge Types ---
// Using default nodes for now, can be extended with custom components
type AppNode = Node<PokemonNodeData | TypeNodeData | AbilityNodeData>;
type AppEdge = Edge;



// --- Component ---
const PokemonRelationshipGraph: React.FC<PokemonRelationshipGraphProps> = ({
  pokemon, species, loadPokemon, onTypeClick, onAbilityClick
}) => {
  const [nodes, setNodes] = useState<AppNode[]>([]);
  const [edges, setEdges] = useState<AppEdge[]>([]);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  // --- Generate Nodes and Edges from Pokemon Data ---
  useEffect(() => {
    const newNodes: AppNode[] = [];
    const newEdges: AppEdge[] = [];
    const typeColor = getTypeColor(pokemon.types[0].type.name);
    const centerNodeId = `pokemon-${pokemon.id}`;

    // 1. Central Pokemon Node
    newNodes.push({
      id: centerNodeId,
      type: 'default', // Could be a custom 'pokemonNode' later
      position: { x: 0, y: 0 }, // React Flow will auto-layout if positions clash
      data: {
        label: capitalize(pokemon.name),
        image: pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default,
        typeColor: typeColor,
      },
      // Style the node itself
      style: {
         border: `2px solid ${typeColor}`,
         padding: '10px',
         borderRadius: '8px',
         background: 'rgba(40, 40, 40, 0.8)',
         width: 150, // Example fixed width
         textAlign: 'center'
      }
    });

    // Calculate positions for related nodes (simple circle layout)
    const radius = 250;
    const totalRelatedNodes = pokemon.types.length + pokemon.abilities.length;
    let angleIncrement = totalRelatedNodes > 0 ? (2 * Math.PI) / totalRelatedNodes : 0;
    let currentAngle = -Math.PI / 2; // Start at the top

    // 2. Type Nodes
    pokemon.types.forEach((typeInfo) => {
      const typeName = typeInfo.type.name;
      const typeNodeId = `type-${typeName}`;
      const nodeColor = getTypeColor(typeName);
      const posX = radius * Math.cos(currentAngle);
      const posY = radius * Math.sin(currentAngle);

      newNodes.push({
        id: typeNodeId,
        type: 'output', // Use input/output types for semantic connection points
        position: { x: posX, y: posY },
        data: { label: capitalize(typeName), color: nodeColor },
        style: {
          background: nodeColor,
          color: '#fff', // White text usually works well
          border: '1px solid rgba(255,255,255,0.5)',
          borderRadius: '15px',
          padding: '5px 10px',
          fontSize: '12px',
          minWidth: 60,
          textAlign: 'center'
        },
      });
      newEdges.push({
        id: `e-${centerNodeId}-${typeNodeId}`,
        source: centerNodeId,
        target: typeNodeId,
        // type: 'smoothstep', // Different edge types available
        animated: false, // Make edges animated
        style: { stroke: '#aaa' },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#aaa' },
      });
       currentAngle += angleIncrement;
    });

    // 3. Ability Nodes
    pokemon.abilities.forEach((abilityInfo) => {
      const abilityName = abilityInfo.ability.name;
      const abilityNodeId = `ability-${abilityName}`;
       const posX = radius * Math.cos(currentAngle);
       const posY = radius * Math.sin(currentAngle);

      newNodes.push({
        id: abilityNodeId,
        type: 'output',
        position: { x: posX, y: posY },
        data: { label: capitalize(abilityName.replace('-', ' ')), isHidden: abilityInfo.is_hidden },
         style: {
             background: '#4a5568', // Gray for abilities
             color: '#fff',
             border: '1px solid rgba(255,255,255,0.3)',
             borderRadius: '4px',
             padding: '5px 10px',
             fontSize: '12px',
          },
      });
      newEdges.push({
        id: `e-${centerNodeId}-${abilityNodeId}`,
        source: centerNodeId,
        target: abilityNodeId,
        animated: false,
        style: { stroke: '#aaa' },
         markerEnd: { type: MarkerType.ArrowClosed, color: '#aaa' },
      });
      currentAngle += angleIncrement;
    });

    setNodes(newNodes);
    setEdges(newEdges);
  }, [pokemon, species]); // Re-run when Pokemon data changes

  // Handle node clicks (optional)
  const onNodeClick = useCallback((event: React.MouseEvent, node: AppNode) => {
     console.log('Node clicked:', node);
     if (node.id.startsWith('type-') && onTypeClick) {
        onTypeClick(node.data.label.toLowerCase());
     } else if (node.id.startsWith('ability-') && onAbilityClick) {
        onAbilityClick(node.data.label);
     }
     // Could add logic for clicking the central Pokemon node if needed
  }, [onTypeClick, onAbilityClick]);


  
  return (
    <div style={{ height: '100%', width: '100%', minHeight: 400 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        fitView // Prop still works for initial fit
        // Optional: fitViewOptions={{ padding: 0.1 }}
        // ... other props
      >
        {/* UI elements import from their own packages now */}
        <Background color="#555" gap={16} />
        <Controls />
        {/* <MiniMap nodeColor={(n) => n.style?.background || '#eee'} nodeStrokeWidth={3} zoomable pannable /> */}
      </ReactFlow>
    </div>
  );
};

export default PokemonRelationshipGraph;