import React from 'react';
import './App.css';
import { Stage, Ellipse, Group, Arrow, Line, Layer, Circle, Text, useStrictMode, Transformer, Rect} from 'react-konva';
import Konva from 'konva';

useStrictMode(true)
// the TLDR is that my move to mix up hooks and class components is somewhere along the spectrum from tenuous to sketchy to unsuported. try to refactor with more consistent hook usage would be my best guess.
const Rectangle = ({ shapeProps, isSelected, onSelect, onChange }) =>  {
  const shapeRef = React.useRef();
  const trRef = React.useRef();

  React.useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <React.fragment>
      <Rect
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDragEnd={(e) => {
          onChange({
	    ...shapeProps,
	    x: e.target.x(),
	    y: e.target.y(),
	  })
        }}
        onTransformerEnd={(e) => {
          const node = shapeRef.current;
	  const scaleX = node.scaleX();
	  const scaleY = node.scaleY();
          node.scaleX(1);
	  node.scaleY(1);
	  onChange({
            ...shapeProps,
	    x: node.x(),
	    y: node.y(),
	    width: Math.max(5, node.width() * scaleX),
	    height: Math.max(node.height() * scaleY),
	  });
	}}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
	    if(newBox.width < 5 || newBox.height < 5) {
	      return oldBox
	    }
	    return newBox;
	  }}
	/>
      )}
    </React.fragment>
  )

}

const rectData = [{
  x: 10,
  y: 10,
  width: 100,
  height: 100,
  fill: 'deeppink',
  id: 'rect1'
}]

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
      cirkows: [[10,400],[10,300]],
      rectangles: rectData,
      selectedID: null,
    }

//    this.updatePos = this.updatePos.bind(this);
    this.update = this.update.bind(this);
    this.handleDrop = this.handleDrop.bind(this);

  }

  handleDrop(event) {
    if (event.target.x() < 400) {
      console.log('this is here')
      let stateCopy = this.state.cirkows
      stateCopy.push([event.target.x(), event.target.y()])
      this.setState({cirkows: stateCopy})
    }
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

  render() {

  return (
    <div className="App">
      <header className="App-header">
        <p>Hi there 🙃</p>
        <Stage width={500} height={500} style={{border: '2px solid deeppink'}}>
          <Layer>
	  <Circle radius={15} fill='deeppink' x={420} y={400} draggable={true} onDragEnd={(e) => {this.handleDrop(e)}}/>
	  </Layer>
          <Layer>
            {/*this.state.rectangles.map((rect, i) => {
	      return(
              <Rectangle
	        key={i}
		shapeProps={rect}
		isSelected={rect.id === this.state.selectedID}
		onSelect={() => {
		  this.setState({
	            selectedID: rect.id,
		  })
		}}
		onChange={(newAttrs) => {
	          const rects = this.state.rectangles.slice();
		  rects[i] = newAttrs
		  this.setState({
	            rectangles: rects,
		  })
		}}
		/>)
	    })*/} 
		  <Rectangle height={50} width={50} fill='deeppink' />

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
	    {this.state.cirkows.map((cirkow) => <Circle width={15} height={15} fill='deeppink' x={cirkow[0]} y={cirkow[1]} /> )}
	    <Circle width={50} height={50} fill='cadetblue' draggable={true} x={this.state.c1x} y={this.state.c1y} onDragMove={(e) => {this.update(1, e.target.x(), e.target.y())}}/>
	    <Circle width={50} height={50} fill='cadetblue' draggable={true} x={this.state.c2x} y={this.state.c2y} onDragMove={(e) => {this.update(2, e.target.x(), e.target.y())}}/>
	    <Circle width={50} height={50} fill='cadetblue' draggable={true} x={this.state.c3x} y={this.state.c3y} onDragMove={(e) => {this.update(3, e.target.x(), e.target.y())}}/>
	    <Arrow stroke='cadetblue' points={[this.state.c1x+25,this.state.c1y+25,this.state.c2x-25,this.state.c2y-25]} />
	    <Arrow stroke='cadetblue' points={[this.state.c2x+25,this.state.c2y+25,this.state.c3x-25,this.state.c3y-25]} />
	    <Line stroke='deeppink' points={[400,0,400,500]} />
          </Layer>
        </Stage>
     </header>
    </div>
  );


  }
}

export default App;
