import { useState, useEffect, BaseSyntheticEvent } from 'react';
import ReactFlow, { addEdge, Connection, Edge, Elements, Position, getOutgoers } from 'react-flow-renderer';

const HiddenFlow = () => {
  const getText = (text: string) => (
    <div>
      <p>{text}</p>
      <b style={{color: 'red'}}>Value 1</b> | <b>Value 2</b>
      <div>
        <button>Test</button>
      </div>
    </div>
  );

  const initialElements: Elements = [
    { id: '1', data: { label: 'Node 1' }, position: { x: 250, y: 5 }, connectable: false, selectable: false, draggable: false, sourcePosition: Position.Bottom, targetPosition: Position.Bottom },
    { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 100 }, connectable: false },
    { id: '3', data: { label: getText('Test Label'), childs: ['4', '5', '6', '7'], expanded: false }, position: { x: 400, y: 100 }, connectable: false, style: { width: '400px', textAlign: 'left' } },
    { id: '4', data: { label: getText('Node 4'), childs: ['6', '7'], expanded: false }, position: { x: 400, y: 400 }, connectable: false, isHidden: true },
    { id: '5', data: { label: getText('Node 5') }, position: { x: 600, y: 400 }, connectable: false, isHidden: true },
    { id: '6', data: { label: 'Child 1 of Node 4' }, position: { x: 400, y: 600 }, connectable: false, isHidden: true },
    { id: '7', data: { label: 'Child 2 of Node 4' }, position: { x: 600, y: 600 }, connectable: false, isHidden: true },
    { id: 'e1-2', source: '1', target: '2', },
    { id: 'e1-3', source: '1', target: '3' },
    { id: 'e3-4', source: '3', target: '4' },
    { id: 'e3-5', source: '3', target: '5' },
    { id: 'e4-6', source: '4', target: '6' },
    { id: 'e4-7', source: '4', target: '7' },
  ];

  const [elements, setElements] = useState<Elements>(initialElements);
  const [elementSelected, setElementSelected] = useState<any>();
  const [expand, setExpand] = useState<boolean>(false);
  const onConnect = (params: Connection | Edge) => setElements((els) => addEdge(params, els));

  useEffect(() => {
    if (elementSelected && expand && elementSelected.data?.childs) {
      elementSelected.data.expanded = !elementSelected.data.expanded
      
      if (!elementSelected.data.expanded) {
        elementSelected.data.childs.forEach((elementId: string) => {
          const index = elements.findIndex(el => el.id === elementId);
          elements.filter((el: any) => el.target === elementId).forEach(element => element.isHidden = true);
          elements[index].isHidden = true;
          elements[index].data.expanded = false;
        })  
      } else {
        const childs = getOutgoers(elementSelected, elements);
        childs.forEach(child => {
          elements.find(el => el.id === child.id)!.isHidden = false;
          elements.filter((el: any) => el.target === child.id).forEach(element => { element.isHidden = false });
        })
      }

      setElements([...elements])
    }

    setExpand(false)
  }, [expand]);

  return (
    <ReactFlow
      elements={elements}
      onConnect={onConnect}
      onElementClick={(event: BaseSyntheticEvent, element) => {
        setElementSelected(element);

        if(event.target.tagName === 'BUTTON') {
          setExpand(true);
        }
      }}
    >
    </ReactFlow>
  );
};

export default HiddenFlow;
