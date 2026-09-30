import type { IconType } from 'react-icons'
import type { FunctionArg, TableFunction, TypedValue } from '../db/types'
import { typeIcon } from '../theme/typeIcons'

function ParamRow({ value, prefix }: { value: TypedValue; prefix?: string }) {
  const TypeIcon: IconType = typeIcon(value.typeName, value.typeCategory)
  return (
    <div className="param-row">
      {prefix && <span className="param-mode">{prefix}</span>}
      <span className="column-name">{value.name}</span>
      <span className="column-type">
        <TypeIcon size={12} />
        {value.type}
      </span>
    </div>
  )
}

const modePrefix = (arg: FunctionArg) => (arg.mode === 'in' ? undefined : arg.mode)

/** Pure display: a function's arguments and returned columns. */
export function FunctionBody({ fn }: { fn: TableFunction }) {
  return (
    <>
      {fn.args.length > 0 && <div className="index-section">Arguments</div>}
      {fn.args.map((arg, i) => (
        <ParamRow key={`${arg.name}${i}`} value={arg} prefix={modePrefix(arg)} />
      ))}
      <div className="index-section">{fn.returnsSet ? 'Returns rows' : 'Returns'}</div>
      {fn.returns.map((value, i) => (
        <ParamRow key={`${value.name}${i}`} value={value} />
      ))}
    </>
  )
}
