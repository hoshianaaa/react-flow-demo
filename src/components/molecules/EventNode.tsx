// モック用のNODEコンポーネント
import { NodeDataType } from '@/components/pages/Editor'
import { Handle, Position } from 'react-flow-renderer'

interface EventNodeProps {
  data: NodeDataType
  selected: boolean
}

// Tailwind text align: https://tailwindcss.com/docs/text-align
export const EventNode = ({ data, selected }: EventNodeProps) => {
  return (
    <>
      <p className="ml-1 text-[14px] text-blue-400 bg-transparent text-center">{data.name}</p>
      <div
        className=
            'border-2 border-red-800 p-1 relative justify-center items-center'
        style={{
          width : 150,
          height: 40,
        }}

      >
        <div>

          <p style={{ top: 9, left: 48, textAlign: 'right',fontSize:'10px',position:"absolute"}}>
            SUCCEED
          </p>
          <p style={{ top: 30, left: 54, textAlign: 'right',fontSize:'10px',position:"absolute"}}>
            FAILED
          </p>


          <Handle
            type="target"
            style={{ top: '33%' }}
            position={Position.Left}
            className="aaa"
          >
          </Handle>
          <Handle
            type="source"
            style={{ top: '33%' }}
            position={Position.Right}
            id="SUCCEED"
          >
          </Handle>
          <Handle
            type="source"
            style={{ top: '80%' }}
            position={Position.Right}
            id="FAILED"
          >
          </Handle>

        </div>
      </div>
    </>
  )
}
