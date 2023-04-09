// モック用のNODEコンポーネント
import { NodeDataType } from '@/components/pages/Editor'
import { Handle, Position } from 'react-flow-renderer'

interface EventNodeProps {
  data: NodeDataType
  selected: boolean
}

export const EventNode = ({ data, selected }: EventNodeProps) => {
  return (
    <>
      <p className="ml-1 text-[14px] text-blue-400 bg-transparent">{data.name}</p>
      <div
        className={
          selected
            ? 'border-2 border-red-400 p-1 relative justify-center items-center'
            : 'border-2 border-transparent p-1 relative justify-center items-center'
        }
        style={{
          width : 100,
          height: 50,
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
