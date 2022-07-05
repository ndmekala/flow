import React from 'react';
import './App.css';
import { Stage, Group, Arrow, Line, Layer, Circle, Text, useStrictMode, Transformer} from 'react-konva';
import { Html } from 'react-konva-utils';

useStrictMode(true)
// MAKE IT SO STATE ONLY UPDATES ON DRAG END!!! (this will help undo/redo)
// or add a ~layer~ between state and dragging…
// it could be isDragging ? x = yadayada : x = state value


const Node = ({ shapeProps, isSelected, onSelect, onChange }) =>  {
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
      <Group draggable>
        <Circle
          onClick={onSelect}
          onTap={onSelect}
          ref={shapeRef}
          {...shapeProps}
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
            rotateEnabled={false}
            centeredScaling={true}
            keepRatio={true}
            enabledAnchors={['top-right', 'bottom-right', 'top-left', 'bottom-left']}
            boundBoxFunc={(oldBox, newBox) => {
              if(newBox.width < 5 || newBox.height < 5) {
                return oldBox
              }
              return newBox;
            }}
          />
        )}
        <Text
          x={400}
          y={350}
          fill='white'
          fontFamily='Courier New'
          text='yo!'
        />
      </Group>
      {/* I say its open for debate whether to use group or have text x y update via state */}
      <Arrow stroke='chartreuse' fill='chartreuse' points={[500,0,0,500]}/>
    </React.Fragment>
  )

}

const nodeData = [{
  x: 250,
  y: 400,
  radius: 50,
  fill: 'cadetblue',
  id: 'node1',
  descendents: [{
    id: 'node2',
    arrowCoeff: 0.5,
  }]
},{
  x: 150,
  y: 200,
  radius: 10,
  fill: 'pink',
  id: 'node2',
  descendents: [{}],
}]

// keeping around because dag validator works through this…
// also i deleted old circles that pointed to functions (handlecircle select i think)on click…
const moreShapesData = [
  {
    id: 1,
    x: 150,
    y: 50,
    descendents: []
  },
  {
    id: 2,
    x: 250,
    y: 150,
    descendents: []
  },
  {
    id: 3,
    x: 350,
    y: 150,
    descendents: []
  },
  {
    id: 4,
    x: 350,
    y: 250,
    descendents: []
  },
  {
    id: 5,
    x: 250,
    y: 200,
    descendents: []
  },
]

