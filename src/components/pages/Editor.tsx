// react-flow samples CodeSsandbox: https://codesandbox.io/examples/package/react-flow
// add node sample: https://reactflow.dev/docs/examples/nodes/add-node-on-edge-drop/

import { EventNode } from '@/components/molecules/EventNode'
import { EditorSidePanel } from '@/components/organisms/EditorSidePanel'
import { useGetWindowSize } from '@/hooks/useGetWindowSize'
import { useCallback, useState, useEffect, useRef } from 'react'
import { Ros, Topic, Message } from 'roslib';

// *** tree menu ***
// https://github.com/iannbing/react-simple-tree-menu
import TreeMenu from 'react-simple-tree-menu'
// nodemodule内のcss変更，新しくモジュールをインストールしないと変更されない
import 'node_modules/react-simple-tree-menu/dist/main.css';
//import 'src/components/pages/treemenu.css';

// react-icons
// https://qiita.com/stin_dev/items/5755e14805e60718620c
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { faCoffee } from "@fortawesome/free-solid-svg-icons";
import { FaPlay } from 'react-icons/fa';
import { FaStop } from 'react-icons/fa';
import { MdStopCircle } from 'react-icons/fa';
import { faTruckPlow } from 'react-icons/fa';

import { For } from 'react-loops'
import Select from 'react-select'
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';

// param

import {
  Routes,
  Route,
  useSearchParams,
  BrowserRouter
} from "react-router-dom"

// 動的変数 {} 内の値を変化させる場合はstateを使う: https://qiita.com/Kazunori-Kimura/items/d94ddd1a8d8e2e39d504

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
  useNodesState,
  useEdgesState,
} from 'react-flow-renderer'

const nodeTypes = { 
  DUAL_RESULT: EventNode,
}

// TODO: 一旦ここに書いてあるが、この部分がPluginごとに異なる部分になる想定
export type NodeDataType = {
  label: string
  name: string
  color: string
}

// ノードの作成方法，種類: https://reactflow.dev/docs/api/nodes/node-types/

const initialNodes: Node<NodeDataType>[] = [
]

// markerEnd: { type: MarkerType.ArrowClosed },を追加すると矢印がでる
const initialEdges: Edge[] = [
]

const fitViewOptions: FitViewOptions = {
  padding: 0.2,
}



var namespace = "wheelLoader2/";

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


let ns_listener = null;
let function_list_listener = null;
let graph_listener = null;
let listener = null;
let listener_setting = 0;
const empty_msg = new Message({
});
let ns_request = null;
let graph_request = null;
let function_list_request = null;


const initialize = () => {

  ns_listener = new Topic({
    ros: ros,
    name: namespace + 'ui/flow/ns',
    messageType: 'std_msgs/String'
  });

  function_list_listener = new Topic({
    ros: ros,
    name: namespace + 'function_list_server/function_list',
    messageType: 'std_msgs/String'
  });

  graph_listener = new Topic({
    ros: ros,
    name: namespace + 'graph',
    messageType: 'std_msgs/String'
  });

  listener = new Topic({
    ros: ros,
    name: namespace + 'ui/active_ids',
    messageType: 'std_msgs/String'
  });

  listener_setting = 0;

  ns_request = new Topic({
    ros : ros,
    name : namespace + 'ui/flow/request_ns',
    messageType : 'std_msgs/Empty'
  });

  graph_request = new Topic({
    ros : ros,
    name : namespace + 'graph_server/request',
    messageType : 'std_msgs/Empty'
  });

  function_list_request = new Topic({
    ros : ros,
    name : namespace + 'function_list_server/request',
    messageType : 'std_msgs/Empty'
  });

  setTimeout(function () {

    ns_request.publish(empty_msg);
    graph_request.publish(empty_msg);
    function_list_request.publish(empty_msg);

  }, 50);

}

initialize();

