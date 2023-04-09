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
      <p className="ml-1 text-[6px] text-gray-400 bg-transparent">{data.name}</p>
      <div
        className={
          selected
            ? 'border-2 border-red-400 p-1 relative justify-center items-center'
            : 'border-2 border-transparent p-1 relative justify-center items-center'
        }
        style={{
          width : 300,
          height: 100,
        }}

      >
        <div>
          <span
            className="font-semibold text-center"
            style={{ color: data.color }}
          >
            {data.name}
          </span>
          <Handle
            type="target"
            style={{ top: '33%' }}
            position={Position.Left}
            className="aaa"
          >
          aaa
          </Handle>
          <Handle
            type="source"
            style={{ top: '33%' }}
            position={Position.Right}
            id="SUCCEED"
          />
          <Handle
            type="source"
            style={{ top: '66%' }}
            position={Position.Right}
            id="FAILED"
          />

        </div>
      </div>
    </>
  )
}