const App = () => {

  const [c1, setC1] = React.useState([50, 50])
  const [c2, setC2] = React.useState([150, 150])
  const [c3, setC3] = React.useState([250, 250])
  const [nodes, setNodes] = React.useState(nodeData)
  const [selectedID, setSelectedID] = React.useState(null)
  const [shadow, setShadow] = React.useState(false)
  const [value, setValue] = React.useState(0)
  const [arrowDrawMode, setArrowDrawMode] = React.useState(true)
  const [arrowDrawIdStash, setArrowDrawIdStash] = React.useState(null)
  const [moreShapes, setMoreShapes] = React.useState(moreShapesData)

  const checkDeselect = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedID(null);
    }
  }

  // NOTE ^^ there needs to be a deslect for when you are adding arrows

  React.useEffect(() => {
    const parseDAG = () => {
      //console.log('----- PARSE DAG START ------')
      let allShapes = []
      let nonOrphans = []
      let arrows = []
      moreShapes.forEach((shape) => {
        allShapes.push(shape.id)
        shape.descendents.forEach((descendent) => {
          if (!nonOrphans.includes(descendent)) {nonOrphans.push(descendent)}
          arrows.push([shape.id, descendent])
        })
      })
      let orphans = []
      allShapes.forEach((shape) => {
        if (!nonOrphans.includes(shape)) {orphans.push(shape)}
      })
      while (orphans.length) {
        let relationships = arrows.filter((arrow) => {
          return arrow[0] === orphans[0]
        })
        //console.log('------ WHILE LOOP START -------')
        //console.log(`arrows: ${JSON.stringify(arrows)}`)
        //console.log(`orphans: ${JSON.stringify(orphans)}`)
        //console.log(`relationships: ${JSON.stringify(relationships)}`)
        relationships.forEach((relationship) => {
          // remove from arrows array
          for (let i = 0; i < arrows.length; i++) {
            if (arrows[i] === relationship) {
              arrows.splice(i, 1)
            }
          }
          //console.log('------ ARROWS W ARROW EXCISED -----')
          //console.log(`relationship: ${JSON.stringify(relationship)}`)
          //console.log(`arrows: ${JSON.stringify(arrows)}`)
          // scan to see if removal of this edge makes the child an orphan
          let found = false
          for (let i=0; i < arrows.length; i++) {
            // do any children remaining in arrow array equal the child in the relationship in question
            //console.log(`arrows[i][1]: ${JSON.stringify(arrows[i][1])}`)
            //console.log(`relationship[1]: ${relationship[1]}`)
            // weird behavior when relationship is in arrow array… this shouldnt happen - shows that shift insufficient
            if (arrows[i][1] === relationship[1]) {
              found = true
              //console.log('found')
              break
            } else {
              //console.log('not found')
              found = false
              continue
            }
          }
          if (!found && !orphans.includes(relationship[1])) {
            orphans.push(relationship[1])
          }
        })
        orphans.shift()
      }
      if (arrows.length) {
        console.log('CYCLIC!')
      } else {
        console.log('ACYCLIC!')
      }

    }
    parseDAG()
  });

  const handleDrop = (e) => {

    if (e.target.x() < 400) {

      let stateCopy = nodes.slice()
      stateCopy.push({
        x: e.target.x(),
        y: e.target.y(),
        radius: 10,
        fill: 'chartreuse',
        id: nodes.length+1
      })
      setNodes(stateCopy)
    }

  }

  const handleCircleSelect = (e) => {

    if (arrowDrawIdStash === null) {
      setArrowDrawIdStash(e.target.attrs.id)
    } else if (e.target.attrs.id !== arrowDrawIdStash) {
      let fromDataIndex = moreShapes.findIndex(shape => {
        return shape.id === parseFloat(arrowDrawIdStash)
      })
      if (!moreShapes[fromDataIndex].descendents.includes(parseFloat(e.target.attrs.id))) {
        let toDataIndex = moreShapes.findIndex(shape => {
          return shape.id === parseFloat(e.target.attrs.id)
        })
        let fromData = moreShapes[fromDataIndex]
        fromData.descendents.push(moreShapes[toDataIndex].id)
        let stateCopy = moreShapes.slice()
        stateCopy[fromDataIndex] = fromData
        setMoreShapes(stateCopy)
        setArrowDrawIdStash(null)
      }
    }
  }

  const handleArrowDrawModeToggle = () => {
    let stateCopy = arrowDrawMode
    setArrowDrawMode(!stateCopy)
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
    return [p1Array[0]+xAdj, p1Array[1]+yAdj, 100, 70, (p1Array[1]+(p2Array[1]-p1Array[1])/2),  p2Array[0]-xAdj, p2Array[1]-yAdj]


  }

  return (
    <div className="App">
      <header className="App-header">
        <p>Hi there <span role="img" aria-label="upside-down smiley face">🙃</span></p>
        <Stage onMouseDown={checkDeselect} onTouchStart={checkDeselect} width={500} height={500} style={{border: '2px solid deeppink'}}>
          <Layer>
            {/* demonstrating ddrag and drop*/}
            <Circle radius={15} fill='deeppink' x={420} y={420} draggable={true} onDragEnd={(e) => {handleDrop(e)}} />
            {/* demonstrating HTML elements */}
            <Html divProps={{style:{position: 'relative', top: 400, left: 400}}}>
              <input type="range" min="-10" max="10" value={value} onChange={(e) => {handleSlider(e)}}></input>
              <button onClick={() => {handleArrowDrawModeToggle()}}>Arrow Draw Mode: {arrowDrawMode.toString()}</button>
            </Html>
            {/* mapping data */}
            {/* dont forget to add validation w arrow mode etc */}
            {nodes.map((node, i) => {
              return(
                <React.Fragment>
                  <Node
                    key={i}
                    shapeProps={node}
                    isSelected={node.id === selectedID}
                    onSelect={() => {setSelectedID(node.id)}}
                    onChange={(newAttrs) => {
                      const stateCopy = nodes.slice();
                      stateCopy[i] = newAttrs;
                      setNodes(stateCopy)
                    }}
                  />
                  {node.descendents.map((descendent) => {
                    const returnDescendent = (descendentID) => {
                      return nodes.find(element => element.id === descendentID)
                    }
                    console.log(returnDescendent(descendent.id))
                    if (returnDescendent(descendent.id)) {
                      return(
                        <Arrow stroke='mediumslateblue' points={[node.x, node.y, returnDescendent(descendent.id).x, returnDescendent(descendent.id).y]}/>
                      )
                    }
                  })}
                </React.Fragment>
              )
            })}

            {/* illustrating arrow select, smart arrows, arrow tension/ediitng*/}
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
