import { EventNode } from '@/components/molecules/EventNode'
import { EditorSidePanel } from '@/components/organisms/EditorSidePanel'
import { useGetWindowSize } from '@/hooks/useGetWindowSize'
import { useCallback, useState, useEffect } from 'react'
import { Ros, Topic, Message } from 'roslib';

import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Connection,
  Controls,
  Edge,
  EdgeChange,
  FitViewOptions,
  Node,
  NodeChange,
  OnSelectionChangeParams,
  updateEdge,
} from 'react-flow-renderer'

// TODO: 一旦ここに書いてあるが、この部分がPluginごとに異なる部分になる想定
export type NodeDataType = {
  label: string
  name: string
  color: string
}

// ノードの作成方法，種類: https://reactflow.dev/docs/api/nodes/node-types/

const initialNodes: Node<NodeDataType>[] = [
  {
    id: '1',
    data: {
      label: 'start',
      name: 'start',
      color: 'red',
    },
    position: { x: 5, y: 5 },
    type: 'eventNode',
  },
  {
    id: '2',
    data: { label: 'down_arm', name: 'down_arm'},
    position: { x: 5, y: 100 },
    style: { border: '1px solid #777', padding: 10, background: '#2c8a8c' },
  },
  {
    id: '3',
    data: { label: 'move', name: 'move'},
    position: { x: 5, y: 200 },
  },
  {
    id: '4',
    data: { label: 'up_arm', name: 'up_arm'},
    position: { x: 5, y: 300 },
  },


]

// markerEnd: { type: MarkerType.ArrowClosed },を追加すると矢印がでる
const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e3-4', source: '3', target: '4' },
]

const fitViewOptions: FitViewOptions = {
  padding: 0.2,
}

const nodeTypes = { eventNode: EventNode }

// ros websocket setting 

  var ros = new Ros({
    url: 'ws://localhost:9090'
  });
   
  ros.on('connection', function() {
    console.log('Connected to websocket server.');
  });

  ros.on('error', function(error) {
    console.log('Error connecting to websocket server: ', error);
  });

  ros.on('close', function() {
    console.log('Connection to websocket server closed.');
  });

  const listener = new Topic({
    ros: ros,
    name: '/ui/active_ids',
    messageType: 'std_msgs/String'
  });

var listener_setting = 0;

export const Editor = () => {
  const { height: windowHeight, width: windowWidth } = useGetWindowSize()
  const [nodes, setNodes] = useState<Node[]>(initialNodes)
  const [edges, setEdges] = useState<Edge[]>(initialEdges)
  //useStateサンプル: https://reactflow.dev/docs/examples/nodes/update-node/
  const [nodeBg, setNodeBg] = useState('#FFFFFF');
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)

  console.log("hello");
  console.log(listener_setting);

//  if (listener_setting == 0)
//  {
    listener.subscribe(message => {
      var id = message['data'];
      //console.log("** nodes **");
      //console.log(nodes);
      //nodeBg = id;

      setNodeBg(id);

      //console.log(id);
      //document.getElementById("color_value").value = id;



    });
 //   listener_setting = 1;
 // };


  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        console.log("***** nodeBg *****");
        console.log(nodeBg);
        console.log(node.id);
        //if (node.id === '1') {
        if (node.id === nodeBg) {
          // it's important that you create a new object here
          // in order to notify react flow about the change
          //node.style = { ...node.style, backgroundColor: nodeBg };
          node.style = { ...node.style, backgroundColor: '#2c8a8c' };
          console.log("nodebg debug");
        }
       else
      {
        node.style = { ...node.style, backgroundColor: '#FFFFFF', border: '1px solid #F331F5' };
//          nodes[i]['style'] = { border: '3px solid black', padding: 1, background: '#FFFFFF' };
      }

        return node;
      })
    );
  }, [nodeBg, setNodes]);


// react useCallbak 使い方: https://weseek.co.jp/tech/3917/
  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes],
  )
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  )
  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  )

  const onEdgeUpdate = useCallback(
    (oldEdge: Edge, newConnection: Connection) =>
      setEdges((els) => updateEdge(oldEdge, newConnection, els)),
    [],
  )

  const onSelectionChange = useCallback(
    ({ nodes, edges }: OnSelectionChangeParams) => {
      const selectedNodes = nodes.filter((node) => node.selected)
      if (selectedNodes.length === 0) setSelectedNode(null)
      if (selectedNodes.length === 1) setSelectedNode(selectedNodes[0])
    },
    [],
  )

  const handleClick = () => {

    const cmdVel = new Topic({

      ros : ros,
      name : '/ui/flow/nodes',
      messageType : 'std_msgs/String'

    });
    const twist = new Message({

      data: JSON.stringify(nodes)

    });

    cmdVel.publish(twist);

    setTimeout(function () {

      const cmdVel2 = new Topic({

        ros : ros,
        name : '/ui/flow/edges',
        messageType : 'std_msgs/String'

      });
      const twist2 = new Message({

        data: JSON.stringify(edges)

      });

      cmdVel2.publish(twist2);

    }, 500);

    Editor();


  };


  return (
    <div style={{ height: windowHeight, width: windowWidth }}>
    <button type="button" onClick={handleClick}>
        Click Me ! 
    </button>
      {windowWidth > 0 && windowHeight > 0 ? (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgeUpdate={onEdgeUpdate}
          nodeTypes={nodeTypes}
          onSelectionChange={onSelectionChange}
          fitView
          fitViewOptions={fitViewOptions}
        >

              <Controls />
           <Background style={{ backgroundColor: 'black' }} />
        </ReactFlow>
      ) : undefined}
      {selectedNode && (
        <EditorSidePanel
          node={selectedNode}
          settings={{ sampleProperty: 'aaa' }}
        />
      )}

    </div>
  )
}
