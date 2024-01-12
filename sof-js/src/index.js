import { fhirpath_evaluate } from './path.js'

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

function forEach(def, node) {
  assert(def.forEach, 'forEach required')
  let nodes = fhirpath_evaluate(node, def.forEach)
  return nodes.flatMap((node)=>{
    return select({select: def.select}, node)
  })
}

function forEachOrNull(def, node) {
  assert(def.forEachOrNull, 'forEachOrNull required')
  let nodes = fhirpath_evaluate(node, def.forEach)
  if(nodes.length == 0) {
    nodes = [{}];
  }
  return nodes.flatMap((node)=>{
    return select({select: def.select}, node)
  })
}

function column(def, node) {
  assert(def.column, 'column required')
  let record = {};
  def.column.forEach((c) => {
    let vs = fhirpath_evaluate( node, c.path);
    if(c.collection) {
      record[c.name] = vs;
    } else if (vs.length <= 1) {
      let v = vs[0];
      record[c.name] = (v === undefined) ? null : v;
    } else {
      throw new Error('Collection value for ' + c.path + ' => ' + JSON.stringify(vs))
    }
  });
  return [record];
}

function unionAll(def, node) {
  assert(def.unionAll, 'unionAll')
  return def.unionAll.flatMap((d)=>{
    return do_eval(d, node)
  })
}

function select(def, node) {
  assert(def.select, 'select')
  if(def.where) {
    let res = fhirpath_evaluate(node, def.where)
    if(!res[0]) { return []}
  }
  return row_product(
    def.select.map((s)=> {
      return do_eval(s, node);
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
  if(def.forEach) {
    def.select ||= []
    def.type = 'forEach'
    if(def.unionAll) {
      def.select.unshift({unionAll: def.union})
      delete def.unionAll
    }
    if(def.column) {
      def.select.unshift({column: def.column})
      delete def.column
    }
    def.select = def.select.map((s)=> { return normalize(s)})
    return def;
  } else if(def.forEachOrNull) {
    def.select ||= []
    def.type = 'forEachOrNull'
    if(def.unionAll) {
      def.select.unshift({unionAll: def.union})
      delete def.unionAll
    }
    if(def.column) {
      def.select.unshift({column: def.column})
      delete def.column
    }
    def.select = def.select.map((s)=> { return normalize(s)})
    return def;
  } else if(def.unionAll && def.select) {
    def.type = 'select'
    def.select.unshift({unionAll: def.unionAll})
    delete def.unionAll
    def.select = def.select.map((s)=> { return normalize(s)})
    return def;
  } else if (def.select && def.column) {
    def.select.unshift({column: def.column})
    delete def.column
    def.type = 'select'
    def.select = def.select.map((s)=> { return normalize(s)})
    return def;
  } else if (def.unionAll && def.column) {
    def.select ||= []
    def.select.unshift({unionAll: def.unionAll})
    def.select.unshift({column: def.column})
    delete def.unionAll
    delete def.column
    def.type = 'select'
    def.select = def.select.map((s)=> { return normalize(s)})
    return def;
  } else if (def.select){
    def.type = 'select'
    def.select = def.select.map((s)=> { return normalize(s)})
    return def
  } else {
    if(def.unionAll) {
      def.type = 'unionAll'
      def.unionAll = def.unionAll.map((s)=> { return normalize(s)})
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
  'column': column
}

function do_eval(def, node) {
  let f = fns[def.type];
  if(!f){ throw Error('Not impl ' + def.type)}
  return f(def, node);
}

export function evaluate(def, node) {
  if(!Array.isArray(node)) { return evaluate(def, [node]) }
  let normal_def = normalize(def);
  // console.log(JSON.stringify(normal_def, null, " "))
  return node.flatMap((n)=>{
    return do_eval(normal_def, n);
  })
}
