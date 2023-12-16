import React from 'react';
import styled from 'styled-components';
import Grid from './Grid';

const VisualizerWrapper = styled.div`
  text-align: center;
`;

const PathfindingVisualizer = () => {
  return (
    <VisualizerWrapper>
      <h1>Pathfinding Visualizer</h1>
      <Grid />
    </VisualizerWrapper>
  );
};

export default PathfindingVisualizer;
