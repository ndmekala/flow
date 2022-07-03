import React from 'react'
import { Group, Arrow, Circle, Text, Transformer } from 'react-konva'

// and probably a lot more… maybe? shape props should cover a lot - just text?
const Node = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const shapeRef = React.useRef();
  const trRef = React.useRef();

  React.useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected])

  return (
    <React.Fragment>
      {/* how will draggable work w group / transformer??*/}
      {/* also: how will draggable work w ARROW */}
      {/* i don thtin kdraggable is the ticket. circle only. no text or other.*/}
      <Group>
        <Circle
          onClick={onSelect}
          onTap={onSelect}
          {/*CHECK MOBILE COMPATIBILTIY ON ALL THE THINGS!*/}
          ref={shapeRef}
          {...shapeProps}
          draggable={true}
          {/*IDEA: Make this smart, so that extending circle auto-adjusts position to compensate… or not because which is actually better…*/}
          onDragEnd={(e) => {
            onChange({
              ...shapeProps
              x: e.target.x(),
              y: e.target.y(),)
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
              x: node.x();
              y: node.y();
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(node.height() * scaleY)
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
            return newBox
          }}
        )}
        <Text
          {...textProps}
          {/*how will this work? component will only receive one set of props…*/}
          {/*fontFamily=…*/}
        />
      </Group>
    </React.Fragment>
  )
}

export default Node
