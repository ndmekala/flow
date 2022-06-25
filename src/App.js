import React from 'react';
import './App.css';
import { Stage, Ellipse, Group, Line, Arrow, Layer, Circle, Text } from 'react-konva';
import Konva from 'konva';

class Arrowd extends React.Component {
  render() {
    return (
      <Arrow
        x={200}
        y={20}
        fill="cadetblue"
        points={[0,0,100,0,100,100]}
        stroke="cadetblue"
        draggable={true}
      />
    );
  }
}

class Linear extends React.Component {
  render() {
    return (
      <Line
        x={20}
        y={200}
        points={[0,0,0,100,100,100]}
        stroke="magenta"
        draggable={true}
      />
    );
  }
}

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

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      theXPos: 150,
      theYPos: 150,
    }

    this.updatePos = this.updatePos.bind(this);

  }

  updatePos(xPos, yPos) {
    this.setState({
      theXPos: xPos,
      theYPos: yPos,
    })
  }

  render() {

  return (
    <div className="App">
      <header className="App-header">
        <p>Hi there ;)</p>
        <Stage width={500} height={500}>
          <Layer>
            <Group
              draggable={true}>
              <Ellipse
                radius={{
                  x: 10,
		  y: 20,
		}}
		x={220}
		y={220}
		fill='darksalmon'
	      />
	      <Text
		x={220}
		y={220}
		fill='black'
		fontFamily='Courier New'
		text='yo!'
	      />
            </Group>
            <Arrowd />
            <Linear />
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
}

export default App;
