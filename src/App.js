import logo from './logo.svg';
import './App.css';
import PathfindingVisualizer from './components/PathfindingVisualizer';
import GlobalStyles from './styles/GlobalStyles';

function App() {
  return (
    <>
      <GlobalStyles />
      <div className="App">
          <PathfindingVisualizer />
      </div>
    </>
  );
}

export default App;
