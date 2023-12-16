import React from 'react';
import styled from 'styled-components';

const NodeWrapper = styled.div`
  width: 20px;
  height: 20px;
  border: 1px solid #ccc;
  background-color: ${(props) =>
    props.isStart ? 'green' : props.isFinish ? 'red' : props.isWall ? 'black' : 'white'};
  &.visited {
    background-color: yellow;
  }
  &.shortest-path {
    background-color: blue;
  }
`;

const Node = ({ isStart, isFinish, isWall, isVisited, isShortestPath }) => {
  return (
    <NodeWrapper
      className={`node ${isVisited ? 'visited' : ''} ${isShortestPath ? 'shortest-path' : ''}`}
      isStart={isStart}
      isFinish={isFinish}
      isWall={isWall}
    />
  );
};

export default Node;
