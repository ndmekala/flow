import React from 'react';
import './App.css';
import { Stage, Layer, Rect, Circle, Text } from 'react-konva';
import Konva from 'konva';

class ColoredCircle extends React.Component {
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
        x={this.props.xPos}
        y={this.props.yPos}
        width={50}
        height={50}
        fill={this.state.color}
        onClick={this.handleClick}
        draggable={true}
        onDragEnd={(e) => {
          console.log(`x = ${e.target.x()}; y = ${e.target.y()}`)
        }}
      />
    );
  }
}

const circles = [[50,50], [150,150], [250,250]]

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>Hi there ;)</p>
        <Stage width={500} height={500}>
          <Layer>
            {circles.map((circle) => (
              <ColoredCircle
                xPos={circle[0]}
                yPos={circle[1]}
              />
            ))}
          </Layer>
        </Stage>
     </header>
    </div>
  );
}

export default App;
