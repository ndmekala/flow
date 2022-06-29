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

  const handleDrop = (e) => {

    if (e.target.x() < 400) {
      let stateCopy = cirkows.slice()
      stateCopy.push([e.target.x(), e.target.y()])
      setCirkows(stateCopy)
      }

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
	    <Circle radius={15} fill='deeppink' x={420} y={420} draggable={true} onDragEnd={(e) => {handleDrop(e)}} />
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
	    <Arrow stroke='cadetblue' points={smartArrowPoints(c1, c2, 25)} />
	    <Arrow stroke='cadetblue' points={smartArrowPoints(c2, c3, 25)} />
	    <Line stroke='deeppink' points={[400,0,400,500]} />
          </Layer>
        </Stage>
     </header>
    </div>
  );


}

export default App;
