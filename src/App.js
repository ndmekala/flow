import React from 'react';
import './App.css';
import { Stage, Layer, Rect, Circle, Text } from 'react-konva';
import Konva from 'konva';

class ColoredRect extends React.Component {
  state = {
    color: "cadetblue"
  };
  handleClick = () => {
    this.setState({
      color: Konva.Util.getRandomColor()
    });
  };
  render() {
    return (
      <Circle
        x={50}
        y={50}
        width={50}
        height={50}
        fill={this.state.color}
        shadowBlur={5}
        onClick={this.handleClick}
        draggable={true}
      />
    );
  }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>Hi there ;)</p>
        <Stage width={500} height={500}>
          <Layer>
            <ColoredRect />
          </Layer>
        </Stage>
     </header>
    </div>
  );
}

export default App;
