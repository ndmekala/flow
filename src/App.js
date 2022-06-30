import React from 'react';
import './App.css';
import { Stage, Ellipse, Group, Arrow, Line, Layer, Circle, Text, useStrictMode, Transformer, Rect} from 'react-konva';
import { Html } from 'react-konva-utils';

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
    <React.Fragment>
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
    </React.Fragment>
  )

}

const rectData = [{
  x: 250,
  y: 300,
  width: 100,
  height: 100,
  fill: 'deeppink',
  id: 'rect1'
}]

const App = () => {

  // the one thing that isnt in here is a deselect functionality… fyi  

  const [c1, setC1] = React.useState([50, 50])
  const [c2, setC2] = React.useState([150, 150])
  const [c3, setC3] = React.useState([250, 250])
  const [cirkows, setCirkows] = React.useState([])
  const [rectangles, setRectangles] = React.useState(rectData)
  const [selectedID, setSelectedID] = React.useState(null)
  const [shadow, setShadow] = React.useState(false)
  const [value, setValue] = React.useState(0)

  const handleDrop = (e) => {

    if (e.target.x() < 400) {
      let stateCopy = cirkows.slice()
      stateCopy.push([e.target.x(), e.target.y()])
      setCirkows(stateCopy)
      }

  }

  const handleSlider = (e) => {
    setValue(e.target.value)
  }

  const smartArrowPoints = (p1Array, p2Array, r) => {
    // make this even smarter by incorporating arrow points…
    let xMult
    p2Array[0] > p1Array[0] ? xMult = 1 : xMult = -1
    let m = (p2Array[1]-p1Array[1])/(p2Array[0]-p1Array[0])
    let xAdj = xMult*Math.sqrt(r*r/(1+(m*m)))
    let yAdj = m*xAdj
//    return [p1Array[0]+xAdj, p1Array[1]+yAdj, (p1Array[0]+(p2Array[0]-p1Array[0])/2), (p1Array[1]+(p2Array[1]-p1Array[1])/2),  p2Array[0]-xAdj, p2Array[1]-yAdj]
    return [p1Array[0]+xAdj, p1Array[1]+yAdj, 100, 70, (p1Array[1]+(p2Array[1]-p1Array[1])/2),  p2Array[0]-xAdj, p2Array[1]-yAdj]


  }

    return (
    <div className="App">
      <header className="App-header">
        <p>Hi there <span role="img" aria-label="upside-down smiley face">🙃</span></p>
        <Stage width={500} height={500} style={{border: '2px solid deeppink'}}>
          <Layer>
	    <Circle radius={15} fill='deeppink' x={420} y={420} draggable={true} onDragEnd={(e) => {handleDrop(e)}} />
	  </Layer>
          <Layer>
		  <Html divProps={{style:{position: 'relative', top: 400, left: 400}}}>

	      <input type="range" min="-10" max="10" value={value} onChange={(e) => {handleSlider(e)}}></input>
			 
		</Html>
		  {rectangles.map((rect, i) => {
	      return(
              <Rectangle
	        key={i}
		shapeProps={rect}
		isSelected={rect.id === selectedID}
		onSelect={() => {setSelectedID(rect.id)}}
		onChange={(newAttrs) => {
	          const rects = rectangles.slice();
		  rects[i] = newAttrs
		 setRectangles(rects) 
		}}
		/>)
	    }) }

            <Group
              draggable={true}>
              <Ellipse
                radius={{
                  x: 50,
		  y: 20,
		}}
		x={220}
		y={20}
		fill='deeppink'
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
	    <Circle radius={20} fill='cadetblue' draggable={true} x={c1[0]} y={c1[1]} onDragMove={(e) => {setC1([e.target.x(), e.target.y()])}}/>
	    <Circle radius={20} fill='cadetblue' draggable={true} x={c2[0]} y={c2[1]} onDragMove={(e) => {setC2([e.target.x(), e.target.y()])}}/>
	    <Circle radius={20} fill='cadetblue' draggable={true} x={c3[0]} y={c3[1]} onDragMove={(e) => {setC3([e.target.x(), e.target.y()])}}/>
             <Arrow tension={0.5} strokeWidth={5} shadowColor='white' shadowBlur={10} shadowOpacity={0.5} shadowEnabled={shadow} onMouseDown={() => {shadow ? setShadow(false) : setShadow(true)}} stroke='cadetblue' points={smartArrowPoints(c1, c2, 25)} />
             <Arrow strokeWidth={5} stroke='cadetblue' points={[170, 170, 200+29*parseFloat(value), 200-29*parseFloat(value), 230, 230]} tension={0.5} />
	    <Line stroke='deeppink' points={[400,0,400,500]} />
          </Layer>
        </Stage>
     </header>
    </div>
  );


}

export default App;
