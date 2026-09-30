/** Direct and nested partitions with their bounds; the tree is rebuilt from `parent_oid`. */
export const PARTITIONS_SQL = `
  select i.inhparent::int as parent_oid, c.oid::int as oid, n.nspname as schema,
         c.relname as name, pg_get_expr(c.relpartbound, c.oid) as bound,
         case when c.relkind = 'p' then pg_get_partkeydef(c.oid) end as partition_key
  from pg_inherits i
  join pg_class c on c.oid = i.inhrelid
  join pg_namespace n on n.oid = c.relnamespace
  where c.relispartition
  order by c.relname`

/** What each view / materialized view reads: tables, views, and set-returning functions. */
export const VIEW_DEPENDENCIES_SQL = `
  select distinct v.oid::int as target_oid, d.refobjid::int as source_oid,
         d.refclassid::regclass::text as source_class
  from pg_class v
  join pg_rewrite r on r.ev_class = v.oid
  join pg_depend d on d.classid = 'pg_rewrite'::regclass and d.objid = r.oid
       and d.refclassid in ('pg_class'::regclass, 'pg_proc'::regclass)
       and d.refobjid <> v.oid
  where v.relkind in ('v', 'm')`
