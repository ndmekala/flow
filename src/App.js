import React from 'react';
import './App.css';
import { Stage, Ellipse, Group, Arrow, Layer, Circle, Text, useStrictMode} from 'react-konva';
import Konva from 'konva';

useStrictMode(true)

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
      />
    );
  }
}


class App extends React.Component {
  constructor() {
    super();

    this.state = {
      c1x: 50,
      c1y: 50,
      c2x: 150,
      c2y: 150,
      c3x: 250,
      c3y: 250,
      c4x: 425,
      c4y: 425,
    }

//    this.updatePos = this.updatePos.bind(this);
    this.update = this.update.bind(this);

  }

  componentDidMount() {
    console.log('ayy!')
  }

  componentDidUpdate() {
    console.log('upd8')
  }

  update(circ, xPos, yPos) {
    if (circ === 1) {
      this.setState({
        c1x: xPos,
        c1y: yPos,
      })
    }
    if (circ === 2) {
      this.setState({
        c2x: xPos,
        c2y: yPos,
      })
    }
    if (circ === 3) {
      this.setState({
        c3x: xPos,
        c3y: yPos,
      })
    }
    if (circ === 4) {
      this.setState({
        c4x: xPos,
        c4y: yPos,
      })
    }
  }

//  updatePos(xPos, yPos) {
//    this.setState({
//      theXPos: xPos,
//      theYPos: yPos,
//    })
//  }

  render() {

  return (
    <div className="App">
      <header className="App-header">
        <p>Hi there 🙃</p>
        <Stage width={500} height={500}>
          <Layer>
	  <Circle radius={25} fill='pink' x={this.state.c4x} y={this.state.c4y} draggable={true} onDragMove={(e) => {this.update(4, e.target.x(), e.target.y())}} />
	  </Layer>
          <Layer>
            <Group
              draggable={true}>
              <Ellipse
                radius={{
                  x: 50,
		  y: 20,
		}}
		x={220}
		y={20}
		fill='darksalmon'
	      />
	      <Text
		x={220}
		y={20}
		fill='black'
		fontFamily='Courier New'
		text='yo!'
	      />
            </Group>
	    <Circle width={50} height={50} fill='cadetblue' draggable={true} x={this.state.c1x} y={this.state.c1y} onDragMove={(e) => {this.update(1, e.target.x(), e.target.y())}}/>
	    <Circle width={50} height={50} fill='cadetblue' draggable={true} x={this.state.c2x} y={this.state.c2y} onDragMove={(e) => {this.update(2, e.target.x(), e.target.y())}}/>
	    <Circle width={50} height={50} fill='cadetblue' draggable={true} x={this.state.c3x} y={this.state.c3y} onDragMove={(e) => {this.update(3, e.target.x(), e.target.y())}}/>
	    <Arrow stroke='cadetblue' points={[this.state.c1x+25,this.state.c1y+25,this.state.c2x-25,this.state.c2y-25]} />
	    <Arrow stroke='cadetblue' points={[this.state.c2x+25,this.state.c2y+25,this.state.c3x-25,this.state.c3y-25]} />
          </Layer>
        </Stage>
     </header>
    </div>
  );


  }
}

export default App;