export const Editor = () => {
  //let userId = useParams();
  const { height: windowHeight, width: windowWidth } = useGetWindowSize()
  const [nodes, setNodes] = useState<Node[]>(initialNodes)
  const [edges, setEdges] = useState<Edge[]>(initialEdges)
  //useStateサンプル: https://reactflow.dev/docs/examples/nodes/update-node/
  const [nodeBg, setNodeBg] = useState('#FFFFFF');
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)

  const [namespaces, setNameSpaces] = useState([
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
  ]);


  const [treeData, setTreeData] = useState([
  ]);

  const [str, setStr] = useState("wheelLoader");


  console.log("hello");
  console.log(listener_setting);

  if (listener_setting == 0)
  {
    listener.subscribe(message => {
      var id = message['data'];

      setNodeBg(id);

      listener_setting = 1;

    });

/*
    ns_listener.subscribe(message => {
      console.log("namespace");
      console.log(message.data);
      var d = message.data;

      console.log("namespaces");
      console.log(namespaces);

      console.log(ns);
      console.log(ns.includes(d));

      if (ns.includes(d)) 
      {

      }
      else
      {
        ns.push(d);

        console.log("ns");
        console.log(ns);

      }

      var val = [];
      
      for (var i=0;i<ns.length;i++)
      {
        val.push({ "value": ns[i], "label": ns[i]});
      }

      console.log("val");
      console.log(val);

      setNameSpaces([
        { value: 'bbbbbb', label: 'bbbbbb' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' }
      ]);

      console.log("after namespaces");
      console.log(namespaces);

      //listener_setting = 1;
    });
    */

  };

  if (treeData.length>0)
  {
    function_list_listener.unsubscribe();
  }
  else
  {
    function_list_listener.subscribe(message => {

      var function_list = JSON.parse(message.data);
      console.log("function_list",function_list);
      console.log("treeData",treeData);

      setTreeData(function_list);
      console.log(treeData);

      for (var i=0;i<function_list.length;i++)
      {
        function_list[i]["key"] = function_list[i]["name"];
        for (var j=0;j<function_list[i].nodes.length;j++)
        function_list[i].nodes[j]["key"] = function_list[i].nodes[j]["name"];
      }

    });
  }
  graph_listener.subscribe(message => {

    var graph = JSON.parse(message.data);
    console.log("***graph***", graph);

    setNodes(graph["nodes"]);
    setEdges(graph["edges"]);

  });

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
          node.style = { ...node.style, backgroundColor: 'rgba(255,105,212,0.3)', border: '1px solid #F331F5', color: '#F331F5' };
          console.log("nodebg debug");
        }
       else
      {
        node.style = { ...node.style, backgroundColor: 'transparent', border: '1px solid #F331F5', color: '#F331F5' };
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
    (params) =>
      setEdges((eds) => addEdge({ ...params, animated: false, style: { stroke: '#fff' } }, eds)),
    []
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
      name : namespace + 'ui/flow/nodes',
      messageType : 'std_msgs/String'

    });
    const twist = new Message({

      data: JSON.stringify(nodes)

    });

    cmdVel.publish(twist);

    setTimeout(function () {

      const cmdVel2 = new Topic({

        ros : ros,
        name : namespace + 'ui/flow/edges',
        messageType : 'std_msgs/String'

      });
      const twist2 = new Message({

        data: JSON.stringify(edges)

      });

      cmdVel2.publish(twist2);

    }, 500);

  };

  const handleClick2 = () => {

    initialize();
    namespace = str + "/";

    var n = [];
    var e = [];
    var f = [];

    for (var i=0;i<2;i++)
    {
      setNodes(n);
      setEdges(e);
    }

    setTreeData(f);
    
  };




  return (
    
    <div>

      <div style={{ flex:1, flexDirection:'row', padding: 20 , backgroundColor:'white', border: '1px solid lightgray'}}>

        <div style={{color:'darkcyan'}}>
          <button
            sytle={{ border: '3px solid #333' }}
            type="button"
            onClick={handleClick}
          > 
            <FaPlay />
          </button>
        : 実行
        </div>

        <div style={{color:'#DD0000'}}>
          <button
            sytle={{ border: '3px solid #333' }}
            type="button"
            onClick={handleClick}
          > 
            <FaStop />
          </button>
         : 停止
         </div>

      </div>
      <div style={{ height: windowHeight, width: windowWidth, display: 'flex' }}>
        <div>

          <div style={{ textAlign:'left', border: '1px solid lightgray'}} >
           <h style={{ color:'gray', fontSize:'16px', padding:'10px' }}>建機の選択</h>
          </div>
          <div style={{ textAlign:'left', border: '1px solid lightgray', color:'gray', fontSize:'16px', padding:'10px' }} >
          <Select options={namespaces} />

          建機名:
          <input
            type="text"
            value={str}
            onChange={event => setStr(event.target.value)}
          />

          <button
              sytle={{ border: '3px solid #333' }}
              type="button"
              onClick={handleClick2}
            > 接続
          </button>

          </div>

          <div style={{ textAlign:'left', border: '1px solid lightgray'}} >
            <h style={{ color:'gray', fontSize:'16px', padding:'10px' }}>司令一覧</h>
          </div>

          <TreeMenu data={treeData} 
            hasSearch='false'
            onClickItem={({ key, label, args, type, ...props }) => {
              //this.navigate(props.url); // user defined prop
              console.log("key:", key);
              console.log("label:", label);
              const words = key.split('/');
              key = words[words.length-1]
              console.log("key:", key);
              
              console.log("args:",args);
              console.log("type:",type);

              // *** add node ***

              var new_id = Number(nodes.length) + 1;
              console.log("***nodes.length***");
              console.log(typeof nodes.length);
              console.log(typeof '6');
              console.log(typeof '6');

              const newNode = 
                {
                  id: new_id.toString(),
                  data: {
                    label: label,
                    name: key,
                    color: 'red',
                    args: args
                  },
                  position: { x: 100, y: 100 },
                  style: {
                    backgroundColor: 'transparent',
                    border: '1px solid #F331F5',
                    color: '#F331F5',
                  }
                };


              if (type=="DUAL_RESULT")
              {
                newNode.type = "DUAL_RESULT";
              }

              setNodes((nds) => nds.concat(newNode));

            }}>
          </TreeMenu>

        </div>
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
              settings={setSelectedNode}
            />
          )}

    </div>
  </div>
  )
}
