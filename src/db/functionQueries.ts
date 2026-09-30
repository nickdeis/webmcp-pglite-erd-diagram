/** Row-returning functions in user schemas: SETOF, RETURNS TABLE, or OUT parameters. */
const TABLE_FUNCTION = `
  p.prokind = 'f'
  and (p.proretset or p.proargmodes && array['o', 't']::"char"[])
  and n.nspname not in ('pg_catalog', 'information_schema')
  and not exists (select 1 from pg_depend dep
                  where dep.classid = 'pg_proc'::regclass and dep.objid = p.oid and dep.deptype = 'e')`

export const FUNCTIONS_SQL = `
  select p.oid::int as oid, n.nspname as schema, p.proname as name, l.lanname as language,
         pg_get_function_identity_arguments(p.oid) as identity_args,
         format_type(p.prorettype, null) as return_type, rt.typname as return_type_name,
         rt.typcategory::text as return_type_category, p.proretset as returns_set,
         obj_description(p.oid, 'pg_proc') as comment
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  join pg_language l on l.oid = p.prolang
  join pg_type rt on rt.oid = p.prorettype
  where ${TABLE_FUNCTION}
  order by n.nspname, p.proname, p.oid`

/** One row per parameter; mode i/b/v are inputs, o/t are returned columns. */
export const FUNCTION_ARGS_SQL = `
  select p.oid::int as fn_oid, coalesce(p.proargnames[k.ord], '') as name,
         coalesce(p.proargmodes[k.ord]::text, 'i') as mode, format_type(k.type, null) as type,
         t.typname as type_name, t.typcategory::text as type_category
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  cross join lateral unnest(coalesce(p.proallargtypes, p.proargtypes::oid[]))
       with ordinality as k(type, ord)
  join pg_type t on t.oid = k.type
  where ${TABLE_FUNCTION}
  order by p.oid, k.ord`

/** Relations a function is recorded as depending on, including the row type it returns. */
export const FUNCTION_DEPENDENCIES_SQL = `
  select distinct p.oid::int as fn_oid, d.refobjid::int as source_oid
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  join pg_depend d on d.classid = 'pg_proc'::regclass and d.objid = p.oid
       and d.refclassid = 'pg_class'::regclass
  where ${TABLE_FUNCTION}
  union
  select p.oid::int, t.typrelid::int
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  join pg_depend d on d.classid = 'pg_proc'::regclass and d.objid = p.oid
       and d.refclassid = 'pg_type'::regclass
  join pg_type t on t.oid = d.refobjid and t.typrelid <> 0
  where ${TABLE_FUNCTION}`
