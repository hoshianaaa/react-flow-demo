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
      <p className="px-4 py-2 text-[13px] text-fuchsia-500 text-center">{data.label}</p>
      <div
        className=
            'relative justify-center items-center'
        style={{
          width : 150,
          height: 40,
        }}

      >
        <div>

          <p style={{ top: 8, color: 'lightgray', left: 8, textAlign: 'right',fontSize:'10px',position:"absolute"}}>
            INPUT
          </p>
          <p style={{ top: 0, color: 'cyan', right: 8, textAlign: 'right',fontSize:'10px',position:"absolute"}}>
            SUCCEED
          </p>
          <p style={{ top: 16, color: 'yellow', right: 8, textAlign: 'right',fontSize:'10px',position:"absolute"}}>
            FAILED
          </p>


          <Handle
            type="target"
            style={{ top: '15px' }}
            position={Position.Left}
            className="aaa"
          >
          </Handle>
          <Handle
            type="source"
            style={{ top: '8px' }}
            position={Position.Right}
            id="SUCCEED"
          >
          </Handle>
          <Handle
            type="source"
            style={{ top: '23px' }}
            position={Position.Right}
            id="FAILED"
          >
          </Handle>

        </div>
      </div>
    </>
  )
}
