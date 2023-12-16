import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Node from './Node';


const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(30, 20px);
  gap: 1px;
`;

const ProgressBar = styled.div`
  margin-top: 10px;
  width: 100%;
  height: 20px;
  background-color: #eee;
  position: relative;
`;

const ProgressFiller = styled.div`
  height: 100%;
  width: ${(props) => props.progress}%;
  background-color: #4caf50;
`;

const Grid = () => {
  const [nodes, setNodes] = useState([]);
  const [startNode, setStartNode] = useState(null);
  const [finishNode, setFinishNode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    initializeGrid();
  }, []);

  const initializeGrid = () => {
    const initialNodes = Array.from({ length: 900 }, (_, index) => ({
      id: index,
      row: Math.floor(index / 30),
      col: index % 30,
      isStart: index === 10,
      isFinish: index === 890,
      isWall: Math.random() < 0.2,
      distance: Infinity,
      isVisited: false,
      previousNode: null,
      color: '',
      isShortestPath: false,
    }));

    setNodes(initialNodes);
    setStartNode(initialNodes.find((node) => node.isStart));
    setFinishNode(initialNodes.find((node) => node.isFinish));
  };

  const dijkstra = () => {
    const visitedNodesInOrder = [];
    const unvisitedNodes = nodes.slice();
    startNode.distance = 0;

    while (unvisitedNodes.length) {
      unvisitedNodes.sort((a, b) => a.distance - b.distance);
      const closestNode = unvisitedNodes.shift();

      if (closestNode.isWall) continue;

      if (closestNode.distance === Infinity) return visitedNodesInOrder;

      closestNode.isVisited = true;
      visitedNodesInOrder.push(closestNode);

      if (closestNode === finishNode) return visitedNodesInOrder;

      updateUnvisitedNeighbors(closestNode, unvisitedNodes);
    }

    return visitedNodesInOrder;
  };

  const updateUnvisitedNeighbors = (node, unvisitedNodes) => {
    const neighbors = getNeighbors(node, nodes);
    for (const neighbor of neighbors) {
      const newDistance = node.distance + 1;

      if (newDistance < neighbor.distance) {
        neighbor.distance = newDistance;
        neighbor.previousNode = node;
      }
    }
  };

  const getNeighbors = (node, grid) => {
    const neighbors = [];
    const { row, col } = node;

    if (row > 0) neighbors.push(grid[(row - 1) * 30 + col]);
    if (row < 29) neighbors.push(grid[(row + 1) * 30 + col]);
    if (col > 0) neighbors.push(grid[row * 30 + (col - 1)]);
    if (col < 29) neighbors.push(grid[row * 30 + (col + 1)]);

    return neighbors.filter((neighbor) => !neighbor.isVisited);
  };

  const updateProgress = (percentage) => {
    setProgress(percentage);
  };

  const visualizeDijkstra = async () => {
    setIsLoading(true);
    setProgress(0);

    const visitedNodesInOrder = await dijkstra();
    animateDijkstra(visitedNodesInOrder);
    setTimeout(() => {
      animateShortestPath();
      setIsLoading(false);
      setProgress(100);
    }, 10 * visitedNodesInOrder.length);
  };

  const animateDijkstra = (visitedNodesInOrder) => {
    visitedNodesInOrder.forEach((node, i) => {
      setTimeout(() => {
        const updatedNodes = nodes.map((n) =>
          n.row === node.row && n.col === node.col ? { ...n, isVisited: true } : n
        );
        setNodes(updatedNodes);
        updateProgress(((i + 1) / visitedNodesInOrder.length) * 100);
      }, 10 * i);
    });
  };

  const animateShortestPath = async () => {
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      const node = nodesInShortestPathOrder[i];
      setTimeout(() => {
        const updatedNode = { ...node, color: 'blue', isShortestPath: true };
        setNodes((prevNodes) => {
          return prevNodes.map((n) => (n.id === updatedNode.id ? updatedNode : n));
        });
        updateProgress(((i + 1) / nodesInShortestPathOrder.length) * 100);
      }, 50 * i);
    }
  };

  const getNodesInShortestPathOrder = (finish) => {
    const nodesInShortestPathOrder = [];
    let currentNode = finish;
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
  };

  return (
    <div>
      <GridWrapper>
        {nodes.map((node) => (
          <Node key={node.id} {...node} />
        ))}
        <button onClick={visualizeDijkstra} disabled={isLoading} style={{width:"300px"}}>
          {isLoading ? 'Processing...' : 'Visualize Dijkstra'}
        </button>
      </GridWrapper>
      <ProgressBar>
        <ProgressFiller progress={progress} />
      </ProgressBar>
    </div>
  );
};

export default Grid;
