import type { FunctionArgRow, FunctionRow } from './catalogRows'
import type { FunctionArg, TableFunction, TypedValue } from './types'

const INPUT_MODES: Record<string, FunctionArg['mode']> = { i: 'in', b: 'inout', v: 'variadic' }
const RETURNED_MODES = new Set(['o', 't'])

const toTyped = (a: FunctionArgRow): TypedValue => ({
  name: a.name,
  type: a.type,
  typeName: a.type_name,
  typeCategory: a.type_category,
})

/** `SETOF scalar` has no OUT/TABLE columns, so it becomes one unnamed returned value. */
const scalarReturn = (f: FunctionRow): TypedValue => ({
  name: '',
  type: f.return_type,
  typeName: f.return_type_name,
  typeCategory: f.return_type_category,
})

export function buildFunction(f: FunctionRow, allArgs: FunctionArgRow[]): TableFunction {
  const own = allArgs.filter((a) => a.fn_oid === f.oid)
  const returned = own.filter((a) => RETURNED_MODES.has(a.mode)).map(toTyped)
  return {
    schema: f.schema,
    name: f.name,
    identityArgs: f.identity_args,
    language: f.language,
    comment: f.comment,
    args: own
      .filter((a) => a.mode in INPUT_MODES)
      .map((a) => ({ ...toTyped(a), mode: INPUT_MODES[a.mode]! })),
    returns: returned.length > 0 ? returned : [scalarReturn(f)],
    returnsSet: f.returns_set,
  }
}
