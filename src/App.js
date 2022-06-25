import React from 'react';
import './App.css';
import { Stage, Ellipse, Line, Arrow, Layer, Rect, Circle, Text } from 'react-konva';
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

class Elliptical extends React.Component {

  render() {
    return (
      <Ellipse
        radius={{
          x: 50,
          y: 20,
        }}
        x={100}
        y={100}
        fill="darkorange"
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

class TextExample extends React.Component {

  render() {
    return (
      <Text
        x={150}
        y={50}
        text='simple text'
        fontSize={20}
        fill='darkseagreen'
        fontFamily='Courier New'
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
            <Ellipse
              radius={{
                x: 50,
                y: 20,
               }}
              x={this.state.theXPos}
              y={this.state.theYPos}
              fill="black"
              draggable={true}
              onDragMove={(e) => {
                this.updatePos(e.target.x(), e.target.y())
//                console.log(`x = ${e.target.x()}; y = ${e.target.y()}`)
               }}
            />
            <Text
              x={this.state.theXPos}
              y={this.state.theYPos}
              text='simple text'
              fontSize={20}
              fill='white'
              fontFamily='Courier New'
            />
            <Arrowd />
            <Elliptical />
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
