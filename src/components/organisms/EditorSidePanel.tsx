import { NodeDataType } from '@/components/pages/Editor'
import { Node } from 'react-flow-renderer'
import { setState, useCallback, useState, useEffect, useRef } from 'react'

// json editor
import { JSONViewer } from "react-json-editor-viewer";
import { JSONEditor } from "react-json-editor-viewer";


// react-flow

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



interface EditorSidePanelProps {
  settings: any // これがNodeごとに固有になるイメージ
  node: Node<NodeDataType>
}

export const EditorSidePanel = ({ settings, node }: EditorSidePanelProps) => {

  node.data.args.p1[0] = 100;

  const [node, setNode] = useState<Node>(node)

  useEffect(() => { 
          
  });

  function onJsonChange(key, value, parent, data){
      console.log(key, value, parent, data);
      node.data.args.p1[0] = 200;
      node.data.args = data;
  }

  return (

  // classnameの設定 https://zenn.dev/dev_shun/articles/f3d4634a25cabf
  // tailwindcss border color 一覧: https://tailwindcss.com/docs/border-color 
  // tailwindcss border width: https://tailwindcss.com/docs/border-width

    <div className="w-1/4 h-5/6 bg-fuchsia-300 bg-opacity-20 absolute bottom-10 right-4 z-50 rounded-2xl drop-shadow-md text-fuchsia-600 border-fuchsia-600 border">
      <div
        className="rounded-t-2xl h-4"
        //style={{ backgroundColor: node.data.color }}
      >

     </div>
        <div className="text-center">
          <p> {node.data.name} </p>
          <p> {JSON.stringify(node.data.args)} </p>
          <p> {JSON.stringify(node.data.args.p1)} </p>
          <p> {JSON.stringify(node.data.args.p1[0])} </p>
        </div>
        <JSONEditor data={node.data.args}   onChange={onJsonChange}/>
    </div>

  )
}
