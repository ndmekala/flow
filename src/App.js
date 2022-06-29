import React from 'react';
import './App.css';
import { Stage, Ellipse, Group, Arrow, Line, Layer, Circle, Text, useStrictMode, Transformer, Rect} from 'react-konva';
import Konva from 'konva';

useStrictMode(true)

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

const App = () => {
  const [c1, setC1] = React.useState([50, 50])
  const [c2, setC2] = React.useState([150, 150])
  const [c3, setC3] = React.useState([250, 250])
  const [c4, setC4] = React.useState([425, 425])
  const [cirkows, setCirkows] = React.useState([[10, 400], [10,300]])
  const [rectangles, setRectangles] = React.useState(rectData)
  const [selectedID, setSeletedID] = React.useState(null)

  const handleDrop = (event) => {

    if (event.target.x() < 400) {
      let stateCopy = cirkows
      stateCopy.push([event.target.x(), event.target.y()])
      setCirkows(stateCopy)
      }

  }

  const getAdjustments = (x1, y1, x2, y2, r) => {
    let xMult
    x2 > x1 ? xMult = 1 : xMult = -1
    let slope = (y2-y1)/(x2-x1)
    let xAdj1 = xMult*Math.sqrt(r*r/(1+(slope*slope)))
    let yAdj1 = slope*xAdj1
    let xAdj2 = -xAdj1
    let yAdj2 = -yAdj1
    let results = [xAdj1, yAdj1, xAdj2, yAdj2];
    console.log(results)
    return results
  }

  const smartArrowPoints = (p1Array, p2Array, r) => {
    let xMult
    p2Array[0] > p1Array[0] ? xMult = 1 : xMult = -1
    let m = (p2Array[1]-p1Array[1])/(p2Array[0]-p1Array[0])
    let xAdj = xMult*Math.sqrt(r*r/(1+(m*m)))
    let yAdj = m*xAdj
    return [p1Array[0]+xAdj, p1Array[1]+yAdj, p2Array[0]-xAdj, p2Array[1]-yAdj]
  }

    return (
    <div className="App">
      <header className="App-header">
        <p>Hi there 🙃</p>
        <Stage width={500} height={500} style={{border: '2px solid deeppink'}}>
          <Layer>
		  {/*<Circle radius={15} fill='deeppink' x={420} y={400} draggable={true} onDragEnd={(e) => {this.handleDrop(e)}}/> */}
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
		  {/*<Rectangle height={50} width={50} fill='deeppink' />*/}

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
	    {cirkows.map((cirkow) => <Circle width={15} height={15} fill='deeppink' x={cirkow[0]} y={cirkow[1]} /> )}
	    <Circle radius={20} fill='cadetblue' draggable={true} x={c1[0]} y={c1[1]} onDragEnd={(e) => {setC1([e.target.x(), e.target.y()])}}/>
	    <Circle radius={20} fill='cadetblue' draggable={true} x={c2[0]} y={c2[1]} onDragEnd={(e) => {setC2([e.target.x(), e.target.y()])}}/>
	    <Circle radius={20} fill='cadetblue' draggable={true} x={c3[0]} y={c3[1]} onDragEnd={(e) => {setC3([e.target.x(), e.target.y()])}}/>
	    <Arrow stroke='cadetblue' points={smartArrowPoints(c1,c2,25)} />
	    <Arrow stroke='cadetblue' points={[c2[0]+getAdjustments(c2[0],c2[1],c3[0],c3[1],25)[0],c2[1]+getAdjustments(c2[0],c2[1],c3[0],c3[1],25)[1],c3[0]+getAdjustments(c2[0],c2[1],c3[0],c3[1],25)[2],c3[1]+getAdjustments(c2[0],c2[1],c3[0],c3[1],25)[3]]} />
	    {/*<Arrow stroke='cadetblue' points={[this.state.c1x+25,this.state.c1y+25,this.state.c2x-25,this.state.c2y-25]} />*/}
	    {/*<Arrow stroke='cadetblue' points={[this.state.c2x+25,this.state.c2y+25,this.state.c3x-25,this.state.c3y-25]} />*/}
	    <Line stroke='deeppink' points={[400,0,400,500]} />
          </Layer>
        </Stage>
     </header>
    </div>
  );


}


//class App extends React.Component {
//  constructor() {
//    super();

//    this.state = {
//      c1x: 50,
//      c1y: 50,
//      c2x: 150,
//      c2y: 150,
//      c3x: 250,
//      c3y: 250,
//      c4x: 425,
//      c4y: 425,
//      cirkows: [[10,400],[10,300]],
//      rectangles: rectData,
//      selectedID: null,
//    }

//    this.update = this.update.bind(this);
//    this.handleDrop = this.handleDrop.bind(this);
//
//  }

//  handleDrop(event) {
//    if (event.target.x() < 400) {
//      console.log('this is here')
//      let stateCopy = this.state.cirkows
//      stateCopy.push([event.target.x(), event.target.y()])
//      this.setState({cirkows: stateCopy})
//    }
//  }
// change how this actually works
//  update(circ, xPos, yPos) {
//    if (circ === 1) {
//      this.setState({
//        c1x: xPos,
//        c1y: yPos,
//      })
//    }
//    if (circ === 2) {
//      this.setState({
//        c2x: xPos,
//        c2y: yPos,
//      })
//    }
//    if (circ === 3) {
//      this.setState({
//        c3x: xPos,
//        c3y: yPos,
//      })
//    }
//    if (circ === 4) {
//      this.setState({
//        c4x: xPos,
//        c4y: yPos,
//      })
//    }
//  }

//  render() {

//  }
//}

export default App;
