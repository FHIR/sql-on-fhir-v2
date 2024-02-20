import { fhirpath_evaluate } from './path.js'
import {errors as verrors} from './validate.js'


export let errors = verrors

function assert(condition, message) {
  if (!condition) {
    throw message || "Assertion failed";
  }
}

export function merge(a,b) {
  return Object.assign({}, a, b);
}

export function row_product(parts) {
  if(parts.length == 1) {return parts[0]}
  let rows = [{}];
  let new_rows = null;
  parts.forEach((partial_rows) => {
    new_rows = [];
    partial_rows.forEach((partial_row)=> {
      rows.forEach((row)=> {
        new_rows.push(merge(partial_row,row))
      })
    })
    rows = new_rows;
  });
  return rows;
}

function forEach(select_expr, node, def) {
  assert(select_expr.forEach, 'forEach required')
  let nodes = fhirpath_evaluate(node, select_expr.forEach, def.constant)
  return nodes.flatMap((node)=>{
    return select({select: select_expr.select}, node, def)
  })
}

function forEachOrNull(select_expr, node, def) {
  assert(select_expr.forEachOrNull, 'forEachOrNull required')
  let nodes = fhirpath_evaluate(node, select_expr.forEachOrNull, def.constant)
  if(nodes.length == 0) {
    nodes = [{}];
  }
  return nodes.flatMap((node)=>{
    return select({select: select_expr.select}, node, def)
  })
}

function column(select_expr, node, def) {
  assert(select_expr.column, 'column required')
  let record = {};
  select_expr.column.forEach((c) => {
    let vs = fhirpath_evaluate( node, c.path, def.constant);
    if(c.collection) {
      record[c.name || c.path] = vs;
    } else if (vs.length <= 1) {
      let v = vs[0];
      record[c.name || c.path] = (v === undefined) ? null : v;
    } else {
      throw new Error('Collection value for ' + c.path + ' => ' + JSON.stringify(vs))
    }
  });
  return [record];
}

function arrays_eq(a, b) {
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
}

function arrays_unique(arrays) {
  return arrays.reduce((acc, value) => {
    if (acc.length === 0) {
      return [value];
    }

    for (const x of acc) {
      if (arrays_eq(x, value)) {
        return acc;
      }
    }

    return acc.concat([value]);
  }, []);
}

function unionAll(select_expr, node, def) {
  assert(select_expr.unionAll, 'unionAll');
  const result = select_expr.unionAll.flatMap(d => do_eval(d, node, def));

  // TODO ideally, this should be done during the validation
  const unique = arrays_unique(result.map(x => Object.keys(x)));
  // TODO how can unique be === []?
  assert(unique.length <= 1,
    new Error(`Union columns mismatch: ${JSON.stringify(unique)}`));

  return result;
}

function select(select_expr, node, def) {
  assert(select_expr.select, 'select')
  if(select_expr.where) {
    let include = select_expr.where.every((w)=>{
      return fhirpath_evaluate(node, w.path, def.constant)[0]
    })
    if(!include) { return []}
  }
  if(select_expr.resource) {
    if( select_expr.resource !== node.resourceType) {
      return []
    }
  }
  return row_product(
    select_expr.select.map((s)=> {
      return do_eval(s, node, def);
    })
  )
}

function compile(def) {
  throw new Error('not impl');
}

// * foreach    / column / [select(..)]   -> foreach select[column, ..]
// * foreach    / union / [select(..)]     -> foreach select[union, ..]
// * foreach    / select(..)               -> foreach select[..]
// * select[..] / union                    -> select [union, ..]
// * select[..] / column                  -> select [column, ..]
// * union      / column                  -> select [column, union]
function normalize(def) {
  if (def.forEach) {
    def.select ||= []
    def.type = 'forEach'

    if (def.unionAll) {
      def.select.unshift({unionAll: def.unionAll})
      delete def.unionAll
    }

    if (def.column) {
      def.select.unshift({column: def.column})
      delete def.column
    }

    def.select = def.select.map(s => normalize(s))
    return def;

  } else if (def.forEachOrNull) {
    def.select ||= []
    def.type = 'forEachOrNull'

    if (def.unionAll) {
      def.select.unshift({unionAll: def.unionAll})
      delete def.unionAll
    }

    if (def.column) {
      def.select.unshift({column: def.column})
      delete def.column
    }

    def.select = def.select.map(s => normalize(s))
    return def;

  } else if (def.unionAll && def.select) {
    def.type = 'select'
    def.select.unshift({unionAll: def.unionAll})
    delete def.unionAll

    def.select = def.select.map(s => normalize(s))
    return def;

  } else if (def.select && def.column) {
    def.select.unshift({column: def.column})
    delete def.column

    def.type = 'select'
    def.select = def.select.map(s => normalize(s))
    return def;

  } else if (def.unionAll && def.column) {
    def.select ||= []
    def.select.unshift({unionAll: def.unionAll})
    def.select.unshift({column: def.column})
    delete def.unionAll
    delete def.column

    def.type = 'select'
    def.select = def.select.map(s => normalize(s))
    return def;

  } else if (def.select){
    def.type = 'select'
    def.select = def.select.map(s => normalize(s))
    return def

  } else {
    if (def.unionAll) {
      def.type = 'unionAll'
      def.unionAll = def.unionAll.map(s => normalize(s))
    } else if (def.column) {
      def.type = 'column'
    } else if (def.forEach) {
      def.type = 'forEach'
    } else if (def.forEachOrNull) {
      def.type = 'forEachOrNull'
    } else if (def.select) {
      def.type = 'select'
    }
    return def
  }
}
let fns = {
  'forEach': forEach,
  'forEachOrNull': forEachOrNull,
  'unionAll': unionAll,
  'select': select,
  'column': column,
  'unknown': () => { return [] }
}

function do_eval(select_expr, node, def) {
  let f = fns[select_expr.type] || fns['unknown'];
  return f(select_expr, node, def);
}

function collect_columns(acc, def){
  switch (def.type) {
  case 'select':
  case 'forEach':
  case 'forEachNull':
    return def.select.reduce((acc, s)=> {
      return collect_columns(acc, s);
    }, acc)
    break;
  case 'unionAll':
    return def.unionAll.reduce((acc, s)=> {
      return collect_columns(acc, s);
    }, acc)
    break;
  case 'column':
    return def.column.reduce((acc, c)=> {
      acc.push(c.name || c.path)
      return acc
    }, acc)
    break;
  default:
    return acc;
  }
}

// collect columns in a right order
export function get_columns(def) {
  return collect_columns([], normalize(structuredClone(def)));
}

export function evaluate(def, node) {
  if (!Array.isArray(node)) {
    return evaluate(def, [node])
  }

  const normal_def = normalize(structuredClone(def));

  // console.log("=======  NORM =========")
  // console.dir(normal_def, {depth: null})

  return node.flatMap(n => do_eval(normal_def, n, def))
}
