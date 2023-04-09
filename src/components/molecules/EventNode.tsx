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
      <p className="border-2 border-transparent text-[14px] text-fuchsia-500 text-center">{data.name}</p>
      <div
        className=
            'p-1 relative justify-center items-center border-2 border-gray-400'
        style={{
          width : 150,
          height: 40,
        }}

      >
        <div>

          <p style={{ top: 14, color: 'gray', left: 8, textAlign: 'right',fontSize:'10px',position:"absolute"}}>
            INPUT
          </p>
          <p style={{ top: 6, color: 'gray', right: 8, textAlign: 'right',fontSize:'10px',position:"absolute"}}>
            SUCCEED
          </p>
          <p style={{ top: 22, color: 'gray', right: 8, textAlign: 'right',fontSize:'10px',position:"absolute"}}>
            FAILED
          </p>


          <Handle
            type="target"
            style={{ top: '50%' }}
            position={Position.Left}
            className="aaa"
          >
          </Handle>
          <Handle
            type="source"
            style={{ top: '35%' }}
            position={Position.Right}
            id="SUCCEED"
          >
          </Handle>
          <Handle
            type="source"
            style={{ top: '75%' }}
            position={Position.Right}
            id="FAILED"
          >
          </Handle>

        </div>
      </div>
    </>
  )
}
