import { EventNode } from '@/components/molecules/EventNode'
import { EditorSidePanel } from '@/components/organisms/EditorSidePanel'
import { useGetWindowSize } from '@/hooks/useGetWindowSize'
import { useCallback, useState } from 'react'
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
    data: { label: 'move', name: 'test2', color: '#FF5660' },
    position: { x: 5, y: 100 },
  },
  {
    id: '3',
    data: { label: 'wait signal', name: 'test3', color: '#FF5660' },
    position: { x: 400, y: 200 },
  },
  {
    id: '4',
    data: { label: 'move', name: 'test3', color: '#FF5660' },
    position: { x: 400, y: 300 },
  },
]

// markerEnd: { type: MarkerType.ArrowClosed },を追加すると矢印がでる
const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e3-4', source: '3', target: '4' },
  { id: 'e4-2', source: '4', target: '2' },
]

const fitViewOptions: FitViewOptions = {
  padding: 0.2,
}

const nodeTypes = { eventNode: EventNode }

export const Editor = () => {
  const { height: windowHeight, width: windowWidth } = useGetWindowSize()
  const [nodes, setNodes] = useState<Node[]>(initialNodes)
  const [edges, setEdges] = useState<Edge[]>(initialEdges)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)

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

    const cmdVel = new Topic({

      ros : ros,
      name : '/turtle1/cmd_vel',
      messageType : 'geometry_msgs/Twist'

    });
    const twist = new Message({

        linear : {
            x : 2.0,
            y : 0,
            z : 0
        },
        angular : {
            x : 0,
            y : 0,
            z : 0
        }

    });

    cmdVel.publish(twist);

          console.log("aaa");
      // implementation details
  };


  return (
    <div style={{ height: windowHeight, width: windowWidth }}>
    <button type="button" onClick={handleClick}>
        Click Me
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
          <Background style={{ backgroundColor: '#f5f5f5' }} />
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
