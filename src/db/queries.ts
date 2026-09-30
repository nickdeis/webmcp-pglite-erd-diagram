const USER_RELATION = `
  n.nspname not in ('pg_catalog', 'information_schema')
  and n.nspname not like 'pg_toast%'
  and not exists (select 1 from pg_depend dep where dep.objid = c.oid and dep.deptype = 'e')`

/** Tables, partitioned tables, views and materialized views (partitions are nested, not listed). */
const RELATIONS = `('r', 'p', 'v', 'm')`

export const TABLES_SQL = `
  select c.oid::int as oid, n.nspname as schema, c.relname as name, c.relkind::text as relkind,
         obj_description(c.oid, 'pg_class') as comment,
         case when c.relkind = 'p' then pg_get_partkeydef(c.oid) end as partition_key,
         case when c.relkind in ('v', 'm') then pg_get_viewdef(c.oid, true) end as definition
  from pg_class c join pg_namespace n on n.oid = c.relnamespace
  where c.relkind in ${RELATIONS} and not c.relispartition and ${USER_RELATION}
  order by n.nspname, c.relname`

export const COLUMNS_SQL = `
  select c.oid::int as table_oid, a.attnum::int as attnum, a.attname as name,
         format_type(a.atttypid, a.atttypmod) as type, t.typname as type_name,
         t.typcategory::text as type_category, a.attnotnull as not_null,
         pg_get_expr(d.adbin, d.adrelid) as "default",
         a.attgenerated <> '' as generated, a.attidentity <> '' as identity,
         col_description(c.oid, a.attnum) as comment
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  join pg_attribute a on a.attrelid = c.oid and a.attnum > 0 and not a.attisdropped
  join pg_type t on t.oid = a.atttypid
  left join pg_attrdef d on d.adrelid = c.oid and d.adnum = a.attnum
  where c.relkind in ${RELATIONS} and not c.relispartition and ${USER_RELATION}
  order by c.oid, a.attnum`

const CONSTRAINT_COLUMNS = (keys: string, rel: string) => `
  array(select a.attname from unnest(${keys}) with ordinality k(num, ord)
        join pg_attribute a on a.attrelid = ${rel} and a.attnum = k.num order by k.ord)`

export const CONSTRAINTS_SQL = `
  select con.conrelid::int as table_oid, con.conname as name, con.contype::text as type,
         ${CONSTRAINT_COLUMNS('con.conkey', 'con.conrelid')} as columns,
         rn.nspname as ref_schema, rc.relname as ref_table,
         ${CONSTRAINT_COLUMNS('con.confkey', 'con.confrelid')} as ref_columns,
         con.confupdtype::text as on_update, con.confdeltype::text as on_delete
  from pg_constraint con
  left join pg_class rc on rc.oid = con.confrelid
  left join pg_namespace rn on rn.oid = rc.relnamespace
  where con.contype in ('p', 'f')
  order by con.conrelid, con.conname`

export const INDEXES_SQL = `
  select i.indrelid::int as table_oid, ic.relname as name, am.amname as method,
         i.indisunique as unique, pg_get_indexdef(i.indexrelid) as definition,
         obj_description(i.indexrelid, 'pg_class') as comment,
         array(select oc.opcname from unnest(i.indclass::oid[]) with ordinality k(oid, ord)
               join pg_opclass oc on oc.oid = k.oid order by k.ord) as opclasses,
         array(select s.name from (
                 select a.attname as name, k.ord as ord
                 from unnest(i.indkey::int2[]) with ordinality k(num, ord)
                 join pg_attribute a on a.attrelid = i.indrelid and a.attnum = k.num
                 union
                 select a.attname, 1000 + a.attnum
                 from pg_depend d
                 join pg_attribute a on a.attrelid = i.indrelid and a.attnum = d.refobjsubid
                 where d.classid = 'pg_class'::regclass and d.objid = i.indexrelid
                   and d.refobjid = i.indrelid and d.refobjsubid > 0) s
               group by s.name order by min(s.ord)) as columns,
         array(select t.typname from pg_attribute a join pg_type t on t.oid = a.atttypid
               where a.attrelid = i.indexrelid order by a.attnum) as key_types
  from pg_index i
  join pg_class ic on ic.oid = i.indexrelid
  join pg_am am on am.oid = ic.relam
  where not i.indisprimary
    and i.indrelid in (select c.oid from pg_class c join pg_namespace n on n.oid = c.relnamespace
                       where c.relkind in ('r', 'p', 'm') and not c.relispartition
                         and ${USER_RELATION})
  order by i.indrelid, ic.relname`
